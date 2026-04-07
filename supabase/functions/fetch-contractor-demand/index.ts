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
    const { postcode, radius = 5 } = await req.json();

    if (!postcode || typeof postcode !== "string") {
      throw new Error("Postcode is required");
    }

    console.log("=== CONTRACTOR DEMAND SEARCH ===");
    console.log("Postcode:", postcode, "Radius:", radius);

    const coords = await geocodePostcode(postcode);
    if (!coords) throw new Error("Invalid postcode");
    console.log("Geocoded:", coords);

    // Generate all data
    const planningApps = generatePlanningData(coords, radius);
    const activeSites = generateActiveSites(coords, radius);
    const renovationOpps = generateRenovationOpportunities(coords, radius);
    const contractors = generateContractors(coords, radius);

    console.log(
      "Generated - Planning:",
      planningApps.length,
      "Sites:",
      activeSites.length,
      "Reno:",
      renovationOpps.length,
      "Contractors:",
      contractors.length
    );

    // Save to DB in parallel
    const saves = [
      ...planningApps.map((app) =>
        supabase
          .from("planning_applications")
          .upsert(app, { onConflict: "application_reference,local_authority_name" })
      ),
      ...activeSites.map((site) =>
        supabase
          .from("construction_sites")
          .upsert(site, { onConflict: "site_reference" })
      ),
      ...renovationOpps.map((r) =>
        supabase.from("renovation_opportunities").insert(r)
      ),
      ...contractors.map((c) =>
        supabase
          .from("local_contractors")
          .upsert(c, { onConflict: "company_name" })
      ),
    ];
    await Promise.allSettled(saves);

    // Calculate demand score
    const demandScore = calculateDemandScore(
      planningApps.length,
      activeSites.length,
      renovationOpps.length,
      contractors.length
    );

    // Save metrics
    await supabase.from("area_demand_metrics").upsert(
      {
        postcode_area: coords.outcode,
        planning_apps_count: planningApps.length,
        active_sites_count: activeSites.length,
        renovation_opportunities_count: renovationOpps.length,
        contractors_count: contractors.length,
        demand_score: demandScore.score,
        demand_level: demandScore.level,
        supply_demand_ratio: demandScore.ratio,
        avg_contractor_rating: demandScore.avgRating,
        last_calculated: new Date().toISOString(),
      },
      { onConflict: "postcode_area" }
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: { planningApps, activeSites, renovationOpps, contractors, demandScore },
        counts: {
          planning: planningApps.length,
          sites: activeSites.length,
          renovation: renovationOpps.length,
          contractors: contractors.length,
        },
        coordinates: coords,
        source: "generated",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        data: null,
        counts: { planning: 0, sites: 0, renovation: 0, contractors: 0 },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// ============ GEOCODE ============
async function geocodePostcode(postcode: string) {
  const clean = postcode.replace(/\s+/g, "").toUpperCase();
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${clean}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 200 || !data.result) return null;
    return {
      lat: data.result.latitude,
      lng: data.result.longitude,
      admin_district: data.result.admin_district,
      region: data.result.region,
      outcode: data.result.outcode,
    };
  } catch {
    return null;
  }
}

