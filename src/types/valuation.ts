export interface PropertyValuation {
  id: string;
  user_id: string;
  portfolio_property_id?: string;
  address?: string;
  postcode?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  features?: string[];
  estimated_value?: number;
  confidence_score?: number;
  value_range_low?: number;
  value_range_high?: number;
  estimated_rent_pcm?: number;
  rent_range_low?: number;
  rent_range_high?: number;
  estimated_yield?: number;
  comparables?: ValuationComparable[];
  valuation_factors?: ValuationFactor[];
  created_at: string;
}

export interface ValuationComparable {
  address: string;
  price: number;
  date: string;
  bedrooms: number;
  property_type: string;
  distance: string;
}

export interface ValuationFactor {
  name: string;
  impact: number;
  description: string;
}

export interface ValuationHistory {
  id: string;
  portfolio_property_id: string;
  valuation_date: string;
  estimated_value?: number;
  source: 'ai' | 'manual' | 'agent';
  created_at: string;
}

export interface ValuationInput {
  portfolio_property_id?: string;
  address: string;
  postcode: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_footage?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  features: string[];
}

export const PROPERTY_FEATURES = [
  'Garden',
  'Parking',
  'Garage',
  'Loft Conversion',
  'Extension',
  'New Kitchen',
  'New Bathroom',
  'Double Glazing',
  'Central Heating',
  'Solar Panels',
];
