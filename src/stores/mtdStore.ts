import { create } from 'zustand';
import type { MTDObligation, MTDSubmission, MTDSettings, IncomeBreakdown, ExpenseBreakdown } from '@/types/mtd';

// Mock data
const mockObligations: MTDObligation[] = [
  {
    id: '1',
    user_id: 'user-1',
    tax_year: '2025-26',
    quarter: 1,
    period_start: '2025-04-06',
    period_end: '2025-07-05',
    due_date: '2025-08-05',
    status: 'submitted',
    submitted_at: '2025-07-28T10:00:00Z',
    hmrc_reference: 'HMRC-Q1-2025-ABC123',
    created_at: '2025-04-06T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'user-1',
    tax_year: '2025-26',
    quarter: 2,
    period_start: '2025-07-06',
    period_end: '2025-10-05',
    due_date: '2025-11-05',
    status: 'submitted',
    submitted_at: '2025-10-30T14:00:00Z',
    hmrc_reference: 'HMRC-Q2-2025-DEF456',
    created_at: '2025-07-06T00:00:00Z',
  },
  {
    id: '3',
    user_id: 'user-1',
    tax_year: '2025-26',
    quarter: 3,
    period_start: '2025-10-06',
    period_end: '2026-01-05',
    due_date: '2026-02-05',
    status: 'pending',
    submitted_at: null,
    hmrc_reference: null,
    created_at: '2025-10-06T00:00:00Z',
  },
  {
    id: '4',
    user_id: 'user-1',
    tax_year: '2025-26',
    quarter: 4,
    period_start: '2026-01-06',
    period_end: '2026-04-05',
    due_date: '2026-05-05',
    status: 'pending',
    submitted_at: null,
    hmrc_reference: null,
    created_at: '2026-01-06T00:00:00Z',
  },
];

const mockSettings: MTDSettings = {
  id: '1',
  user_id: 'user-1',
  hmrc_connected: false,
  nino_encrypted: null,
  utr_encrypted: null,
  business_name: 'Property Investments Ltd',
  accounting_type: 'cash',
  auto_categorise: true,
  reminder_days_before: 14,
  created_at: '2025-01-01T00:00:00Z',
};

interface MTDState {
  obligations: MTDObligation[];
  submissions: MTDSubmission[];
  settings: MTDSettings | null;
  isLoading: boolean;

  // Actions
  setObligations: (obligations: MTDObligation[]) => void;
  setSubmissions: (submissions: MTDSubmission[]) => void;
  setSettings: (settings: MTDSettings) => void;
  setIsLoading: (loading: boolean) => void;

  // Helpers
  getUpcomingObligation: () => MTDObligation | null;
  getDaysUntilDue: (obligation: MTDObligation) => number;
  calculateQuarterlyTotals: (obligationId: string) => { income: number; expenses: number; profit: number };
}

export const useMTDStore = create<MTDState>((set, get) => ({
  obligations: mockObligations,
  submissions: [],
  settings: mockSettings,
  isLoading: false,

  setObligations: (obligations) => set({ obligations }),
  setSubmissions: (submissions) => set({ submissions }),
  setSettings: (settings) => set({ settings }),
  setIsLoading: (isLoading) => set({ isLoading }),

  getUpcomingObligation: () => {
    const { obligations } = get();
    return obligations.find(o => o.status === 'pending') || null;
  },

  getDaysUntilDue: (obligation) => {
    const dueDate = new Date(obligation.due_date);
    const now = new Date();
    return Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  },

  calculateQuarterlyTotals: () => {
    // Mock calculation - would come from actual transactions
    return {
      income: 10200,
      expenses: 3770,
      profit: 6430,
    };
  },
}));
