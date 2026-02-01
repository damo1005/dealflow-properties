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

// Mock planning applications generator
function generateMockPlanningApplications(address: string, postcode: string, localAuthority: string) {
  const applicationTypes = [
    { type: "Householder", prefix: "HOU", proposals: [
      "Single storey rear extension",
      "Loft conversion with rear dormer",
      "Two storey side extension",
      "Replacement windows",
      "Porch extension",
    ]},
    { type: "Full Planning", prefix: "FUL", proposals: [
      "Conversion to 4 self-contained flats",
      "Change of use to HMO (6 bedrooms)",
      "New dwelling in rear garden",
      "Mixed use ground floor retail",
    ]},
    { type: "Prior Approval", prefix: "PAD", proposals: [
      "Larger home extension",
      "Office to residential conversion",
    ]},
  ];

  const statuses = ['approved', 'pending', 'refused'] as const;
  const applications = [];
  const currentYear = new Date().getFullYear();

  // Generate 2-4 applications
  const numApps = 2 + Math.floor(Math.random() * 3);

  for (let i = 0; i < numApps; i++) {
    const appType = applicationTypes[Math.floor(Math.random() * applicationTypes.length)];
    const proposal = appType.proposals[Math.floor(Math.random() * appType.proposals.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const year = currentYear - i;
    const refNumber = `${year.toString().slice(2)}/${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}/${appType.prefix}`;
    
    const receivedDate = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const validatedDate = new Date(receivedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const decisionDate = status !== 'pending' 
      ? new Date(validatedDate.getTime() + (56 + Math.floor(Math.random() * 30)) * 24 * 60 * 60 * 1000)
      : null;

    const conditions = status === 'approved' ? [
      { number: 1, title: "Time Limit", description: "Development must begin within 3 years" },
      { number: 2, title: "Materials", description: "External materials to match existing building" },
      { number: 3, title: "Plans", description: "Development in accordance with approved plans" },
    ] : null;

    applications.push({
      property_address: address,
      postcode: postcode,
      application_reference: refNumber,
      local_authority_name: localAuthority,
      received_date: receivedDate.toISOString().split('T')[0],
      validated_date: validatedDate.toISOString().split('T')[0],
      decision_date: decisionDate?.toISOString().split('T')[0] || null,
      proposal_description: proposal,
      development_type: appType.type,
      application_type: appType.type,
      status: status,
      decision: status === 'approved' ? 'Permission Granted' : status === 'refused' ? 'Permission Refused' : null,
      decision_reason: status === 'refused' ? 'Impact on character of the area and neighbouring amenity' : null,
      conditions: conditions,
      applicant_name: "Property Owner",
      applicant_type: "Owner",
      agent_name: Math.random() > 0.5 ? "ABC Planning Consultants" : null,
      agent_company: Math.random() > 0.5 ? "ABC Planning Ltd" : null,
      case_officer: ["Sarah Johnson", "Michael Brown", "Emma Wilson"][Math.floor(Math.random() * 3)],
      ward: "Town Ward",
      portal_url: `https://${localAuthority.toLowerCase()}.gov.uk/planning/${refNumber}`,
      documents: [
        { name: "Site Location Plan", url: "#", type: "pdf", date: receivedDate.toISOString().split('T')[0] },
        { name: "Proposed Plans", url: "#", type: "pdf", date: receivedDate.toISOString().split('T')[0] },
        { name: "Design Statement", url: "#", type: "pdf", date: receivedDate.toISOString().split('T')[0] },
      ],
      last_checked_at: new Date().toISOString(),
    });
  }

  return applications.sort((a, b) => 
    new Date(b.received_date!).getTime() - new Date(a.received_date!).getTime()
  );
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { address, postcode, localAuthority, forceRefresh } = await req.json();

    if (!postcode) {
      return new Response(
        JSON.stringify({ success: false, error: "Postcode is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authority = localAuthority || "Enfield";

    // Check cache first
    if (!forceRefresh) {
      const { data: cached } = await supabase
        .from("planning_applications")
        .select("*")
        .eq("postcode", postcode)
        .order("received_date", { ascending: false });

      if (cached && cached.length > 0) {
        const lastChecked = new Date(cached[0].last_checked_at);
        const daysSinceCheck = (Date.now() - lastChecked.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceCheck < 7) {
          console.log("Returning cached planning data");
          return new Response(
            JSON.stringify({ success: true, applications: cached, source: "cache" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Generate mock data for demo
    console.log("Generating mock planning data");
    const mockApplications = generateMockPlanningApplications(
      address || `Property at ${postcode}`,
      postcode,
      authority
    );

    // Store in database
    for (const app of mockApplications) {
      const { error } = await supabase
        .from("planning_applications")
        .upsert(app, { 
          onConflict: "application_reference,local_authority_name",
          ignoreDuplicates: false 
        });

      if (error) {
        console.error("Error saving planning application:", error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        applications: mockApplications,
        source: "mock",
        message: "Using demo data. Real planning portal integration coming soon.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in planning-fetch:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        message: "Failed to fetch planning data",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
