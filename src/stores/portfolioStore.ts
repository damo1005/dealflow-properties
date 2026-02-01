import { create } from "zustand";
import type { 
  PortfolioProperty, 
  Tenancy, 
  RentPayment, 
  PropertyExpense, 
  ComplianceItem, 
  MaintenanceJob,
  PortfolioSummary 
} from "@/types/portfolio";

interface PortfolioState {
  properties: PortfolioProperty[];
  tenancies: Tenancy[];
  payments: RentPayment[];
  expenses: PropertyExpense[];
  compliance: ComplianceItem[];
  maintenance: MaintenanceJob[];
  summary: PortfolioSummary | null;
  isLoading: boolean;
  selectedPropertyId: string | null;

  setProperties: (properties: PortfolioProperty[]) => void;
  setTenancies: (tenancies: Tenancy[]) => void;
  setPayments: (payments: RentPayment[]) => void;
  setExpenses: (expenses: PropertyExpense[]) => void;
  setCompliance: (compliance: ComplianceItem[]) => void;
  setMaintenance: (maintenance: MaintenanceJob[]) => void;
  setSummary: (summary: PortfolioSummary | null) => void;
  setLoading: (loading: boolean) => void;
  setSelectedPropertyId: (id: string | null) => void;
  
  addProperty: (property: PortfolioProperty) => void;
  updateProperty: (id: string, updates: Partial<PortfolioProperty>) => void;
  deleteProperty: (id: string) => void;
  
  addTenancy: (tenancy: Tenancy) => void;
  addExpense: (expense: PropertyExpense) => void;
  addCompliance: (item: ComplianceItem) => void;
  addMaintenance: (job: MaintenanceJob) => void;
  updateMaintenance: (id: string, updates: Partial<MaintenanceJob>) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  properties: [],
  tenancies: [],
  payments: [],
  expenses: [],
  compliance: [],
  maintenance: [],
  summary: null,
  isLoading: false,
  selectedPropertyId: null,

  setProperties: (properties) => set({ properties }),
  setTenancies: (tenancies) => set({ tenancies }),
  setPayments: (payments) => set({ payments }),
  setExpenses: (expenses) => set({ expenses }),
  setCompliance: (compliance) => set({ compliance }),
  setMaintenance: (maintenance) => set({ maintenance }),
  setSummary: (summary) => set({ summary }),
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedPropertyId: (selectedPropertyId) => set({ selectedPropertyId }),

  addProperty: (property) => set((state) => ({
    properties: [property, ...state.properties],
  })),

  updateProperty: (id, updates) => set((state) => ({
    properties: state.properties.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    ),
  })),

  deleteProperty: (id) => set((state) => ({
    properties: state.properties.filter((p) => p.id !== id),
  })),

  addTenancy: (tenancy) => set((state) => ({
    tenancies: [tenancy, ...state.tenancies],
  })),

  addExpense: (expense) => set((state) => ({
    expenses: [expense, ...state.expenses],
  })),

  addCompliance: (item) => set((state) => ({
    compliance: [item, ...state.compliance],
  })),

  addMaintenance: (job) => set((state) => ({
    maintenance: [job, ...state.maintenance],
  })),

  updateMaintenance: (id, updates) => set((state) => ({
    maintenance: state.maintenance.map((j) =>
      j.id === id ? { ...j, ...updates } : j
    ),
  })),
}));

