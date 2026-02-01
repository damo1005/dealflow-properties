import { create } from 'zustand';
import type { DepositProtection, DepositDeduction } from '@/types/deposits';

// Mock data
const mockDeposits: DepositProtection[] = [
  {
    id: '1',
    tenant_name: 'James Wilson',
    tenant_email: 'james.wilson@email.com',
    portfolio_property_id: 'prop-1',
    user_id: 'user-1',
    amount: 850,
    deposit_type: 'security',
    scheme: 'dps',
    scheme_reference: null,
    received_date: '2026-01-27',
    protected_date: null,
    protection_deadline: '2026-02-26',
    certificate_issued_date: null,
    certificate_url: null,
    prescribed_info_served: false,
    prescribed_info_date: null,
    status: 'pending',
    return_date: null,
    amount_returned: null,
    deductions: [],
    dispute_raised: false,
    dispute_date: null,
    dispute_outcome: null,
    created_at: '2026-01-27T10:00:00Z',
    property_address: '14 Oak Street, M14 2AB',
  },
  {
    id: '2',
    tenant_name: 'Sarah Brown',
    tenant_email: 'sarah.brown@email.com',
    portfolio_property_id: 'prop-2',
    user_id: 'user-1',
    amount: 1200,
    deposit_type: 'security',
    scheme: 'dps',
    scheme_reference: 'DPS-12345678',
    received_date: '2024-06-01',
    protected_date: '2024-06-15',
    protection_deadline: '2024-07-01',
    certificate_issued_date: '2024-06-15',
    certificate_url: '/certificates/dps-12345678.pdf',
    prescribed_info_served: true,
    prescribed_info_date: '2024-06-15',
    status: 'protected',
    return_date: null,
    amount_returned: null,
    deductions: [],
    dispute_raised: false,
    dispute_date: null,
    dispute_outcome: null,
    created_at: '2024-06-01T10:00:00Z',
    property_address: '28 Victoria Road, M20 4BW',
  },
  {
    id: '3',
    tenant_name: 'Michael Chen',
    tenant_email: 'michael.chen@email.com',
    portfolio_property_id: 'prop-3',
    user_id: 'user-1',
    amount: 1350,
    deposit_type: 'security',
    scheme: 'tds',
    scheme_reference: 'TDS-87654321',
    received_date: '2025-03-01',
    protected_date: '2025-03-10',
    protection_deadline: '2025-03-31',
    certificate_issued_date: '2025-03-10',
    certificate_url: '/certificates/tds-87654321.pdf',
    prescribed_info_served: true,
    prescribed_info_date: '2025-03-10',
    status: 'protected',
    return_date: null,
    amount_returned: null,
    deductions: [],
    dispute_raised: false,
    dispute_date: null,
    dispute_outcome: null,
    created_at: '2025-03-01T10:00:00Z',
    property_address: '7 Park Avenue, M19 1CD',
  },
];

interface DepositsState {
  deposits: DepositProtection[];
  isLoading: boolean;
  selectedDeposit: DepositProtection | null;

  // Actions
  setDeposits: (deposits: DepositProtection[]) => void;
  setIsLoading: (loading: boolean) => void;
  setSelectedDeposit: (deposit: DepositProtection | null) => void;
  addDeposit: (deposit: DepositProtection) => void;
  updateDeposit: (id: string, data: Partial<DepositProtection>) => void;

  // Helpers
  getPendingDeposits: () => DepositProtection[];
  getProtectedDeposits: () => DepositProtection[];
  getUrgentDeposits: (daysThreshold?: number) => DepositProtection[];
  getTotalHeld: () => number;
}

export const useDepositsStore = create<DepositsState>((set, get) => ({
  deposits: mockDeposits,
  isLoading: false,
  selectedDeposit: null,

  setDeposits: (deposits) => set({ deposits }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedDeposit: (selectedDeposit) => set({ selectedDeposit }),
  
  addDeposit: (deposit) => set((state) => ({ 
    deposits: [...state.deposits, deposit] 
  })),
  
  updateDeposit: (id, data) => set((state) => ({
    deposits: state.deposits.map(d => d.id === id ? { ...d, ...data } : d),
  })),

  getPendingDeposits: () => {
    return get().deposits.filter(d => d.status === 'pending');
  },

  getProtectedDeposits: () => {
    return get().deposits.filter(d => d.status === 'protected');
  },

  getUrgentDeposits: (daysThreshold = 14) => {
    const now = new Date();
    return get().deposits.filter(d => {
      if (d.status !== 'pending' || !d.protection_deadline) return false;
      const deadline = new Date(d.protection_deadline);
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft <= daysThreshold;
    });
  },

  getTotalHeld: () => {
    return get().deposits
      .filter(d => d.status === 'protected' || d.status === 'pending')
      .reduce((sum, d) => sum + d.amount, 0);
  },
}));
