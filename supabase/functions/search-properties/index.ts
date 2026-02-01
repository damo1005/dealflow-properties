import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const APIFY_TOKEN = Deno.env.get("APIFY_API_TOKEN");

interface SearchParams {
  location: string;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  propertyTypes?: string[];
  includeSSTC?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const params: SearchParams = await req.json();
    
    if (!params.location) {
      throw new Error("Location is required");
    }

    console.log("Searching for properties:", params);

    // Generate cache key
    const cacheKey = generateCacheKey(params);
    
    // Check cache first
    const { data: cached } = await supabase
      .from('property_search_cache')
      .select('*')
      .eq('search_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cached) {
      console.log("Returning cached results");
      let query = supabase
        .from('property_listings')
        .select('*')
        .or(`outcode.ilike.%${params.location}%,postcode.ilike.%${params.location}%,address.ilike.%${params.location}%`)
        .eq('status', 'active');

      if (params.minPrice) query = query.gte('price', params.minPrice);
      if (params.maxPrice) query = query.lte('price', params.maxPrice);
      if (params.minBeds) query = query.gte('bedrooms', params.minBeds);
      if (params.maxBeds && params.maxBeds < 10) query = query.lte('bedrooms', params.maxBeds);

      const { data: listings } = await query.order('created_at', { ascending: false }).limit(50);

      return new Response(
        JSON.stringify({ success: true, data: listings || [], fromCache: true, total: listings?.length || 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // First, resolve the location to get a proper Rightmove locationIdentifier
    const locationData = await resolveLocationIdentifier(params.location);
    console.log("Resolved location identifier:", locationData);

    // Build Rightmove search URL with proper location identifier
    const searchUrl = buildRightmoveUrl(params, locationData?.identifier || null);
    console.log("Rightmove URL:", searchUrl);

    let listings: any[] = [];

    if (APIFY_TOKEN) {
      // Always try Apify first if we have a token
      console.log("Using Apify dhrumil/rightmove-scraper...");
      listings = await fetchFromApify(searchUrl, APIFY_TOKEN);
      
      // If Apify returned nothing, fall back to direct scrape
      if (listings.length === 0) {
        console.log("Apify returned no results, trying direct scrape...");
        listings = await directScrape(params);
      }
    } else {
      console.log("No APIFY_API_TOKEN, trying direct scrape...");
      listings = await directScrape(params);
    }

    console.log(`Found ${listings.length} listings`);

    // Save to database
    for (const listing of listings) {
      try {
        await supabase
          .from('property_listings')
          .upsert({
            ...listing,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'external_id,source' });
      } catch (e) {
        console.error("Error upserting listing:", e);
      }
    }

    // Update cache
    if (listings.length > 0) {
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

    return new Response(
      JSON.stringify({ success: true, data: listings, fromCache: false, total: listings.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Search error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Search failed';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateCacheKey(params: SearchParams): string {
  const normalized = {
    l: params.location?.toLowerCase().trim(),
    r: params.radius || 10,
    minP: params.minPrice || 0,
    maxP: params.maxPrice || 10000000,
    minB: params.minBeds || 0,
    maxB: params.maxBeds || 10,
    t: (params.propertyTypes || []).sort().join(','),
  };
  return btoa(JSON.stringify(normalized));
}

// Resolve location to a Rightmove location identifier using their location search API
async function resolveLocationIdentifier(location: string): Promise<{ identifier: string; type: string } | null> {
  try {
    // First, try to determine if this is a postcode or area name
    const isPostcode = /^[A-Za-z]{1,2}\d{1,2}\s*\d?[A-Za-z]{0,2}$/i.test(location.trim());
    const outcode = isPostcode ? location.trim().split(' ')[0].toUpperCase() : null;
    
    // Try to get a proper search page by following redirects from a search
    const searchUrl = `https://www.rightmove.co.uk/property-for-sale/search.html?searchLocation=${encodeURIComponent(location)}&useLocationIdentifier=true&locationIdentifierSearch=true`;
    
    const response = await fetch(searchUrl, { 
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      redirect: 'follow'
    });
    
    const finalUrl = response.url;
    console.log("Final search URL:", finalUrl);
    
    // Check if we got redirected to a proper find.html page with locationIdentifier
    const locationMatch = finalUrl.match(/locationIdentifier=([^&]+)/);
    if (locationMatch) {
      const identifier = decodeURIComponent(locationMatch[1]);
      console.log(`Resolved "${location}" to identifier: ${identifier}`);
      return { identifier, type: 'full' };
    }
    
    // If that didn't work but we have an outcode, return it as OUTCODE type
    if (outcode) {
      console.log(`Using outcode format for: ${outcode}`);
      return { identifier: `OUTCODE^${outcode}`, type: 'outcode' };
    }
    
    // Try region format for area names
    const regionSlug = location.trim().toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '');
    console.log(`Trying REGION format for: ${location}`);
    return { identifier: `REGION^${regionSlug}`, type: 'region' };
    
  } catch (e) {
    console.error("Error resolving location:", e);
    return null;
  }
}

function buildRightmoveUrl(params: SearchParams, locationId: string | null): string {
  // Build a proper search results URL that Apify can scrape
  let url: string;
  
  if (locationId) {
    // Use the resolved location identifier for proper search URL
    // Note: Don't double-encode - the caret ^ should stay as-is for Rightmove
    url = `https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=${locationId}&sortType=6&includeSSTC=false`;
  } else {
    // Try the SEO-friendly URL format which works better for common locations
    const locationSlug = params.location
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');
    
    const isPostcode = /^[A-Za-z]{1,2}\d/.test(params.location.trim());
    
    if (isPostcode) {
      const outcode = params.location.trim().split(' ')[0].toUpperCase();
      url = `https://www.rightmove.co.uk/property-for-sale/${outcode}.html?sortType=6&includeSSTC=false`;
    } else {
      const capitalizedLocation = locationSlug.charAt(0).toUpperCase() + locationSlug.slice(1).toLowerCase();
      url = `https://www.rightmove.co.uk/property-for-sale/${capitalizedLocation}.html?sortType=6&includeSSTC=false`;
    }
  }
  
  // Add optional filters
  if (params.radius) url += `&radius=${params.radius}`;
  if (params.minPrice) url += `&minPrice=${params.minPrice}`;
  if (params.maxPrice) url += `&maxPrice=${params.maxPrice}`;
  if (params.minBeds) url += `&minBedrooms=${params.minBeds}`;
  if (params.maxBeds && params.maxBeds < 10) url += `&maxBedrooms=${params.maxBeds}`;
  
  return url;
}

async function fetchFromApify(searchUrl: string, token: string): Promise<any[]> {
  try {
    console.log('Starting Apify run with dhrumil~rightmove-scraper...');
    
    // Start the actor run
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/dhrumil~rightmove-scraper/runs?token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listUrls: [searchUrl],
          maxItems: 30,
          includeFullPropertyDetails: false,
          includePriceHistory: false,
          includeNearestSchools: false,
        }),
      }
    );

    if (!runResponse.ok) {
      const error = await runResponse.text();
      console.error('Apify start failed:', error);
      throw new Error('Apify start failed');
    }

    const runData = await runResponse.json();
    const runId = runData.data.id;
    console.log('Apify run ID:', runId);

    // Poll for completion (max 90 seconds)
    let status = 'RUNNING';
    let attempts = 0;
    
    while (status === 'RUNNING' && attempts < 45) {
      await new Promise(r => setTimeout(r, 2000));
      
      const statusRes = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${token}`
      );
      const statusData = await statusRes.json();
      status = statusData.data.status;
      attempts++;
      console.log(`Status: ${status} (attempt ${attempts})`);
    }

    if (status !== 'SUCCEEDED') {
      console.error('Run did not succeed:', status);
      throw new Error(`Run status: ${status}`);
    }

    // Get results
    const resultsRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${token}`
    );
    const results = await resultsRes.json();
    console.log(`Got ${results.length} properties from Apify`);

    return results.map(transformApifyResult);

  } catch (error) {
    console.error('Apify error:', error);
    return [];
  }
}

function transformApifyResult(item: any): any {
  const postcode = item.postcode || extractPostcode(item.address || item.displayAddress || '');
  const price = item.price?.amount || item.price || parseInt(String(item.priceText || '').replace(/[^0-9]/g, '')) || 0;
  const monthlyRent = price ? Math.round(price * 0.0045) : null;
  const grossYield = monthlyRent ? Math.round((monthlyRent * 12 / price) * 1000) / 10 : null;

  return {
    external_id: item.id?.toString() || item.propertyId?.toString() || `rm-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    source: 'rightmove',
    listing_url: item.url || item.propertyUrl || `https://www.rightmove.co.uk/properties/${item.id}`,
    address: item.displayAddress || item.address || 'Address not available',
    postcode: postcode,
    outcode: postcode?.split(' ')[0],
    latitude: item.location?.latitude || item.latitude,
    longitude: item.location?.longitude || item.longitude,
    bedrooms: item.bedrooms || item.numberOfBedrooms,
    bathrooms: item.bathrooms || item.numberOfBathrooms,
    property_type: item.propertyType || item.propertySubType || 'Property',
    tenure: item.tenure,
    price: price,
    original_price: item.price?.previousPrice || item.previousPrice,
    is_reduced: !!(item.price?.previousPrice || item.previousPrice || item.isReduced),
    reduction_percent: item.price?.previousPrice ? Math.round((1 - price / item.price.previousPrice) * 100) : null,
    first_listed: item.firstVisibleDate || item.listingDate,
    agent_name: item.customer?.branchDisplayName || item.agent?.name || item.branchName,
    agent_phone: item.customer?.contactTelephone || item.branchPhone,
    thumbnail_url: item.propertyImages?.mainImageSrc || item.mainImage || item.images?.[0]?.url || item.images?.[0],
    images: (item.propertyImages?.images || item.images || []).map((i: any) => i.srcUrl || i.url || i).slice(0, 10),
    summary: item.summary || item.description?.substring(0, 500),
    features: item.keyFeatures || item.features || [],
    estimated_rent: monthlyRent,
    gross_yield: grossYield,
    status: 'active',
  };
}

function extractPostcode(address: string): string | null {
  const match = address.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i);
  return match ? match[1].toUpperCase() : null;
}

async function directScrape(params: SearchParams): Promise<any[]> {
  // Fallback direct scraping if no Apify token
  try {
    console.log('Attempting direct scrape...');
    
    const locResponse = await fetch(
      `https://www.rightmove.co.uk/typeAhead/uknocheck/${encodeURIComponent(params.location)}`,
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }
    );
    
    if (!locResponse.ok) {
      console.log('Location lookup failed');
      return [];
    }
    
    const locData = await locResponse.json();
    const locationId = locData.typeAheadLocations?.[0]?.locationIdentifier;
    if (!locationId) {
      console.log('No location ID found');
      return [];
    }

    let url = `https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=${encodeURIComponent(locationId)}&radius=${params.radius || 10}&sortType=6`;
    if (params.minPrice) url += `&minPrice=${params.minPrice}`;
    if (params.maxPrice) url += `&maxPrice=${params.maxPrice}`;
    if (params.minBeds) url += `&minBedrooms=${params.minBeds}`;

    const searchRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    
    if (!searchRes.ok) {
      console.log('Search page fetch failed');
      return [];
    }
    
    const html = await searchRes.text();
    const jsonMatch = html.match(/window\.jsonModel\s*=\s*({[\s\S]*?});\s*<\/script>/);
    
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        const properties = data.properties || [];
        console.log(`Parsed ${properties.length} properties from direct scrape`);
        return properties.map(transformDirectScrapeResult);
      } catch (e) {
        console.error('JSON parse error:', e);
      }
    }
    
