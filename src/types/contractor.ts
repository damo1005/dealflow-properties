export interface ContractorCategory {
  id: string;
  category_name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  typical_hourly_rate_min: number | null;
  typical_hourly_rate_max: number | null;
  typical_callout_fee: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Contractor {
  id: string;
  business_name: string;
  trading_as: string | null;
  logo_url: string | null;
  bio: string | null;
  email: string;
  phone: string | null;
  website_url: string | null;
  coverage_areas: string[] | null;
  coverage_radius_miles: number | null;
  home_postcode: string | null;
  is_gas_safe_registered: boolean;
  gas_safe_number: string | null;
  is_niceic_registered: boolean;
  niceic_number: string | null;
  other_certifications: string[] | null;
  has_public_liability: boolean;
  public_liability_amount: number | null;
  insurance_expiry_date: string | null;
  is_vetted: boolean;
  dbs_checked: boolean;
  references_checked: boolean;
  hourly_rate: number | null;
  half_day_rate: number | null;
  day_rate: number | null;
  callout_fee: number | null;
  free_quotes: boolean;
  emergency_callout: boolean;
  avg_rating: number;
  total_reviews: number;
  total_jobs_completed: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobRequest {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string;
  property_address: string | null;
  property_postcode: string | null;
  urgency: 'emergency' | 'urgent' | 'normal' | 'flexible';
  preferred_date: string | null;
  preferred_time: string | null;
  budget_min: number | null;
  budget_max: number | null;
  photo_urls: string[] | null;
  status: 'draft' | 'posted' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  selected_contractor_id: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface JobQuote {
  id: string;
  job_request_id: string;
  contractor_id: string;
  quote_amount: number;
  quote_description: string | null;
  estimated_duration: string | null;
  earliest_start_date: string | null;
  labour_cost: number | null;
  materials_cost: number | null;
  other_costs: number | null;
  valid_until: string | null;
  status: 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  created_at: string;
}

export interface ContractorReview {
  id: string;
  user_id: string;
  contractor_id: string;
  overall_rating: number;
  quality_rating: number | null;
  punctuality_rating: number | null;
  communication_rating: number | null;
  value_rating: number | null;
  review_text: string | null;
  contractor_response: string | null;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}
