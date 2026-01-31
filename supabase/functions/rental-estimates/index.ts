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

interface RentalComparable {
  address: string;
  rent_pcm: number;
  bedrooms: number;
  property_type: string;
  date_listed: string;
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

    const { postcode, bedrooms, propertyType, purchasePrice } = await req.json();

    if (!postcode) {
      throw new Error("Postcode is required");
    }

    const normalizedPostcode = postcode.replace(/\s+/g, "").toUpperCase();

    // Check cache (7 days)
    const { data: cached } = await supabase
      .from("rental_estimates_cache")
      .select("*")
      .eq("postcode", normalizedPostcode)
      .eq("bedrooms", bedrooms || 0)
      .eq("property_type", propertyType || "all")
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      console.log("Returning cached rental estimates");
      // Recalculate yields if purchase price provided
      const data = cached.data as Record<string, unknown>;
      if (purchasePrice && data.estimates) {
        const estimates = data.estimates as Record<string, unknown>;
        estimates.gross_yield = ((estimates.average_rent as number) * 12 / purchasePrice * 100).toFixed(2);
        estimates.net_yield = (((estimates.average_rent as number) * 12 * 0.75) / purchasePrice * 100).toFixed(2);
      }
      return new Response(
        JSON.stringify({ success: true, ...data, cached: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build API query
    const queryParams = new URLSearchParams({
      key: PROPERTYDATA_API_KEY,
      postcode: normalizedPostcode,
    });
    if (bedrooms) queryParams.set("bedrooms", bedrooms.toString());
    if (propertyType) queryParams.set("property_type", propertyType);

    // Fetch from PropertyData API
    const response = await fetchWithRetry(
      `${API_BASE_URL}/rents?${queryParams.toString()}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      await logApiUsage(userId, "rental-estimates", false, responseTime, `API Error: ${response.status}`);
      throw new Error(`PropertyData API error: ${response.status}`);
    }

    const apiData = await response.json();
    await logApiUsage(userId, "rental-estimates", true, responseTime);

    // Process rental comparables
    const rentals: RentalComparable[] = (apiData.data || apiData.rentals || []).map((r: Record<string, unknown>) => ({
      address: r.address,
      rent_pcm: r.rent || r.rent_pcm || r.price,
      bedrooms: r.bedrooms,
      property_type: r.property_type,
      date_listed: r.date_listed || r.date,
      distance: r.distance,
    }));

    // Calculate rental statistics
    const rents = rentals.map((r) => r.rent_pcm).filter((r) => r > 0);
    const averageRent = rents.length > 0 ? Math.round(rents.reduce((a, b) => a + b, 0) / rents.length) : 0;
    const medianRent = rents.length > 0 ? rents.sort((a, b) => a - b)[Math.floor(rents.length / 2)] : 0;

    // Calculate yields if purchase price provided
    let grossYield = null;
    let netYield = null;
    if (purchasePrice && averageRent > 0) {
      grossYield = ((averageRent * 12) / purchasePrice * 100).toFixed(2);
      netYield = ((averageRent * 12 * 0.75) / purchasePrice * 100).toFixed(2); // Assume 25% costs
    }

    const result = {
      postcode: normalizedPostcode,
      bedrooms: bedrooms || "all",
      property_type: propertyType || "all",
      rentals,
      estimates: {
        average_rent: averageRent,
        median_rent: medianRent,
        min_rent: rents.length > 0 ? Math.min(...rents) : 0,
        max_rent: rents.length > 0 ? Math.max(...rents) : 0,
        sample_size: rentals.length,
        gross_yield: grossYield,
        net_yield: netYield,
        annual_rent: averageRent * 12,
      },
      // Breakdown by bedroom count
      by_bedrooms: Object.entries(
        rentals.reduce((acc: Record<number, number[]>, r) => {
          if (!acc[r.bedrooms]) acc[r.bedrooms] = [];
          acc[r.bedrooms].push(r.rent_pcm);
          return acc;
        }, {})
      ).map(([beds, rentsArr]) => ({
        bedrooms: parseInt(beds),
        average_rent: Math.round((rentsArr as number[]).reduce((a, b) => a + b, 0) / (rentsArr as number[]).length),
        count: (rentsArr as number[]).length,
      })),
    };

    // Cache the result (7 days)
    await supabase.from("rental_estimates_cache").upsert(
      {
        postcode: normalizedPostcode,
        bedrooms: bedrooms || 0,
        property_type: propertyType || "all",
        data: result,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "postcode,bedrooms,property_type" }
    );

    return new Response(
      JSON.stringify({ success: true, ...result, cached: false }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in rental-estimates:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const responseTime = Date.now() - startTime;
    await logApiUsage(userId, "rental-estimates", false, responseTime, errorMessage);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage, message: "Failed to fetch rental estimates." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
