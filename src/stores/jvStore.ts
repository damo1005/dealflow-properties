import { create } from 'zustand';
import { JVDeal, JVPartner, JVTransaction, JVSummary } from '@/types/jv';

interface JVState {
  deals: JVDeal[];
  selectedDeal: JVDeal | null;
  transactions: JVTransaction[];
  summary: JVSummary;
  isLoading: boolean;
  
  setDeals: (deals: JVDeal[]) => void;
  setSelectedDeal: (deal: JVDeal | null) => void;
  setTransactions: (transactions: JVTransaction[]) => void;
  setSummary: (summary: JVSummary) => void;
  setIsLoading: (loading: boolean) => void;
  addDeal: (deal: JVDeal) => void;
  updateDeal: (dealId: string, updates: Partial<JVDeal>) => void;
  addTransaction: (transaction: JVTransaction) => void;
}

export const useJVStore = create<JVState>((set) => ({
  deals: [],
  selectedDeal: null,
  transactions: [],
  summary: {
    totalDeals: 0,
    activeDeals: 0,
    totalInvested: 0,
    totalEquity: 0,
    totalDistributions: 0,
  },
  isLoading: false,
  
  setDeals: (deals) => set({ deals }),
  setSelectedDeal: (selectedDeal) => set({ selectedDeal }),
  setTransactions: (transactions) => set({ transactions }),
  setSummary: (summary) => set({ summary }),
  setIsLoading: (isLoading) => set({ isLoading }),
  
  addDeal: (deal) => set((state) => ({ deals: [...state.deals, deal] })),
  
  updateDeal: (dealId, updates) => set((state) => ({
    deals: state.deals.map((d) => d.id === dealId ? { ...d, ...updates } : d),
    selectedDeal: state.selectedDeal?.id === dealId 
      ? { ...state.selectedDeal, ...updates } 
      : state.selectedDeal,
  })),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [...state.transactions, transaction],
  })),
}));

// Mock data
export const mockJVDeals: JVDeal[] = [
  {
    id: 'jv-1',
    user_id: 'user-1',
    portfolio_property_id: 'prop-1',
    deal_name: '14 Oak Street JV',
    deal_type: 'equity_split',
    deal_start_date: '2024-06-01',
    total_investment: 150000,
    status: 'active',
    created_at: new Date().toISOString(),
    property: {
      address: '14 Oak Street',
      postcode: 'M14 5AB',
      current_value: 175000,
    },
    partners: [
      {
        id: 'partner-1',
        jv_deal_id: 'jv-1',
        partner_name: 'You',
        is_self: true,
        initial_investment: 75000,
        additional_investments: 0,
        equity_percentage: 50,
        distributions_received: 8400,
        created_at: new Date().toISOString(),
      },
      {
        id: 'partner-2',
        jv_deal_id: 'jv-1',
        partner_name: 'Mike Williams',
        partner_email: 'mike@email.com',
        is_self: false,
        initial_investment: 75000,
        additional_investments: 0,
        equity_percentage: 50,
        distributions_received: 8400,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'jv-2',
    user_id: 'user-1',
    portfolio_property_id: 'prop-2',
    deal_name: 'High Street Development',
    deal_type: 'equity_split',
    deal_start_date: '2024-01-15',
    total_investment: 350000,
    status: 'active',
    created_at: new Date().toISOString(),
    property: {
      address: '28 High Street',
      postcode: 'M20 1AA',
      current_value: 380000,
    },
    partners: [
      {
        id: 'partner-3',
        jv_deal_id: 'jv-2',
        partner_name: 'You',
        is_self: true,
        initial_investment: 105000,
        additional_investments: 0,
        equity_percentage: 30,
        distributions_received: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: 'partner-4',
        jv_deal_id: 'jv-2',
        partner_name: 'James Brown',
        is_self: false,
        initial_investment: 140000,
        additional_investments: 0,
        equity_percentage: 40,
        distributions_received: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: 'partner-5',
        jv_deal_id: 'jv-2',
        partner_name: 'Lucy Chen',
        is_self: false,
        initial_investment: 105000,
        additional_investments: 0,
        equity_percentage: 30,
        distributions_received: 0,
        created_at: new Date().toISOString(),
      },
    ],
  },
];

export const mockJVTransactions: JVTransaction[] = [
  {
    id: 'tx-1',
    jv_deal_id: 'jv-1',
    transaction_type: 'distribution',
    total_amount: 4200,
    transaction_date: '2026-01-15',
    description: 'Q4 2025 rental income',
    split_type: 'by_equity',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tx-2',
    jv_deal_id: 'jv-1',
    transaction_type: 'capital_call',
    total_amount: 150000,
    transaction_date: '2024-06-01',
    description: 'Initial investment',
    split_type: 'by_equity',
    created_at: new Date().toISOString(),
  },
];

export const mockJVSummary: JVSummary = {
  totalDeals: 2,
  activeDeals: 2,
  totalInvested: 180000,
  totalEquity: 219500,
  totalDistributions: 8400,
};