// ============ PLANNING ============
function generatePlanningData(coords: any, radiusMiles: number) {
  const apps: any[] = [];
  const now = new Date();
  const types = [
    { type: "householder", desc: "Single storey rear extension", dev: "residential" },
    { type: "householder", desc: "Two storey side extension", dev: "residential" },
    { type: "householder", desc: "Loft conversion with rear dormer", dev: "residential" },
    { type: "full", desc: "Erection of 4 dwellings with parking", dev: "residential" },
    { type: "full", desc: "Change of use from retail to restaurant", dev: "commercial" },
    { type: "full", desc: "Conversion of offices to 8 residential flats", dev: "residential" },
    { type: "outline", desc: "Outline application for up to 25 dwellings", dev: "residential" },
    { type: "full", desc: "Demolition and erection of 12 apartments", dev: "residential" },
    { type: "householder", desc: "New detached garage and driveway", dev: "residential" },
    { type: "full", desc: "New commercial unit with parking", dev: "commercial" },
    { type: "change_of_use", desc: "Change of use from C3 to HMO (C4)", dev: "residential" },
    { type: "prior_approval", desc: "Prior approval for office to residential", dev: "residential" },
  ];
  const statuses = [
    { status: "approved", weight: 45 },
    { status: "pending", weight: 30 },
    { status: "refused", weight: 15 },
    { status: "withdrawn", weight: 10 },
  ];
  const count = Math.min(Math.floor(radiusMiles * 2.5) + 8, 40);
  for (let i = 0; i < count; i++) {
    const [lat, lng] = rndPt(coords.lat, coords.lng, radiusMiles);
    const t = pick(types);
    const status = wRnd(statuses);
    const daysAgo = Math.floor(Math.random() * 180);
    const received = new Date(now);
    received.setDate(received.getDate() - daysAgo);
    let decision = null;
    if (status !== "pending") {
      decision = new Date(received);
      decision.setDate(decision.getDate() + Math.floor(Math.random() * 60) + 30);
      if (decision > now) decision = null;
    }
    apps.push({
      application_reference: `${coords.outcode}/${received.getFullYear()}/${String(rndInt(1000, 9999))}`,
      property_address: `${rndInt(1, 150)} ${rndStreet()}, ${coords.admin_district || "Town"}`,
      postcode: mkPC(coords.outcode),
      latitude: lat,
      longitude: lng,
      local_authority_name: coords.admin_district || "Local Council",
      proposal_description: t.desc,
      application_type: t.type,
      development_type: t.dev,
      status,
      decision: status === "approved" ? "Permission Granted" : status === "refused" ? "Permission Refused" : null,
      received_date: received.toISOString().split("T")[0],
      decision_date: decision ? decision.toISOString().split("T")[0] : null,
      applicant_name: rndName(),
      agent_company: Math.random() > 0.5 ? `${rndName()} Planning Ltd` : null,
      data_source: "generated",
      last_synced: new Date().toISOString(),
    });
  }
  return apps;
}

// ============ ACTIVE SITES ============
function generateActiveSites(coords: any, radiusMiles: number) {
  const sites: any[] = [];
  const now = new Date();
  const projectTypes = [
    { type: "new_build", name: "Residential Development", desc: "Construction of new dwellings" },
    { type: "new_build", name: "Housing Estate Phase", desc: "New build housing development" },
    { type: "extension", name: "School Extension", desc: "Extension to existing school building" },
    { type: "refurbishment", name: "Office Refurbishment", desc: "Major refurbishment works" },
    { type: "conversion", name: "Barn Conversion", desc: "Conversion of agricultural building" },
    { type: "commercial", name: "Retail Park Development", desc: "New retail units" },
    { type: "infrastructure", name: "Road Improvements", desc: "Highway improvement works" },
    { type: "new_build", name: "Apartment Block", desc: "Construction of apartment building" },
  ];
  const contractorNames = [
    "Wates Construction", "Kier Group", "Morgan Sindall", "Willmott Dixon",
    "BAM Construction", "Galliford Try", "ISG Construction", "McLaren Construction",
    "Hill Group", "Countryside Properties",
  ];
  const count = Math.min(Math.floor(radiusMiles * 1.2) + 3, 20);
  for (let i = 0; i < count; i++) {
    const [lat, lng] = rndPt(coords.lat, coords.lng, radiusMiles);
    const p = pick(projectTypes);
    const cName = pick(contractorNames);
    const monthsAgo = Math.floor(Math.random() * 12);
    const start = new Date(now);
    start.setMonth(start.getMonth() - monthsAgo);
    const completion = new Date(start);
    completion.setMonth(completion.getMonth() + rndInt(6, 24));
    const value =
      p.type === "infrastructure"
        ? rndInt(1000000, 6000000)
        : p.type === "new_build"
        ? rndInt(500000, 3500000)
        : rndInt(100000, 1000000);

    sites.push({
      site_reference: `CCS-${coords.outcode}-${String(i + 1).padStart(4, "0")}`,
      site_name: `${p.name} - ${rndStreet()}`,
      address: `${rndStreet()}, ${coords.admin_district || "Town"}`,
      postcode: mkPC(coords.outcode),
      latitude: lat,
      longitude: lng,
      local_authority: coords.admin_district,
      project_type: p.type,
      description: p.desc,
      estimated_value: value,
      units_count: p.type === "new_build" ? rndInt(4, 50) : null,
      client_name: `${rndName()} Developments Ltd`,
      contractor_name: cName,
      contractor_phone: `07${rndInt(100000000, 999999999)}`,
      site_manager: rndName(),
      site_manager_phone: `07${rndInt(100000000, 999999999)}`,
      status: "active",
      start_date: start.toISOString().split("T")[0],
      expected_completion: completion.toISOString().split("T")[0],
      is_ccs_registered: Math.random() > 0.3,
      ccs_score: Math.random() > 0.3 ? parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)) : null,
      data_source: "generated",
      last_synced: new Date().toISOString(),
    });
  }
  return sites;
}

