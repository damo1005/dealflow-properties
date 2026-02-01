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

  const APIFY_TOKEN = Deno.env.get("APIFY_API_TOKEN");

  try {
    const params = await req.json();
    
    if (!params.location) {
      throw new Error("Location is required");
    }

    console.log('=== SEARCH START ===');
    console.log('Location:', params.location);
    console.log('APIFY_TOKEN exists:', !!APIFY_TOKEN);
    console.log('APIFY_TOKEN length:', APIFY_TOKEN?.length || 0);

    // Step 1: Get Rightmove location ID
    let locationId = await getRightmoveLocationId(params.location);
    console.log('Rightmove location ID:', locationId);

    // If no location ID found, try common formats
    if (!locationId) {
      const cleanLoc = params.location.toUpperCase().replace(/\s+/g, '');
      locationId = `OUTCODE^${cleanLoc}`;
    }

    // Build search URL
    let searchUrl = `https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=${encodeURIComponent(locationId)}&radius=${params.radius || 10}.0&sortType=6&includeSSTC=false`;
    
    if (params.minPrice) searchUrl += `&minPrice=${params.minPrice}`;
    if (params.maxPrice && params.maxPrice < 5000000) searchUrl += `&maxPrice=${params.maxPrice}`;
    if (params.minBeds) searchUrl += `&minBedrooms=${params.minBeds}`;
    
    console.log('Search URL:', searchUrl);

    // Try to fetch properties
    let results: any[] = [];
    let source = 'none';

    // Method 1: Try Apify if token exists
    if (APIFY_TOKEN && APIFY_TOKEN.length > 10) {
      try {
        console.log('Trying Apify...');
        results = await fetchFromApify(searchUrl, APIFY_TOKEN);
        source = 'apify';
        console.log('Apify returned:', results.length);
      } catch (apifyError: any) {
        console.error('Apify failed:', apifyError.message);
      }
    }

    // Method 2: Fallback to direct scraping
    if (results.length === 0) {
      try {
        console.log('Trying direct scrape...');
        results = await directScrape(searchUrl);
        source = 'direct';
        console.log('Direct scrape returned:', results.length);
      } catch (scrapeError: any) {
        console.error('Direct scrape failed:', scrapeError.message);
      }
    }

    // Transform results
    const listings = results.map(item => transformListing(item, params.location));
    console.log('Transformed listings:', listings.length);

    // Save to database
    for (const listing of listings) {
      const { error } = await supabase
        .from('property_listings')
        .upsert(listing, { onConflict: 'external_id,source' });
      if (error) console.log('DB error:', error.message);
    }

    console.log('=== SEARCH COMPLETE ===');
    console.log('Source:', source, 'Count:', listings.length);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: listings, 
        count: listings.length,
        source,
        fromCache: false 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Fatal error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message, data: [], count: 0 }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function getRightmoveLocationId(location: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.rightmove.co.uk/typeAhead/uknocheck/${encodeURIComponent(location)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log('Location API status:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Location results:', data.typeAheadLocations?.length || 0);
    
    if (data.typeAheadLocations?.[0]?.locationIdentifier) {
      return data.typeAheadLocations[0].locationIdentifier;
    }
    
    return null;
  } catch (error: any) {
    console.error('Location lookup error:', error.message);
    return null;
  }
}