// Mock data for development
export const mockPortfolioProperties: PortfolioProperty[] = [
  {
    id: "1",
    user_id: "user1",
    address: "123 High Street, Enfield",
    postcode: "EN3 4AB",
    property_type: "Flat",
    bedrooms: 2,
    purchase_date: "2022-03-15",
    purchase_price: 235000,
    current_value: 265000,
    mortgage_lender: "Nationwide",
    mortgage_amount: 176250,
    mortgage_rate: 5.25,
    monthly_payment: 1074,
    tenure: "Freehold",
    lease_years: null,
    investment_strategy: "BTL",
    property_status: "let",
    total_income_ytd: 16200,
    total_expenses_ytd: 12888,
    current_yield: 7.8,
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "user1",
    address: "45 Oak Road, Tottenham",
    postcode: "N17 8CD",
    property_type: "Terraced",
    bedrooms: 3,
    purchase_date: "2021-08-20",
    purchase_price: 320000,
    current_value: 355000,
    mortgage_lender: "Halifax",
    mortgage_amount: 240000,
    mortgage_rate: 4.99,
    monthly_payment: 1380,
    tenure: "Freehold",
    lease_years: null,
    investment_strategy: "BTL",
    property_status: "void",
    total_income_ytd: 0,
    total_expenses_ytd: 1380,
    current_yield: 0,
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "user1",
    address: "67 Elm Street, Walthamstow",
    postcode: "E17 5EF",
    property_type: "Flat",
    bedrooms: 1,
    purchase_date: "2023-01-10",
    purchase_price: 195000,
    current_value: 205000,
    mortgage_lender: "Santander",
    mortgage_amount: 146250,
    mortgage_rate: 5.49,
    monthly_payment: 890,
    tenure: "Leasehold",
    lease_years: 85,
    investment_strategy: "BTL",
    property_status: "let",
    total_income_ytd: 12000,
    total_expenses_ytd: 10680,
    current_yield: 6.2,
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockTenancies: Tenancy[] = [
  {
    id: "t1",
    portfolio_property_id: "1",
    tenant_name: "John Smith",
    tenant_email: "john.smith@email.com",
    tenant_phone: "+44 7700 900123",
    start_date: "2022-04-01",
    end_date: "2025-03-31",
    monthly_rent: 1350,
    deposit_amount: 1350,
    deposit_scheme: "DPS",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "t2",
    portfolio_property_id: "3",
    tenant_name: "Sarah Johnson",
    tenant_email: "sarah.j@email.com",
    tenant_phone: "+44 7700 900456",
    start_date: "2023-02-01",
    end_date: "2026-01-31",
    monthly_rent: 1000,
    deposit_amount: 1000,
    deposit_scheme: "TDS",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockCompliance: ComplianceItem[] = [
  {
    id: "c1",
    portfolio_property_id: "1",
    compliance_type: "gas_safety",
    certificate_number: "GS-2024-001",
    issued_date: "2024-01-15",
    expiry_date: "2025-01-15",
    certificate_url: null,
    status: "valid",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c2",
    portfolio_property_id: "1",
    compliance_type: "epc",
    certificate_number: "EPC-123456",
    issued_date: "2022-03-01",
    expiry_date: "2032-03-01",
    certificate_url: null,
    status: "valid",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c3",
    portfolio_property_id: "2",
    compliance_type: "gas_safety",
    certificate_number: "GS-2023-045",
    issued_date: "2023-12-01",
    expiry_date: "2024-12-01",
    certificate_url: null,
    status: "expired",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c4",
    portfolio_property_id: "3",
    compliance_type: "epc",
    certificate_number: "EPC-789012",
    issued_date: "2023-01-05",
    expiry_date: "2025-02-15",
    certificate_url: null,
    status: "expiring",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockMaintenance: MaintenanceJob[] = [
  {
    id: "m1",
    portfolio_property_id: "1",
    title: "Boiler Service",
    description: "Annual boiler service required",
    category: "Heating",
    priority: "medium",
    reported_date: "2025-01-20",
    scheduled_date: "2025-02-05",
    completed_date: null,
    estimated_cost: 120,
    actual_cost: null,
    contractor_name: "ABC Heating",
    contractor_phone: "020 1234 5678",
    status: "scheduled",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m2",
    portfolio_property_id: "2",
    title: "Leaking Tap",
    description: "Kitchen tap is dripping",
    category: "Plumbing",
    priority: "low",
    reported_date: "2025-01-25",
    scheduled_date: null,
    completed_date: null,
    estimated_cost: 80,
    actual_cost: null,
    contractor_name: null,
    contractor_phone: null,
    status: "reported",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m3",
    portfolio_property_id: "1",
    title: "Broken Window Lock",
    description: "Bedroom window lock needs replacing",
    category: "Security",
    priority: "high",
    reported_date: "2025-01-28",
    scheduled_date: null,
    completed_date: null,
    estimated_cost: 150,
    actual_cost: null,
    contractor_name: null,
    contractor_phone: null,
    status: "reported",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockPortfolioSummary: PortfolioSummary = {
  id: "s1",
  user_id: "user1",
  total_properties: 3,
  total_value: 825000,
  total_equity: 262500,
  monthly_income: 2350,
  monthly_expenses: 3344,
  monthly_cash_flow: -994,
  portfolio_yield: 6.8,
  occupancy_rate: 66.7,
  last_updated: new Date().toISOString(),
};
