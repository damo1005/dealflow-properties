export interface PlanningApplication {
  id: string;
  reference: string;
  address: string;
  postcode: string;
  latitude: number;
  longitude: number;
  local_authority: string;
  description: string;
  application_type: string;
  development_type: string;
  proposed_units: number;
  status: string;
  submitted_date: string;
  decision_date: string | null;
  applicant_name: string | null;
  agent_company: string | null;
  distance_miles?: number;
}

export interface EPCProperty {
  id: string;
  lmk_key: string;
  address: string;
  postcode: string;
  latitude: number;
  longitude: number;
  property_type: string;
  built_form: string;
  floor_area: number;
  current_rating: string;
  current_score: number;
  potential_rating: string;
  potential_score: number;
  walls_efficiency: string;
  roof_efficiency: string;
  windows_efficiency: string;
  heating_efficiency: string;
  distance_miles?: number;
}

export interface AreaContractor {
  id: string;
  company_name: string;
  trading_name: string | null;
  source: string;
  postcode: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  trade_categories: string[];
  specialties: string[];
  ccs_score: number | null;
  ccs_project_count: number | null;
  checkatrade_score: number | null;
  checkatrade_reviews: number | null;
  trustmark_registered: boolean;
  is_verified: boolean;
  distance_miles?: number;
}

export interface DemandScore {
  id: string;
  postcode_district: string;
  planning_approved_count: number;
  planning_pending_count: number;
  ccs_active_sites: number;
  low_epc_properties: number;
  overall_demand_score: number;
}

export interface CCSProject {
  id: string;
  ccs_project_id: string;
  project_name: string;
  project_description: string;
  project_category: string;
  address_line1: string;
  town: string;
  postcode: string;
  latitude: number;
  longitude: number;
  region: string;
  client_name: string;
  contractor_name: string;
  site_manager_name: string | null;
  site_manager_phone: string | null;
  site_manager_email: string | null;
  overall_score: number | null;
  community_score: number | null;
  environment_score: number | null;
  workforce_score: number | null;
  is_ultra_site: boolean;
  has_award: boolean;
  award_details: string | null;
  visit_count: number;
  distance_miles?: number;
}

export interface ContractorDemandFilters {
  postcode: string;
  radius: number;
  minScore: number;
  status?: string;
  tradeCategory?: string;
  epcRatings?: string[];
}
