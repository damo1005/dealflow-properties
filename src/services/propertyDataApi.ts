import { supabase } from "@/integrations/supabase/client";

// Types
export interface PropertySearchFilters {
  location?: string;
  postcode?: string;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  propertyTypes?: string[];
  minYield?: number;
  priceReduced?: boolean;
  page?: number;
  limit?: number;
}

export interface Property {
  id: string;
  external_id: string;
  address: string;
  price: number;
  original_price?: number;
  price_reduced?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  description?: string;
  features?: string[];
  images?: string[];
  postcode?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  county?: string;
  days_on_market?: number;
  estimated_yield?: number;
  roi_potential?: number;
  floor_area_sqft?: number;
  epc_rating?: string;
  tenure?: string;
}

export interface ComparableProperty {
  address: string;
  price: number;
  date_sold: string;
  property_type: string;
  bedrooms: number;
  tenure: string;
  distance: number;
}

export interface ComparablesResult {
  postcode: string;
  radius_miles: number;
  comparables: ComparableProperty[];
  statistics: {
    count: number;
    average_price: number;
    median_price: number;
    min_price: number;
    max_price: number;
    price_per_sqft?: number;
  };
  chart_data: Array<{ month: string; count: number; average: number }>;
  cached: boolean;
}

export interface RentalEstimate {
  address: string;
  rent_pcm: number;
  bedrooms: number;
  property_type: string;
  date_listed: string;
  distance: number;
}

export interface RentalEstimatesResult {
  postcode: string;
  bedrooms: number | string;
  property_type: string;
  rentals: RentalEstimate[];
  estimates: {
    average_rent: number;
    median_rent: number;
    min_rent: number;
    max_rent: number;
    sample_size: number;
    gross_yield?: string;
    net_yield?: string;
    annual_rent: number;
  };
  by_bedrooms: Array<{ bedrooms: number; average_rent: number; count: number }>;
  cached: boolean;
}

export interface AreaStatistics {
  postcode: string;
  postcode_area: string;
  prices: {
    average_price?: number;
    median_price?: number;
    transactions_count?: number;
    price_change_1y?: number;
    price_change_5y?: number;
    price_per_sqft?: number;
    by_property_type?: Record<string, number>;
  };
  demographics: {
    population?: number;
    households?: number;
    average_age?: number;
    tenure?: {
      owned?: number;
      rented_private?: number;
      rented_social?: number;
    };
    employment_rate?: number;
    deprivation_index?: number;
    crime_rate?: number;
  };
  demand: {
    rental_demand_score?: number;
    days_to_let?: number;
    rental_yield_estimate?: number;
    void_rate?: number;
    stock_levels?: number;
  };
  price_trends: Array<{ date: string; price: number }>;
  market_indicators: {
    average_days_on_market?: number;
    listing_to_sale_ratio?: number;
    price_reduction_rate?: number;
    new_listings_30d?: number;
  };
  cached: boolean;
}

// API Functions
export async function searchProperties(filters: PropertySearchFilters): Promise<{
  success: boolean;
  data: Property[];
  total: number;
  page: number;
  cached: boolean;
  error?: string;
}> {
  const { data, error } = await supabase.functions.invoke("property-search", {
    body: filters,
  });

  if (error) {
    console.error("Property search error:", error);
    return { success: false, data: [], total: 0, page: 1, cached: false, error: error.message };
  }

  return data;
}

export async function getPropertyDetails(params: {
  propertyId?: string;
  uprn?: string;
  postcode?: string;
  address?: string;
}): Promise<{
  success: boolean;
  data: Property | null;
  cached: boolean;
  error?: string;
}> {
  const { data, error } = await supabase.functions.invoke("property-details", {
    body: params,
  });

  if (error) {
    console.error("Property details error:", error);
    return { success: false, data: null, cached: false, error: error.message };
  }

  return data;
}

export async function getComparables(params: {
  postcode: string;
  radiusMiles?: number;
  propertyType?: string;
  bedrooms?: number;
  months?: number;
}): Promise<{
  success: boolean;
  data: ComparablesResult | null;
  error?: string;
}> {
  const { data, error } = await supabase.functions.invoke("property-comparables", {
    body: params,
  });

  if (error) {
    console.error("Comparables error:", error);
    return { success: false, data: null, error: error.message };
  }

  return { success: data.success, data, error: data.error };
}

export async function getRentalEstimates(params: {
  postcode: string;
  bedrooms?: number;
  propertyType?: string;
  purchasePrice?: number;
}): Promise<{
  success: boolean;
  data: RentalEstimatesResult | null;
  error?: string;
}> {
  const { data, error } = await supabase.functions.invoke("rental-estimates", {
    body: params,
  });

  if (error) {
    console.error("Rental estimates error:", error);
    return { success: false, data: null, error: error.message };
  }

  return { success: data.success, data, error: data.error };
}

export async function getAreaStatistics(params: {
  postcode: string;
  includeDetails?: boolean;
}): Promise<{
  success: boolean;
  data: AreaStatistics | null;
  error?: string;
}> {
  const { data, error } = await supabase.functions.invoke("area-statistics", {
    body: params,
  });

  if (error) {
    console.error("Area statistics error:", error);
    return { success: false, data: null, error: error.message };
  }

  return { success: data.success, data, error: data.error };
}

// Helper to format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper to format percentage
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
