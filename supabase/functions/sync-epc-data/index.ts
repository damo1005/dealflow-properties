import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// EPC API (requires registration at epc.opendatacommunities.org)
const EPC_API_BASE = "https://epc.opendatacommunities.org/api/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const EPC_API_KEY = Deno.env.get("EPC_API_KEY");

  try {
    const { postcode, local_authority, min_rating = "D" } = await req.json();

    console.log("Fetching EPC data for:", { postcode, local_authority, min_rating });

    // If no API key, return demo data
    if (!EPC_API_KEY) {
      console.log("No EPC_API_KEY configured, returning cached data only");
      
      // Query existing cached data
      let query = supabase.from("epc_properties").select("*");
      
      if (postcode) {
        const district = postcode.split(" ")[0];
        query = query.ilike("postcode", `${district}%`);
      }
      
      query = query.in("current_rating", ["D", "E", "F", "G"]);
      query = query.limit(50);
      
      const { data: cachedData, error } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: cachedData || [],
          count: cachedData?.length || 0,
          source: "cache"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build EPC API query
    const params = new URLSearchParams();
    
    if (postcode) {
      params.append("postcode", postcode.split(" ")[0]);
    }
    
    if (local_authority) {
      params.append("local-authority", local_authority);
    }
    
    // Filter by low ratings
    params.append("energy-rating", "D");
    params.append("size", "100");

    const apiUrl = `${EPC_API_BASE}/domestic/search?${params.toString()}`;

    console.log("Calling EPC API");

    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Basic ${btoa(EPC_API_KEY + ":")}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error("EPC API error:", response.status);
      // Return cached data on error
      const { data: cachedData } = await supabase
        .from("epc_properties")
        .select("*")
        .limit(50);
        
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: cachedData || [],
          count: cachedData?.length || 0,
          source: "cache"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const certificates = data.rows || data.results || [];

    console.log(`Found ${certificates.length} EPC certificates`);

    // Map to our schema
    const mappedEPCs = certificates.map((epc: any) => ({
      lmk_key: epc["lmk-key"] || epc.lmkKey || `EPC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      address: epc.address || `${epc["address1"]} ${epc["address2"] || ""}`.trim(),
      postcode: epc.postcode,
      latitude: epc.latitude,
      longitude: epc.longitude,
      local_authority: epc["local-authority"],
      property_type: epc["property-type"],
      built_form: epc["built-form"],
      floor_area: parseFloat(epc["total-floor-area"]) || null,
      current_rating: epc["current-energy-rating"],
      current_score: parseInt(epc["current-energy-efficiency"]) || null,
      potential_rating: epc["potential-energy-rating"],
      potential_score: parseInt(epc["potential-energy-efficiency"]) || null,
      walls_description: epc["walls-description"],
      walls_efficiency: epc["walls-energy-eff"],
      roof_description: epc["roof-description"],
      roof_efficiency: epc["roof-energy-eff"],
      windows_description: epc["windows-description"],
      windows_efficiency: epc["windows-energy-eff"],
      heating_description: epc["mainheat-description"],
      heating_efficiency: epc["mainheat-energy-eff"],
      lodgement_date: epc["lodgement-date"],
      last_synced: new Date().toISOString(),
    })).filter((epc: any) => epc.lmk_key && ["D", "E", "F", "G"].includes(epc.current_rating));

    // Upsert to database
    if (mappedEPCs.length > 0) {
      const { error: upsertError } = await supabase
        .from("epc_properties")
        .upsert(mappedEPCs, { 
          onConflict: "lmk_key",
          ignoreDuplicates: false 
        });

      if (upsertError) {
        console.error("Upsert error:", upsertError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: mappedEPCs,
        count: mappedEPCs.length,
        source: "api"
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
