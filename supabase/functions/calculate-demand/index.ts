import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    console.log("Refreshing demand scores...");

    // Get all unique postcode districts from our data sources
    const [planningRes, ccsRes, epcRes] = await Promise.all([
      supabase.from("planning_applications").select("postcode"),
      supabase.from("ccs_projects").select("postcode"),
      supabase.from("epc_properties").select("postcode"),
    ]);

    const allPostcodes = [
      ...(planningRes.data || []).map((r: any) => r.postcode),
      ...(ccsRes.data || []).map((r: any) => r.postcode),
      ...(epcRes.data || []).map((r: any) => r.postcode),
    ].filter(Boolean);

    // Extract unique districts
    const districts = [...new Set(
      allPostcodes.map((pc: string) => pc.split(" ")[0])
    )];

    console.log(`Processing ${districts.length} postcode districts`);

    const scores: any[] = [];

    for (const district of districts) {
      // Count planning applications (approved in last 12 months)
      const { count: planningApproved } = await supabase
        .from("planning_applications")
        .select("*", { count: "exact", head: true })
        .ilike("postcode", `${district}%`)
        .eq("status", "approved");

      const { count: planningPending } = await supabase
        .from("planning_applications")
        .select("*", { count: "exact", head: true })
        .ilike("postcode", `${district}%`)
        .eq("status", "pending");

      // Count active CCS sites
      const { count: ccsCount } = await supabase
        .from("ccs_projects")
        .select("*", { count: "exact", head: true })
        .ilike("postcode", `${district}%`);

      // Count low EPC properties
      const { count: epcCount } = await supabase
        .from("epc_properties")
        .select("*", { count: "exact", head: true })
        .ilike("postcode", `${district}%`)
        .in("current_rating", ["D", "E", "F", "G"]);

      // Calculate scores
      const planningScore = Math.min(100, ((planningApproved || 0) + (planningPending || 0)) * 3);
      const constructionScore = Math.min(100, (ccsCount || 0) * 10);
      const renovationScore = Math.min(100, Math.floor((epcCount || 0) * 0.5));
      
      const overallScore = Math.min(100, Math.floor(
        (planningScore * 0.3) + 
        (constructionScore * 0.4) + 
        (renovationScore * 0.3)
      ));

      scores.push({
        postcode_district: district,
        planning_approved_count: planningApproved || 0,
        planning_pending_count: planningPending || 0,
        ccs_active_sites: ccsCount || 0,
        low_epc_properties: epcCount || 0,
        planning_score: planningScore,
        construction_score: constructionScore,
        renovation_score: renovationScore,
        overall_demand_score: overallScore,
        calculated_at: new Date().toISOString(),
      });
    }

    // Upsert all scores
    if (scores.length > 0) {
      const { error } = await supabase
        .from("demand_scores")
        .upsert(scores, { onConflict: "postcode_district" });

      if (error) {
        console.error("Upsert error:", error);
        throw error;
      }
    }

    console.log(`Updated ${scores.length} demand scores`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        updated: scores.length,
        scores: scores.slice(0, 10) // Return first 10 as sample
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
