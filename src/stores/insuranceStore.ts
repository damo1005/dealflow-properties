import { create } from 'zustand';
import type { InsuranceProvider, InsuranceQuote, ProviderQuote, InsurancePurchase } from '@/types/insurance';

interface InsuranceWizardData {
  // Step 1: Property Details
  propertyAddress: string;
  postcode: string;
  propertyType: 'house' | 'flat' | 'bungalow' | 'hmo';
  bedrooms: number;
  propertyValue: number;
  rebuildCost: number;
  yearBuilt: number;
  construction: 'standard' | 'non_standard' | 'listed';
  hasFlatRoof: boolean;
  hasSwimmingPool: boolean;
  hasSolarPanels: boolean;
  hasBasement: boolean;
  
  // Step 2: Coverage
  coverageType: 'buildings' | 'contents' | 'combined' | 'liability';
  buildingsCoverAmount: number;
  isFurnished: 'furnished' | 'part_furnished' | 'unfurnished';
  contentsCoverAmount: number;
  needsRentGuarantee: boolean;
  rentGuaranteeAmount: number;
  rentGuaranteeMonths: number;
  needsLegalExpenses: boolean;
  legalExpensesLimit: number;
  needsEmergencyCover: boolean;
  needsAlternativeAccommodation: boolean;
  needsLossOfRent: boolean;
  lossOfRentMonths: number;
  needsAccidentalDamage: boolean;
  
  // Step 3: Tenancy
  tenancyStatus: 'let' | 'vacant' | 'refurbishing';
  tenancyType: 'ast' | 'company' | 'students' | 'housing_benefit' | 'holiday';
  numberOfTenants: number;
  isHmo: boolean;
  hasLocks: boolean;
  hasWindowLocks: boolean;
  hasBurglarAlarm: boolean;
  hasCCTV: boolean;
  hasSecurityLights: boolean;
  claimsCount: number;
  claimsDetails: string;
  excessPreference: number;
}

interface InsuranceState {
  // Wizard
  currentStep: number;
  wizardData: InsuranceWizardData;
  
  // Providers & Quotes
  providers: InsuranceProvider[];
  generatedQuotes: ProviderQuote[];
  savedQuotes: InsuranceQuote[];
  purchases: InsurancePurchase[];
  
  // Loading
  isLoadingProviders: boolean;
  isLoadingQuotes: boolean;
  isGeneratingQuotes: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateWizardData: (data: Partial<InsuranceWizardData>) => void;
  resetWizard: () => void;
  setProviders: (providers: InsuranceProvider[]) => void;
  setGeneratedQuotes: (quotes: ProviderQuote[]) => void;
  setSavedQuotes: (quotes: InsuranceQuote[]) => void;
  setPurchases: (purchases: InsurancePurchase[]) => void;
  setIsLoadingProviders: (loading: boolean) => void;
  setIsLoadingQuotes: (loading: boolean) => void;
  setIsGeneratingQuotes: (loading: boolean) => void;
}

const initialWizardData: InsuranceWizardData = {
  propertyAddress: '',
  postcode: '',
  propertyType: 'house',
  bedrooms: 2,
  propertyValue: 300000,
  rebuildCost: 250000,
  yearBuilt: 1990,
  construction: 'standard',
  hasFlatRoof: false,
  hasSwimmingPool: false,
  hasSolarPanels: false,
  hasBasement: false,
  
  coverageType: 'buildings',
  buildingsCoverAmount: 250000,
  isFurnished: 'unfurnished',
  contentsCoverAmount: 0,
  needsRentGuarantee: true,
  rentGuaranteeAmount: 1500,
  rentGuaranteeMonths: 6,
  needsLegalExpenses: true,
  legalExpensesLimit: 50000,
  needsEmergencyCover: true,
  needsAlternativeAccommodation: false,
  needsLossOfRent: true,
  lossOfRentMonths: 12,
  needsAccidentalDamage: false,
  
  tenancyStatus: 'let',
  tenancyType: 'ast',
  numberOfTenants: 2,
  isHmo: false,
  hasLocks: true,
  hasWindowLocks: true,
  hasBurglarAlarm: false,
  hasCCTV: false,
  hasSecurityLights: false,
  claimsCount: 0,
  claimsDetails: '',
  excessPreference: 250,
};

