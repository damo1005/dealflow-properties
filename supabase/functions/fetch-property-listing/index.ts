import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PropertyData {
  address: string;
  postcode: string;
  price: number;
  priceText: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  tenure: string;
  description: string;
  features: string[];
  images: string[];
  floorArea: number | null;
  epcRating: string | null;
  agent: string;
  listingUrl: string;
  source: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      throw new Error("URL is required");
    }

    console.log("Fetching property from URL:", url);

    let propertyData: PropertyData;

    // Determine source and fetch
    if (url.includes("rightmove.co.uk")) {
      propertyData = await fetchRightmove(url);
    } else if (url.includes("zoopla.co.uk")) {
      propertyData = await fetchZoopla(url);
    } else if (url.includes("onthemarket.com")) {
      propertyData = await fetchOnTheMarket(url);
    } else if (url.includes("auction")) {
      propertyData = await fetchAuctionSite(url);
    } else {
      throw new Error("Unsupported property listing site. Supported: Rightmove, Zoopla, OnTheMarket");
    }

    console.log("Successfully fetched property:", propertyData.address);

    return new Response(
      JSON.stringify({ success: true, data: propertyData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching property:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function fetchRightmove(url: string): Promise<PropertyData> {
  // Extract property ID from URL
  const propertyIdMatch = url.match(/properties\/(\d+)/);
  if (!propertyIdMatch) {
    throw new Error("Could not extract Rightmove property ID from URL");
  }

  // Fetch the page
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-GB,en;q=0.5",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Rightmove page: ${response.status}`);
  }

  const html = await response.text();

  // Extract from PAGE_MODEL (Rightmove's internal data)
  const pageModelMatch = html.match(/window\.PAGE_MODEL\s*=\s*({[\s\S]*?});?\s*<\/script>/);
  let pageModel: any = null;
  
  if (pageModelMatch) {
    try {
      pageModel = JSON.parse(pageModelMatch[1]);
      console.log("Found PAGE_MODEL data");
    } catch (e) {
      console.log("Could not parse PAGE_MODEL");
    }
  }

  // Extract data from PAGE_MODEL or fall back to regex
  const propertyData = pageModel?.propertyData || {};
  
  const address = propertyData.address?.displayAddress ||
                  extractPattern(html, /<h1[^>]*itemprop="streetAddress"[^>]*>([^<]+)<\/h1>/) ||
                  extractPattern(html, /<address[^>]*>([^<]+)<\/address>/) ||
                  extractPattern(html, /<h1[^>]*>([^<]+)<\/h1>/);

  const priceAmount = propertyData.prices?.primaryPrice ||
                      extractPattern(html, /<span[^>]*class="[^"]*propertyHeaderPrice[^"]*"[^>]*>([^<]+)<\/span>/) ||
                      extractPattern(html, /£[\d,]+/);
  
  const price = priceAmount ? parseInt(String(priceAmount).replace(/[£,\s]/g, "")) : 0;

  const bedrooms = propertyData.bedrooms ||
                   parseInt(extractPattern(html, /(\d+)\s*(?:bed|bedroom)/i) || "0");

  const bathrooms = propertyData.bathrooms ||
                    parseInt(extractPattern(html, /(\d+)\s*(?:bath|bathroom)/i) || "0");

  const propertyType = propertyData.propertySubType ||
                       extractPattern(html, /<p[^>]*class="[^"]*property-type[^"]*"[^>]*>([^<]+)<\/p>/) ||
                       extractPropertyType(html);

  const postcode = propertyData.address?.outcode && propertyData.address?.incode
                   ? `${propertyData.address.outcode} ${propertyData.address.incode}`
                   : extractPattern(html, /([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i) ||
                     extractPattern(address || "", /([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i);

  const tenure = propertyData.tenure?.tenureType ||
                 extractPattern(html, /<dt[^>]*>Tenure<\/dt>\s*<dd[^>]*>([^<]+)<\/dd>/i) ||
                 (html.toLowerCase().includes("freehold") ? "Freehold" : 
                  html.toLowerCase().includes("leasehold") ? "Leasehold" : "Unknown");

  // Extract features
  const features: string[] = [];
  const keyFeatures = propertyData.keyFeatures || [];
  if (Array.isArray(keyFeatures)) {
    features.push(...keyFeatures);
  } else {
    const featuresMatch = html.match(/<ul[^>]*class="[^"]*key-features[^"]*"[^>]*>([\s\S]*?)<\/ul>/);
    if (featuresMatch) {
      const featureItems = featuresMatch[1].match(/<li[^>]*>([^<]+)<\/li>/g);
      if (featureItems) {
        featureItems.forEach(item => {
          const text = item.replace(/<[^>]+>/g, "").trim();
          if (text) features.push(text);
        });
      }
    }
  }

  // Extract images
  const images: string[] = [];
  const propertyImages = propertyData.images || [];
  if (Array.isArray(propertyImages)) {
    propertyImages.forEach((img: any) => {
      if (img.url && images.length < 10) {
        images.push(img.url);
      }
    });
  }
  if (images.length === 0) {
    const imageMatches = html.matchAll(/https:\/\/media\.rightmove\.co\.uk[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi);
    for (const match of imageMatches) {
      if (!images.includes(match[0]) && images.length < 10) {
        images.push(match[0]);
      }
    }
  }

  // Extract floor area
  const sizings = propertyData.sizings || [];
  let floorArea: number | null = null;
  if (Array.isArray(sizings) && sizings.length > 0) {
    const sqFt = sizings.find((s: any) => s.unit === "sqft");
    if (sqFt) {
      floorArea = sqFt.minimumSize || sqFt.maximumSize;
    }
  }
  if (!floorArea) {
    const floorAreaMatch = html.match(/(\d+(?:,\d+)?)\s*(?:sq\.?\s*(?:ft|feet)|square\s*feet)/i);
    floorArea = floorAreaMatch ? parseInt(floorAreaMatch[1].replace(",", "")) : null;
  }

  // Extract EPC rating
  const epcRating = propertyData.epc?.currentEnergyRating ||
                    extractPattern(html, /EPC\s*(?:Rating|Band)?:?\s*([A-G])/i);

  // Extract agent
  const agent = propertyData.customer?.branchDisplayName ||
                extractPattern(html, /<a[^>]*class="[^"]*agent-name[^"]*"[^>]*>([^<]+)<\/a>/) ||
                extractPattern(html, /<p[^>]*class="[^"]*branch-name[^"]*"[^>]*>([^<]+)<\/p>/);

  // Extract description
  const description = propertyData.text?.description ||
                      extractPattern(html, /<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/)
                        ?.replace(/<[^>]+>/g, " ")
                        .replace(/\s+/g, " ")
                        .trim()
                        .substring(0, 1000) || "";

  return {
    address: address?.trim() || "Address not found",
    postcode: postcode?.toUpperCase().trim() || "",
    price,
    priceText: price > 0 ? `£${price.toLocaleString()}` : "Price on application",
    bedrooms,
    bathrooms,
    propertyType: propertyType?.trim() || "Property",
    tenure: tenure || "Unknown",
    description,
    features,
    images,
    floorArea,
    epcRating: epcRating || null,
    agent: agent?.trim() || "Unknown agent",
    listingUrl: url,
    source: "rightmove",
  };
}

async function fetchZoopla(url: string): Promise<PropertyData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Zoopla page: ${response.status}`);
  }

  const html = await response.text();

  // Zoopla uses Next.js with __NEXT_DATA__
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  let nextData: any = null;
  
  if (nextDataMatch) {
    try {
      nextData = JSON.parse(nextDataMatch[1]);
      console.log("Found Zoopla NEXT_DATA");
    } catch (e) {
      console.log("Could not parse Zoopla NEXT_DATA");
    }
  }

  const listing = nextData?.props?.pageProps?.listingDetails || 
                  nextData?.props?.pageProps?.data?.listing || {};

  const address = listing.address?.displayAddress || 
                  listing.displayAddress ||
                  extractPattern(html, /<h1[^>]*>([^<]+)<\/h1>/);

  const priceValue = listing.pricing?.label || listing.price?.displayValue;
  const price = priceValue ? 
                parseInt(String(priceValue).replace(/[£,\s]/g, "")) :
                parseInt(extractPattern(html, /£([\d,]+)/)?.replace(",", "") || "0");

  const postcodeValue = listing.address?.postcode || listing.postcode ||
                        extractPattern(html, /([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i);

  return {
    address: address || "Address not found",
    postcode: postcodeValue?.toUpperCase() || "",
    price,
    priceText: price > 0 ? `£${price.toLocaleString()}` : "Price on application",
    bedrooms: listing.counts?.numBedrooms || listing.numBedrooms || parseInt(extractPattern(html, /(\d+)\s*bed/i) || "0"),
    bathrooms: listing.counts?.numBathrooms || listing.numBathrooms || parseInt(extractPattern(html, /(\d+)\s*bath/i) || "0"),
    propertyType: listing.propertyType || extractPattern(html, /property-type[^>]*>([^<]+)</) || "Property",
    tenure: listing.tenure || "Unknown",
    description: listing.description?.substring(0, 1000) || "",
    features: listing.features || listing.bullets || [],
    images: (listing.images || listing.photos || []).map((img: any) => img.url || img.src || img).filter(Boolean).slice(0, 10),
    floorArea: listing.floorArea?.value || listing.floorAreaValue || null,
    epcRating: listing.epc?.rating || listing.epcRating || null,
    agent: listing.branch?.name || listing.agentName || "Unknown agent",
    listingUrl: url,
    source: "zoopla",
  };
}

async function fetchOnTheMarket(url: string): Promise<PropertyData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OnTheMarket page: ${response.status}`);
  }

  const html = await response.text();

  // Try to find JSON-LD structured data
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let structuredData: any = null;
  
  if (jsonLdMatch) {
    try {
      structuredData = JSON.parse(jsonLdMatch[1]);
      console.log("Found OnTheMarket structured data");
    } catch (e) {
      console.log("Could not parse OnTheMarket structured data");
    }
  }

  const address = structuredData?.name ||
                  extractPattern(html, /<h1[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/h1>/) ||
                  extractPattern(html, /<h1[^>]*>([^<]+)<\/h1>/);
                  
  const priceText = extractPattern(html, /£[\d,]+/);
  const price = priceText ? parseInt(priceText.replace(/[£,]/g, "")) : 0;

  const postcodeValue = extractPattern(html, /([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i);

  // Extract features
  const features: string[] = [];
  const featuresMatch = html.match(/<ul[^>]*class="[^"]*features[^"]*"[^>]*>([\s\S]*?)<\/ul>/);
  if (featuresMatch) {
    const featureItems = featuresMatch[1].match(/<li[^>]*>([^<]+)<\/li>/g);
    if (featureItems) {
      featureItems.forEach(item => {
        const text = item.replace(/<[^>]+>/g, "").trim();
        if (text) features.push(text);
      });
    }
  }

  // Extract images
  const images: string[] = [];
  const imageMatches = html.matchAll(/https:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi);
  for (const match of imageMatches) {
    if (match[0].includes("onthemarket") && !images.includes(match[0]) && images.length < 10) {
      images.push(match[0]);
    }
  }

  return {
    address: address?.trim() || "Address not found",
    postcode: postcodeValue?.toUpperCase() || "",
    price,
    priceText: price > 0 ? `£${price.toLocaleString()}` : "Price on application",
    bedrooms: parseInt(extractPattern(html, /(\d+)\s*bed/i) || "0"),
    bathrooms: parseInt(extractPattern(html, /(\d+)\s*bath/i) || "0"),
    propertyType: extractPattern(html, /property-type[^>]*>([^<]+)</) || extractPropertyType(html),
    tenure: extractPattern(html, /(freehold|leasehold)/i) || "Unknown",
    description: extractPattern(html, /<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/)
      ?.replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 1000) || "",
    features,
    images,
    floorArea: null,
    epcRating: extractPattern(html, /EPC[^A-G]*([A-G])/i) || null,
    agent: extractPattern(html, /agent-name[^>]*>([^<]+)</) || "Unknown agent",
    listingUrl: url,
    source: "onthemarket",
  };
}

async function fetchAuctionSite(url: string): Promise<PropertyData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch auction page: ${response.status}`);
  }

  const html = await response.text();

  const address = extractPattern(html, /<h1[^>]*>([^<]+)<\/h1>/) || "Address not found";
  const guidePrice = extractPattern(html, /guide[^£]*£([\d,]+)/i);
  const price = guidePrice ? parseInt(guidePrice.replace(",", "")) : 0;
  const postcodeValue = extractPattern(html, /([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i);

  return {
    address: address.trim(),
    postcode: postcodeValue?.toUpperCase() || "",
    price,
    priceText: price > 0 ? `Guide: £${price.toLocaleString()}` : "Guide price TBC",
    bedrooms: parseInt(extractPattern(html, /(\d+)\s*bed/i) || "0"),
    bathrooms: parseInt(extractPattern(html, /(\d+)\s*bath/i) || "0"),
    propertyType: "Auction Property",
    tenure: extractPattern(html, /(freehold|leasehold)/i) || "Unknown",
    description: "",
    features: [],
    images: [],
    floorArea: null,
    epcRating: null,
    agent: "Auction House",
    listingUrl: url,
    source: "auction",
  };
}

function extractPattern(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match ? match[1] : null;
}

function extractPropertyType(html: string): string {
  const lowerHtml = html.toLowerCase();
  if (lowerHtml.includes("detached house") || (lowerHtml.includes("detached") && !lowerHtml.includes("semi"))) return "Detached";
  if (lowerHtml.includes("semi-detached") || lowerHtml.includes("semi detached")) return "Semi-detached";
  if (lowerHtml.includes("terraced") || lowerHtml.includes("terrace")) return "Terraced";
  if (lowerHtml.includes("flat") || lowerHtml.includes("apartment")) return "Flat";
  if (lowerHtml.includes("bungalow")) return "Bungalow";
  if (lowerHtml.includes("maisonette")) return "Maisonette";
  if (lowerHtml.includes("cottage")) return "Cottage";
  if (lowerHtml.includes("hmo") || lowerHtml.includes("house in multiple")) return "HMO";
  return "Property";
}
