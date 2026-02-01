import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
      // Return cached results from database
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

    // Scrape fresh data from portals
    console.log("Scraping fresh data from property portals...");
    
    const [rightmoveResults, zooplaResults] = await Promise.all([
      scrapeRightmove(params),
      scrapeZoopla(params),
    ]);
    
    console.log(`Found ${rightmoveResults.length} Rightmove, ${zooplaResults.length} Zoopla listings`);
    
    // Combine and dedupe by external_id
    const allResults = [...rightmoveResults, ...zooplaResults];
    const uniqueResults = dedupeListings(allResults);
    
    // Enrich with rental estimates
    const enrichedResults = await enrichWithRentalData(uniqueResults, params.location);
    
    // Save to database (upsert)
    if (enrichedResults.length > 0) {
      for (const listing of enrichedResults) {
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
    }

    // Update cache
    await supabase
      .from('property_search_cache')
      .upsert({
        search_key: cacheKey,
        search_params: params,
        result_count: enrichedResults.length,
        last_searched: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'search_key' });

    return new Response(
      JSON.stringify({ success: true, data: enrichedResults, fromCache: false, total: enrichedResults.length }),
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

function dedupeListings(listings: any[]): any[] {
  const seen = new Set();
  return listings.filter(l => {
    const key = `${l.external_id}-${l.source}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function scrapeRightmove(params: SearchParams): Promise<any[]> {
  try {
    // Get location identifier from Rightmove
    const locationCode = await getRightmoveLocationCode(params.location);
    if (!locationCode) {
      console.log("Could not get Rightmove location code for:", params.location);
      return [];
    }

    const searchUrl = buildRightmoveUrl(locationCode, params);
    console.log("Rightmove URL:", searchUrl);
    
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-GB,en;q=0.9",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      console.error("Rightmove fetch failed:", response.status);
      return [];
    }

    const html = await response.text();
    return parseRightmoveResults(html);
  } catch (error) {
    console.error("Rightmove scrape error:", error);
    return [];
  }
}

async function getRightmoveLocationCode(location: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.rightmove.co.uk/typeAhead/uknocheck/${encodeURIComponent(location)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
        },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.typeAheadLocations && data.typeAheadLocations.length > 0) {
        return data.typeAheadLocations[0].locationIdentifier;
      }
    }
    return null;
  } catch (error) {
    console.error("Location lookup error:", error);
    return null;
  }
}

function buildRightmoveUrl(locationCode: string, params: SearchParams): string {
  const baseUrl = "https://www.rightmove.co.uk/property-for-sale/find.html";
  const queryParams = new URLSearchParams({
    locationIdentifier: locationCode,
    radius: (params.radius || 10).toString(),
    sortType: "6", // newest first
    includeSSTC: params.includeSSTC ? "true" : "false",
  });

  if (params.minPrice) queryParams.set("minPrice", params.minPrice.toString());
  if (params.maxPrice) queryParams.set("maxPrice", params.maxPrice.toString());
  if (params.minBeds) queryParams.set("minBedrooms", params.minBeds.toString());
  if (params.maxBeds && params.maxBeds < 10) queryParams.set("maxBedrooms", params.maxBeds.toString());
  
  if (params.propertyTypes && params.propertyTypes.length > 0) {
    queryParams.set("propertyTypes", params.propertyTypes.join(","));
  }

  return `${baseUrl}?${queryParams.toString()}`;
}

function parseRightmoveResults(html: string): any[] {
  const results: any[] = [];
  
  // Try to find embedded JSON data
  const jsonPatterns = [
    /window\.jsonModel\s*=\s*({[\s\S]*?});?\s*<\/script>/,
    /"properties"\s*:\s*(\[[\s\S]*?\])\s*,\s*"(?:resultCount|pagination)"/,
    /data-test="results-list"[\s\S]*?({[\s\S]*?properties[\s\S]*?})/,
  ];

  let properties: any[] = [];
  
  for (const pattern of jsonPatterns) {
    const match = html.match(pattern);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        properties = data.properties || data || [];
        if (properties.length > 0) break;
      } catch {
        continue;
      }
    }
  }

  // Parse found properties
  for (const prop of properties) {
    if (!prop.id) continue;
    
    const address = prop.displayAddress || prop.propertyTypeFullDescription || "";
    
    results.push({
      external_id: prop.id?.toString(),
      source: 'rightmove',
      listing_url: `https://www.rightmove.co.uk/properties/${prop.id}`,
      address: address,
      postcode: extractPostcode(address),
      outcode: extractOutcode(address),
      latitude: prop.location?.latitude,
      longitude: prop.location?.longitude,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      property_type: prop.propertySubType || prop.propertyType,
      price: prop.price?.amount,
      price_qualifier: prop.price?.displayPrices?.[0]?.displayPriceQualifier,
      original_price: prop.price?.previousPrice,
      is_reduced: !!prop.price?.previousPrice,
      reduction_percent: prop.price?.previousPrice 
        ? Math.round((1 - prop.price.amount / prop.price.previousPrice) * 100) 
        : null,
      first_listed: prop.firstVisibleDate,
      agent_name: prop.customer?.branchDisplayName,
      agent_phone: prop.customer?.contactTelephone,
      thumbnail_url: prop.propertyImages?.mainImageSrc,
      images: prop.propertyImages?.images?.map((i: any) => i.srcUrl) || [],
      summary: prop.summary,
      features: prop.keyFeatures || [],
      status: prop.displayStatus === 'Under Offer' ? 'under_offer' : 
              prop.displayStatus === 'Sold STC' ? 'sold_stc' : 'active',
    });
  }

  // Fallback: regex parsing if no JSON found
  if (results.length === 0) {
    const cardMatches = html.matchAll(/data-propertyid="(\d+)"[\s\S]*?<\/article>/g);
    
    for (const match of cardMatches) {
      const cardHtml = match[0];
      const id = match[1];
      
      const price = cardHtml.match(/£([\d,]+)/)?.[1]?.replace(/,/g, '');
      const address = cardHtml.match(/propertyCard-address[^>]*>([^<]+)</)?.[1];
      const beds = cardHtml.match(/(\d+)\s*bed/i)?.[1];
      const baths = cardHtml.match(/(\d+)\s*bath/i)?.[1];
      const image = cardHtml.match(/src="(https:\/\/media\.rightmove[^"]+)"/)?.[1];
      const type = cardHtml.match(/propertyCard-type[^>]*>([^<]+)</)?.[1];
      
      if (id && price) {
        results.push({
          external_id: id,
          source: 'rightmove',
          listing_url: `https://www.rightmove.co.uk/properties/${id}`,
          address: address?.trim() || 'Address not available',
          postcode: extractPostcode(address || ''),
          outcode: extractOutcode(address || ''),
          bedrooms: beds ? parseInt(beds) : null,
          bathrooms: baths ? parseInt(baths) : null,
          property_type: type?.trim(),
          price: parseInt(price),
          thumbnail_url: image,
          status: 'active',
        });
      }
    }
  }

  console.log(`Parsed ${results.length} Rightmove properties`);
  return results;
}