// ============ RENOVATION OPPORTUNITIES ============
function generateRenovationOpportunities(coords: any, radiusMiles: number) {
  const opps: any[] = [];
  const propTypes = ["detached", "semi_detached", "terraced", "flat", "bungalow"];
  const epcRatings = ["D", "E", "F", "G"];
  const workSets = [
    ["roof", "windows"],
    ["heating", "insulation"],
    ["kitchen", "bathroom"],
    ["insulation", "windows", "heating"],
    ["full_refurb"],
    ["extension_potential", "modernisation"],
    ["roof", "insulation", "windows"],
    ["bathroom", "kitchen", "heating"],
  ];
  const costMap: Record<string, [number, number]> = {
    roof: [5000, 15000],
    windows: [3000, 10000],
    heating: [3000, 8000],
    insulation: [2000, 6000],
    kitchen: [5000, 20000],
    bathroom: [3000, 10000],
    full_refurb: [30000, 80000],
    extension_potential: [20000, 60000],
    modernisation: [10000, 30000],
  };
  const count = Math.min(Math.floor(radiusMiles * 2) + 5, 30);
  for (let i = 0; i < count; i++) {
    const [lat, lng] = rndPt(coords.lat, coords.lng, radiusMiles);
    const pt = pick(propTypes);
    const epc = pick(epcRatings);
    const work = pick(workSets);
    let costLow = 0,
      costHigh = 0;
    for (const w of work) {
      const c = costMap[w] || [0, 0];
      costLow += c[0];
      costHigh += c[1];
    }
    const potIdx = epcRatings.indexOf(epc);
    opps.push({
      address: `${rndInt(1, 150)} ${rndStreet()}, ${coords.admin_district || "Town"}`,
      postcode: mkPC(coords.outcode),
      latitude: lat,
      longitude: lng,
      property_type: pt,
      bedrooms: pt === "flat" ? rndInt(1, 2) : rndInt(2, 5),
      build_year: rndInt(1930, 2010),
      epc_rating: epc,
      epc_potential: "C",
      estimated_condition: potIdx >= 2 ? "poor" : "fair",
      renovation_potential: potIdx >= 2 ? "high" : potIdx === 1 ? "medium" : "low",
      work_types: work,
      estimated_cost_low: costLow,
      estimated_cost_high: costHigh,
      data_source: "generated",
      last_synced: new Date().toISOString(),
    });
  }
  return opps;
}

// ============ CONTRACTORS ============
function generateContractors(coords: any, radiusMiles: number) {
  const contractors: any[] = [];
  const tradeTypes = [
    { trades: ["builder", "general_contractor"], specs: ["Extensions", "New Builds", "Renovations"] },
    { trades: ["plumber"], specs: ["Boiler Installation", "Bathroom Fitting", "Central Heating"] },
    { trades: ["electrician"], specs: ["Rewiring", "Consumer Units", "EV Charging"] },
    { trades: ["roofer"], specs: ["Flat Roofs", "Pitched Roofs", "Repairs"] },
    { trades: ["kitchen_fitter"], specs: ["Kitchen Design", "Installation", "Worktops"] },
    { trades: ["bathroom_fitter"], specs: ["Full Bathrooms", "Wet Rooms", "En-suites"] },
    { trades: ["plasterer"], specs: ["Plastering", "Rendering", "Coving"] },
    { trades: ["painter_decorator"], specs: ["Interior", "Exterior", "Wallpapering"] },
    { trades: ["carpenter"], specs: ["Bespoke Joinery", "Doors", "Flooring"] },
    { trades: ["landscaper"], specs: ["Garden Design", "Paving", "Fencing"] },
    { trades: ["window_fitter"], specs: ["uPVC Windows", "Doors", "Conservatories"] },
    { trades: ["heating_engineer"], specs: ["Gas Boilers", "Heat Pumps", "Underfloor Heating"] },
  ];
  const prefixes = ["A1", "Pro", "Elite", "Premier", "Quality", "Expert", "Reliable", "First Choice", "Supreme", "Master"];
  const suffixes = ["Services", "Solutions", "Ltd", "Group", "Contractors", "& Sons", "UK"];
  const count = Math.min(Math.floor(radiusMiles * 1.5) + 6, 25);
  for (let i = 0; i < count; i++) {
    const [lat, lng] = rndPt(coords.lat, coords.lng, radiusMiles * 0.7);
    const trade = pick(tradeTypes);
    const tradeName = trade.trades[0].charAt(0).toUpperCase() + trade.trades[0].slice(1).replace("_", " ");
    const companyName = `${pick(prefixes)} ${tradeName} ${pick(suffixes)}`;
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const isGasSafe = trade.trades.includes("plumber") || trade.trades.includes("heating_engineer");
    const isNiceic = trade.trades.includes("electrician");
    contractors.push({
      company_name: companyName,
      trading_name: companyName,
      company_number: Math.random() > 0.5 ? String(rndInt(10000000, 99999999)) : null,
      contact_name: rndName(),
      phone: `07${rndInt(100000000, 999999999)}`,
      email: `info@${slug}.co.uk`,
      website: Math.random() > 0.3 ? `https://www.${slug}.co.uk` : null,
      address: `${rndInt(1, 100)} ${rndStreet()}`,
      postcode: mkPC(coords.outcode),
      latitude: lat,
      longitude: lng,
      trade_categories: trade.trades,
      specialties: trade.specs,
      service_radius_miles: rndInt(10, 30),
      checkatrade_url: Math.random() > 0.3 ? `https://www.checkatrade.com/trades/${slug}` : null,
      checkatrade_rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      checkatrade_reviews: rndInt(10, 150),
      google_rating: Math.random() > 0.5 ? parseFloat((Math.random() + 4).toFixed(1)) : null,
      google_reviews: Math.random() > 0.5 ? rndInt(5, 50) : null,
      is_gas_safe: isGasSafe,
      gas_safe_number: isGasSafe ? String(rndInt(100000, 999999)) : null,
      is_niceic: isNiceic,
      is_trustmark: Math.random() > 0.7,
      is_federation_master_builders: Math.random() > 0.8,
      established_year: rndInt(1990, 2020),
      employees_count: pick(["1-5", "1-5", "1-5", "6-10", "6-10", "11-25"]),
      data_source: "generated",
      last_synced: new Date().toISOString(),
    });
  }
  return contractors;
}

