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

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
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

    const { propertyId, uprn, postcode, address } = await req.json();

    if (!propertyId && !uprn && !postcode) {
      throw new Error("Property identifier required (propertyId, uprn, or postcode)");
    }

    // Check cache first
    if (propertyId) {
      const { data: cachedProperty } = await supabase
        .from("cached_properties")
        .select("*")
        .eq("external_id", propertyId)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (cachedProperty) {
        console.log("Returning cached property details");
        return new Response(
          JSON.stringify({
            success: true,
            data: cachedProperty,
            cached: true,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Build API query
    const queryParams = new URLSearchParams({ key: PROPERTYDATA_API_KEY });
    if (uprn) queryParams.set("uprn", uprn);
    if (postcode) queryParams.set("postcode", postcode);
    if (address) queryParams.set("address", address);

    // Fetch from PropertyData API
    const response = await fetchWithRetry(
      `${API_BASE_URL}/property?${queryParams.toString()}`,
      { method: "GET", headers: { "Accept": "application/json" } }
    );

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      await logApiUsage(userId, "property-details", false, responseTime, `API Error: ${response.status}`);
      throw new Error(`PropertyData API error: ${response.status} - ${errorText}`);
    }

    const apiData = await response.json();
    await logApiUsage(userId, "property-details", true, responseTime);

    // Transform the data
    const property = {
      external_id: apiData.uprn || propertyId || `pd-${Date.now()}`,
      address: apiData.address || apiData.full_address,
      price: apiData.price || apiData.last_sale_price,
      bedrooms: apiData.bedrooms,
      bathrooms: apiData.bathrooms,
      property_type: apiData.property_type,
      description: apiData.description,
      features: apiData.features || [],
      images: apiData.images || [],
      postcode: apiData.postcode,
      latitude: apiData.latitude,
      longitude: apiData.longitude,
      region: apiData.region,
      county: apiData.county,
      // Enriched data
      floor_area_sqft: apiData.total_floor_area,
      floor_area_sqm: apiData.total_floor_area ? Math.round(apiData.total_floor_area * 0.092903) : null,
      epc_rating: apiData.epc_rating,
      council_tax_band: apiData.council_tax_band,
      tenure: apiData.tenure,
      construction_date: apiData.construction_date,
      last_sale_date: apiData.last_sale_date,
      last_sale_price: apiData.last_sale_price,
      estimated_value: apiData.estimated_value,
      raw_data: apiData,
    };

    // Cache the result
    await supabase
      .from("cached_properties")
      .upsert({
        ...property,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: "external_id" });

    return new Response(
      JSON.stringify({
        success: true,
        data: property,
        cached: false,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in property-details:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const responseTime = Date.now() - startTime;
    await logApiUsage(userId, "property-details", false, responseTime, errorMessage);

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        message: "Failed to fetch property details. Please try again.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
