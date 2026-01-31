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

// Retry helper with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // If rate limited, wait and retry
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("Retry-After") || "5");
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw lastError || new Error("Max retries exceeded");
}

// Log API usage
async function logApiUsage(
  userId: string | null,
  endpoint: string,
  success: boolean,
  responseTimeMs: number,
  errorMessage?: string
) {
  try {
    await supabase.from("api_usage").insert({
      user_id: userId,
      endpoint,
      success,
      response_time_ms: responseTimeMs,
      error_message: errorMessage,
    });
  } catch (error) {
    console.error("Failed to log API usage:", error);
  }
}

// Transform PropertyData response to our schema
function transformProperty(item: Record<string, unknown>): Record<string, unknown> {
  return {
    external_id: item.listing_id || item.uprn || `pd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    address: item.address || item.full_address || "Unknown",
    price: item.price || item.asking_price || 0,
    original_price: item.original_price,
    price_reduced: item.price_reduced || false,
    bedrooms: item.bedrooms || item.num_bedrooms,
    bathrooms: item.bathrooms || item.num_bathrooms,
    property_type: item.property_type || item.type,
    description: item.description || item.summary,
    features: item.features || [],
    images: item.images || item.photos || [],
    postcode: item.postcode,
    latitude: item.latitude || item.lat,
    longitude: item.longitude || item.lng,
    region: item.region || item.county,
    county: item.county,
    days_on_market: item.days_on_market,
    estimated_yield: item.estimated_yield,
    roi_potential: item.roi_potential,
    raw_data: item,
  };
}

interface SearchFilters {
  location?: string;
  postcode?: string;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  propertyTypes?: string[];
  minYield?: number;
  priceReduced?: boolean;
  page?: number;
  limit?: number;
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

    const filters: SearchFilters = await req.json();
    const { location, postcode, radius = 1, minPrice, maxPrice, minBedrooms, maxBedrooms, propertyTypes, page = 1, limit = 20 } = filters;

    // Build cache key
    const cacheKey = JSON.stringify({ location, postcode, radius, minPrice, maxPrice, minBedrooms, maxBedrooms, propertyTypes, page, limit });
    
    // Check cache first
    const { data: cachedData } = await supabase
      .from("cached_properties")
      .select("*")
      .gt("expires_at", new Date().toISOString())
      .limit(limit)
      .order("created_at", { ascending: false });

    // If we have enough cached data matching filters, return it
    if (cachedData && cachedData.length >= limit) {
      let filtered = cachedData;
      
      if (minPrice) filtered = filtered.filter(p => (p.price || 0) >= minPrice);
      if (maxPrice) filtered = filtered.filter(p => (p.price || 0) <= maxPrice);
      if (minBedrooms) filtered = filtered.filter(p => (p.bedrooms || 0) >= minBedrooms);
      if (maxBedrooms) filtered = filtered.filter(p => (p.bedrooms || 0) <= maxBedrooms);
      if (propertyTypes?.length) filtered = filtered.filter(p => propertyTypes.includes(p.property_type || ""));
      
      if (filtered.length >= limit) {
        console.log("Returning cached results");
        return new Response(
          JSON.stringify({
            success: true,
            data: filtered.slice(0, limit),
            total: filtered.length,
            page,
            cached: true,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Build PropertyData API query
    const queryParams = new URLSearchParams({
      key: PROPERTYDATA_API_KEY,
    });

    if (postcode) queryParams.set("postcode", postcode);
    if (location) queryParams.set("location", location);
    if (radius) queryParams.set("radius", radius.toString());
    if (minPrice) queryParams.set("min_price", minPrice.toString());
    if (maxPrice) queryParams.set("max_price", maxPrice.toString());
    if (minBedrooms) queryParams.set("min_bedrooms", minBedrooms.toString());
    if (maxBedrooms) queryParams.set("max_bedrooms", maxBedrooms.toString());
    if (propertyTypes?.length) queryParams.set("property_type", propertyTypes.join(","));

    // Fetch from PropertyData API
    const response = await fetchWithRetry(
      `${API_BASE_URL}/for-sale?${queryParams.toString()}`,
      {
        method: "GET",
        headers: { "Accept": "application/json" },
      }
    );

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      await logApiUsage(userId, "property-search", false, responseTime, `API Error: ${response.status} - ${errorText}`);
      
      // Fallback to cached data if available
      if (cachedData && cachedData.length > 0) {
        console.log("API failed, returning cached fallback");
        return new Response(
          JSON.stringify({
            success: true,
            data: cachedData.slice(0, limit),
            total: cachedData.length,
            page,
            cached: true,
            fallback: true,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`PropertyData API error: ${response.status}`);
    }

    const apiData = await response.json();
    await logApiUsage(userId, "property-search", true, responseTime);

    // Transform and cache results
    const properties = (apiData.data || apiData.listings || apiData.properties || []).map(transformProperty);

    // Cache the results
    if (properties.length > 0) {
      const cacheInserts = properties.map((p: Record<string, unknown>) => ({
        ...p,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      }));

      await supabase
        .from("cached_properties")
        .upsert(cacheInserts, { onConflict: "external_id" });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: properties.slice((page - 1) * limit, page * limit),
        total: properties.length,
        page,
        cached: false,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in property-search:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const responseTime = Date.now() - startTime;
    await logApiUsage(userId, "property-search", false, responseTime, errorMessage);

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        message: "Failed to search properties. Please try again.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
