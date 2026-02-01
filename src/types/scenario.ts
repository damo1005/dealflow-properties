import type { BTLInputs, BRRInputs, HMOInputs, FlipInputs } from "@/stores/calculatorStore";

export type ScenarioType = "btl" | "brr" | "hmo" | "flip";

export interface ScenarioInputs {
  btl: BTLInputs;
  brr: BRRInputs;
  hmo: HMOInputs;
  flip: FlipInputs;
}

export interface ScenarioVariation {
  id: string;
  name: string;
  changes: Partial<BTLInputs | BRRInputs | HMOInputs | FlipInputs>;
  metrics: ScenarioMetrics;
  createdAt: string;
}

export interface ScenarioMetrics {
  monthlyCashFlow: number;
  annualCashFlow: number;
  grossYield: number;
  netYield: number;
  roi: number;
  totalCashRequired: number;
  monthlyMortgage: number;
  breakEvenRent?: number;
}

export interface ScenarioSliderConfig {
  key: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  unit: "currency" | "percent" | "years" | "months" | "number";
  category: "purchase" | "financing" | "income" | "expenses";
  getBaseValue: (inputs: BTLInputs) => number;
  format?: (value: number, base: number) => string;
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  changes: Partial<BTLInputs>;
  color: "green" | "red" | "yellow" | "orange";
}

export interface SavedScenario {
  id: string;
  user_id: string;
  property_id: string | null;
  name: string;
  scenario_type: ScenarioType;
  base_inputs: BTLInputs | BRRInputs | HMOInputs | FlipInputs;
  scenario_variations: ScenarioVariation[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Cash Flow Forecasting Types
export interface CashFlowForecast {
  id: string;
  user_id: string;
  property_id?: string;
  forecast_date: string;
  forecast_type: 'actual' | 'projected';
  rental_income: number;
  other_income: number;
  total_income: number;
  mortgage_payment: number;
  insurance: number;
  ground_rent: number;
  service_charge: number;
  maintenance: number;
  management_fees: number;
  utilities: number;
  council_tax: number;
  other_expenses: number;
  total_expenses: number;
  net_cash_flow: number;
  cumulative_cash_flow: number;
  assumptions?: Record<string, unknown>;
  notes?: string;
  confidence_level: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
}

export interface ScheduledEvent {
  id: string;
  user_id: string;
  property_id?: string;
  event_type: 
    | 'rent_review' 
    | 'tenancy_end' 
    | 'mortgage_end' 
    | 'planned_maintenance'
    | 'capex' 
    | 'insurance_renewal' 
    | 'gas_safety' 
    | 'epc_renewal' 
    | 'eicr' 
    | 'refinance' 
    | 'sale';
  event_date: string;
  income_impact?: number;
  expense_impact?: number;
  description?: string;
  estimated_cost?: number;
  is_confirmed: boolean;
  is_completed: boolean;
  completed_date?: string;
  created_at: string;
}

export interface ForecastScenario {
  id: string;
  user_id: string;
  scenario_name: string;
  scenario_type: 'optimistic' | 'base' | 'pessimistic' | 'custom';
  rental_growth_rate: number;
  vacancy_rate: number;
  maintenance_percentage: number;
  capex_annual: number;
  annual_appreciation: number;
  assumptions?: Record<string, unknown>;
  is_default: boolean;
  created_at: string;
}

export interface MonthlyForecast {
  month: string;
  income: number;
  expenses: number;
  netCashFlow: number;
  cumulative: number;
  confidence: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface ScenarioSummary {
  name: string;
  type: ForecastScenario['scenario_type'];
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  color: string;
}

export const EVENT_CONFIG: Record<ScheduledEvent['event_type'], { label: string; icon: string; color: string }> = {
  rent_review: { label: 'Rent Review', icon: '💰', color: 'text-green-600' },
  tenancy_end: { label: 'Tenancy End', icon: '🏠', color: 'text-yellow-600' },
  mortgage_end: { label: 'Mortgage End', icon: '🏦', color: 'text-blue-600' },
  planned_maintenance: { label: 'Planned Maintenance', icon: '🔧', color: 'text-orange-600' },
  capex: { label: 'Capital Expenditure', icon: '🏗️', color: 'text-purple-600' },
  insurance_renewal: { label: 'Insurance Renewal', icon: '📋', color: 'text-gray-600' },
  gas_safety: { label: 'Gas Safety Check', icon: '🔥', color: 'text-red-600' },
  epc_renewal: { label: 'EPC Renewal', icon: '⚡', color: 'text-green-600' },
  eicr: { label: 'EICR', icon: '💡', color: 'text-yellow-600' },
  refinance: { label: 'Refinance', icon: '🔄', color: 'text-blue-600' },
  sale: { label: 'Property Sale', icon: '🏷️', color: 'text-red-600' },
};

export const CONFIDENCE_STYLES: Record<CashFlowForecast['confidence_level'], string> = {
  high: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};