async function scrapeZoopla(params: SearchParams): Promise<any[]> {
  try {
    // Build Zoopla search URL
    const locationSlug = params.location.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let searchUrl = `https://www.zoopla.co.uk/for-sale/property/${locationSlug}/?`;
    
    const queryParams = new URLSearchParams();
    if (params.minPrice) queryParams.set("price_min", params.minPrice.toString());
    if (params.maxPrice) queryParams.set("price_max", params.maxPrice.toString());
    if (params.minBeds) queryParams.set("beds_min", params.minBeds.toString());
    if (params.maxBeds && params.maxBeds < 10) queryParams.set("beds_max", params.maxBeds.toString());
    if (params.radius) queryParams.set("radius_miles", params.radius.toString());
    
    searchUrl += queryParams.toString();
    console.log("Zoopla URL:", searchUrl);
    
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-GB,en;q=0.9",
      },
    });

    if (!response.ok) {
      console.error("Zoopla fetch failed:", response.status);
      return [];
    }

    const html = await response.text();
    return parseZooplaResults(html);
  } catch (error) {
    console.error("Zoopla scrape error:", error);
    return [];
  }
}

function parseZooplaResults(html: string): any[] {
  const results: any[] = [];
  
  // Zoopla uses __NEXT_DATA__ for SSR data
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  
  if (nextDataMatch) {
    try {
      const data = JSON.parse(nextDataMatch[1]);
      const listings = data?.props?.pageProps?.regularListingsFormatted || 
                      data?.props?.pageProps?.listingsData?.regularListingsFormatted ||
                      [];
      
      for (const listing of listings) {
        if (!listing.listingId) continue;
        
        const address = listing.address || listing.displayAddress || "";
        const postcode = listing.outcode ? `${listing.outcode} ${listing.incode || ''}`.trim() : extractPostcode(address);
        
        results.push({
          external_id: listing.listingId?.toString(),
          source: 'zoopla',
          listing_url: `https://www.zoopla.co.uk${listing.listingUris?.detail || `/for-sale/details/${listing.listingId}`}`,
          address: address,
          postcode: postcode,
          outcode: listing.outcode || extractOutcode(address),
          latitude: listing.location?.coordinates?.latitude,
          longitude: listing.location?.coordinates?.longitude,
          bedrooms: listing.attributes?.bedrooms || listing.numBedrooms,
          bathrooms: listing.attributes?.bathrooms || listing.numBathrooms,
          receptions: listing.attributes?.livingRooms,
          property_type: listing.propertyType,
          tenure: listing.tenure,
          price: listing.price?.amount || listing.price,
          original_price: listing.price?.priceChange?.previousPrice,
          is_reduced: !!listing.price?.priceChange,
          first_listed: listing.publishedOn || listing.firstPublishedDate,
          agent_name: listing.branch?.name,
          agent_phone: listing.branch?.phone,
          thumbnail_url: listing.image?.src || listing.images?.[0]?.src,
          images: listing.images?.map((i: any) => i.src) || [],
          summary: listing.description,
          status: listing.flag === 'SOLD_STC' ? 'sold_stc' : 
                  listing.flag === 'UNDER_OFFER' ? 'under_offer' : 'active',
        });
      }
    } catch (e) {
      console.error("Zoopla JSON parse error:", e);
    }
  }

  console.log(`Parsed ${results.length} Zoopla properties`);
  return results;
}

