import { create } from 'zustand';

export interface MortgageProduct {
  id: string;
  lender: string;
  product_name: string;
  rate: number;
  initial_rate_period: number;
  mortgage_type: string;
  rate_type: string;
  max_ltv: number;
  min_loan: number;
  max_loan: number;
  product_fee: number;
  cashback: number;
  is_active: boolean;
}

export interface MortgageComparison {
  id: string;
  user_id: string;
  property_id?: string;
  loan_amount: number;
  property_value: number;
  ltv: number;
  mortgage_type: string;
  term_years: number;
  results?: MortgageProduct[];
  best_rate?: number;
  created_at: string;
}

export interface MortgageReferral {
  id: string;
  user_id: string;
  comparison_id?: string;
  product_id?: string;
  partner: string;
  loan_amount: number;
  lender_name: string;
  rate: number;
  referral_url: string;
  referral_code: string;
  status: 'clicked' | 'applied' | 'approved' | 'completed' | 'rejected';
  commission_amount?: number;
  commission_paid: boolean;
  created_at: string;
}

interface MortgageState {
  // Search params
  propertyValue: number;
  loanAmount: number;
  ltv: number;
  mortgageType: 'btl' | 'residential' | 'remortgage';
  termYears: number;
  
  // Filters
  rateType: 'all' | 'fixed' | 'variable' | 'tracker';
  fixedPeriod: 'all' | '2' | '3' | '5';
  maxFee: number | null;
  sortBy: 'rate' | 'fee' | 'monthly' | 'total';
  
  // Results
  products: MortgageProduct[];
  isLoading: boolean;
  
  // Actions
  setPropertyValue: (value: number) => void;
  setLoanAmount: (value: number) => void;
  setMortgageType: (type: 'btl' | 'residential' | 'remortgage') => void;
  setTermYears: (years: number) => void;
  setRateType: (type: 'all' | 'fixed' | 'variable' | 'tracker') => void;
  setFixedPeriod: (period: 'all' | '2' | '3' | '5') => void;
  setMaxFee: (fee: number | null) => void;
  setSortBy: (sort: 'rate' | 'fee' | 'monthly' | 'total') => void;
  setProducts: (products: MortgageProduct[]) => void;
  setIsLoading: (loading: boolean) => void;
  calculateMonthlyPayment: (loanAmount: number, rate: number, termYears: number) => number;
  reset: () => void;
}

const initialState = {
  propertyValue: 250000,
  loanAmount: 187500,
  ltv: 75,
  mortgageType: 'btl' as const,
  termYears: 25,
  rateType: 'all' as const,
  fixedPeriod: 'all' as const,
  maxFee: null,
  sortBy: 'rate' as const,
  products: [],
  isLoading: false,
};

export const useMortgageStore = create<MortgageState>((set, get) => ({
  ...initialState,

  setPropertyValue: (value) => {
    const ltv = (get().loanAmount / value) * 100;
    set({ propertyValue: value, ltv: Math.round(ltv * 100) / 100 });
  },

  setLoanAmount: (value) => {
    const ltv = (value / get().propertyValue) * 100;
    set({ loanAmount: value, ltv: Math.round(ltv * 100) / 100 });
  },

  setMortgageType: (type) => set({ mortgageType: type }),
  setTermYears: (years) => set({ termYears: years }),
  setRateType: (type) => set({ rateType: type }),
  setFixedPeriod: (period) => set({ fixedPeriod: period }),
  setMaxFee: (fee) => set({ maxFee: fee }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setProducts: (products) => set({ products }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  calculateMonthlyPayment: (loanAmount, rate, termYears) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = termYears * 12;
    
    if (monthlyRate === 0) return loanAmount / numPayments;
    
    const payment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return Math.round(payment);
  },

  reset: () => set(initialState),
}));
