import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Planning Data API (planning.data.gov.uk)
const PLANNING_API_BASE = "https://www.planning.data.gov.uk/api/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { postcode, local_authority, limit = 50 } = await req.json();

    console.log("Fetching planning data for:", { postcode, local_authority });

    // Build query for planning.data.gov.uk API
    let apiUrl = `${PLANNING_API_BASE}/planning-application`;
    const params = new URLSearchParams();
    
    if (postcode) {
      // Get postcode district for wider search
      const district = postcode.split(" ")[0];
      params.append("postcode", district);
    }
    
    if (local_authority) {
      params.append("local-planning-authority", local_authority);
    }
    
    params.append("limit", limit.toString());
    
    apiUrl += `?${params.toString()}`;

    console.log("Calling Planning API:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Planning API error:", response.status, await response.text());
      // Return empty array on error - API may not have data for this area
      return new Response(
        JSON.stringify({ success: true, data: [], count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const applications = data.entities || data.results || data.data || [];

    console.log(`Found ${applications.length} planning applications`);

    // Map and upsert to database
    const mappedApps = applications.map((app: any) => ({
      reference: app.reference || app["planning-application"] || `PA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      address: app.address || app["site-address"] || "Unknown",
      postcode: app.postcode || postcode,
      latitude: app.latitude || app.point?.coordinates?.[1],
      longitude: app.longitude || app.point?.coordinates?.[0],
      local_authority: app["local-planning-authority"] || local_authority,
      description: app.description || app.proposal,
      application_type: app["application-type"] || app.type,
      development_type: app["development-type"],
      proposed_units: app["units-proposed"],
      status: mapStatus(app.status || app["decision-type"]),
      submitted_date: app["received-date"] || app["start-date"],
      decision_date: app["decision-date"],
      applicant_name: app.applicant,
      agent_company: app.agent,
      source_url: app.url,
      source: "planning_data_gov",
      last_synced: new Date().toISOString(),
      raw_data: app,
    })).filter((app: any) => app.reference);

    // Upsert to database
    if (mappedApps.length > 0) {
      const { error: upsertError } = await supabase
        .from("planning_applications")
        .upsert(mappedApps, { 
          onConflict: "reference",
          ignoreDuplicates: false 
        });

      if (upsertError) {
        console.error("Upsert error:", upsertError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: mappedApps,
        count: mappedApps.length 
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

function mapStatus(status: string | undefined): string {
  if (!status) return "pending";
  
  const s = status.toLowerCase();
  if (s.includes("approved") || s.includes("granted") || s.includes("permitted")) {
    return "approved";
  }
  if (s.includes("refused") || s.includes("rejected")) {
    return "refused";
  }
  if (s.includes("withdrawn")) {
    return "withdrawn";
  }
  if (s.includes("appeal")) {
    return "appeal";
  }
  return "pending";
}
