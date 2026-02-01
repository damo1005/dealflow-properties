import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Pre-encoded location codes (use %5E instead of ^)
const LOCATION_CODES: Record<string, string> = {
  'harpenden': 'OUTCODE%5E114',
  'al5': 'OUTCODE%5E114',
  'st albans': 'REGION%5E1029',
  'al1': 'OUTCODE%5E93',
  'birmingham': 'REGION%5E162',
  'b1': 'OUTCODE%5E234',
  'manchester': 'REGION%5E904',
  'm1': 'OUTCODE%5E1712',
  'london': 'REGION%5E87490',
  'leeds': 'REGION%5E787',
  'liverpool': 'REGION%5E821',
  'bristol': 'REGION%5E219',
  'sheffield': 'REGION%5E1195',
  'edinburgh': 'REGION%5E475',
  'glasgow': 'REGION%5E550',
  'nottingham': 'REGION%5E1019',
  'leicester': 'REGION%5E806',
  'coventry': 'REGION%5E366',
  'reading': 'REGION%5E1098',
  'milton keynes': 'REGION%5E943',
  'cambridge': 'REGION%5E274',
  'oxford': 'REGION%5E1036',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const APIFY_TOKEN = Deno.env.get("APIFY_API_TOKEN");

  try {
    const params = await req.json();
    
    if (!params.location) {
      throw new Error("Location is required");
    }

    const searchLocation = params.location.trim().toLowerCase();
    console.log('=== SEARCH START ===');
    console.log('Location:', searchLocation);
    console.log('Has APIFY_TOKEN:', !!APIFY_TOKEN);

    // Get pre-encoded location code
    let locationCode = LOCATION_CODES[searchLocation];
    
    if (!locationCode) {
      // Check if it's an outcode pattern (e.g., AL5, M1, SW1A)
      const outcodeMatch = searchLocation.match(/^([a-z]{1,2}\d{1,2}[a-z]?)$/i);
      if (outcodeMatch) {
        locationCode = `OUTCODE%5E${outcodeMatch[1].toUpperCase()}`;
      }
    }

    if (!locationCode) {
      throw new Error(`Unknown location: ${params.location}. Try a city name or postcode like AL5, M1, etc.`);
    }

    console.log('Location code:', locationCode);

    // Build EXACT URL format that works (from manual test)
    const searchUrl = `https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=${locationCode}&radius=${params.radius || 10}.0&sortType=6&propertyTypes=&includeSSTC=false&mustHave=&dontShow=&furnishTypes=&keywords=`;
    
    console.log('Search URL:', searchUrl);

    let results: any[] = [];

    // Try Apify
    if (APIFY_TOKEN) {
      try {
        results = await fetchFromApify(searchUrl, APIFY_TOKEN);
        console.log('Apify returned:', results.length, 'results');
      } catch (e: any) {
        console.error('Apify failed:', e.message);
      }
    } else {
      console.log('No APIFY_TOKEN set');
    }

    // Transform results
    const listings = results.map(item => transformListing(item, params.location));
    console.log('Transformed:', listings.length, 'listings');

    // Save to database
    for (const listing of listings) {
      await supabase
        .from('property_listings')
        .upsert(listing, { onConflict: 'external_id,source' });
    }

    console.log('=== COMPLETE ===');

    return new Response(
      JSON.stringify({ success: true, data: listings, count: listings.length }),
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

async function fetchFromApify(searchUrl: string, token: string): Promise<any[]> {
  // Use exact input format
  const input = {
    listUrls: [searchUrl],
    maxItems: 25,
    includeFullPropertyDetails: false,
    includePriceHistory: false,
    includeNearestSchools: false,
  };

  console.log('Apify input listUrls[0]:', input.listUrls[0]);

  const startRes = await fetch(
    `https://api.apify.com/v2/acts/dhrumil~rightmove-scraper/runs?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );

  if (!startRes.ok) {
    const errText = await startRes.text();
    console.error('Apify response:', errText);
    throw new Error(`Apify failed: ${startRes.status}`);
  }

  const startData = await startRes.json();
  const runId = startData.data?.id;
  
  if (!runId) {
    throw new Error('No run ID returned');
  }
  
  console.log('Apify run ID:', runId);

  // Poll for completion
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${token}`
    );
    const statusData = await statusRes.json();
    const status = statusData.data?.status;
    
    if (i % 5 === 0) console.log(`Poll ${i}: ${status}`);
    
    if (status === 'SUCCEEDED') {
      const dataRes = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${token}`
      );
      const items = await dataRes.json();
      console.log('Got', items.length, 'items from dataset');
      return items;
    }
    
    if (status === 'FAILED' || status === 'ABORTED') {
      throw new Error(`Run ${status}`);
    }
  }

  throw new Error('Timeout waiting for Apify');
}

function transformListing(item: any, location: string): any {
  const address = item.displayAddress || item.address || `Property in ${location}`;
  const postcode = extractPostcode(address);
  
  let price = 0;
  if (typeof item.price === 'number') {
    price = item.price;
  } else if (item.price?.amount) {
    price = item.price.amount;
  } else if (item.displayPrice) {
    price = parseInt(String(item.displayPrice).replace(/\D/g, '')) || 0;
  }

  const rent = price ? Math.round(price * 0.0045) : null;
  const yld = rent && price ? Math.round((rent * 12 / price) * 100) / 10 : null;

  const images = (item.images || item.propertyImages?.images || [])
    .map((i: any) => typeof i === 'string' ? i : (i.url || i.srcUrl || ''))
    .filter(Boolean)
    .slice(0, 5);

  return {
    external_id: String(item.id || `rm-${Date.now()}-${Math.random().toString(36).substr(2,6)}`),
    source: 'rightmove',
    listing_url: item.url || `https://www.rightmove.co.uk/properties/${item.id}`,
    address,
    postcode,
    outcode: postcode?.split(' ')[0] || location.toUpperCase(),
    latitude: item.coordinates?.latitude || item.location?.latitude,
    longitude: item.coordinates?.longitude || item.location?.longitude,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    property_type: item.propertyType || 'Property',
    tenure: item.tenure,
    price,
    original_price: item.price?.previousPrice,
    is_reduced: !!item.price?.previousPrice,
    agent_name: item.agent || item.customer?.branchDisplayName,
    agent_phone: item.agentPhone,
    thumbnail_url: images[0] || null,
    images,
    summary: (item.description || '').substring(0, 300),
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
