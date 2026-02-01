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

function generateMockCrimeData(address: string, postcode: string) {
  const safetyRatings = ['Very Safe', 'Safe', 'Average', 'Below Average', 'High Crime'] as const;
  const safetyIndex = Math.floor(Math.random() * 3); // Mostly safe areas
  const safetyRating = safetyRatings[safetyIndex];
  
  const safetyScores: Record<string, number> = {
    'Very Safe': 90,
    'Safe': 75,
    'Average': 60,
    'Below Average': 40,
    'High Crime': 20,
  };

  const baseMultiplier = safetyIndex + 1;
  
  // Generate crime counts based on safety rating
  const antisocial = Math.floor(Math.random() * 15 * baseMultiplier);
  const violence = Math.floor(Math.random() * 10 * baseMultiplier);
  const vehicle = Math.floor(Math.random() * 8 * baseMultiplier);
  const burglary = Math.floor(Math.random() * 6 * baseMultiplier);
  const criminal = Math.floor(Math.random() * 5 * baseMultiplier);
  const otherTheft = Math.floor(Math.random() * 4 * baseMultiplier);
  const publicOrder = Math.floor(Math.random() * 3 * baseMultiplier);
  const drugs = Math.floor(Math.random() * 2 * baseMultiplier);
  const bicycle = Math.floor(Math.random() * 2 * baseMultiplier);
  const robbery = Math.floor(Math.random() * baseMultiplier);
  const shoplifting = Math.floor(Math.random() * 3 * baseMultiplier);
  const theftPerson = Math.floor(Math.random() * 2 * baseMultiplier);
  const weapons = Math.floor(Math.random() * baseMultiplier);
  const other = Math.floor(Math.random() * 2 * baseMultiplier);

  const total = antisocial + violence + vehicle + burglary + criminal + otherTheft + 
    publicOrder + drugs + bicycle + robbery + shoplifting + theftPerson + weapons + other;

  // Generate monthly data
  const monthlyData = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i - 2, 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData.push({
      month,
      count: Math.floor(total / 12) + Math.floor(Math.random() * 5) - 2,
    });
  }

  const trends = ['increasing', 'stable', 'decreasing'] as const;
  const trend = trends[Math.floor(Math.random() * 3)];
  
  const comparisons = ['below', 'average', 'above'] as const;

  return {
    property_address: address,
    postcode: postcode.replace(/\s/g, '').toUpperCase(),
    latitude: 51.65 + Math.random() * 0.1,
    longitude: -0.05 + Math.random() * 0.1,
    police_force: 'Metropolitan Police',
    neighbourhood_id: 'E05000200',
    neighbourhood_name: 'Town Ward',
    total_crimes: total,
    crimes_per_1000_people: total / 10,
    antisocial_behaviour: antisocial,
    bicycle_theft: bicycle,
    burglary: burglary,
    criminal_damage: criminal,
    drugs: drugs,
    other_theft: otherTheft,
    possession_weapons: weapons,
    public_order: publicOrder,
    robbery: robbery,
    shoplifting: shoplifting,
    theft_from_person: theftPerson,
    vehicle_crime: vehicle,
    violence_sexual_offences: violence,
    other_crime: other,
    crime_trend: trend,
    trend_percentage: 5 + Math.floor(Math.random() * 20),
    vs_national_average: comparisons[safetyIndex < 2 ? 0 : safetyIndex > 2 ? 2 : 1],
    vs_force_average: comparisons[safetyIndex < 2 ? 0 : safetyIndex > 2 ? 2 : 1],
    safety_rating: safetyRating,
    safety_score: safetyScores[safetyRating] + Math.floor(Math.random() * 10) - 5,
    monthly_data: monthlyData,
    data_period_start: monthlyData[0].month,
    data_period_end: monthlyData[monthlyData.length - 1].month,
    last_updated_at: new Date().toISOString(),
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
      .from("crime_statistics")
      .select("*")
      .eq("postcode", cleanPostcode)
      .ilike("property_address", `%${address?.split(',')[0] || ''}%`)
      .single();

    // Cache for 30 days (crime data updated monthly)
    if (cached && !forceRefresh && isRecent(cached.last_updated_at, 30)) {
      console.log("Returning cached crime data");
      return new Response(
        JSON.stringify({ success: true, data: cached, source: "cache" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate mock data for demo
    console.log("Generating mock crime data");
    const mockData = generateMockCrimeData(address || `Property at ${postcode}`, cleanPostcode);

    const { data: saved, error } = await supabase
      .from("crime_statistics")
      .upsert(mockData, { onConflict: "postcode,property_address" })
      .select()
      .single();

    if (error) {
      console.error("Error saving crime data:", error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: saved || mockData,
        source: "mock",
        message: "Using demo data. Real Police.uk API integration available.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in crime-data-fetch:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        message: "Failed to fetch crime data",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
