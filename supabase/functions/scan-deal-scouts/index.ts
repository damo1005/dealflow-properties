import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROPERTYDATA_API_KEY = Deno.env.get('PROPERTYDATA_API_KEY');
const PROPERTYDATA_BASE_URL = 'https://api.propertydata.co.uk';
const CACHE_EXPIRY_DAYS = 7;

interface ScoutResult {
  scoutId: string;
  scoutName: string;
  propertiesFound: number;
  newDiscoveries: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if specific scout ID was provided
    const body = await req.json().catch(() => ({}));
    const specificScoutId = body.scoutId;

    console.log('Starting deal scout scan...', specificScoutId ? `for scout ${specificScoutId}` : 'for all scouts');

    // Get scouts to scan
    let query = supabase
      .from('deal_scouts')
      .select('*')
      .eq('is_active', true);

    if (specificScoutId) {
      query = query.eq('id', specificScoutId);
    }

    const { data: scouts, error: scoutsError } = await query;

    if (scoutsError) throw scoutsError;

    console.log(`Found ${scouts?.length || 0} scouts to process`);

    const results: ScoutResult[] = [];

    for (const scout of scouts || []) {
      const result = await scanForScout(scout, supabase);
      results.push(result);
    }

    const totalFound = results.reduce((sum, r) => sum + r.propertiesFound, 0);
    const totalDiscoveries = results.reduce((sum, r) => sum + r.newDiscoveries, 0);

