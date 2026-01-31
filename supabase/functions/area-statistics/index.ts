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

    const { postcode, includeDetails = true } = await req.json();

    if (!postcode) {
      throw new Error("Postcode is required");
    }

    const normalizedPostcode = postcode.replace(/\s+/g, "").toUpperCase();
    const postcodeArea = normalizedPostcode.slice(0, -3).trim(); // Get postcode district

    // Check cache (30 days for area statistics)
    const { data: cached } = await supabase
      .from("area_statistics_cache")
      .select("*")
      .eq("postcode", normalizedPostcode)
      .eq("area_type", "full")
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      console.log("Returning cached area statistics");
      return new Response(
        JSON.stringify({ success: true, ...cached.data, cached: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch multiple data points in parallel
    const [pricesResponse, demographicsResponse, demandResponse] = await Promise.all([
      fetchWithRetry(
        `${API_BASE_URL}/prices?key=${PROPERTYDATA_API_KEY}&postcode=${normalizedPostcode}`,
        { method: "GET", headers: { Accept: "application/json" } }
      ),
      fetchWithRetry(
        `${API_BASE_URL}/demographics?key=${PROPERTYDATA_API_KEY}&postcode=${normalizedPostcode}`,
        { method: "GET", headers: { Accept: "application/json" } }
      ),
      fetchWithRetry(
        `${API_BASE_URL}/demand?key=${PROPERTYDATA_API_KEY}&postcode=${normalizedPostcode}`,
        { method: "GET", headers: { Accept: "application/json" } }
      ),
    ]);

    const responseTime = Date.now() - startTime;

    // Parse responses
    const pricesData = pricesResponse.ok ? await pricesResponse.json() : {};
    const demographicsData = demographicsResponse.ok ? await demographicsResponse.json() : {};
    const demandData = demandResponse.ok ? await demandResponse.json() : {};

    await logApiUsage(userId, "area-statistics", true, responseTime);

    // Build comprehensive area statistics
    const result = {
      postcode: normalizedPostcode,
      postcode_area: postcodeArea,
      
      // Price data
      prices: {
        average_price: pricesData.average_price || pricesData.avg_price,
        median_price: pricesData.median_price,
        transactions_count: pricesData.transactions || pricesData.count,
        price_change_1y: pricesData.change_1y || pricesData.price_change_12m,
        price_change_5y: pricesData.change_5y || pricesData.price_change_5y,
        price_per_sqft: pricesData.price_per_sqft,
        by_property_type: pricesData.by_type || {
          detached: pricesData.detached_avg,
          semi_detached: pricesData.semi_avg,
          terraced: pricesData.terraced_avg,
          flat: pricesData.flat_avg,
        },
      },

      // Demographics
      demographics: {
        population: demographicsData.population,
        households: demographicsData.households,
        average_age: demographicsData.average_age,
        tenure: {
          owned: demographicsData.owned_percentage || demographicsData.owner_occupied,
          rented_private: demographicsData.private_rented,
          rented_social: demographicsData.social_rented,
        },
        employment_rate: demographicsData.employment_rate,
        deprivation_index: demographicsData.imd_score || demographicsData.deprivation_index,
        crime_rate: demographicsData.crime_rate,
      },

      // Rental demand
      demand: {
        rental_demand_score: demandData.demand_score || demandData.rental_demand,
        days_to_let: demandData.avg_days_to_let || demandData.time_to_rent,
        rental_yield_estimate: demandData.yield_estimate || demandData.avg_yield,
        void_rate: demandData.void_rate,
        stock_levels: demandData.stock_level || demandData.properties_available,
      },

      // Price trends (last 5 years)
      price_trends: pricesData.history || pricesData.trends || [],

      // Market indicators
      market_indicators: {
        average_days_on_market: pricesData.avg_dom || pricesData.days_on_market,
        listing_to_sale_ratio: pricesData.sold_stc_ratio,
        price_reduction_rate: pricesData.reduction_rate,
        new_listings_30d: pricesData.new_listings,
      },
    };

    // Cache the result (30 days)
    await supabase.from("area_statistics_cache").upsert(
      {
        postcode: normalizedPostcode,
        area_type: "full",
        data: result,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "postcode,area_type" }
    );

    return new Response(
      JSON.stringify({ success: true, ...result, cached: false }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in area-statistics:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const responseTime = Date.now() - startTime;
    await logApiUsage(userId, "area-statistics", false, responseTime, errorMessage);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage, message: "Failed to fetch area statistics." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
