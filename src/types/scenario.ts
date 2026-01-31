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
