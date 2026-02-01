import { create } from 'zustand';
import {
  PropertyInput,
  FinancialsInput,
  StrategyInput,
  DealAnalysis,
  Strategy,
  BTLStrategyInputs,
} from '@/types/dealAnalysis';

interface DealAnalysisState {
  // Wizard state
  currentStep: number;
  property: PropertyInput;
  financials: FinancialsInput;
  strategyInput: StrategyInput;
  
  // Analysis results
  analysis: DealAnalysis | null;
  isAnalyzing: boolean;
  
  // Saved analyses
  savedAnalyses: DealAnalysis[];
  
  // Actions
  setStep: (step: number) => void;
  setProperty: (property: Partial<PropertyInput>) => void;
  setFinancials: (financials: Partial<FinancialsInput>) => void;
  setStrategyInput: (input: Partial<StrategyInput>) => void;
  setAnalysis: (analysis: DealAnalysis | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setSavedAnalyses: (analyses: DealAnalysis[]) => void;
  resetWizard: () => void;
}

const defaultProperty: PropertyInput = {
  inputMethod: 'manual',
  postcode: '',
  propertyType: 'terraced',
  bedrooms: 3,
  bathrooms: 1,
};

const defaultFinancials: FinancialsInput = {
  askingPrice: 0,
  offerPrice: 0,
  purchaseType: 'standard',
  refurbLight: 0,
  refurbMedium: 0,
  refurbHeavy: 0,
  financeType: 'btl_mortgage',
  ltv: 75,
  interestRate: 5.5,
  mortgageTerm: 25,
  interestOnly: true,
};

const defaultBTLInputs: BTLStrategyInputs = {
  monthlyRent: 0,
  managementPercent: 0,
  voidWeeksPerYear: 2,
  maintenancePercent: 10,
};

const defaultStrategyInput: StrategyInput = {
  strategy: 'btl',
  inputs: defaultBTLInputs,
};

export const useDealAnalysisStore = create<DealAnalysisState>((set) => ({
  currentStep: 1,
  property: defaultProperty,
  financials: defaultFinancials,
  strategyInput: defaultStrategyInput,
  analysis: null,
  isAnalyzing: false,
  savedAnalyses: [],
  
  setStep: (step) => set({ currentStep: step }),
  
  setProperty: (property) => set((state) => ({
    property: { ...state.property, ...property },
  })),
  
  setFinancials: (financials) => set((state) => ({
    financials: { ...state.financials, ...financials },
  })),
  
  setStrategyInput: (input) => set((state) => ({
    strategyInput: { ...state.strategyInput, ...input },
  })),
  
  setAnalysis: (analysis) => set({ analysis }),
  
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  
  setSavedAnalyses: (savedAnalyses) => set({ savedAnalyses }),
  
  resetWizard: () => set({
    currentStep: 1,
    property: defaultProperty,
    financials: defaultFinancials,
    strategyInput: defaultStrategyInput,
    analysis: null,
  }),
}));
