import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting deal scout scan...');

    // Get all active scouts that are due for scanning
    const { data: scouts, error: scoutsError } = await supabase
      .from('deal_scouts')
      .select('*')
      .eq('is_active', true);

    if (scoutsError) throw scoutsError;

    console.log(`Found ${scouts?.length || 0} active scouts`);

    for (const scout of scouts || []) {
      await scanForScout(scout, supabase);
    }

    return new Response(
      JSON.stringify({ success: true, scoutsProcessed: scouts?.length || 0 }),
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

async function scanForScout(scout: any, supabase: any) {
  console.log(`Scanning for scout: ${scout.name}`);

  // Get cached properties matching scout criteria
  let query = supabase.from('cached_properties').select('*');

  if (scout.price_min) query = query.gte('price', scout.price_min);
  if (scout.price_max) query = query.lte('price', scout.price_max);
  if (scout.bedrooms_min) query = query.gte('bedrooms', scout.bedrooms_min);
  if (scout.bedrooms_max) query = query.lte('bedrooms', scout.bedrooms_max);
  if (scout.property_types?.length > 0) {
    query = query.in('property_type', scout.property_types);
  }

  const { data: properties, error } = await query.limit(50);

  if (error) {
    console.error(`Error fetching properties for scout ${scout.id}:`, error);
    return;
  }

  console.log(`Found ${properties?.length || 0} matching properties`);

  for (const property of properties || []) {
    // Check if already discovered
    const { data: existing } = await supabase
      .from('scout_discoveries')
      .select('id')
      .eq('scout_id', scout.id)
      .eq('property_id', property.id)
      .single();

    if (existing) continue;

    // Calculate score
    const score = calculateScore(property, scout);

    if (score.overall < (scout.alert_score_threshold || 70)) continue;

    // Create discovery
    const { error: insertError } = await supabase
      .from('scout_discoveries')
      .insert({
        scout_id: scout.id,
        property_id: property.id,
        source: 'cached_properties',
        listing_url: property.listing_url,
        overall_score: score.overall,
        score_breakdown: score.breakdown,
        score_reasoning: score.reasoning,
        days_on_market: property.days_on_market,
        is_price_reduced: property.price_reduced || false,
        estimated_yield: score.metrics.yield,
        estimated_cash_flow: score.metrics.cashFlow,
        bmv_percentage: score.metrics.bmvPct,
        opportunity_flags: score.opportunities,
        risk_flags: score.risks,
      });

    if (insertError) {
      console.error('Error creating discovery:', insertError);
    }
  }

  // Update scout stats
  await supabase
    .from('deal_scouts')
    .update({
      last_scan_at: new Date().toISOString(),
      properties_found: scout.properties_found + (properties?.length || 0),
    })
    .eq('id', scout.id);
}

function calculateScore(property: any, _scout: any) {
  let breakdown: any = {};
  let opportunities: any = {};
  let risks: any = {};

  // Estimate yield (using avg rent assumption)
  const estimatedRent = property.bedrooms ? property.bedrooms * 500 : 1000;
  const estimatedYield = property.price > 0 ? (estimatedRent * 12 / property.price) * 100 : 0;
  
  // Yield score (0-30)
  if (estimatedYield >= 10) breakdown.yield = 30;
  else if (estimatedYield >= 8) breakdown.yield = 25;
  else if (estimatedYield >= 7) breakdown.yield = 20;
  else if (estimatedYield >= 6) breakdown.yield = 15;
  else breakdown.yield = 10;

  // Cash flow estimate
  const mortgagePayment = property.price * 0.75 * 0.05 / 12; // 75% LTV, 5% rate
  const estimatedCashFlow = estimatedRent - mortgagePayment - 200; // £200 for expenses

  // Cash flow score (0-25)
  if (estimatedCashFlow >= 300) breakdown.cashFlow = 25;
  else if (estimatedCashFlow >= 200) breakdown.cashFlow = 20;
  else if (estimatedCashFlow >= 100) breakdown.cashFlow = 15;
  else if (estimatedCashFlow >= 0) breakdown.cashFlow = 10;
  else breakdown.cashFlow = 5;

  // BMV score (0-25)
  const bmvPct = property.roi_potential || 0;
  if (bmvPct >= 20) { breakdown.bmv = 25; opportunities.significant_bmv = true; }
  else if (bmvPct >= 15) { breakdown.bmv = 20; opportunities.good_bmv = true; }
  else if (bmvPct >= 10) breakdown.bmv = 15;
  else if (bmvPct >= 5) breakdown.bmv = 10;
  else breakdown.bmv = 5;

  // Location score (0-20) - simplified
  breakdown.location = 15;

  // Opportunity flags
  if (property.days_on_market > 60) opportunities.long_on_market = true;
  if (property.price_reduced) opportunities.price_reduced = true;
  if (estimatedYield > 8) opportunities.high_yield = true;

  const overall = Math.min(
    breakdown.yield + breakdown.cashFlow + breakdown.bmv + breakdown.location,
    100
  );

  const reasoning = generateReasoning(breakdown, opportunities, estimatedYield, estimatedCashFlow);

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

function generateReasoning(breakdown: any, opportunities: any, yield_: number, cashFlow: number) {
  const reasons = [];
  if (breakdown.yield >= 25) reasons.push(`High yield (${yield_.toFixed(1)}%)`);
  if (breakdown.cashFlow >= 20) reasons.push(`Strong cash flow (+£${cashFlow.toFixed(0)}/mo)`);
  if (opportunities.price_reduced) reasons.push('Price recently reduced');
  if (opportunities.long_on_market) reasons.push('Long on market - negotiating opportunity');
  return reasons.join('. ') || 'Matches your criteria';
}
