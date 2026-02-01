export type ProjectType = 'conversion' | 'new_build' | 'refurb_flip' | 'hmo_conversion' | 'extension';
export type ExitStrategy = 'sell' | 'retain' | 'mix';

export interface UnitBreakdown {
  type: string;
  count: number;
  size_sqft: number;
  value?: number;
}

export interface DevelopmentAppraisal {
  id: string;
  user_id: string;
  project_name: string;
  address: string | null;
  postcode: string | null;
  project_type: ProjectType | null;
  existing_units: number;
  proposed_units: number | null;
  unit_breakdown: UnitBreakdown[];
  purchase_price: number | null;
  purchase_costs: number | null;
  construction_cost: number | null;
  contingency_percent: number;
  professional_fees: number | null;
  finance_type: string | null;
  loan_amount: number | null;
  interest_rate: number | null;
  loan_term_months: number | null;
  arrangement_fee: number | null;
  gdv: number | null;
  sales_costs: number | null;
  exit_strategy: ExitStrategy | null;
  estimated_rent_pcm: number | null;
  estimated_yield: number | null;
  total_costs: number | null;
  gross_profit: number | null;
  net_profit: number | null;
  profit_on_cost: number | null;
  roi: number | null;
  build_months: number | null;
  status: string;
  created_at: string;
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  conversion: 'Flat Conversion',
  new_build: 'New Build',
  refurb_flip: 'Refurb & Flip',
  hmo_conversion: 'HMO Conversion',
  extension: 'Extension',
};
