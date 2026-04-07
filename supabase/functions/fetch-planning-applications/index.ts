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

    // 1. Geocode the postcode using postcodes.io
    const coords = await geocodePostcode(postcode);
    if (!coords) {
      throw new Error("Invalid postcode");
    }
    console.log("Geocoded:", coords);

    // 2. Generate realistic planning data based on the area
    const applications = generateRealisticPlanningData(coords, radius, postcode);
    console.log("Generated applications:", applications.length);

    // 3. Save to database
    for (const app of applications) {
      await supabase
        .from("planning_applications")
        .upsert(app, {
          onConflict: "application_reference,local_authority_name",
          ignoreDuplicates: false,
        })
        .select();
    }

    // 4. Fetch from database (includes distance calc from RPC)
    const { data: results } = await supabase.rpc("find_planning_near", {
      search_lat: coords.lat,
      search_lng: coords.lng,
      radius_miles: radius,
      status_filter: null,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: results || applications,
        count: (results || applications).length,
        source: "generated",
        coordinates: coords,
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

  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${cleanPostcode}`
    );
    if (!res.ok) {
      console.error("Postcodes.io error:", res.status);
      return null;
    }

    const data = await res.json();
    if (data.status !== 200 || !data.result) {
      console.error("Invalid postcode response:", data);
      return null;
    }

    return {
      lat: data.result.latitude,
      lng: data.result.longitude,
      admin_district: data.result.admin_district,
      region: data.result.region,
      outcode: data.result.outcode,
      country: data.result.country,
    };
  } catch (e) {
    console.error("Geocode error:", e);
    return null;
  }
}

function generateRealisticPlanningData(
  coords: any,
  radiusMiles: number,
  postcode: string
) {
  const applications: any[] = [];
  const now = new Date();

  const applicationTypes = [
    { type: "householder", desc: "Single storey rear extension", devType: "residential" },
    { type: "householder", desc: "Two storey side extension", devType: "residential" },
    { type: "householder", desc: "Loft conversion with rear dormer", devType: "residential" },
    { type: "full", desc: "Erection of 4 dwellings with parking", devType: "residential" },
    { type: "full", desc: "Change of use from retail to restaurant", devType: "commercial" },
    { type: "full", desc: "Conversion of offices to 8 residential flats", devType: "residential" },
    { type: "outline", desc: "Outline application for up to 25 dwellings", devType: "residential" },
    { type: "full", desc: "Demolition and erection of 12 apartments", devType: "residential" },
    { type: "householder", desc: "New detached garage and driveway", devType: "residential" },
    { type: "full", desc: "New commercial unit with parking", devType: "commercial" },
    { type: "change_of_use", desc: "Change of use from C3 to HMO (C4)", devType: "residential" },
    { type: "prior_approval", desc: "Prior approval for office to residential", devType: "residential" },
    { type: "listed_building", desc: "Internal alterations to Grade II listed building", devType: "residential" },
    { type: "full", desc: "Mixed use development with retail and 6 flats", devType: "mixed" },
    { type: "householder", desc: "Replacement windows and new roof tiles", devType: "residential" },
  ];

  const statuses = [
    { status: "approved", weight: 45 },
    { status: "pending", weight: 30 },
    { status: "refused", weight: 15 },
    { status: "withdrawn", weight: 10 },
  ];

  const streetNames = [
    "High Street", "Station Road", "Church Lane", "Mill Lane", "Park Road",
    "Victoria Road", "London Road", "Green Lane", "The Avenue", "Manor Road",
    "Oak Drive", "Elm Close", "Cedar Way", "Willow Gardens", "Beech Avenue",
  ];

  const localAuthority = coords.admin_district || "Local Council";
  const count = Math.min(Math.floor(radiusMiles * 3) + 5, 50);

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusMiles * 0.8;
    const latOffset = (distance / 69) * Math.cos(angle);
    const lngOffset =
      (distance / (69 * Math.cos((coords.lat * Math.PI) / 180))) *
      Math.sin(angle);

    const appType =
      applicationTypes[Math.floor(Math.random() * applicationTypes.length)];
    const status = weightedRandom(statuses);
    const streetNum = Math.floor(Math.random() * 150) + 1;
    const street = streetNames[Math.floor(Math.random() * streetNames.length)];

    const daysAgo = Math.floor(Math.random() * 180);
    const receivedDate = new Date(now);
    receivedDate.setDate(receivedDate.getDate() - daysAgo);

    let decisionDate: Date | null = null;
    if (status !== "pending") {
      decisionDate = new Date(receivedDate);
      decisionDate.setDate(
        decisionDate.getDate() + Math.floor(Math.random() * 60) + 30
      );
      if (decisionDate > now) decisionDate = null;
    }

    const refYear = receivedDate.getFullYear();
    const refNum = String(Math.floor(Math.random() * 9000) + 1000);
    const outcodePrefix =
      postcode.split(" ")[0] || coords.outcode || "PL";

    applications.push({
      application_reference: `${outcodePrefix}/${refYear}/${refNum}`,
      property_address: `${streetNum} ${street}, ${coords.admin_district || "Town"}`,
      postcode: `${outcodePrefix} ${Math.floor(Math.random() * 9)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      latitude: coords.lat + latOffset,
      longitude: coords.lng + lngOffset,
      local_authority_name: localAuthority,
      proposal_description: appType.desc,
      application_type: appType.type,
      development_type: appType.devType,
      status: status,
      decision:
        status === "approved"
          ? "Permission Granted"
          : status === "refused"
            ? "Permission Refused"
            : null,
      received_date: receivedDate.toISOString().split("T")[0],
      validated_date: receivedDate.toISOString().split("T")[0],
      decision_date: decisionDate
        ? decisionDate.toISOString().split("T")[0]
        : null,
      applicant_name: generateName(),
      agent_name:
        Math.random() > 0.5 ? `${generateName()} Planning Ltd` : null,
      source_url: null,
      data_source: "generated",
      last_synced: new Date().toISOString(),
      raw_data: { generated: true, seed_location: postcode },
    });
  }

  return applications;
}

function weightedRandom(
  items: { status: string; weight: number }[]
): string {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * total;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item.status;
  }

  return items[0].status;
}

function generateName(): string {
  const firstNames = [
    "James", "Sarah", "Michael", "Emma", "David",
    "Sophie", "Robert", "Lucy", "William", "Charlotte",
  ];
  const lastNames = [
    "Smith", "Jones", "Williams", "Brown", "Taylor",
    "Davies", "Wilson", "Evans", "Thomas", "Johnson",
  ];

  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}
