import { create } from 'zustand';
import { RentSchedule, RentLedgerEntry, RentReminder, RentCollectionSummary } from '@/types/rentCollection';

interface RentCollectionState {
  schedules: RentSchedule[];
  ledger: RentLedgerEntry[];
  reminders: RentReminder[];
  isLoading: boolean;
  
  setSchedules: (schedules: RentSchedule[]) => void;
  setLedger: (ledger: RentLedgerEntry[]) => void;
  setReminders: (reminders: RentReminder[]) => void;
  
  recordPayment: (entryId: string, amount: number, date: string, method: string, reference?: string) => void;
  
  getSummary: () => RentCollectionSummary;
  setIsLoading: (loading: boolean) => void;
}

const mockLedger: RentLedgerEntry[] = [
  {
    id: '1',
    tenancy_id: 't1',
    portfolio_property_id: 'prop-1',
    period_start: '2026-02-01',
    period_end: '2026-02-28',
    due_date: '2026-02-01',
    amount_due: 850,
    amount_paid: 850,
    balance: 0,
    status: 'paid',
    paid_date: '2026-02-01',
    payment_method: 'standing_order',
    payment_reference: 'SO-REF-001',
    days_late: 0,
    late_fee: 0,
    property_address: '14 Oak Street, Manchester',
    tenant_name: 'John Smith',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    tenancy_id: 't2',
    portfolio_property_id: 'prop-2',
    period_start: '2026-02-01',
    period_end: '2026-02-28',
    due_date: '2026-02-01',
    amount_due: 950,
    amount_paid: 0,
    balance: 950,
    status: 'overdue',
    days_late: 5,
    late_fee: 0,
    property_address: '28 Victoria Road, Didsbury',
    tenant_name: 'Mary Jones',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    tenancy_id: 't3',
    portfolio_property_id: 'prop-3',
    period_start: '2026-02-01',
    period_end: '2026-02-28',
    due_date: '2026-02-01',
    amount_due: 775,
    amount_paid: 775,
    balance: 0,
    status: 'paid',
    paid_date: '2026-01-31',
    payment_method: 'bank_transfer',
    days_late: 0,
    late_fee: 0,
    property_address: '7 Park Avenue, Chorlton',
    tenant_name: 'Sarah Brown',
    created_at: new Date().toISOString(),
  },
];

const mockReminders: RentReminder[] = [
  { id: '1', user_id: 'user-1', reminder_type: 'upcoming', days_offset: -3, send_email: true, send_sms: false, send_notification: true, is_active: true, created_at: new Date().toISOString() },
  { id: '2', user_id: 'user-1', reminder_type: 'due', days_offset: 0, send_email: true, send_sms: false, send_notification: true, is_active: true, created_at: new Date().toISOString() },
  { id: '3', user_id: 'user-1', reminder_type: 'overdue', days_offset: 3, send_email: true, send_sms: false, send_notification: true, is_active: true, created_at: new Date().toISOString() },
  { id: '4', user_id: 'user-1', reminder_type: 'overdue', days_offset: 7, send_email: true, send_sms: true, send_notification: true, is_active: true, created_at: new Date().toISOString() },
];

export const useRentCollectionStore = create<RentCollectionState>((set, get) => ({
  schedules: [],
  ledger: mockLedger,
  reminders: mockReminders,
  isLoading: false,

  setSchedules: (schedules) => set({ schedules }),
  setLedger: (ledger) => set({ ledger }),
  setReminders: (reminders) => set({ reminders }),

  recordPayment: (entryId, amount, date, method, reference) => set((state) => ({
    ledger: state.ledger.map((entry) => {
      if (entry.id !== entryId) return entry;
      
      const newAmountPaid = entry.amount_paid + amount;
      const newBalance = entry.amount_due - newAmountPaid;
      const newStatus = newBalance <= 0 ? 'paid' : newBalance < entry.amount_due ? 'partial' : entry.status;
      
      return {
        ...entry,
        amount_paid: newAmountPaid,
        balance: newBalance,
        status: newStatus as RentLedgerEntry['status'],
        paid_date: date,
        payment_method: method,
        payment_reference: reference,
      };
    }),
  })),

  getSummary: () => {
    const { ledger } = get();
    const currentMonth = ledger.filter((e) => {
      const dueDate = new Date(e.due_date);
      const now = new Date();
      return dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
    });

    const expected = currentMonth.reduce((sum, e) => sum + e.amount_due, 0);
    const collected = currentMonth.reduce((sum, e) => sum + e.amount_paid, 0);
    const outstanding = expected - collected;
    const overdueCount = currentMonth.filter((e) => e.status === 'overdue').length;

    return {
      expected_amount: expected,
      collected_amount: collected,
      outstanding_amount: outstanding,
      collection_rate: expected > 0 ? (collected / expected) * 100 : 0,
      tenants_overdue: overdueCount,
    };
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
}));
