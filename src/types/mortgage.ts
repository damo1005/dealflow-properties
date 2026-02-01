export interface MortgageProduct {
  id: string;
  lender: string;
  product_name: string;
  rate: number;
  initial_rate_period: number; // months
  mortgage_type: 'btl' | 'residential';
  rate_type: 'fixed' | 'variable' | 'tracker';
  max_ltv: number;
  min_loan: number;
  max_loan: number;
  product_fee: number; // in pence
  cashback: number; // in pence
  early_repayment_charges?: ERCSchedule[];
  eligibility_criteria?: EligibilityCriteria;
  is_active: boolean;
  last_updated: string;
}

export interface ERCSchedule {
  year: number;
  percentage: number;
}

export interface EligibilityCriteria {
  min_income?: number;
  min_rental_coverage?: number;
  first_time_buyer?: boolean;
  limited_company?: boolean;
  portfolio_landlord?: boolean;
}

export interface MortgageComparison {
  id: string;
  user_id: string;
  property_id?: string;
  loan_amount: number;
  property_value: number;
  ltv: number;
  mortgage_type: 'btl' | 'residential' | 'remortgage';
  term_years: number;
  results?: MortgageProduct[];
  best_rate?: number;
  created_at: string;
}

export interface MortgageReferral {
  id: string;
  user_id: string;
  comparison_id?: string;
  product_id?: string;
  partner: 'mojo' | 'l_and_c' | 'trussle' | 'habito';
  loan_amount: number;
  lender_name: string;
  rate: number;
  referral_url: string;
  referral_code: string;
  click_id: string;
  status: 'clicked' | 'applied' | 'approved' | 'completed' | 'rejected';
  commission_amount?: number; // in pence
  commission_paid: boolean;
  commission_paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MortgageSearchParams {
  propertyValue: number;
  loanAmount: number;
  mortgageType: 'btl' | 'residential' | 'remortgage';
  termYears: number;
}

export interface MortgageFilterParams {
  rateType?: 'fixed' | 'variable' | 'tracker';
  fixedPeriodMonths?: number;
  maxFee?: number;
}

export interface CalculatedMortgage extends MortgageProduct {
  monthlyPayment: number;
  totalCostOverPeriod: number;
  totalInterest: number;
  effectiveRate: number; // Including fees
}
