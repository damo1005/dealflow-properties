export interface PortfolioProperty {
  id: string;
  user_id: string;
  address: string;
  postcode: string;
  property_type: string | null;
  bedrooms: number | null;
  purchase_date: string;
  purchase_price: number;
  current_value: number | null;
  mortgage_lender: string | null;
  mortgage_amount: number | null;
  mortgage_rate: number | null;
  monthly_payment: number | null;
  tenure: string | null;
  lease_years: number | null;
  investment_strategy: string | null;
  property_status: 'let' | 'void' | 'refurbishing' | 'selling';
  total_income_ytd: number;
  total_expenses_ytd: number;
  current_yield: number | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Tenancy {
  id: string;
  portfolio_property_id: string;
  tenant_name: string;
  tenant_email: string | null;
  tenant_phone: string | null;
  start_date: string;
  end_date: string | null;
  monthly_rent: number;
  deposit_amount: number;
  deposit_scheme: string | null;
  status: 'active' | 'ended' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface RentPayment {
  id: string;
  tenancy_id: string;
  expected_date: string;
  expected_amount: number;
  actual_date: string | null;
  actual_amount: number | null;
  status: 'pending' | 'paid' | 'partial' | 'overdue' | 'late' | 'missed';
  days_late: number;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  created_at: string;
}

export interface PropertyExpense {
  id: string;
  portfolio_property_id: string;
  user_id: string;
  expense_date: string;
  amount: number;
  category: string;
  description: string;
  is_tax_deductible: boolean;
  receipt_url: string | null;
  created_at: string;
}

export interface ComplianceItem {
  id: string;
  portfolio_property_id: string;
  compliance_type: 'gas_safety' | 'epc' | 'eicr' | 'fire_safety' | 'legionella' | 'pat' | 'hmo_license' | 'other';
  certificate_number: string | null;
  issued_date: string | null;
  expiry_date: string;
  certificate_url: string | null;
  status: 'valid' | 'expiring' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface MaintenanceJob {
  id: string;
  portfolio_property_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  reported_date: string;
  scheduled_date: string | null;
  completed_date: string | null;
  estimated_cost: number | null;
  actual_cost: number | null;
  contractor_name: string | null;
  contractor_phone: string | null;
  status: 'reported' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface PortfolioSummary {
  id: string;
  user_id: string;
  total_properties: number;
  total_value: number;
  total_equity: number;
  monthly_income: number;
  monthly_expenses: number;
  monthly_cash_flow: number;
  portfolio_yield: number | null;
  occupancy_rate: number | null;
  last_updated: string;
}

export interface PortfolioPropertyWithDetails extends PortfolioProperty {
  tenancies?: Tenancy[];
  compliance_items?: ComplianceItem[];
  maintenance_jobs?: MaintenanceJob[];
}

export const COMPLIANCE_TYPES = [
  { value: 'gas_safety', label: 'Gas Safety Certificate', icon: '🔥' },
  { value: 'epc', label: 'Energy Performance Certificate (EPC)', icon: '⚡' },
  { value: 'eicr', label: 'Electrical Safety (EICR)', icon: '🔌' },
  { value: 'fire_safety', label: 'Fire Safety', icon: '🧯' },
  { value: 'legionella', label: 'Legionella Risk Assessment', icon: '💧' },
  { value: 'pat', label: 'PAT Testing', icon: '🔋' },
  { value: 'hmo_license', label: 'HMO License', icon: '📜' },
  { value: 'other', label: 'Other', icon: '📋' },
];

export const EXPENSE_CATEGORIES = [
  'Mortgage Interest',
  'Insurance',
  'Letting Agent Fees',
  'Repairs & Maintenance',
  'Service Charges',
  'Ground Rent',
  'Council Tax',
  'Utilities',
  'Cleaning',
  'Legal Fees',
  'Accountancy',
  'Travel',
  'Furniture',
  'Appliances',
  'Other',
];

export const PROPERTY_STATUSES = [
  { value: 'let', label: 'Let', color: 'bg-green-500' },
  { value: 'void', label: 'Void', color: 'bg-yellow-500' },
  { value: 'refurbishing', label: 'Refurbishing', color: 'bg-blue-500' },
  { value: 'selling', label: 'Selling', color: 'bg-purple-500' },
];
