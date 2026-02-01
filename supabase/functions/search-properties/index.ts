import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APIFY_TOKEN = Deno.env.get("APIFY_API_TOKEN");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const params = await req.json();
    
    if (!params.location) {
      throw new Error("Location is required");
    }

    console.log('Searching:', params.location);

    // Get Rightmove location ID first
    const locationId = await getRightmoveLocationId(params.location);
    console.log('Location ID:', locationId);

    // Build search URL
    const locParam = locationId || `OUTCODE%5E${params.location.toUpperCase().replace(/\s+/g, '')}`;
    let searchUrl = `https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=${locParam}&radius=${params.radius || 10}.0&sortType=6&includeSSTC=false`;
    
    if (params.minPrice) searchUrl += `&minPrice=${params.minPrice}`;
    if (params.maxPrice && params.maxPrice < 5000000) searchUrl += `&maxPrice=${params.maxPrice}`;
    if (params.minBeds) searchUrl += `&minBedrooms=${params.minBeds}`;
    
    console.log('URL:', searchUrl);

    // Check cache
    const cacheKey = btoa(searchUrl).substring(0, 80);
    const { data: cached } = await supabase
      .from('property_search_cache')
      .select('*')
      .eq('search_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cached) {
      const { data: listings } = await supabase
        .from('property_listings')
        .select('*')
        .ilike('address', `%${params.location}%`)
        .eq('status', 'active')
        .limit(50);
      
      return new Response(
        JSON.stringify({ success: true, data: listings || [], fromCache: true, count: listings?.length || 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Apify synchronously - this waits for completion
    const results = await callApifySync(searchUrl);
    console.log('Apify returned:', results.length, 'items');

    // Transform and save
    const listings = [];
    for (const item of results) {
      const listing = transformListing(item, params.location);
      listings.push(listing);
      
      await supabase
        .from('property_listings')
        .upsert(listing, { onConflict: 'external_id,source' });
    }

    // Cache
    await supabase.from('property_search_cache').upsert({
      search_key: cacheKey,
      search_params: params,
      result_count: listings.length,
      expires_at: new Date(Date.now() + 3600000).toISOString(),
    }, { onConflict: 'search_key' });

    return new Response(
      JSON.stringify({ success: true, data: listings, fromCache: false, count: listings.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message, data: [], count: 0 }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function getRightmoveLocationId(location: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.rightmove.co.uk/typeAhead/uknocheck/${encodeURIComponent(location)}`,
      { headers: { "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.typeAheadLocations?.[0]?.locationIdentifier 
      ? encodeURIComponent(data.typeAheadLocations[0].locationIdentifier)
      : null;
  } catch {
    return null;
  }
}

async function callApifySync(searchUrl: string): Promise<any[]> {
  if (!APIFY_TOKEN) throw new Error('APIFY_API_TOKEN not set');

  // Use run-sync endpoint - waits up to 300s and returns results directly
  const response = await fetch(
    `https://api.apify.com/v2/acts/dhrumil~rightmove-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=60`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listUrls: [searchUrl],
        maxItems: 20,
        includeFullPropertyDetails: false,
        includePriceHistory: false,
        includeNearestSchools: false,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error('Apify error:', text);
    throw new Error('Apify request failed');
  }

  return await response.json();
}

function transformListing(item: any, location: string): any {
  const address = item.displayAddress || item.address || '';
  const postcode = extractPostcode(address);
  const price = typeof item.price === 'number' ? item.price : 
                item.price?.amount || 
                parseInt(String(item.displayPrice || '').replace(/\D/g, '')) || 0;
  
  const rent = price ? Math.round(price * 0.0045) : null;
  const yld = rent ? Math.round((rent * 12 / price) * 100) / 10 : null;

  return {
    external_id: String(item.id || Date.now()),
    source: 'rightmove',
    listing_url: item.url || `https://www.rightmove.co.uk/properties/${item.id}`,
    address,
    postcode,
    outcode: postcode?.split(' ')[0] || location.toUpperCase(),
    latitude: item.coordinates?.latitude,
    longitude: item.coordinates?.longitude,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    property_type: item.propertyType || 'Property',
    tenure: item.tenure,
    price,
    original_price: item.price?.previousPrice,
    is_reduced: !!item.price?.previousPrice,
    agent_name: item.agent,
    agent_phone: item.agentPhone,
    thumbnail_url: item.images?.[0]?.url || item.images?.[0] || null,
    images: (item.images || []).map((i: any) => i?.url || i).filter(Boolean).slice(0, 5),
    summary: item.description?.substring(0, 300),
    features: item.keyFeatures || [],
    estimated_rent: rent,
    gross_yield: yld,
    status: 'active',
  };
}

function extractPostcode(addr: string): string | null {
  const m = addr?.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i);
  return m ? m[1].toUpperCase() : null;
}
