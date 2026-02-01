import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LAND_REGISTRY_API_KEY = Deno.env.get("LAND_REGISTRY_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function isRecent(dateString: string, days: number): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < days;
}

// Mock data generator for demo purposes (when no API key)
function generateMockLandRegistryData(address: string, postcode: string) {
  const mockCharges = Math.random() > 0.5 ? [{
    date: "2020-03-15",
    chargee: "Barclays Bank PLC",
    type: "Legal Charge",
  }] : null;

  const mockLeaseData = Math.random() > 0.6 ? {
    lease_term_years: 125,
    lease_start_date: "1999-01-01",
    lease_expiry_date: "2124-01-01",
    ground_rent: 250,
  } : {};

  return {
    property_address: address,
    postcode: postcode,
    uprn: `UPRN${Math.floor(Math.random() * 1000000000)}`,
    title_number: `${postcode.replace(/\s/g, '').substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 100000)}`,
    tenure: mockLeaseData.lease_term_years ? 'leasehold' : 'freehold',
    proprietor_name: Math.random() > 0.4 ? "ABC Property Investments Ltd" : "John Smith & Jane Smith",
    proprietor_address: "123 Company House, London EC1A 1BB",
    proprietorship_category: Math.random() > 0.4 ? "Limited Company" : "Private Individual",
    company_registration_number: Math.random() > 0.4 ? "12345678" : null,
    date_proprietor_added: "2020-03-15",
    ...mockLeaseData,
    has_charges: mockCharges !== null,
    charge_count: mockCharges ? mockCharges.length : 0,
    charges: mockCharges,
    has_restrictions: false,
    restrictions: null,
    last_sale_date: "2020-03-15",
    last_sale_price: 285000 + Math.floor(Math.random() * 200000),
    last_sale_type: "Transfer",
    boundary_polygon: {
      type: "Polygon",
      coordinates: [[[0.1, 51.5], [0.101, 51.5], [0.101, 51.501], [0.1, 51.501], [0.1, 51.5]]]
    },
    data_quality: "basic",
    last_refreshed_at: new Date().toISOString(),
  };
}

// Generate mock price paid history
function generateMockPricePaidHistory(address: string, postcode: string) {
  const sales = [];
  let basePrice = 89500;
  const years = [2000, 2005, 2010, 2015, 2020];
  
  for (const year of years) {
    basePrice = Math.round(basePrice * (1 + 0.04 + Math.random() * 0.08));
    sales.push({
      property_address: address,
      postcode: postcode,
      transaction_id: `TRANS${year}${Math.floor(Math.random() * 10000)}`,
      sale_price: basePrice,
      sale_date: `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      property_type: ['D', 'S', 'T', 'F'][Math.floor(Math.random() * 4)],
      old_new: 'N',
      duration: Math.random() > 0.5 ? 'F' : 'L',
      transaction_category: 'Standard',
    });
  }
  
  return sales.reverse();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { address, postcode, titleNumber, forceRefresh } = await req.json();

    if (!address || !postcode) {
      return new Response(
        JSON.stringify({ success: false, error: "Address and postcode are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check cache first
    const { data: cached } = await supabase
      .from("land_registry_data")
      .select("*")
      .eq("postcode", postcode)
      .ilike("property_address", `%${address.split(',')[0]}%`)
      .single();

    if (cached && !forceRefresh && isRecent(cached.last_refreshed_at, 30)) {
      console.log("Returning cached Land Registry data");
      
      // Get price history
      const { data: priceHistory } = await supabase
        .from("price_paid_history")
        .select("*")
        .eq("postcode", postcode)
        .order("sale_date", { ascending: false });

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: cached, 
          priceHistory: priceHistory || [],
          source: "cache" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For demo purposes, use mock data if no API key
    if (!LAND_REGISTRY_API_KEY) {
      console.log("No Land Registry API key, generating mock data");
      
      const mockData = generateMockLandRegistryData(address, postcode);
      const mockPriceHistory = generateMockPricePaidHistory(address, postcode);

      // Store mock data
      const { data: saved, error } = await supabase
        .from("land_registry_data")
        .upsert(mockData, { onConflict: "title_number" })
        .select()
        .single();

      if (error) {
        console.error("Error saving mock data:", error);
      }

      // Store price history
      for (const sale of mockPriceHistory) {
        await supabase
          .from("price_paid_history")
          .upsert(sale, { onConflict: "transaction_id" })
          .select();
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: saved || mockData, 
          priceHistory: mockPriceHistory,
          source: "mock",
          message: "Using demo data. Connect Land Registry API for real data."
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Real API integration would go here
    // For now, return mock data with a note about API integration
    const mockData = generateMockLandRegistryData(address, postcode);
    const mockPriceHistory = generateMockPricePaidHistory(address, postcode);

    const { data: saved } = await supabase
      .from("land_registry_data")
      .upsert(mockData, { onConflict: "title_number" })
      .select()
      .single();

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: saved || mockData, 
        priceHistory: mockPriceHistory,
        source: "api" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in land-registry-fetch:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        message: "Failed to fetch Land Registry data"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
