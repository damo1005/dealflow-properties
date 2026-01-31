import { create } from "zustand";
import type { BTLInputs } from "@/stores/calculatorStore";
import { calculateBTLResults } from "@/stores/calculatorStore";
import type { ScenarioMetrics, ScenarioVariation } from "@/types/scenario";

interface ScenarioState {
  baseInputs: BTLInputs;
  currentInputs: BTLInputs;
  variations: ScenarioVariation[];
  
  // Actions
  setBaseInputs: (inputs: BTLInputs) => void;
  updateInput: (key: keyof BTLInputs, value: number) => void;
  resetToBase: () => void;
  saveVariation: (name: string) => void;
  loadVariation: (id: string) => void;
  deleteVariation: (id: string) => void;
  applyPreset: (changes: Partial<BTLInputs>) => void;
  clearVariations: () => void;
}

const defaultInputs: BTLInputs = {
  purchasePrice: 250000,
  depositPercent: 25,
  mortgageRate: 5.5,
  mortgageTerm: 25,
  legalFees: 1500,
  surveyFees: 500,
  brokerFees: 500,
  refurbCosts: 0,
  monthlyRent: 1200,
  voidPercent: 5,
  lettingAgentFee: 8,
  managementFee: 10,
  insurance: 300,
  maintenancePercent: 10,
  serviceCharge: 0,
  groundRent: 0,
};

export function calculateMetrics(inputs: BTLInputs): ScenarioMetrics {
  const results = calculateBTLResults(inputs);
  
  // Calculate break-even rent
  const totalCostsWithoutRent = 
    results.monthlyMortgage * 12 +
    inputs.insurance +
    inputs.serviceCharge +
    inputs.groundRent;
  
  const effectiveRateMultiplier = (1 - inputs.voidPercent / 100) * 
    (1 - inputs.lettingAgentFee / 100) * 
    (1 - inputs.managementFee / 100) * 
    (1 - inputs.maintenancePercent / 100);
  
  const breakEvenRent = effectiveRateMultiplier > 0 
    ? totalCostsWithoutRent / (12 * effectiveRateMultiplier)
    : 0;

  return {
    monthlyCashFlow: results.monthlyCashFlow,
    annualCashFlow: results.annualCashFlow,
    grossYield: results.grossYield,
    netYield: results.netYield,
    roi: results.roi,
    totalCashRequired: results.totalCashRequired,
    monthlyMortgage: results.monthlyMortgage,
    breakEvenRent: Math.round(breakEvenRent),
  };
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  baseInputs: defaultInputs,
  currentInputs: defaultInputs,
  variations: [],

  setBaseInputs: (inputs) => {
    set({ baseInputs: inputs, currentInputs: inputs });
  },

  updateInput: (key, value) => {
    set((state) => ({
      currentInputs: { ...state.currentInputs, [key]: value },
    }));
  },

  resetToBase: () => {
    set((state) => ({ currentInputs: state.baseInputs }));
  },

  saveVariation: (name) => {
    const { baseInputs, currentInputs, variations } = get();
    
    // Calculate changes from base
    const changes: Partial<BTLInputs> = {};
    (Object.keys(currentInputs) as (keyof BTLInputs)[]).forEach((key) => {
      if (currentInputs[key] !== baseInputs[key]) {
        (changes as Record<string, number>)[key] = currentInputs[key];
      }
    });

    const metrics = calculateMetrics(currentInputs);
    
    const newVariation: ScenarioVariation = {
      id: crypto.randomUUID(),
      name,
      changes,
      metrics,
      createdAt: new Date().toISOString(),
    };

    set({ variations: [...variations, newVariation] });
  },

  loadVariation: (id) => {
    const { baseInputs, variations } = get();
    const variation = variations.find((v) => v.id === id);
    
    if (variation) {
      set({
        currentInputs: { ...baseInputs, ...variation.changes } as BTLInputs,
      });
    }
  },

  deleteVariation: (id) => {
    set((state) => ({
      variations: state.variations.filter((v) => v.id !== id),
    }));
  },

  applyPreset: (changes) => {
    set((state) => ({
      currentInputs: { ...state.currentInputs, ...changes },
    }));
  },

  clearVariations: () => {
    set({ variations: [] });
  },
}));
