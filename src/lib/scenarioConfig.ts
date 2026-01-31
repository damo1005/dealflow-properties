import type { BTLInputs } from "@/stores/calculatorStore";
import type { ScenarioSliderConfig, PresetScenario } from "@/types/scenario";

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(value % 1 === 0 ? 0 : 2)}%`;
};

export const formatDiff = (current: number, base: number, unit: "currency" | "percent"): string => {
  const diff = current - base;
  if (diff === 0) return "";
  
  const prefix = diff > 0 ? "+" : "";
  if (unit === "currency") {
    return `${prefix}${formatCurrency(diff)}`;
  }
  return `${prefix}${diff.toFixed(2)}%`;
};

export const sliderConfigs: ScenarioSliderConfig[] = [
  // Purchase Variables
  {
    key: "purchasePrice",
    label: "Purchase Price",
    description: "What if purchase price was...",
    min: 0.8,
    max: 1.2,
    step: 0.01,
    unit: "currency",
    category: "purchase",
    getBaseValue: (inputs) => inputs.purchasePrice,
  },
  {
    key: "depositPercent",
    label: "Deposit",
    description: "Deposit percentage",
    min: 10,
    max: 50,
    step: 5,
    unit: "percent",
    category: "purchase",
    getBaseValue: (inputs) => inputs.depositPercent,
  },
  {
    key: "refurbCosts",
    label: "Refurb Costs",
    description: "What if refurb costs were...",
    min: 0,
    max: 2,
    step: 0.1,
    unit: "currency",
    category: "purchase",
    getBaseValue: (inputs) => inputs.refurbCosts,
  },
  
  // Financing Variables
  {
    key: "mortgageRate",
    label: "Interest Rate",
    description: "What if interest rates change to...",
    min: 2,
    max: 10,
    step: 0.25,
    unit: "percent",
    category: "financing",
    getBaseValue: (inputs) => inputs.mortgageRate,
  },
  {
    key: "mortgageTerm",
    label: "Mortgage Term",
    description: "Mortgage term (years)",
    min: 5,
    max: 40,
    step: 5,
    unit: "years",
    category: "financing",
    getBaseValue: (inputs) => inputs.mortgageTerm,
  },
  
  // Income Variables
  {
    key: "monthlyRent",
    label: "Monthly Rent",
    description: "What if I could charge...",
    min: 0.7,
    max: 1.3,
    step: 0.01,
    unit: "currency",
    category: "income",
    getBaseValue: (inputs) => inputs.monthlyRent,
  },
  {
    key: "voidPercent",
    label: "Void Period",
    description: "Void period (%)",
    min: 0,
    max: 25,
    step: 1,
    unit: "percent",
    category: "income",
    getBaseValue: (inputs) => inputs.voidPercent,
  },
  
  // Expense Variables
  {
    key: "maintenancePercent",
    label: "Maintenance",
    description: "Annual maintenance (% of rent)",
    min: 0,
    max: 20,
    step: 1,
    unit: "percent",
    category: "expenses",
    getBaseValue: (inputs) => inputs.maintenancePercent,
  },
  {
    key: "managementFee",
    label: "Management Fee",
    description: "Letting agent fee (%)",
    min: 0,
    max: 15,
    step: 1,
    unit: "percent",
    category: "expenses",
    getBaseValue: (inputs) => inputs.managementFee,
  },
  {
    key: "insurance",
    label: "Insurance",
    description: "Annual insurance cost",
    min: 0,
    max: 1500,
    step: 50,
    unit: "currency",
    category: "expenses",
    getBaseValue: (inputs) => inputs.insurance,
  },
];

export const presetScenarios: PresetScenario[] = [
  {
    id: "best-case",
    name: "Best Case",
    description: "Optimistic assumptions",
    icon: "TrendingUp",
    color: "green",
    changes: {
      monthlyRent: 1.1, // Will be multiplied by base
      voidPercent: 3,
      purchasePrice: 0.95, // Will be multiplied by base
      mortgageRate: 5.0,
    },
  },
  {
    id: "worst-case",
    name: "Worst Case",
    description: "Pessimistic assumptions",
    icon: "TrendingDown",
    color: "red",
    changes: {
      monthlyRent: 0.9,
      voidPercent: 10,
      mortgageRate: 7.5,
      maintenancePercent: 15,
    },
  },
  {
    id: "rate-shock",
    name: "Rate Shock",
    description: "Interest rates jump +3%",
    icon: "Zap",
    color: "orange",
    changes: {
      mortgageRate: 8.5,
    },
  },
  {
    id: "recession",
    name: "Recession",
    description: "Economic downturn scenario",
    icon: "AlertTriangle",
    color: "red",
    changes: {
      monthlyRent: 0.85,
      voidPercent: 12,
      purchasePrice: 0.9,
      mortgageRate: 6.5,
    },
  },
];

export function applyPresetToInputs(
  baseInputs: BTLInputs,
  preset: PresetScenario
): Partial<BTLInputs> {
  const changes: Partial<BTLInputs> = {};
  
  Object.entries(preset.changes).forEach(([key, value]) => {
    const k = key as keyof BTLInputs;
    const baseValue = baseInputs[k];
    
    // For price/rent, value is a multiplier
    if (k === "purchasePrice" || k === "monthlyRent") {
      changes[k] = Math.round(baseValue * (value as number));
    } else {
      changes[k] = value as number;
    }
  });
  
  return changes;
}

export function getRateColor(rate: number): string {
  if (rate < 5) return "text-green-600";
  if (rate <= 7) return "text-yellow-600";
  return "text-red-600";
}

export function getYieldColor(yieldPercent: number): string {
  if (yieldPercent >= 8) return "text-green-600";
  if (yieldPercent >= 5) return "text-yellow-600";
  return "text-red-600";
}

export function getCashFlowColor(cashFlow: number): string {
  if (cashFlow > 0) return "text-green-600";
  if (cashFlow === 0) return "text-yellow-600";
  return "text-red-600";
}
