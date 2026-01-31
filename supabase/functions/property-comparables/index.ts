import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROPERTYDATA_API_KEY = Deno.env.get("PROPERTYDATA_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const API_BASE_URL = "https://api.propertydata.co.uk";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("Retry-After") || "5");
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      return response;
    } catch (error) {
      lastError = error as Error;
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  throw lastError || new Error("Max retries exceeded");
}

async function logApiUsage(userId: string | null, endpoint: string, success: boolean, responseTimeMs: number, errorMessage?: string) {
  try {
    await supabase.from("api_usage").insert({ user_id: userId, endpoint, success, response_time_ms: responseTimeMs, error_message: errorMessage });
  } catch (error) {
    console.error("Failed to log API usage:", error);
  }
}

interface ComparableProperty {
  address: string;
  price: number;
  date_sold: string;
  property_type: string;
  bedrooms: number;
  tenure: string;
  distance: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();
  let userId: string | null = null;

  try {
    if (!PROPERTYDATA_API_KEY) {
      throw new Error("PROPERTYDATA_API_KEY is not configured");
    }

    const { postcode, radiusMiles = 0.5, propertyType, bedrooms, months = 24 } = await req.json();

    if (!postcode) {
      throw new Error("Postcode is required");
    }

    // Normalize postcode
    const normalizedPostcode = postcode.replace(/\s+/g, "").toUpperCase();

    // Check cache first (7 day cache for sold data)
    const { data: cached } = await supabase
      .from("comparables_cache")
      .select("*")
      .eq("postcode", normalizedPostcode)
      .eq("radius_miles", radiusMiles)
      .eq("property_type", propertyType || "all")
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      console.log("Returning cached comparables");
      return new Response(
        JSON.stringify({ success: true, ...cached.data, cached: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build API query
    const queryParams = new URLSearchParams({
      key: PROPERTYDATA_API_KEY,
      postcode: normalizedPostcode,
      radius: radiusMiles.toString(),
      months: months.toString(),
    });
    if (propertyType) queryParams.set("property_type", propertyType);
    if (bedrooms) queryParams.set("bedrooms", bedrooms.toString());

    // Fetch from PropertyData API
    const response = await fetchWithRetry(
      `${API_BASE_URL}/sold-prices?${queryParams.toString()}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      await logApiUsage(userId, "property-comparables", false, responseTime, `API Error: ${response.status}`);
      throw new Error(`PropertyData API error: ${response.status}`);
    }

    const apiData = await response.json();
    await logApiUsage(userId, "property-comparables", true, responseTime);

    // Process comparables
    const comparables: ComparableProperty[] = (apiData.data || apiData.sales || []).map((sale: Record<string, unknown>) => ({
      address: sale.address || sale.full_address,
      price: sale.price || sale.amount,
      date_sold: sale.date || sale.date_of_transfer,
      property_type: sale.property_type || sale.type,
      bedrooms: sale.bedrooms,
      tenure: sale.tenure,
      distance: sale.distance,
    }));

    // Calculate statistics
    const prices = comparables.map((c) => c.price).filter((p) => p > 0);
    const stats = {
      count: comparables.length,
      average_price: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
      median_price: prices.length > 0 ? prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)] : 0,
      min_price: prices.length > 0 ? Math.min(...prices) : 0,
      max_price: prices.length > 0 ? Math.max(...prices) : 0,
      price_per_sqft: apiData.average_price_per_sqft,
    };

    // Group by month for chart data
    const monthlyData: Record<string, { count: number; total: number }> = {};
    comparables.forEach((c) => {
      const month = c.date_sold?.slice(0, 7);
      if (month) {
        if (!monthlyData[month]) monthlyData[month] = { count: 0, total: 0 };
        monthlyData[month].count++;
        monthlyData[month].total += c.price;
      }
    });

    const chartData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        count: data.count,
        average: Math.round(data.total / data.count),
      }));

    const result = {
      postcode: normalizedPostcode,
      radius_miles: radiusMiles,
      comparables,
      statistics: stats,
      chart_data: chartData,
    };

    // Cache the result (7 days)
    await supabase.from("comparables_cache").upsert(
      {
        postcode: normalizedPostcode,
        radius_miles: radiusMiles,
        property_type: propertyType || "all",
        data: result,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "postcode,radius_miles,property_type" }
    );

    return new Response(
      JSON.stringify({ success: true, ...result, cached: false }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in property-comparables:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const responseTime = Date.now() - startTime;
    await logApiUsage(userId, "property-comparables", false, responseTime, errorMessage);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage, message: "Failed to fetch comparables." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
