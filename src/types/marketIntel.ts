export interface MarketData {
  id: string;
  postcode: string;
  area_type?: string;
  avg_sold_price?: number;
  avg_sold_price_3m?: number;
  avg_sold_price_12m?: number;
  price_growth_pct?: number;
  price_per_sqft?: number;
  avg_rent_pcm?: number;
  avg_rent_1bed?: number;
  avg_rent_2bed?: number;
  avg_rent_3bed?: number;
  gross_yield?: number;
  properties_for_sale?: number;
  properties_sold_3m?: number;
  avg_time_on_market_days?: number;
  sale_vs_asking_pct?: number;
  population?: number;
  median_age?: number;
  avg_income?: number;
  employment_rate?: number;
  btl_score?: number;
  hmo_score?: number;
  growth_score?: number;
  overall_investment_score?: number;
  demand_score?: number;
  supply_score?: number;
  raw_data?: Record<string, unknown>;
  cached_at?: string;
  expires_at?: string;
}

export interface CMAReport {
  id: string;
  user_id: string;
  property_id?: string;
  subject_address: string;
  subject_postcode: string;
  subject_price?: number;
  sold_comparables?: ComparableProperty[];
  active_comparables?: ComparableProperty[];
  rental_comparables?: RentalComparable[];
  market_value_estimate?: number;
  confidence_level?: number;
  price_vs_market_pct?: number;
  estimated_rent?: number;
  estimated_yield?: number;
  created_at: string;
}

export interface ComparableProperty {
  address: string;
  price: number;
  sold_date?: string;
  property_type: string;
  bedrooms: number;
  sqft?: number;
  price_per_sqft?: number;
  distance?: number;
  adjustment?: number;
  adjusted_value?: number;
}

export interface RentalComparable {
  address: string;
  rent_pcm: number;
  bedrooms: number;
  property_type: string;
  listed_date?: string;
  distance?: number;
}

export interface DistressedProperty {
  id: string;
  property_id?: string;
  address: string;
  postcode: string;
  distress_type: string[];
  distress_score: number;
  current_price?: number;
  estimated_value?: number;
  potential_discount_pct?: number;
  days_on_market?: number;
  price_reductions?: number;
  last_reduction_pct?: number;
  epc_rating?: string;
  is_active: boolean;
  detected_at: string;
  updated_at: string;
}

export interface DistressedWatch {
  id: string;
  user_id: string;
  postcodes: string[];
  max_price?: number;
  property_types?: string[];
  min_discount_pct?: number;
  email_alerts: boolean;
  alert_frequency: 'instant' | 'daily' | 'weekly';
  created_at: string;
}

export interface InvestmentHotspot {
  id: string;
  area_name: string;
  postcode_district: string;
  hotspot_type?: string;
  avg_price?: number;
  avg_yield?: number;
  price_growth_12m?: number;
  forecast_growth_12m?: number;
  reasons: string[];
  opportunity_score?: number;
  suitable_strategies?: string[];
  entry_price_range?: string;
  risk_level?: 'low' | 'medium' | 'high';
  infrastructure_projects?: string[];
  demographic_trends?: Record<string, unknown>;
  is_active: boolean;
  rank?: number;
  calculated_at: string;
}

export interface PlanningApplication {
  id: string;
  address: string;
  postcode: string;
  reference: string;
  description?: string;
  application_type?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  decision_date?: string;
  applicant?: string;
  case_officer?: string;
  consultation_end_date?: string;
  property_impact?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PlanningAlert {
  id: string;
  user_id: string;
  postcodes: string[];
  radius_miles: number;
  alert_types: string[];
  email_alerts: boolean;
  created_at: string;
}
