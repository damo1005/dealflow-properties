export interface InsuranceProvider {
  id: string;
  provider_name: string;
  logo_url: string | null;
  website_url: string | null;
  offers_buildings: boolean;
  offers_contents: boolean;
  offers_liability: boolean;
  offers_rent_guarantee: boolean;
  offers_legal_expenses: boolean;
  offers_emergency_assistance: boolean;
  affiliate_network: string | null;
  affiliate_link: string | null;
  commission_type: 'per_policy' | 'percentage' | 'cpa' | null;
  commission_amount: number | null;
  cookie_duration_days: number;
  trustpilot_rating: number | null;
  defaqto_rating: number | null;
  avg_buildings_premium: number | null;
  avg_contents_premium: number | null;
  avg_combined_premium: number | null;
  key_features: string[] | null;
  excess_options: string[] | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface InsuranceQuote {
  id: string;
  user_id: string;
  portfolio_property_id: string | null;
  property_address: string | null;
  postcode: string | null;
  property_type: string | null;
  property_value: number | null;
  rebuild_cost: number | null;
  year_built: number | null;
  coverage_type: 'buildings' | 'contents' | 'combined' | 'liability';
  buildings_cover_amount: number | null;
  contents_cover_amount: number | null;
  bedrooms: number | null;
  is_listed_building: boolean;
  has_flat_roof: boolean;
  is_hmo: boolean;
  is_furnished: boolean;
  has_tenants: boolean;
  needs_rent_guarantee: boolean;
  needs_legal_expenses: boolean;
  needs_emergency_cover: boolean;
  quotes: ProviderQuote[] | null;
  status: 'draft' | 'quoted' | 'purchased' | 'expired';
  created_at: string;
  expires_at: string | null;
}

export interface ProviderQuote {
  provider_id: string;
  provider_name: string;
  annual_premium: number;
  monthly_premium: number;
  buildings_cover: number;
  contents_cover: number;
  rent_guarantee_limit: number | null;
  rent_guarantee_months: number | null;
  legal_expenses_limit: number | null;
  has_emergency_cover: boolean;
  excess: number;
  features: string[];
}

export interface InsurancePurchase {
  id: string;
  user_id: string;
  quote_id: string | null;
  provider_id: string | null;
  provider_name: string | null;
  policy_number: string | null;
  coverage_type: string | null;
  annual_premium: number | null;
  excess: number | null;
  start_date: string | null;
  end_date: string | null;
  affiliate_click_id: string | null;
  commission_status: 'pending' | 'approved' | 'paid' | 'declined';
  commission_amount: number | null;
  commission_date: string | null;
  created_at: string;
}

export interface InsuranceWizardData {
  // Step 1: Property Details
  propertyAddress: string;
  postcode: string;
  propertyType: 'house' | 'flat' | 'bungalow' | 'hmo';
  bedrooms: number;
  propertyValue: number;
  rebuildCost: number;
  yearBuilt: number;
  construction: 'standard' | 'non_standard' | 'listed';
  hasFlatRoof: boolean;
  hasSwimmingPool: boolean;
  hasSolarPanels: boolean;
  hasBasement: boolean;
  
  // Step 2: Coverage
  coverageType: 'buildings' | 'contents' | 'combined' | 'liability';
  buildingsCoverAmount: number;
  isFurnished: 'furnished' | 'part_furnished' | 'unfurnished';
  contentsCoverAmount: number;
  needsRentGuarantee: boolean;
  rentGuaranteeAmount: number;
  rentGuaranteeMonths: number;
  needsLegalExpenses: boolean;
  legalExpensesLimit: number;
  needsEmergencyCover: boolean;
  needsAlternativeAccommodation: boolean;
  needsLossOfRent: boolean;
  lossOfRentMonths: number;
  needsAccidentalDamage: boolean;
  
  // Step 3: Tenancy
  tenancyStatus: 'let' | 'vacant' | 'refurbishing';
  tenancyType: 'ast' | 'company' | 'students' | 'housing_benefit' | 'holiday';
  numberOfTenants: number;
  isHmo: boolean;
  hasLocks: boolean;
  hasWindowLocks: boolean;
  hasBurglarAlarm: boolean;
  hasCCTV: boolean;
  hasSecurityLights: boolean;
  claimsCount: number;
  claimsDetails: string;
  excessPreference: number;
}
