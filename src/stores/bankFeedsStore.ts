import { create } from 'zustand';
import { BankConnection, BankTransaction, BankRule } from '@/types/bankFeeds';

interface BankFeedsState {
  connections: BankConnection[];
  transactions: BankTransaction[];
  rules: BankRule[];
  isLoading: boolean;

  confirmTransaction: (id: string, propertyId: string, category: string) => void;
  ignoreTransaction: (id: string) => void;
  addRule: (rule: Omit<BankRule, 'id' | 'user_id' | 'created_at'>) => void;
  getPendingTransactions: () => BankTransaction[];
  getTransactionsByStatus: (status: string) => BankTransaction[];
}

const mockConnections: BankConnection[] = [
  {
    id: '1',
    user_id: 'current-user',
    provider: 'truelayer',
    institution_id: 'barclays',
    institution_name: 'Barclays',
    account_id: '****4521',
    account_name: 'Business Current',
    account_type: 'current',
    currency: 'GBP',
    last_synced_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sync_enabled: true,
    status: 'active',
    created_at: new Date().toISOString(),
  },
];

const mockTransactions: BankTransaction[] = [
  { id: '1', bank_connection_id: '1', user_id: 'current-user', external_id: 'ext-1', transaction_date: new Date().toISOString().split('T')[0], description: 'SMITH J STANDING ORDER', merchant_name: 'Smith J', amount: 850, transaction_type: 'credit', category_auto: 'Rent', category_confirmed: null, property_id_suggested: 'prop-1', property_id_confirmed: null, matched_transaction_id: null, status: 'pending', notes: null, created_at: new Date().toISOString() },
  { id: '2', bank_connection_id: '1', user_id: 'current-user', external_id: 'ext-2', transaction_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], description: 'BRITISH GAS', merchant_name: 'British Gas', amount: -67.50, transaction_type: 'debit', category_auto: 'Utilities', category_confirmed: null, property_id_suggested: null, property_id_confirmed: null, matched_transaction_id: null, status: 'pending', notes: null, created_at: new Date().toISOString() },
  { id: '3', bank_connection_id: '1', user_id: 'current-user', external_id: 'ext-3', transaction_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], description: 'SIMPLY BUSINESS', merchant_name: 'Simply Business', amount: -285, transaction_type: 'debit', category_auto: 'Insurance', category_confirmed: 'Insurance', property_id_suggested: 'prop-1', property_id_confirmed: 'prop-1', matched_transaction_id: 'tx-123', status: 'matched', notes: null, created_at: new Date().toISOString() },
  { id: '4', bank_connection_id: '1', user_id: 'current-user', external_id: 'ext-4', transaction_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], description: 'NATIONWIDE MORT', merchant_name: 'Nationwide', amount: -542.50, transaction_type: 'debit', category_auto: 'Mortgage', category_confirmed: null, property_id_suggested: 'prop-1', property_id_confirmed: null, matched_transaction_id: null, status: 'pending', notes: null, created_at: new Date().toISOString() },
];

const mockRules: BankRule[] = [
  { id: '1', user_id: 'current-user', rule_name: 'Rent from Smith', match_type: 'contains', match_value: 'SMITH J', assign_property_id: 'prop-1', assign_category: 'Rent Income', auto_create: true, is_active: true, created_at: new Date().toISOString() },
  { id: '2', user_id: 'current-user', rule_name: 'Insurance', match_type: 'contains', match_value: 'SIMPLY BUSINESS', assign_property_id: null, assign_category: 'Insurance', auto_create: false, is_active: true, created_at: new Date().toISOString() },
];

export const useBankFeedsStore = create<BankFeedsState>((set, get) => ({
  connections: mockConnections,
  transactions: mockTransactions,
  rules: mockRules,
  isLoading: false,

  confirmTransaction: (id, propertyId, category) => {
    set((state) => ({
      transactions: state.transactions.map(t =>
        t.id === id
          ? { ...t, status: 'created' as const, property_id_confirmed: propertyId, category_confirmed: category }
          : t
      ),
    }));
  },

  ignoreTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.map(t =>
        t.id === id ? { ...t, status: 'ignored' as const } : t
      ),
    }));
  },

  addRule: (rule) => {
    const newRule: BankRule = {
      ...rule,
      id: crypto.randomUUID(),
      user_id: 'current-user',
      created_at: new Date().toISOString(),
    };
    set((state) => ({ rules: [...state.rules, newRule] }));
  },

  getPendingTransactions: () => get().transactions.filter(t => t.status === 'pending'),
  getTransactionsByStatus: (status) => get().transactions.filter(t => t.status === status),
}));