    return new Response(
      JSON.stringify({ 
        success: true, 
        scoutsProcessed: scouts?.length || 0,
        totalPropertiesFound: totalFound,
        totalNewDiscoveries: totalDiscoveries,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in deal scout scan:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function scanForScout(scout: any, supabase: any): Promise<ScoutResult> {
  console.log(`Scanning for scout: ${scout.name}`);
  
  const result: ScoutResult = {
    scoutId: scout.id,
    scoutName: scout.name,
    propertiesFound: 0,
    newDiscoveries: 0,
  };

  // Fetch properties from PropertyData API for each location area
  const allProperties: any[] = [];
  
  for (const postcode of scout.location_areas || []) {
    try {
      const properties = await fetchPropertiesFromAPI(postcode, scout);
      allProperties.push(...properties);
    } catch (error) {
      console.error(`Error fetching properties for ${postcode}:`, error);
    }
  }

  console.log(`Fetched ${allProperties.length} properties from API for scout ${scout.name}`);
  result.propertiesFound = allProperties.length;

  // Cache properties and create discoveries
  for (const property of allProperties) {
    try {
      // Upsert to cache
      const cachedProperty = await cacheProperty(property, supabase);
      
      if (!cachedProperty) continue;

      // Check if already discovered
      const { data: existing } = await supabase
        .from('scout_discoveries')
        .select('id')
        .eq('scout_id', scout.id)
        .eq('property_id', cachedProperty.id)
        .single();

      if (existing) continue;

      // Calculate score
      const score = calculateScore(cachedProperty, scout);

      if (score.overall < (scout.alert_score_threshold || 70)) continue;

      // Create discovery
      const { error: insertError } = await supabase
        .from('scout_discoveries')
        .insert({
          scout_id: scout.id,
          property_id: cachedProperty.id,
          source: 'propertydata_api',
          listing_url: cachedProperty.listing_url,
          overall_score: score.overall,
          score_breakdown: score.breakdown,
          score_reasoning: score.reasoning,
          days_on_market: cachedProperty.days_on_market,
          is_price_reduced: cachedProperty.price_reduced || false,
          estimated_yield: score.metrics.yield,
          estimated_cash_flow: score.metrics.cashFlow,
          bmv_percentage: score.metrics.bmvPct,
          opportunity_flags: score.opportunities,
          risk_flags: score.risks,
        });

      if (insertError) {
        console.error('Error creating discovery:', insertError);
      } else {
        result.newDiscoveries++;
      }
    } catch (error) {
      console.error('Error processing property:', error);
    }
  }

  // Update scout stats
  await supabase
    .from('deal_scouts')
    .update({
      last_scan_at: new Date().toISOString(),
      next_scan_at: calculateNextScanTime(scout.scan_frequency),
      properties_found: (scout.properties_found || 0) + result.propertiesFound,
    })
    .eq('id', scout.id);

  console.log(`Scout ${scout.name}: Found ${result.propertiesFound} properties, ${result.newDiscoveries} new discoveries`);
  
  return result;
}

async function fetchPropertiesFromAPI(postcode: string, scout: any): Promise<any[]> {
  if (!PROPERTYDATA_API_KEY) {
    console.log('PropertyData API key not configured, using cached data only');
    return [];
  }

  const params = new URLSearchParams({
    key: PROPERTYDATA_API_KEY,
    postcode: postcode,
    radius: String(scout.location_radius_miles || 5),
  });

  if (scout.price_min) params.append('min_price', String(scout.price_min));
  if (scout.price_max) params.append('max_price', String(scout.price_max));
  if (scout.bedrooms_min) params.append('min_bedrooms', String(scout.bedrooms_min));
  if (scout.bedrooms_max) params.append('max_bedrooms', String(scout.bedrooms_max));

  const url = `${PROPERTYDATA_BASE_URL}/for-sale?${params.toString()}`;
  console.log(`Fetching from PropertyData API: ${postcode}`);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`PropertyData API error: ${response.status} - ${errorText}`);
      return [];
    }

    const data = await response.json();
    
    if (data.status !== 'success' || !data.properties) {
      console.log(`No properties found for ${postcode}`);
      return [];
    }

    return data.properties.map((p: any) => ({
      external_id: p.id || `pd-${postcode}-${p.address?.replace(/\s/g, '-')}`,
      address: p.address || 'Unknown address',
      postcode: p.postcode || postcode,
      price: p.price || 0,
      original_price: p.original_price,
      price_reduced: p.price_reduced || false,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      property_type: p.property_type,
      description: p.description,
      images: p.images || [],
      days_on_market: p.days_on_market,
      estimated_yield: p.estimated_yield,
      roi_potential: p.roi_potential,
      floor_area_sqft: p.floor_area_sqft,
      latitude: p.latitude,
      longitude: p.longitude,
      region: p.region,
      county: p.county,
      tenure: p.tenure,
      epc_rating: p.epc_rating,
      listing_url: p.url || p.listing_url,
      features: p.features,
      raw_data: p,
    }));
  } catch (error) {
    console.error(`Failed to fetch from PropertyData API for ${postcode}:`, error);
    return [];
  }
}

async function cacheProperty(property: any, supabase: any): Promise<any | null> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + CACHE_EXPIRY_DAYS);

  // Try to find existing by external_id
  const { data: existing } = await supabase
    .from('cached_properties')
    .select('id')
    .eq('external_id', property.external_id)
    .single();

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('cached_properties')
      .update({
        ...property,
        cached_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cached property:', error);
      return null;
    }
    return data;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('cached_properties')
      .insert({
        ...property,
        cached_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting cached property:', error);
      return null;
    }
    return data;
  }
}

function calculateNextScanTime(frequency: string): string {
  const now = new Date();
  switch (frequency) {
    case 'every_6_hours':
      now.setHours(now.getHours() + 6);
      break;
    case 'every_12_hours':
      now.setHours(now.getHours() + 12);
      break;
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'manual':
      // Set far in future - won't auto-scan
      now.setFullYear(now.getFullYear() + 10);
      break;
    default:
      now.setDate(now.getDate() + 1);
  }
  return now.toISOString();
}

