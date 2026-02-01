export type BankConnectionStatus = 'active' | 'expired' | 'revoked';
export type BankTransactionStatus = 'pending' | 'matched' | 'created' | 'ignored';
export type TransactionType = 'credit' | 'debit';

export interface BankConnection {
  id: string;
  user_id: string;
  provider: string;
  institution_id: string | null;
  institution_name: string | null;
  account_id: string | null;
  account_name: string | null;
  account_type: string | null;
  currency: string;
  last_synced_at: string | null;
  sync_enabled: boolean;
  status: BankConnectionStatus;
  created_at: string;
}

export interface BankTransaction {
  id: string;
  bank_connection_id: string;
  user_id: string;
  external_id: string | null;
  transaction_date: string;
  description: string | null;
  merchant_name: string | null;
  amount: number;
  transaction_type: TransactionType | null;
  category_auto: string | null;
  category_confirmed: string | null;
  property_id_suggested: string | null;
  property_id_confirmed: string | null;
  matched_transaction_id: string | null;
  status: BankTransactionStatus;
  notes: string | null;
  created_at: string;
}

export interface BankRule {
  id: string;
  user_id: string;
  rule_name: string | null;
  match_type: 'contains' | 'exact' | 'regex';
  match_value: string;
  assign_property_id: string | null;
  assign_category: string | null;
  auto_create: boolean;
  is_active: boolean;
  created_at: string;
}
