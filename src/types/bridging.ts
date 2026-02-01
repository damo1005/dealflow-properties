export interface BridgingCalculation {
  id: string;
  user_id: string;
  loan_purpose: string | null;
  property_value: number | null;
  purchase_price: number | null;
  loan_amount: number | null;
  ltv: number | null;
  term_months: number | null;
  interest_rate_monthly: number | null;
  arrangement_fee_percent: number | null;
  exit_fee_percent: number | null;
  gross_interest: number | null;
  arrangement_fee: number | null;
  exit_fee: number | null;
  valuation_fee: number | null;
  legal_fee: number | null;
  total_cost: number | null;
  total_repayable: number | null;
  exit_strategy: string | null;
  created_at: string;
}

export const LOAN_PURPOSES = [
  { value: 'purchase', label: 'Property Purchase' },
  { value: 'refurb', label: 'Refurbishment' },
  { value: 'auction', label: 'Auction Purchase' },
  { value: 'chain_break', label: 'Chain Break' },
  { value: 'development', label: 'Development' },
];

export const BRIDGING_LENDERS = [
  { name: 'MT Finance', rateMonthly: 0.75, arrangementFee: 2, exitFee: 1 },
  { name: 'Together', rateMonthly: 0.85, arrangementFee: 2, exitFee: 0 },
  { name: 'United Trust', rateMonthly: 0.89, arrangementFee: 1.5, exitFee: 1 },
  { name: 'Shawbrook', rateMonthly: 0.95, arrangementFee: 2, exitFee: 0 },
  { name: 'Roma Finance', rateMonthly: 0.79, arrangementFee: 2, exitFee: 1.5 },
];
