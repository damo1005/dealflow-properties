import { create } from 'zustand';
import { Mortgage, MortgagePayment, MortgageAlert, MortgageSummary } from '@/types/mortgage';

interface MortgageTrackerState {
  mortgages: Mortgage[];
  payments: MortgagePayment[];
  isLoading: boolean;
  
  // Computed
  getAlerts: () => MortgageAlert[];
  getSummary: () => MortgageSummary;
  
  // Actions
  setMortgages: (mortgages: Mortgage[]) => void;
  addMortgage: (mortgage: Mortgage) => void;
  updateMortgage: (id: string, updates: Partial<Mortgage>) => void;
  deleteMortgage: (id: string) => void;
  addPayment: (payment: MortgagePayment) => void;
  setIsLoading: (loading: boolean) => void;
}

// Mock data for development
const mockMortgages: Mortgage[] = [
  {
    id: '1',
    user_id: 'user-1',
    portfolio_property_id: 'prop-1',
    lender_name: 'NatWest',
    account_number: '****4521',
    mortgage_type: 'btl',
    repayment_type: 'interest_only',
    original_amount: 150000,
    current_balance: 148500,
    rate_type: 'fixed',
    current_rate: 5.29,
    svr_rate: 7.99,
    deal_start_date: '2023-03-15',
    deal_end_date: '2026-03-14',
    term_years: 25,
    monthly_payment: 654,
    erc_percent: 2,
    erc_end_date: '2026-03-14',
    is_portable: true,
    overpayment_allowance: 10,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    property_address: '14 Oak Street, Manchester, M14 5TH',
  },
  {
    id: '2',
    user_id: 'user-1',
    portfolio_property_id: 'prop-2',
    lender_name: 'Barclays',
    account_number: '****8834',
    mortgage_type: 'btl',
    repayment_type: 'interest_only',
    original_amount: 200000,
    current_balance: 197200,
    rate_type: 'fixed',
    current_rate: 4.89,
    svr_rate: 8.25,
    deal_start_date: '2024-01-10',
    deal_end_date: '2026-01-09',
    term_years: 25,
    monthly_payment: 815,
    erc_percent: 3,
    erc_end_date: '2026-01-09',
    is_portable: true,
    overpayment_allowance: 10,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    property_address: '28 Victoria Road, Didsbury, M20 2QT',
  },
  {
    id: '3',
    user_id: 'user-1',
    portfolio_property_id: 'prop-3',
    lender_name: 'HSBC',
    account_number: '****2156',
    mortgage_type: 'btl',
    repayment_type: 'interest_only',
    original_amount: 180000,
    current_balance: 175000,
    rate_type: 'fixed',
    current_rate: 5.49,
    svr_rate: 7.75,
    deal_start_date: '2023-06-01',
    deal_end_date: '2026-02-28',
    term_years: 25,
    monthly_payment: 823,
    erc_percent: 1.5,
    erc_end_date: '2026-02-28',
    is_portable: false,
    overpayment_allowance: 10,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    property_address: '7 Park Avenue, Chorlton, M21 8NB',
  },
];

export const useMortgageTrackerStore = create<MortgageTrackerState>((set, get) => ({
  mortgages: mockMortgages,
  payments: [],
  isLoading: false,

  getAlerts: () => {
    const { mortgages } = get();
    const today = new Date();
    const alerts: MortgageAlert[] = [];

    mortgages.forEach((mortgage) => {
      if (mortgage.deal_end_date && mortgage.status === 'active') {
        const endDate = new Date(mortgage.deal_end_date);
        const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysRemaining <= 90 && daysRemaining > 0) {
          let severity: 'critical' | 'warning' | 'info' = 'info';
          if (daysRemaining <= 30) severity = 'critical';
          else if (daysRemaining <= 60) severity = 'warning';

          const svrImpact = mortgage.svr_rate && mortgage.current_balance
            ? ((mortgage.svr_rate - mortgage.current_rate) / 100 / 12) * mortgage.current_balance
            : undefined;

          alerts.push({
            mortgage,
            days_remaining: daysRemaining,
            severity,
            svr_impact: svrImpact,
          });
        }
      }
    });

    return alerts.sort((a, b) => a.days_remaining - b.days_remaining);
  },

  getSummary: () => {
    const { mortgages } = get();
    const activeMortgages = mortgages.filter((m) => m.status === 'active');
    
    const total_debt = activeMortgages.reduce((sum, m) => sum + m.current_balance, 0);
    const monthly_cost = activeMortgages.reduce((sum, m) => sum + (m.monthly_payment || 0), 0);
    const avg_rate = activeMortgages.length > 0
      ? activeMortgages.reduce((sum, m) => sum + m.current_rate, 0) / activeMortgages.length
      : 0;
    const annual_interest = activeMortgages.reduce((sum, m) => 
      sum + (m.current_balance * (m.current_rate / 100)), 0);

    // Calculate portfolio LTV (would need property values in real implementation)
    const estimated_portfolio_value = total_debt * 1.4; // Rough estimate
    const portfolio_ltv = estimated_portfolio_value > 0 
      ? (total_debt / estimated_portfolio_value) * 100 
      : 0;

    const alerts = get().getAlerts();
    const mortgages_expiring_soon = alerts.filter((a) => a.days_remaining <= 90).length;

    return {
      total_debt,
      monthly_cost,
      avg_rate,
      portfolio_ltv,
      annual_interest,
      mortgages_expiring_soon,
    };
  },

  setMortgages: (mortgages) => set({ mortgages }),
  
  addMortgage: (mortgage) => set((state) => ({ 
    mortgages: [...state.mortgages, mortgage] 
  })),
  
  updateMortgage: (id, updates) => set((state) => ({
    mortgages: state.mortgages.map((m) => 
      m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m
    ),
  })),
  
  deleteMortgage: (id) => set((state) => ({
    mortgages: state.mortgages.filter((m) => m.id !== id),
  })),
  
  addPayment: (payment) => set((state) => ({
    payments: [...state.payments, payment],
  })),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
