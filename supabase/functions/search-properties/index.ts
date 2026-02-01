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

    console.log('=== SEARCH START ===');
    console.log('Location:', params.location);

    // Step 1: Resolve location to Rightmove identifier
    const locationId = await getRightmoveLocationId(params.location);
    console.log('Resolved location ID:', locationId);
    
    if (!locationId) {
      // Try with OUTCODE format as fallback
      console.log('Using OUTCODE fallback');
    }

    // Build the search URL - use exact format that works
    let searchUrl = `https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=${locationId || `OUTCODE%5E${params.location.toUpperCase()}`}&radius=${params.radius || 10}.0&sortType=6&propertyTypes=&includeSSTC=false&mustHave=&dontShow=&furnishTypes=&keywords=`;
    
    if (params.minPrice) searchUrl += `&minPrice=${params.minPrice}`;
    if (params.maxPrice && params.maxPrice < 10000000) searchUrl += `&maxPrice=${params.maxPrice}`;
    if (params.minBeds) searchUrl += `&minBedrooms=${params.minBeds}`;
    if (params.maxBeds) searchUrl += `&maxBedrooms=${params.maxBeds}`;
    
    console.log('Search URL:', searchUrl);

    // Check cache first
    const cacheKey = btoa(searchUrl).substring(0, 100);
    
    const { data: cached } = await supabase
      .from('property_search_cache')
      .select('*')
      .eq('search_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cached && cached.result_count > 0) {
      console.log('Returning cached results');
      const { data: listings } = await supabase
        .from('property_listings')
        .select('*')
        .or(`outcode.ilike.%${params.location}%,postcode.ilike.%${params.location}%,address.ilike.%${params.location}%`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

      return new Response(
        JSON.stringify({ success: true, data: listings || [], fromCache: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch from Apify
    const listings = await fetchFromApify(searchUrl, params.location);
    console.log('Got listings:', listings.length);

    // Save to database
    if (listings.length > 0) {
      for (const listing of listings) {
        const { error } = await supabase
          .from('property_listings')
          .upsert(listing, { onConflict: 'external_id,source' });
        if (error) console.log('Upsert error:', error.message);
      }

      // Update cache
      await supabase
        .from('property_search_cache')
        .upsert({
          search_key: cacheKey,
          search_params: params,
          result_count: listings.length,
          last_searched: new Date().toISOString(),
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        }, { onConflict: 'search_key' });
    }

    console.log('=== SEARCH COMPLETE ===');
    
    return new Response(
      JSON.stringify({ success: true, data: listings, fromCache: false, count: listings.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Search error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    if (!response.ok) return null;

    const data = await response.json();
    const loc = data.typeAheadLocations?.[0];
    
    if (loc?.locationIdentifier) {
      return encodeURIComponent(loc.locationIdentifier);
    }
    
    return null;
  } catch (error) {
    console.error('Location lookup error:', error);
    return null;
  }
}

async function fetchFromApify(searchUrl: string, searchLocation: string): Promise<any[]> {
  if (!APIFY_TOKEN) {
    throw new Error('APIFY_API_TOKEN not configured');
  }

  console.log('Starting Apify run...');
  
  // Use the EXACT input format that works
  const input = {
    listUrls: [searchUrl],
    maxItems: 25,
    includeFullPropertyDetails: false,
    includePriceHistory: false,
    includeNearestSchools: false,
  };
  
  console.log('Apify input:', JSON.stringify(input));

  // Start the run
  const startResponse = await fetch(
    `https://api.apify.com/v2/acts/dhrumil~rightmove-scraper/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );

  if (!startResponse.ok) {
    const errorText = await startResponse.text();
    console.error('Apify start error:', errorText);
    throw new Error('Failed to start Apify: ' + errorText);
  }

  const startData = await startResponse.json();
  const runId = startData.data?.id;
  console.log('Run ID:', runId);

  if (!runId) {
    throw new Error('No run ID returned');
  }

  // Poll for completion
  let status = 'RUNNING';
  let attempts = 0;
  
  while ((status === 'RUNNING' || status === 'READY') && attempts < 60) {
    await new Promise(r => setTimeout(r, 2000));
    
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    const statusData = await statusRes.json();
    status = statusData.data?.status;
    attempts++;
    
    if (attempts % 5 === 0) {
      console.log(`Status: ${status} (${attempts * 2}s)`);
    }
  }

  console.log('Final status:', status);

  if (status !== 'SUCCEEDED') {
    throw new Error(`Run failed with status: ${status}`);
  }

  // Get results
  const resultsRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`
  );
  
  if (!resultsRes.ok) {
    throw new Error('Failed to get results');
  }
  
  const results = await resultsRes.json();
  console.log('Raw results count:', results.length);
  
  if (results.length > 0) {
    console.log('Sample result keys:', Object.keys(results[0]));
  }

  return results.map((item: any) => transformResult(item, searchLocation));
}

function transformResult(item: any, searchLocation: string): any {
  // Based on actual Apify output structure:
  // addedOn, agent, agentPhone, bathrooms, bedrooms, coordinates, 
  // description, displayAddress, displayStatus, firstVisibleDate, id, images, etc.
  
  const address = item.displayAddress || item.address || 'Address not available';
  const postcode = item.postcode || extractPostcode(address);
  
  // Handle price - could be number or object
  let price = 0;
  if (typeof item.price === 'number') {
    price = item.price;
  } else if (item.price?.amount) {
    price = item.price.amount;
  } else if (item.displayPrice) {
    price = parseInt(String(item.displayPrice).replace(/[^0-9]/g, '')) || 0;
  }
  
  const monthlyRent = price ? Math.round(price * 0.0045) : null;
  const grossYield = monthlyRent && price ? Math.round((monthlyRent * 12 / price) * 1000) / 10 : null;

  // Get images array
  let images: string[] = [];
  if (Array.isArray(item.images)) {
    images = item.images.map((img: any) => {
      if (typeof img === 'string') return img;
      return img.url || img.srcUrl || img.original || '';
    }).filter(Boolean);
  }

  return {
    external_id: String(item.id || `rm-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`),
    source: 'rightmove',
    listing_url: item.url || `https://www.rightmove.co.uk/properties/${item.id}`,
    address: address,
    postcode: postcode,
    outcode: postcode?.split(' ')[0] || searchLocation.toUpperCase(),
    latitude: item.coordinates?.latitude || item.location?.latitude,
    longitude: item.coordinates?.longitude || item.location?.longitude,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    property_type: item.propertyType || item.propertySubType || 'Property',
    tenure: item.tenure,
    price: price,
    original_price: item.price?.previousPrice,
    is_reduced: item.displayStatus?.toLowerCase().includes('reduced') || !!item.price?.previousPrice,
    reduction_percent: item.price?.previousPrice ? Math.round((1 - price / item.price.previousPrice) * 100) : null,
    first_listed: item.firstVisibleDate || item.addedOn,
    agent_name: item.agent,
    agent_phone: item.agentPhone,
    thumbnail_url: images[0] || null,
    images: images.slice(0, 10),
    summary: item.description?.substring(0, 500),
    features: item.keyFeatures || [],
    estimated_rent: monthlyRent,
    gross_yield: grossYield,
    status: item.displayStatus?.toLowerCase().includes('sold') ? 'sold_stc' : 
            item.displayStatus?.toLowerCase().includes('offer') ? 'under_offer' : 'active',
  };
}

function extractPostcode(address: string): string | null {
  if (!address) return null;
  const match = address.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i);
  return match ? match[1].toUpperCase() : null;
}