function extractPostcode(address: string): string | null {
  const match = address?.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i);
  return match ? match[1].toUpperCase() : null;
}

function extractOutcode(address: string): string | null {
  const postcode = extractPostcode(address);
  if (postcode) {
    return postcode.split(' ')[0];
  }
  return null;
}

async function enrichWithRentalData(listings: any[], _location: string): Promise<any[]> {
  const propertyDataKey = Deno.env.get("PROPERTYDATA_API_KEY");
  
  // Use basic yield estimates if no API key
  if (!propertyDataKey) {
    return listings.map(listing => {
      const estimatedYield = estimateYield(listing);
      const estimatedRent = listing.price ? Math.round((listing.price * estimatedYield / 100) / 12) : null;
      return {
        ...listing,
        estimated_rent: estimatedRent,
        gross_yield: estimatedYield,
      };
    });
  }

  // With PropertyData API, get more accurate rental data
  try {
    const postcodes = [...new Set(listings.map(l => l.postcode).filter(Boolean))];
    const rentalData: Record<string, number> = {};

    // Limit API calls to 3 postcodes
    for (const postcode of postcodes.slice(0, 3)) {
      try {
        const response = await fetch(
          `https://api.propertydata.co.uk/rents?key=${propertyDataKey}&postcode=${encodeURIComponent(postcode)}`,
        );
        if (response.ok) {
          const data = await response.json();
          if (data.data?.long_let?.average) {
            rentalData[postcode] = data.data.long_let.average;
          }
        }
      } catch (e) {
        console.error(`Rental data error for ${postcode}:`, e);
      }
    }

    return listings.map(listing => {
      const areaRent = listing.postcode ? rentalData[listing.postcode] : null;
      const bedroomMultiplier = listing.bedrooms ? 0.6 + (listing.bedrooms * 0.25) : 1;
      const estimatedRent = areaRent ? Math.round(areaRent * bedroomMultiplier) : null;
      const grossYield = estimatedRent && listing.price 
        ? Math.round((estimatedRent * 12 / listing.price) * 1000) / 10 
        : estimateYield(listing);
      
      return {
        ...listing,
        estimated_rent: estimatedRent || (listing.price ? Math.round((listing.price * grossYield / 100) / 12) : null),
        gross_yield: grossYield,
      };
    });
  } catch (error) {
    console.error("Rental enrichment error:", error);
    return listings.map(listing => ({
      ...listing,
      gross_yield: estimateYield(listing),
    }));
  }
}

function estimateYield(listing: any): number {
  // Basic yield estimate based on property type and price band
  const baseYield = 5.5;
  
  // Adjust by property type
  let typeAdjustment = 0;
  const type = (listing.property_type || '').toLowerCase();
  if (type.includes('flat') || type.includes('apartment')) typeAdjustment = 0.5;
  if (type.includes('terraced')) typeAdjustment = 0.3;
  if (type.includes('detached')) typeAdjustment = -0.3;
  
  // Adjust by price (lower prices often have higher yields)
  let priceAdjustment = 0;
  if (listing.price < 150000) priceAdjustment = 1.0;
  else if (listing.price < 250000) priceAdjustment = 0.5;
  else if (listing.price > 500000) priceAdjustment = -0.5;
  else if (listing.price > 750000) priceAdjustment = -1.0;
  
  return Math.round((baseYield + typeAdjustment + priceAdjustment) * 10) / 10;
}