export const useInsuranceStore = create<InsuranceState>((set) => ({
  currentStep: 1,
  wizardData: initialWizardData,
  providers: [],
  generatedQuotes: [],
  savedQuotes: [],
  purchases: [],
  isLoadingProviders: false,
  isLoadingQuotes: false,
  isGeneratingQuotes: false,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  updateWizardData: (data) => set((state) => ({ 
    wizardData: { ...state.wizardData, ...data } 
  })),
  resetWizard: () => set({ currentStep: 1, wizardData: initialWizardData, generatedQuotes: [] }),
  setProviders: (providers) => set({ providers }),
  setGeneratedQuotes: (quotes) => set({ generatedQuotes: quotes }),
  setSavedQuotes: (quotes) => set({ savedQuotes: quotes }),
  setPurchases: (purchases) => set({ purchases }),
  setIsLoadingProviders: (loading) => set({ isLoadingProviders: loading }),
  setIsLoadingQuotes: (loading) => set({ isLoadingQuotes: loading }),
  setIsGeneratingQuotes: (loading) => set({ isGeneratingQuotes: loading }),
}));

// Helper to generate simulated quotes based on wizard data
export function generateQuotes(
  providers: InsuranceProvider[], 
  wizardData: InsuranceWizardData
): ProviderQuote[] {
  return providers
    .filter(p => p.is_active)
    .map(provider => {
      // Base premium calculation
      let basePremium = provider.avg_buildings_premium || 280;
      
      // Adjust for property value
      const valueMultiplier = wizardData.buildingsCoverAmount / 250000;
      basePremium *= Math.max(0.8, Math.min(1.5, valueMultiplier));
      
      // Adjust for property type
      if (wizardData.propertyType === 'hmo') basePremium *= 1.4;
      if (wizardData.propertyType === 'flat') basePremium *= 0.9;
      
      // Adjust for features
      if (wizardData.hasFlatRoof) basePremium *= 1.15;
      if (wizardData.construction === 'listed') basePremium *= 1.25;
      if (wizardData.construction === 'non_standard') basePremium *= 1.2;
      
      // Adjust for coverage
      if (wizardData.coverageType === 'combined') basePremium *= 1.3;
      if (wizardData.needsRentGuarantee && provider.offers_rent_guarantee) basePremium += 80;
      if (wizardData.needsLegalExpenses && provider.offers_legal_expenses) basePremium += 40;
      if (wizardData.needsEmergencyCover && provider.offers_emergency_assistance) basePremium += 35;
      
      // Adjust for claims history
      basePremium *= (1 + wizardData.claimsCount * 0.15);
      
      // Adjust for excess - lower excess = higher premium
      if (wizardData.excessPreference < 250) basePremium *= 1.1;
      if (wizardData.excessPreference >= 500) basePremium *= 0.92;
      if (wizardData.excessPreference >= 1000) basePremium *= 0.85;
      
      // Add some variance
      const variance = 0.9 + Math.random() * 0.2;
      basePremium *= variance;
      
      const annualPremium = Math.round(basePremium);
      
      return {
        provider_id: provider.id,
        provider_name: provider.provider_name,
        annual_premium: annualPremium,
        monthly_premium: Math.round((annualPremium / 12) * 100) / 100,
        buildings_cover: wizardData.buildingsCoverAmount,
        contents_cover: wizardData.contentsCoverAmount,
        rent_guarantee_limit: provider.offers_rent_guarantee ? wizardData.rentGuaranteeAmount : null,
        rent_guarantee_months: provider.offers_rent_guarantee ? wizardData.rentGuaranteeMonths : null,
        legal_expenses_limit: provider.offers_legal_expenses ? wizardData.legalExpensesLimit : null,
        has_emergency_cover: provider.offers_emergency_assistance && wizardData.needsEmergencyCover,
        excess: wizardData.excessPreference,
        features: provider.key_features || [],
      };
    })
    .sort((a, b) => a.annual_premium - b.annual_premium);
}
