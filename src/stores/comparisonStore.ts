import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ComparisonProperty, CalculatorInputs } from "@/types/comparison";

interface ComparisonState {
  properties: ComparisonProperty[];
  calculatorInputs: CalculatorInputs;
  selectedCategory: "all" | "financial" | "property" | "location" | "investment";
  showOnlyDifferences: boolean;
  
  // Actions
  addProperty: (property: ComparisonProperty) => void;
  removeProperty: (id: string) => void;
  clearAll: () => void;
  updateCalculatorInputs: (inputs: Partial<CalculatorInputs>) => void;
  updatePropertyCalculations: (id: string, calculations: Partial<ComparisonProperty>) => void;
  setSelectedCategory: (category: ComparisonState["selectedCategory"]) => void;
  setShowOnlyDifferences: (show: boolean) => void;
  loadComparison: (properties: ComparisonProperty[], inputs: CalculatorInputs) => void;
}

const defaultCalculatorInputs: CalculatorInputs = {
  depositPercent: 25,
  mortgageRate: 5.5,
  mortgageTerm: 25,
  managementFee: 10,
  maintenancePercent: 1,
  voidPercent: 5,
  insuranceMonthly: 30,
};

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      properties: [],
      calculatorInputs: defaultCalculatorInputs,
      selectedCategory: "all",
      showOnlyDifferences: false,

      addProperty: (property) => {
        const { properties } = get();
        if (properties.length >= 4) return;
        if (properties.find((p) => p.id === property.id)) return;
        set({ properties: [...properties, property] });
      },

      removeProperty: (id) => {
        set({ properties: get().properties.filter((p) => p.id !== id) });
      },

      clearAll: () => {
        set({ properties: [], calculatorInputs: defaultCalculatorInputs });
      },

      updateCalculatorInputs: (inputs) => {
        set({ calculatorInputs: { ...get().calculatorInputs, ...inputs } });
      },

      updatePropertyCalculations: (id, calculations) => {
        set({
          properties: get().properties.map((p) =>
            p.id === id ? { ...p, ...calculations } : p
          ),
        });
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
      },

      setShowOnlyDifferences: (show) => {
        set({ showOnlyDifferences: show });
      },

      loadComparison: (properties, inputs) => {
        set({ properties, calculatorInputs: inputs });
      },
    }),
    {
      name: "comparison-storage",
      partialize: (state) => ({
        properties: state.properties,
        calculatorInputs: state.calculatorInputs,
      }),
    }
  )
);

// Utility functions
export function calculatePropertyMetrics(
  property: ComparisonProperty,
  inputs: CalculatorInputs
): Partial<ComparisonProperty> {
  const rent = property.estimatedRent || 0;
  const price = property.price || 0;
  const deposit = price * (inputs.depositPercent / 100);
  const loanAmount = price - deposit;
  
  // Monthly mortgage payment (interest only for simplicity)
  const monthlyMortgage = (loanAmount * (inputs.mortgageRate / 100)) / 12;
  
  // Monthly costs
  const managementCost = rent * (inputs.managementFee / 100);
  const maintenanceCost = (price * (inputs.maintenancePercent / 100)) / 12;
  const voidCost = rent * (inputs.voidPercent / 100);
  const totalCosts = monthlyMortgage + managementCost + maintenanceCost + voidCost + inputs.insuranceMonthly;
  
  // Cash flow
  const monthlyCashFlow = rent - totalCosts;
  
  // Yields
  const grossYield = price > 0 ? ((rent * 12) / price) * 100 : 0;
  const netYield = price > 0 ? ((monthlyCashFlow * 12) / price) * 100 : 0;
  
  // ROI
  const annualCashFlow = monthlyCashFlow * 12;
  const stampDuty = calculateStampDuty(price);
  const purchaseCosts = price * 0.02; // ~2% for legal, surveys etc
  const totalCashRequired = deposit + stampDuty + purchaseCosts;
  const roi = totalCashRequired > 0 ? (annualCashFlow / totalCashRequired) * 100 : 0;

  return {
    calculatedYield: Math.round(grossYield * 100) / 100,
    calculatedCashFlow: Math.round(monthlyCashFlow),
    calculatedROI: Math.round(roi * 100) / 100,
    totalCashRequired: Math.round(totalCashRequired),
  };
}

function calculateStampDuty(price: number): number {
  // Additional property rates (2024)
  if (price <= 40000) return 0;
  if (price <= 250000) return price * 0.03;
  if (price <= 925000) return 7500 + (price - 250000) * 0.08;
  if (price <= 1500000) return 61500 + (price - 925000) * 0.13;
  return 136250 + (price - 1500000) * 0.15;
}