    return [];
  } catch (e) {
    console.error('Direct scrape failed:', e);
    return [];
  }
}

function transformDirectScrapeResult(prop: any): any {
  const address = prop.displayAddress || prop.propertyTypeFullDescription || "";
  const postcode = extractPostcode(address);
  const price = prop.price?.amount || 0;
  const monthlyRent = price ? Math.round(price * 0.0045) : null;
  const grossYield = monthlyRent ? Math.round((monthlyRent * 12 / price) * 1000) / 10 : null;

  return {
    external_id: prop.id?.toString(),
    source: 'rightmove',
    listing_url: `https://www.rightmove.co.uk/properties/${prop.id}`,
    address: address,
    postcode: postcode,
    outcode: postcode?.split(' ')[0],
    latitude: prop.location?.latitude,
    longitude: prop.location?.longitude,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    property_type: prop.propertySubType || prop.propertyType,
    price: price,
    price_qualifier: prop.price?.displayPrices?.[0]?.displayPriceQualifier,
    original_price: prop.price?.previousPrice,
    is_reduced: !!prop.price?.previousPrice,
    reduction_percent: prop.price?.previousPrice 
      ? Math.round((1 - price / prop.price.previousPrice) * 100) 
      : null,
    first_listed: prop.firstVisibleDate,
    agent_name: prop.customer?.branchDisplayName,
    agent_phone: prop.customer?.contactTelephone,
    thumbnail_url: prop.propertyImages?.mainImageSrc,
    images: prop.propertyImages?.images?.map((i: any) => i.srcUrl) || [],
    summary: prop.summary,
    features: prop.keyFeatures || [],
    estimated_rent: monthlyRent,
    gross_yield: grossYield,
    status: prop.displayStatus === 'Under Offer' ? 'under_offer' : 
            prop.displayStatus === 'Sold STC' ? 'sold_stc' : 'active',
  };
}
