import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROPERTYDATA_API_KEY = Deno.env.get('PROPERTYDATA_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function calculateBTLScore(prices: any, rental: any): number {
  let score = 50;
  
  const grossYield = rental?.gross_yield || 0;
  if (grossYield > 7) score += 20;
  else if (grossYield > 6) score += 10;
  else if (grossYield < 4) score -= 20;
  
  if (prices?.demand_score > 70) score += 15;
  if (prices?.avg_time_on_market < 30) score += 10;
  if (prices?.supply_score < 50) score += 10;
  
  return Math.min(100, Math.max(0, score));
}

function calculateHMOScore(prices: any, rental: any, demographics: any): number {
  let score = 50;
  
  const medianAge = demographics?.median_age || 40;
  if (medianAge < 35) score += 20;
  else if (medianAge < 45) score += 10;
  
  if (prices?.demand_score > 75) score += 15;
  
  const avgRent = rental?.average_rent || 1000;
  const avgPrice = prices?.average_price || 200000;
  const rentToPrice = (avgRent * 12) / avgPrice;
  if (rentToPrice > 0.07) score += 15;
  
  return Math.min(100, Math.max(0, score));
}

function calculateGrowthScore(prices: any): number {
  let score = 50;
  
  const growth = prices?.price_growth_12m || 0;
  if (growth > 10) score += 30;
  else if (growth > 5) score += 20;
  else if (growth < 0) score -= 20;
  
  if (prices?.sales_volume_3m > (prices?.sales_volume_12m || 0) / 4) score += 10;
  if (prices?.demand_score > 70) score += 10;
  
  return Math.min(100, Math.max(0, score));
}

function generateMockMarketData(postcode: string) {
  const basePrice = 200000 + Math.floor(Math.random() * 300000);
  const baseRent = 800 + Math.floor(Math.random() * 1200);
  const grossYield = ((baseRent * 12) / basePrice) * 100;
  
  return {
    postcode: postcode.toUpperCase().replace(/\s/g, ''),
    area_type: 'postcode',
    avg_sold_price: basePrice,
    avg_sold_price_3m: basePrice * (1 + (Math.random() * 0.1 - 0.05)),
    avg_sold_price_12m: basePrice * (1 - Math.random() * 0.08),
    price_growth_pct: (Math.random() * 15 - 3).toFixed(2),
    price_per_sqft: Math.floor(basePrice / (600 + Math.random() * 400)),
    avg_rent_pcm: baseRent,
    avg_rent_1bed: Math.floor(baseRent * 0.7),
    avg_rent_2bed: baseRent,
    avg_rent_3bed: Math.floor(baseRent * 1.4),
    gross_yield: grossYield.toFixed(2),
    properties_for_sale: Math.floor(20 + Math.random() * 80),
    properties_sold_3m: Math.floor(10 + Math.random() * 40),
    avg_time_on_market_days: Math.floor(20 + Math.random() * 60),
    sale_vs_asking_pct: (95 + Math.random() * 5).toFixed(2),
    population: Math.floor(5000 + Math.random() * 25000),
    median_age: Math.floor(28 + Math.random() * 20),
    avg_income: Math.floor(25000 + Math.random() * 50000),
    employment_rate: (85 + Math.random() * 12).toFixed(2),
    demand_score: Math.floor(40 + Math.random() * 60),
    supply_score: Math.floor(30 + Math.random() * 50),
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { postcode } = await req.json();
    
    if (!postcode) {
      return new Response(
        JSON.stringify({ error: 'Postcode is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const normalizedPostcode = postcode.toUpperCase().replace(/\s/g, '');
    
    // Check cache first
    const { data: cached } = await supabase
      .from('market_data')
      .select('*')
      .eq('postcode', normalizedPostcode)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (cached) {
      console.log('Returning cached market data for:', normalizedPostcode);
      return new Response(
        JSON.stringify({ success: true, data: cached, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let marketData;

    // Try PropertyData API if key exists
    if (PROPERTYDATA_API_KEY) {
      try {
        console.log('Fetching from PropertyData API for:', normalizedPostcode);
        
        const [pricesRes, rentalRes] = await Promise.all([
          fetch(`https://api.propertydata.co.uk/prices?key=${PROPERTYDATA_API_KEY}&postcode=${encodeURIComponent(postcode)}`),
          fetch(`https://api.propertydata.co.uk/rents?key=${PROPERTYDATA_API_KEY}&postcode=${encodeURIComponent(postcode)}`)
        ]);

        const prices = await pricesRes.json();
        const rental = await rentalRes.json();

        if (prices.status === 'success' || rental.status === 'success') {
          const demographics = { median_age: 38, avg_income: 45000, employment_rate: 88 };
          
          const btlScore = calculateBTLScore(prices, rental);
          const hmoScore = calculateHMOScore(prices, rental, demographics);
          const growthScore = calculateGrowthScore(prices);

          marketData = {
            postcode: normalizedPostcode,
            area_type: 'postcode',
            avg_sold_price: prices.data?.average_price || null,
            avg_sold_price_3m: prices.data?.average_price_3m || null,
            avg_sold_price_12m: prices.data?.average_price_12m || null,
            price_growth_pct: prices.data?.price_growth_12m || null,
            price_per_sqft: prices.data?.price_per_sqft || null,
            avg_rent_pcm: rental.data?.average_rent || null,
            avg_rent_1bed: rental.data?.rent_1bed || null,
            avg_rent_2bed: rental.data?.rent_2bed || null,
            avg_rent_3bed: rental.data?.rent_3bed || null,
            gross_yield: rental.data?.gross_yield || null,
            properties_for_sale: prices.data?.properties_for_sale || null,
            properties_sold_3m: prices.data?.sales_volume_3m || null,
            avg_time_on_market_days: prices.data?.avg_time_on_market || null,
            sale_vs_asking_pct: prices.data?.achieved_vs_asking || null,
            population: demographics.avg_income ? 15000 : null,
            median_age: demographics.median_age,
            avg_income: demographics.avg_income,
            employment_rate: demographics.employment_rate,
            btl_score: btlScore,
            hmo_score: hmoScore,
            growth_score: growthScore,
            overall_investment_score: Math.round((btlScore + hmoScore + growthScore) / 3),
            demand_score: prices.data?.demand_score || 60,
            supply_score: prices.data?.supply_score || 50,
            raw_data: { prices, rental, demographics },
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          };
        }
      } catch (apiError) {
        console.error('PropertyData API error:', apiError);
      }
    }

    // Fall back to mock data if API failed or no key
    if (!marketData) {
      console.log('Using mock data for:', normalizedPostcode);
      const mockData = generateMockMarketData(normalizedPostcode);
      const btlScore = calculateBTLScore(mockData, mockData);
      const hmoScore = calculateHMOScore(mockData, mockData, mockData);
      const growthScore = calculateGrowthScore(mockData);

      marketData = {
        ...mockData,
        btl_score: btlScore,
        hmo_score: hmoScore,
        growth_score: growthScore,
        overall_investment_score: Math.round((btlScore + hmoScore + growthScore) / 3),
        raw_data: { mock: true },
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    }

    // Cache the result
    const { error: upsertError } = await supabase
      .from('market_data')
      .upsert(marketData, { onConflict: 'postcode' });

    if (upsertError) {
      console.error('Cache upsert error:', upsertError);
    }

    return new Response(
      JSON.stringify({ success: true, data: marketData, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-market-data:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
