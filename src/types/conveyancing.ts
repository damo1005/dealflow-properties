export interface ConveyancingFirm {
  id: string;
  firm_name: string;
  logo_url: string | null;
  website_url: string | null;
  handles_purchases: boolean;
  handles_sales: boolean;
  handles_remortgage: boolean;
  handles_transfer_equity: boolean;
  handles_btl: boolean;
  handles_ltd_company: boolean;
  handles_leasehold: boolean;
  handles_new_build: boolean;
  purchase_fee_from: number | null;
  sale_fee_from: number | null;
  remortgage_fee_from: number | null;
  referral_partner: string | null;
  referral_link: string | null;
  commission_type: 'per_completion' | 'percentage' | null;
  commission_amount: number | null;
  sra_number: string | null;
  cqs_accredited: boolean;
  avg_completion_days: number | null;
  trustpilot_rating: number | null;
  reviews_count: number | null;
  offers_no_sale_no_fee: boolean;
  offers_fixed_fee: boolean;
  offers_online_tracking: boolean;
  dedicated_conveyancer: boolean;
  coverage_areas: string[] | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ConveyancingQuote {
  id: string;
  user_id: string;
  transaction_type: 'purchase' | 'sale' | 'purchase_and_sale' | 'remortgage' | 'transfer_equity';
  purchase_price: number | null;
  purchase_property_type: string | null;
  purchase_postcode: string | null;
  is_btl: boolean;
  is_ltd_company: boolean;
  needs_mortgage: boolean;
  is_first_time_buyer: boolean;
  sale_price: number | null;
  sale_property_type: string | null;
  sale_postcode: string | null;
  remortgage_value: number | null;
  remortgage_postcode: string | null;
  is_cash_buyer: boolean;
  chain_position: string | null;
  quotes: FirmQuote[] | null;
  status: 'draft' | 'quoted' | 'instructed' | 'completed' | 'expired';
  created_at: string;
  expires_at: string | null;
}

export interface FirmQuote {
  firm_id: string;
  firm_name: string;
  legal_fee: number;
  disbursements: number;
  total_cost: number;
  avg_completion_days: number;
  trustpilot_rating: number;
  reviews_count: number;
  features: string[];
  offers_no_sale_no_fee: boolean;
  cqs_accredited: boolean;
}

export interface ConveyancingWizardData {
  transactionType: 'purchase' | 'sale' | 'purchase_and_sale' | 'remortgage' | 'transfer_equity';
  // Purchase
  purchasePrice: number;
  purchasePostcode: string;
  purchasePropertyType: 'freehold' | 'leasehold' | 'new_build' | 'shared_ownership';
  leaseYearsRemaining: number;
  isFirstTimeBuyer: boolean;
  buyingMethod: 'mortgage' | 'cash' | 'help_to_buy';
  isBtl: boolean;
  isLtdCompany: boolean;
  chainPosition: 'no_chain' | 'selling_too' | 'already_sold';
  surveyType: 'valuation' | 'homebuyer' | 'structural' | 'none';
  // Sale
  salePrice: number;
  salePostcode: string;
  salePropertyType: 'freehold' | 'leasehold';
  hasOutstandingMortgage: boolean;
}
