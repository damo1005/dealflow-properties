import { create } from 'zustand';
import type { ConveyancingFirm, ConveyancingWizardData, FirmQuote } from '@/types/conveyancing';

interface ConveyancingState {
  currentStep: number;
  wizardData: ConveyancingWizardData;
  firms: ConveyancingFirm[];
  generatedQuotes: FirmQuote[];
  isLoading: boolean;
  isGeneratingQuotes: boolean;
  
  setCurrentStep: (step: number) => void;
  updateWizardData: (data: Partial<ConveyancingWizardData>) => void;
  resetWizard: () => void;
  setFirms: (firms: ConveyancingFirm[]) => void;
  setGeneratedQuotes: (quotes: FirmQuote[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsGeneratingQuotes: (loading: boolean) => void;
}

const initialWizardData: ConveyancingWizardData = {
  transactionType: 'purchase',
  purchasePrice: 350000,
  purchasePostcode: '',
  purchasePropertyType: 'freehold',
  leaseYearsRemaining: 99,
  isFirstTimeBuyer: false,
  buyingMethod: 'mortgage',
  isBtl: true,
  isLtdCompany: false,
  chainPosition: 'no_chain',
  surveyType: 'valuation',
  salePrice: 0,
  salePostcode: '',
  salePropertyType: 'freehold',
  hasOutstandingMortgage: false,
};

export const useConveyancingStore = create<ConveyancingState>((set) => ({
  currentStep: 1,
  wizardData: initialWizardData,
  firms: [],
  generatedQuotes: [],
  isLoading: false,
  isGeneratingQuotes: false,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  updateWizardData: (data) => set((state) => ({ 
    wizardData: { ...state.wizardData, ...data } 
  })),
  resetWizard: () => set({ currentStep: 1, wizardData: initialWizardData, generatedQuotes: [] }),
  setFirms: (firms) => set({ firms }),
  setGeneratedQuotes: (quotes) => set({ generatedQuotes: quotes }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsGeneratingQuotes: (loading) => set({ isGeneratingQuotes: loading }),
}));

export function generateConveyancingQuotes(
  firms: ConveyancingFirm[], 
  wizardData: ConveyancingWizardData
): FirmQuote[] {
  const baseDisb = calculateDisbursements(wizardData);
  
  return firms
    .filter(f => f.is_active)
    .map(firm => {
      let legalFee = firm.purchase_fee_from || 699;
      
      // Adjust for transaction type
      if (wizardData.transactionType === 'sale') {
        legalFee = firm.sale_fee_from || 599;
      } else if (wizardData.transactionType === 'purchase_and_sale') {
        legalFee = (firm.purchase_fee_from || 699) + (firm.sale_fee_from || 599) - 200; // Bundle discount
      } else if (wizardData.transactionType === 'remortgage') {
        legalFee = firm.remortgage_fee_from || 299;
      }
      
      // Adjustments
      if (wizardData.purchasePropertyType === 'leasehold') legalFee += 150;
      if (wizardData.purchasePropertyType === 'new_build') legalFee += 100;
      if (wizardData.isLtdCompany) legalFee += 100;
      if (wizardData.purchasePrice > 500000) legalFee += 100;
      
      // Add variance
      const variance = 0.95 + Math.random() * 0.1;
      legalFee = Math.round(legalFee * variance);
      
      const disbursements = baseDisb + Math.round(Math.random() * 50);
      
      return {
        firm_id: firm.id,
        firm_name: firm.firm_name,
        legal_fee: legalFee,
        disbursements,
        total_cost: legalFee + disbursements,
        avg_completion_days: firm.avg_completion_days || 60,
        trustpilot_rating: firm.trustpilot_rating || 4.0,
        reviews_count: firm.reviews_count || 0,
        features: [
          firm.offers_fixed_fee ? 'Fixed fee - no hidden costs' : null,
          firm.offers_no_sale_no_fee ? 'No completion, no fee' : null,
          firm.dedicated_conveyancer ? 'Dedicated conveyancer' : null,
          firm.offers_online_tracking ? 'Online case tracking' : null,
          firm.cqs_accredited ? 'CQS Accredited' : null,
        ].filter(Boolean) as string[],
        offers_no_sale_no_fee: firm.offers_no_sale_no_fee,
        cqs_accredited: firm.cqs_accredited,
      };
    })
    .sort((a, b) => a.total_cost - b.total_cost);
}

function calculateDisbursements(wizardData: ConveyancingWizardData): number {
  let disb = 0;
  
  if (wizardData.transactionType === 'purchase' || wizardData.transactionType === 'purchase_and_sale') {
    disb += 300; // Local searches
    disb += 3;   // Land Registry search
    disb += 2;   // Bankruptcy search
    disb += 40;  // Bank transfer
    disb += 30;  // SDLT submission
    disb += 18;  // ID verification
    disb += 36;  // Copy documents
    disb += 51;  // AML checks
    
    // Land Registry fee based on price
    if (wizardData.purchasePrice <= 100000) disb += 45;
    else if (wizardData.purchasePrice <= 200000) disb += 100;
    else if (wizardData.purchasePrice <= 500000) disb += 200;
    else if (wizardData.purchasePrice <= 1000000) disb += 295;
    else disb += 500;
  }
  
  if (wizardData.transactionType === 'sale' || wizardData.transactionType === 'purchase_and_sale') {
    disb += 40;  // Bank transfer
    disb += 10;  // Title deeds
  }
  
  return disb;
}
