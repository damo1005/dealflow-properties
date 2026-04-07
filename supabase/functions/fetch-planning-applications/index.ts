import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
    const { postcode, radius = 5 } = await req.json();

    if (!postcode || typeof postcode !== "string") {
      throw new Error("Postcode is required");
    }

    console.log("=== PLANNING SEARCH ===");
    console.log("Postcode:", postcode, "Radius:", radius);

    // 1. Geocode the postcode
    const coords = await geocodePostcode(postcode);
    if (!coords) {
      throw new Error("Could not geocode postcode");
    }
    console.log("Coordinates:", coords);

    // 2. Check cache first
    const { data: cached } = await supabase.rpc("find_planning_near", {
      search_lat: coords.lat,
      search_lng: coords.lng,
      radius_miles: radius,
      status_filter: null,
    });

    if (cached && cached.length > 0) {
      const freshCache = cached.filter((app: any) => {
        if (!app.last_synced) return false;
        const synced = new Date(app.last_synced);
        const hoursSince = (Date.now() - synced.getTime()) / (1000 * 60 * 60);
        return hoursSince < 24;
      });

      if (freshCache.length > 0) {
        console.log("Returning cached results:", freshCache.length);
        return new Response(
          JSON.stringify({
            success: true,
            data: freshCache,
            count: freshCache.length,
            source: "cache",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // 3. Fetch fresh data from planning.data.gov.uk
    const applications = await fetchPlanningData(coords, radius);
    console.log("Fetched from API:", applications.length);

    // 4. Upsert to database
    if (applications.length > 0) {
      const { error: upsertError } = await supabase
        .from("planning_applications")
        .upsert(applications, {
          onConflict: "application_reference,local_authority_name",
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error("Upsert error:", upsertError);
      }
    }

    // 5. Return results from DB (includes distance calc)
    const { data: results } = await supabase.rpc("find_planning_near", {
      search_lat: coords.lat,
      search_lng: coords.lng,
      radius_miles: radius,
      status_filter: null,
    });

    const finalData = results && results.length > 0 ? results : applications;

    return new Response(
      JSON.stringify({
        success: true,
        data: finalData,
        count: finalData.length,
        source: applications.length > 0 ? "api" : "cache",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        data: [],
        count: 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function geocodePostcode(postcode: string) {
  const cleanPostcode = postcode.replace(/\s+/g, "").toUpperCase();

  const res = await fetch(
    `https://api.postcodes.io/postcodes/${cleanPostcode}`
  );
  if (!res.ok) return null;

  const data = await res.json();
  if (data.status !== 200) return null;

  return {
    lat: data.result.latitude,
    lng: data.result.longitude,
    admin_district: data.result.admin_district,
    outcode: data.result.outcode,
  };
}

async function fetchPlanningData(
  coords: { lat: number; lng: number; admin_district: string; outcode: string },
  radiusMiles: number
) {
  const applications: any[] = [];

  // Try entity search with point geometry
  try {
    const url = new URL("https://www.planning.data.gov.uk/entity.json");
    url.searchParams.set("dataset", "planning-application");
    url.searchParams.set("limit", "100");
    // Search by point with buffer
    url.searchParams.set(
      "geometry",
      `POINT(${coords.lng} ${coords.lat})`
    );
    url.searchParams.set("geometry_relation", "intersects");

    console.log("Fetching from:", url.toString());
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      const entities = data.entities || [];
      console.log("Entity search returned:", entities.length);

      for (const entity of entities) {
        applications.push(mapPlanningEntity(entity, coords));
      }
    } else {
      console.error("Entity search failed:", res.status);
    }
  } catch (e) {
    console.error("Entity search error:", e);
  }

  // Also try searching by outcode area if we didn't get enough results
  if (applications.length < 20) {
    try {
      const url = new URL("https://www.planning.data.gov.uk/entity.json");
      url.searchParams.set("dataset", "planning-application");
      url.searchParams.set("limit", "100");

      console.log("Trying broader search");
      const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        const entities = data.entities || [];

        for (const entity of entities) {
          if (entity.point) {
            const [lng, lat] = entity.point.coordinates || [0, 0];
            const distance = haversineDistance(
              coords.lat,
              coords.lng,
              lat,
              lng
            );

            if (distance <= radiusMiles) {
              const mapped = mapPlanningEntity(entity, coords);
              if (
                !applications.find(
                  (a) =>
                    a.application_reference === mapped.application_reference
                )
              ) {
                applications.push(mapped);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Broader search error:", e);
    }
  }

  return applications;
}

function mapPlanningEntity(entity: any, searchCoords: any) {
  const point = entity.point?.coordinates || [null, null];

  return {
    application_reference:
      entity.reference || entity.entity?.toString() || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    property_address:
      entity.address || entity.name || "Address not available",
    postcode: extractPostcode(entity.address || "") || null,
    latitude: point[1] || searchCoords.lat,
    longitude: point[0] || searchCoords.lng,
    local_authority_name:
      entity.organisation || entity["local-planning-authority"] || "Unknown",
    proposal_description:
      entity.description || entity.name || "Planning application",
    application_type: mapApplicationType(
      entity["application-type"] || entity.dataset || ""
    ),
    development_type: inferDevelopmentType(entity.description || ""),
    status: mapStatus(entity.status || entity["planning-decision"] || ""),
    decision: entity["planning-decision"] || null,
    received_date: entity["start-date"] || entity["entry-date"] || null,
    validated_date: entity["entry-date"] || null,
    decision_date: entity["end-date"] || null,
    applicant_name: entity.applicant || null,
    agent_name: entity.agent || null,
    source_url: entity.entity
      ? `https://www.planning.data.gov.uk/entity/${entity.entity}`
      : null,
    data_source: "planning_data_gov",
    last_synced: new Date().toISOString(),
    raw_data: entity,
  };
}

function extractPostcode(address: string): string | null {
  const match = address.match(
    /([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i
  );
  return match ? match[1].toUpperCase() : null;
}

function mapApplicationType(type: string): string {
  const typeMap: Record<string, string> = {
    full: "full",
    outline: "outline",
    householder: "householder",
    "change-of-use": "change_of_use",
    "listed-building": "listed_building",
    "prior-approval": "prior_approval",
    "reserved-matters": "reserved_matters",
  };
  return typeMap[type?.toLowerCase()] || "other";
}

function mapStatus(status: string): string {
  const statusLower = (status || "").toLowerCase();
  if (statusLower.includes("grant") || statusLower.includes("approv"))
    return "approved";
  if (statusLower.includes("refus")) return "refused";
  if (statusLower.includes("withdraw")) return "withdrawn";
  if (statusLower.includes("appeal")) return "appealed";
  if (statusLower.includes("pending") || statusLower.includes("progress"))
    return "pending";
  return "submitted";
}

function inferDevelopmentType(description: string): string {
  const desc = description.toLowerCase();
  if (
    desc.includes("dwelling") ||
    desc.includes("residential") ||
    desc.includes("house") ||
    desc.includes("flat")
  )
    return "residential";
  if (
    desc.includes("commercial") ||
    desc.includes("office") ||
    desc.includes("retail") ||
    desc.includes("shop")
  )
    return "commercial";
  if (desc.includes("mixed")) return "mixed";
  if (
    desc.includes("infrastructure") ||
    desc.includes("road") ||
    desc.includes("utility")
  )
    return "infrastructure";
  return "other";
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
