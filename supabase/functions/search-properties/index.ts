import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Known location codes for common UK areas
const LOCATION_CODES: Record<string, string> = {
  'harpenden': 'OUTCODE^114',
  'al5': 'OUTCODE^114',
  'st albans': 'REGION^1029',
  'al1': 'OUTCODE^93',
  'birmingham': 'REGION^162',
  'manchester': 'REGION^904',
  'london': 'REGION^87490',
  'leeds': 'REGION^787',
  'liverpool': 'REGION^821',
  'bristol': 'REGION^219',
  'sheffield': 'REGION^1195',
  'edinburgh': 'REGION^475',
  'glasgow': 'REGION^550',
  'nottingham': 'REGION^1019',
  'leicester': 'REGION^806',
  'coventry': 'REGION^366',
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

    // Get location code - try known codes first, then API
    let locationCode = LOCATION_CODES[searchLocation];
    
    if (!locationCode) {
      // Check if it looks like a postcode outcode (e.g., AL5, M1, SW1)
      const outcodeMatch = searchLocation.match(/^([a-z]{1,2}\d{1,2}[a-z]?)$/i);
      if (outcodeMatch) {
        locationCode = `OUTCODE^${outcodeMatch[1].toUpperCase()}`;
      } else {
        // Try the API
        const apiCode = await getRightmoveLocationCode(searchLocation);
        if (apiCode) locationCode = apiCode;
      }
    }

    if (!locationCode) {
      // Last resort - treat as region search
      locationCode = `REGION^${searchLocation.toUpperCase()}`;
    }

    console.log('Location code:', locationCode);

    // Build search URL - DO NOT encode the locationIdentifier, it's already in correct format
    let searchUrl = `https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=${encodeURIComponent(locationCode)}&radius=${params.radius || 10}.0&sortType=6&includeSSTC=false&_includeSSTC=on`;
    
    if (params.minPrice) searchUrl += `&minPrice=${params.minPrice}`;
    if (params.maxPrice && params.maxPrice < 5000000) searchUrl += `&maxPrice=${params.maxPrice}`;
    if (params.minBeds) searchUrl += `&minBedrooms=${params.minBeds}`;
    
    console.log('Search URL:', searchUrl);

    // Validate URL format
    try {
      new URL(searchUrl);
    } catch {
      throw new Error('Invalid search URL generated');
    }

    let results: any[] = [];

    // Try Apify
    if (APIFY_TOKEN) {
      try {
        console.log('Calling Apify...');
        results = await fetchFromApify(searchUrl, APIFY_TOKEN);
        console.log('Apify returned:', results.length);
      } catch (e: any) {
        console.error('Apify error:', e.message);
      }
    }

    // Fallback to direct scraping
    if (results.length === 0) {
      console.log('Trying direct scrape...');
      results = await directScrape(searchUrl);
      console.log('Direct scrape returned:', results.length);
    }

    // Transform and save
    const listings = results.map(item => transformListing(item, params.location));

    for (const listing of listings) {
      await supabase
        .from('property_listings')
        .upsert(listing, { onConflict: 'external_id,source' })
        .then(({ error }) => error && console.log('DB:', error.message));
    }

    console.log('=== COMPLETE: ' + listings.length + ' listings ===');

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

async function getRightmoveLocationCode(location: string): Promise<string | null> {
  try {
    // Try multiple API endpoints
    const endpoints = [
      `https://www.rightmove.co.uk/typeAhead/uknocheck/${encodeURIComponent(location)}`,
      `https://www.rightmove.co.uk/api/_searchLocations?searchType=SALE&query=${encodeURIComponent(location)}`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://www.rightmove.co.uk/",
          },
        });

        if (res.ok) {
          const data = await res.json();
          const loc = data.typeAheadLocations?.[0] || data.locations?.[0];
          if (loc?.locationIdentifier) {
            console.log('Found location via API:', loc.locationIdentifier);
            return loc.locationIdentifier;
          }
        }
      } catch {}
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchFromApify(searchUrl: string, token: string): Promise<any[]> {
  const input = {
    listUrls: [searchUrl],
    maxItems: 25,
    includeFullPropertyDetails: false,
    includePriceHistory: false,
    includeNearestSchools: false,
  };

  console.log('Apify input:', JSON.stringify(input));

  const startRes = await fetch(
    `https://api.apify.com/v2/acts/dhrumil~rightmove-scraper/runs?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );

  const startText = await startRes.text();
  console.log('Apify start response:', startText.substring(0, 300));

  if (!startRes.ok) {
    throw new Error(`Apify start failed: ${startRes.status} - ${startText.substring(0, 100)}`);
  }

  const startData = JSON.parse(startText);
  const runId = startData.data?.id;
  if (!runId) throw new Error('No run ID');

  console.log('Run ID:', runId);

  // Poll for completion
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const statusData = await statusRes.json();
    const status = statusData.data?.status;
    
    if (i % 5 === 0) console.log(`Status: ${status}`);
    
    if (status === 'SUCCEEDED') {
      const dataRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${token}`);
      return await dataRes.json();
    }
    
    if (status === 'FAILED' || status === 'ABORTED') {
      throw new Error(`Run ${status}`);
    }
  }

  throw new Error('Timeout');
}

async function directScrape(searchUrl: string): Promise<any[]> {
  const res = await fetch(searchUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml",
      "Accept-Language": "en-GB,en;q=0.9",
    },
  });

  if (!res.ok) return [];

  const html = await res.text();
  
  // Try to find embedded JSON
  const jsonMatch = html.match(/window\.jsonModel\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      return data.properties || [];
    } catch {}
  }

  return [];
}

function transformListing(item: any, location: string): any {
  const address = item.displayAddress || item.address || `Property in ${location}`;
  const postcode = extractPostcode(address);
  
  let price = 0;
  if (typeof item.price === 'number') price = item.price;
  else if (item.price?.amount) price = item.price.amount;
  else if (item.displayPrice) price = parseInt(String(item.displayPrice).replace(/\D/g, '')) || 0;

  const rent = price ? Math.round(price * 0.0045) : null;
  const yld = rent && price ? Math.round((rent * 12 / price) * 100) / 10 : null;

  const images = (item.images || item.propertyImages?.images || [])
    .map((i: any) => typeof i === 'string' ? i : (i.url || i.srcUrl || ''))
    .filter(Boolean)
    .slice(0, 5);

  return {
    external_id: String(item.id || `rm-${Date.now()}`),
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
