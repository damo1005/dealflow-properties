export interface RentSchedule {
  id: string;
  tenancy_id: string;
  portfolio_property_id: string;
  amount: number;
  frequency: 'weekly' | 'fortnightly' | 'monthly';
  due_day?: number;
  start_date: string;
  end_date?: string;
  payment_method?: string;
  bank_reference?: string;
  auto_detect_enabled: boolean;
  is_active: boolean;
  created_at: string;
}

export interface RentLedgerEntry {
  id: string;
  rent_schedule_id?: string;
  tenancy_id: string;
  portfolio_property_id: string;
  period_start: string;
  period_end: string;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  balance: number;
  status: 'upcoming' | 'due' | 'paid' | 'partial' | 'overdue' | 'waived';
  paid_date?: string;
  payment_method?: string;
  payment_reference?: string;
  days_late: number;
  late_fee: number;
  notes?: string;
  created_at: string;
  // Joined data
  property_address?: string;
  tenant_name?: string;
}

export interface RentReminder {
  id: string;
  user_id: string;
  reminder_type?: string;
  days_offset?: number;
  send_email: boolean;
  send_sms: boolean;
  send_notification: boolean;
  email_template?: string;
  sms_template?: string;
  is_active: boolean;
  created_at: string;
}

export interface RentCollectionSummary {
  expected_amount: number;
  collected_amount: number;
  outstanding_amount: number;
  collection_rate: number;
  tenants_overdue: number;
}