async function fetchFromApify(searchUrl: string, token: string): Promise<any[]> {
  console.log('Starting Apify actor run...');
  
  // Start the run
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/dhrumil~rightmove-scraper/runs?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listUrls: [searchUrl],
        maxItems: 20,
        includeFullPropertyDetails: false,
      }),
    }
  );

  if (!startRes.ok) {
    const text = await startRes.text();
    throw new Error(`Apify start failed: ${startRes.status} - ${text.substring(0, 200)}`);
  }

  const startData = await startRes.json();
  const runId = startData.data?.id;
  console.log('Run ID:', runId);

  if (!runId) throw new Error('No run ID');

  // Poll for completion (max 50 seconds)
  let status = 'RUNNING';
  for (let i = 0; i < 25 && (status === 'RUNNING' || status === 'READY'); i++) {
    await new Promise(r => setTimeout(r, 2000));
    
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const statusData = await statusRes.json();
    status = statusData.data?.status || 'UNKNOWN';
    
    if (i % 5 === 0) console.log(`Poll ${i}: ${status}`);
  }

  if (status !== 'SUCCEEDED') {
    throw new Error(`Run status: ${status}`);
  }

  // Get dataset items
  const dataRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${token}`
  );
  
  if (!dataRes.ok) throw new Error('Failed to get dataset');
  
  return await dataRes.json();
}

async function directScrape(searchUrl: string): Promise<any[]> {
  console.log('Direct scraping:', searchUrl);
  
  const response = await fetch(searchUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-GB,en;q=0.9",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  console.log('HTML length:', html.length);

  // Try to extract JSON data from the page
  const jsonMatch = html.match(/window\.jsonModel\s*=\s*(\{[\s\S]*?\});?\s*<\/script>/);
  
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      console.log('Found jsonModel with', data.properties?.length || 0, 'properties');
      return data.properties || [];
    } catch (e) {
      console.log('JSON parse failed');
    }
  }

  // Fallback: try to find property cards in HTML
  const properties: any[] = [];
  const cardRegex = /propertyCard-\w+.*?href="\/properties\/(\d+)/gs;
  
  let match;
  const ids = new Set<string>();
  
  while ((match = cardRegex.exec(html)) !== null) {
    if (!ids.has(match[1])) {
      ids.add(match[1]);
      properties.push({
        id: match[1],
        url: `https://www.rightmove.co.uk/properties/${match[1]}`,
      });
    }
  }

  console.log('Regex found:', properties.length, 'property IDs');
  return properties;
}

function transformListing(item: any, location: string): any {
  const address = item.displayAddress || item.address || item.title || `Property in ${location}`;
  const postcode = extractPostcode(address);
  
  let price = 0;
  if (typeof item.price === 'number') price = item.price;
  else if (item.price?.amount) price = item.price.amount;
  else if (item.displayPrice) price = parseInt(String(item.displayPrice).replace(/\D/g, '')) || 0;

  const rent = price ? Math.round(price * 0.0045) : null;
  const yld = rent && price ? Math.round((rent * 12 / price) * 100) / 10 : null;

  let images: string[] = [];
  if (Array.isArray(item.images)) {
    images = item.images.map((i: any) => typeof i === 'string' ? i : (i.url || i.srcUrl || '')).filter(Boolean);
  } else if (item.propertyImages?.images) {
    images = item.propertyImages.images.map((i: any) => i.srcUrl || i.url || '').filter(Boolean);
  }

  return {
    external_id: String(item.id || item.propertyId || `rm-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`),
    source: 'rightmove',
    listing_url: item.url || item.propertyUrl || `https://www.rightmove.co.uk/properties/${item.id}`,
    address,
    postcode,
    outcode: postcode?.split(' ')[0] || location.toUpperCase(),
    latitude: item.coordinates?.latitude || item.location?.latitude,
    longitude: item.coordinates?.longitude || item.location?.longitude,
    bedrooms: item.bedrooms || item.numberOfBedrooms,
    bathrooms: item.bathrooms || item.numberOfBathrooms,
    property_type: item.propertyType || item.propertySubType || 'Property',
    tenure: item.tenure,
    price,
    original_price: item.price?.previousPrice,
    is_reduced: !!item.price?.previousPrice,
    agent_name: item.agent || item.customer?.branchDisplayName,
    agent_phone: item.agentPhone || item.customer?.contactTelephone,
    thumbnail_url: images[0] || null,
    images: images.slice(0, 5),
    summary: (item.description || item.summary || '').substring(0, 300),
    features: item.keyFeatures || [],
    estimated_rent: rent,
    gross_yield: yld,
    status: 'active',
  };
}

function extractPostcode(addr: string): string | null {
  if (!addr) return null;
  const m = addr.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i);
  return m ? m[1].toUpperCase() : null;
}
