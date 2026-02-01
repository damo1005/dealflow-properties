import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function isRecent(dateString: string, days: number): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < days;
}

function generateMockFloodData(address: string, postcode: string) {
  const riskLevels = ['Very Low', 'Low', 'Medium', 'High'] as const;
  const riverRiskIndex = Math.floor(Math.random() * 3); // Mostly low risk
  const surfaceRiskIndex = Math.floor(Math.random() * 3);
  
  const riskChances: Record<string, number> = {
    'Very Low': 0.1,
    'Low': 0.5,
    'Medium': 2.0,
    'High': 5.0,
  };

  const overallRisk = riskLevels[Math.max(riverRiskIndex, surfaceRiskIndex)];
  
  const recommendations = [];
  if (overallRisk === 'Medium' || overallRisk === 'High') {
    recommendations.push({
      title: 'Flood Insurance Required',
      description: 'Standard buildings insurance may not cover flood risk. Obtain specialist flood insurance.',
      priority: 'high',
    });
    recommendations.push({
      title: 'Property Flood Resilience',
      description: 'Consider installing flood barriers, air brick covers, and non-return valves.',
      priority: 'high',
    });
    recommendations.push({
      title: 'Emergency Plan',
      description: 'Create a flood emergency plan and sign up for EA flood warnings.',
      priority: 'medium',
    });
  }

  const insuranceImplications: Record<string, string> = {
    'Very Low': 'Standard insurance readily available at normal rates.',
    'Low': 'Insurance available, may have slightly higher premiums.',
    'Medium': 'Specialist flood insurance likely required. Higher premiums and excess.',
    'High': 'Flood insurance expensive or difficult to obtain. May require Flood Re scheme.',
  };

  return {
    property_address: address,
    postcode: postcode.replace(/\s/g, '').toUpperCase(),
    latitude: 51.65 + Math.random() * 0.1,
    longitude: -0.05 + Math.random() * 0.1,
    rivers_and_sea_risk: riskLevels[riverRiskIndex],
    rivers_and_sea_annual_chance: riskChances[riskLevels[riverRiskIndex]],
    surface_water_risk: riskLevels[surfaceRiskIndex],
    surface_water_annual_chance: riskChances[riskLevels[surfaceRiskIndex]],
    reservoir_risk: Math.random() > 0.9,
    reservoir_risk_details: Math.random() > 0.9 ? 'Property is within reservoir flood extent' : null,
    overall_flood_risk: overallRisk,
    in_flood_zone_2: overallRisk === 'Medium' || overallRisk === 'High',
    in_flood_zone_3: overallRisk === 'High',
    flood_defenses_present: Math.random() > 0.6,
    defense_standard: Math.random() > 0.6 ? '1 in 100 year protection' : null,
    recorded_flood_events: [],
    last_flood_event_date: null,
    recommendations: recommendations,
    current_warnings: [],
    current_alerts: [],
    insurance_implications: insuranceImplications[overallRisk],
    last_checked_at: new Date().toISOString(),
    last_warning_check_at: new Date().toISOString(),
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { address, postcode, forceRefresh } = await req.json();

    if (!postcode) {
      return new Response(
        JSON.stringify({ success: false, error: "Postcode is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanPostcode = postcode.replace(/\s/g, "").toUpperCase();

    // Check cache first
    const { data: cached } = await supabase
      .from("flood_risk_data")
      .select("*")
      .eq("postcode", cleanPostcode)
      .ilike("property_address", `%${address?.split(',')[0] || ''}%`)
      .single();

    // Flood risk data is static - cache for 90 days
    if (cached && !forceRefresh && isRecent(cached.last_checked_at, 90)) {
      console.log("Returning cached flood risk data");
      return new Response(
        JSON.stringify({ success: true, data: cached, source: "cache" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate mock data for demo
    console.log("Generating mock flood risk data");
    const mockData = generateMockFloodData(address || `Property at ${postcode}`, cleanPostcode);

    const { data: saved, error } = await supabase
      .from("flood_risk_data")
      .upsert(mockData, { onConflict: "postcode,property_address" })
      .select()
      .single();

    if (error) {
      console.error("Error saving flood risk data:", error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: saved || mockData,
        source: "mock",
        message: "Using demo data. Real Environment Agency API integration available.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in flood-risk-fetch:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        message: "Failed to fetch flood risk data",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