// ============ DEMAND SCORE ============
function calculateDemandScore(planning: number, sites: number, renovation: number, contractors: number) {
  const totalWork = planning + sites + renovation;
  const ratio = contractors > 0 ? totalWork / contractors : totalWork;
  let score = Math.min(Math.round(ratio * 15), 100);
  if (totalWork > 50) score = Math.min(score + 10, 100);
  if (contractors < 10) score = Math.min(score + 15, 100);
  let level: string;
  if (score >= 75) level = "very_high";
  else if (score >= 50) level = "high";
  else if (score >= 25) level = "medium";
  else level = "low";
  const avgRating = parseFloat((4.2 + Math.random() * 0.5).toFixed(1));
  return {
    score,
    level,
    ratio: Math.round(ratio * 100) / 100,
    avgRating,
    interpretation:
      level === "very_high"
        ? "Very high demand — contractors are in short supply"
        : level === "high"
        ? "High demand — good opportunity for contractors"
        : level === "medium"
        ? "Moderate demand — balanced market"
        : "Low demand — competitive market for contractors",
  };
}

// ============ HELPERS ============
function rndPt(lat: number, lng: number, r: number): [number, number] {
  const a = Math.random() * 2 * Math.PI;
  const d = Math.random() * r * 0.9;
  return [lat + (d / 69) * Math.cos(a), lng + (d / (69 * Math.cos((lat * Math.PI) / 180))) * Math.sin(a)];
}
function rndStreet() {
  const s = ["High Street", "Station Road", "Church Lane", "Mill Lane", "Park Road", "Victoria Road", "London Road", "Green Lane", "The Avenue", "Manor Road", "Oak Drive", "Elm Close", "Cedar Way", "Willow Gardens", "Beech Avenue", "Kings Road", "Queens Way", "Bridge Street", "Market Square", "Chapel Lane"];
  return pick(s);
}
function mkPC(outcode: string) {
  return `${outcode} ${Math.floor(Math.random() * 9)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
}
function rndName() {
  const f = ["James", "Sarah", "Michael", "Emma", "David", "Sophie", "Robert", "Lucy", "William", "Charlotte", "John", "Emily", "Richard", "Hannah", "Thomas"];
  const l = ["Smith", "Jones", "Williams", "Brown", "Taylor", "Davies", "Wilson", "Evans", "Thomas", "Johnson", "Walker", "Wright", "Robinson", "Hall", "Green"];
  return `${pick(f)} ${pick(l)}`;
}
function rndInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function wRnd(items: { status: string; weight: number }[]): string {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const i of items) {
    r -= i.weight;
    if (r <= 0) return i.status;
  }
  return items[0].status;
}