function calculateScore(property: any, scout: any) {
  const breakdown: Record<string, number> = {};
  const opportunities: Record<string, boolean> = {};
  const risks: Record<string, boolean> = {};

  // Estimate rent based on bedrooms (£550/bedroom as specified)
  const bedrooms = property.bedrooms || 2;
  const estimatedRent = bedrooms * 550;
  const estimatedYield = property.price > 0 ? (estimatedRent * 12 / property.price) * 100 : 0;
  
  // YIELD SCORE (0-30): Based on estimated yield
  if (estimatedYield >= 10) breakdown.yield = 30;
  else if (estimatedYield >= 8) breakdown.yield = 26;
  else if (estimatedYield >= 7) breakdown.yield = 22;
  else if (estimatedYield >= 6) breakdown.yield = 18;
  else if (estimatedYield >= 5) breakdown.yield = 14;
  else breakdown.yield = 10;

  // CASH FLOW SCORE (0-25): Rent minus mortgage (75% LTV, 5.5% rate) minus 20% expenses
  const loanAmount = property.price * 0.75;
  const monthlyRate = 0.055 / 12;
  const numPayments = 25 * 12;
  const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const expenses = estimatedRent * 0.20; // 20% for expenses
  const estimatedCashFlow = estimatedRent - monthlyMortgage - expenses;

  if (estimatedCashFlow >= 400) breakdown.cashFlow = 25;
  else if (estimatedCashFlow >= 300) breakdown.cashFlow = 22;
  else if (estimatedCashFlow >= 200) breakdown.cashFlow = 18;
  else if (estimatedCashFlow >= 100) breakdown.cashFlow = 14;
  else if (estimatedCashFlow >= 0) breakdown.cashFlow = 10;
  else breakdown.cashFlow = 5;

  // BMV SCORE (0-25): Based on roi_potential field from API
  const bmvPct = property.roi_potential || 0;
  if (bmvPct >= 20) { breakdown.bmv = 25; opportunities.significant_bmv = true; }
  else if (bmvPct >= 15) { breakdown.bmv = 21; opportunities.good_bmv = true; }
  else if (bmvPct >= 10) breakdown.bmv = 17;
  else if (bmvPct >= 5) breakdown.bmv = 13;
  else breakdown.bmv = 8;

  // TIMING SCORE (0-20): Bonus for days_on_market > 60 and price_reduced
  let timingScore = 10; // Base score
  
  if (property.days_on_market && property.days_on_market > 60) {
    timingScore += 5;
    opportunities.long_on_market = true;
  }
  if (property.days_on_market && property.days_on_market > 120) {
    timingScore += 3; // Additional bonus for very long listings
  }
  if (property.price_reduced) {
    timingScore += 2;
    opportunities.price_reduced = true;
  }
  breakdown.timing = Math.min(timingScore, 20);

  // Additional opportunity flags
  if (estimatedYield > 8) opportunities.high_yield = true;

  // Calculate overall score
  const overall = Math.min(
    breakdown.yield + breakdown.cashFlow + breakdown.bmv + breakdown.timing,
    100
  );

  // Risk flags
  if (property.epc_rating && ['F', 'G'].includes(property.epc_rating)) {
    risks.poor_epc = true;
  }

  const reasoning = generateReasoning(breakdown, opportunities, estimatedYield, estimatedCashFlow, property);

  return {
    overall,
    breakdown,
    reasoning,
    opportunities,
    risks,
    metrics: {
      yield: Math.round(estimatedYield * 10) / 10,
      cashFlow: Math.round(estimatedCashFlow),
      bmvPct,
    },
  };
}

function generateReasoning(
  breakdown: Record<string, number>, 
  opportunities: Record<string, boolean>, 
  yieldPct: number, 
  cashFlow: number,
  property: any
) {
  const reasons = [];
  
  if (breakdown.yield >= 26) reasons.push(`Strong yield (${yieldPct.toFixed(1)}%)`);
  else if (breakdown.yield >= 22) reasons.push(`Good yield (${yieldPct.toFixed(1)}%)`);
  
  if (cashFlow >= 200) reasons.push(`Positive cash flow (+£${cashFlow.toFixed(0)}/mo)`);
  else if (cashFlow >= 0) reasons.push(`Cash flow neutral`);
  
  if (opportunities.price_reduced) reasons.push('Price recently reduced');
  if (opportunities.long_on_market) reasons.push(`On market ${property.days_on_market} days - negotiating opportunity`);
  if (opportunities.significant_bmv) reasons.push('Significant below market value');
  if (opportunities.good_bmv) reasons.push('Good BMV opportunity');
  if (opportunities.high_yield) reasons.push('High yield potential');
  
  return reasons.join('. ') || 'Matches your investment criteria';
}
