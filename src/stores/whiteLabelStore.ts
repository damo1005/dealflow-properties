import { create } from 'zustand';
import { WhiteLabelConfig, AgentClient, AgentSummary } from '@/types/whiteLabel';

interface WhiteLabelState {
  config: WhiteLabelConfig | null;
  clients: AgentClient[];
  isLoading: boolean;
  
  setConfig: (config: WhiteLabelConfig | null) => void;
  updateConfig: (updates: Partial<WhiteLabelConfig>) => void;
  
  setClients: (clients: AgentClient[]) => void;
  addClient: (client: AgentClient) => void;
  updateClient: (id: string, updates: Partial<AgentClient>) => void;
  deleteClient: (id: string) => void;
  
  getSummary: () => AgentSummary;
  setIsLoading: (loading: boolean) => void;
}

const mockConfig: WhiteLabelConfig = {
  id: '1',
  user_id: 'user-1',
  company_name: 'ABC Lettings Ltd',
  company_logo_url: '',
  company_website: 'https://abclettings.co.uk',
  primary_color: '#1e40af',
  secondary_color: '#3b82f6',
  accent_color: '#10b981',
  custom_domain: 'portal.abclettings.co.uk',
  domain_verified: true,
  features_enabled: { tenant_screening: true, rent_collection: true, maintenance: true },
  max_clients: 50,
  max_properties_per_client: 20,
  subscription_tier: 'agent_pro',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockClients: AgentClient[] = [
  {
    id: '1',
    agent_id: 'user-1',
    client_name: 'John Smith',
    client_email: 'john@email.com',
    client_phone: '07700 900111',
    access_level: 'view_only',
    property_count: 4,
    management_fee_percent: 10,
    fee_type: 'percentage',
    status: 'active',
    contract_start_date: '2024-01-15',
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    agent_id: 'user-1',
    client_name: 'Sarah Williams',
    client_email: 'sarah.w@email.com',
    client_phone: '07700 900222',
    access_level: 'view_only',
    property_count: 2,
    management_fee_percent: 12,
    fee_type: 'percentage',
    status: 'active',
    contract_start_date: '2024-06-01',
    created_at: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    agent_id: 'user-1',
    client_name: 'David Brown',
    client_email: 'david.b@email.com',
    access_level: 'limited',
    property_count: 6,
    management_fee_percent: 8,
    fee_type: 'percentage',
    status: 'active',
    contract_start_date: '2023-09-15',
    created_at: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useWhiteLabelStore = create<WhiteLabelState>((set, get) => ({
  config: mockConfig,
  clients: mockClients,
  isLoading: false,

  setConfig: (config) => set({ config }),
  
  updateConfig: (updates) => set((state) => ({
    config: state.config ? { ...state.config, ...updates, updated_at: new Date().toISOString() } : null,
  })),

  setClients: (clients) => set({ clients }),
  
  addClient: (client) => set((state) => ({
    clients: [client, ...state.clients],
  })),
  
  updateClient: (id, updates) => set((state) => ({
    clients: state.clients.map((c) =>
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    ),
  })),
  
  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id),
  })),

  getSummary: () => {
    const { clients } = get();
    const activeClients = clients.filter((c) => c.status === 'active');
    const totalProperties = activeClients.reduce((sum, c) => sum + c.property_count, 0);
    
    // Mock monthly fees calculation
    const monthlyFees = activeClients.reduce((sum, c) => {
      const avgRent = 900;
      const fee = c.management_fee_percent ? (avgRent * c.property_count * c.management_fee_percent) / 100 : 0;
      return sum + fee;
    }, 0);

    return {
      active_clients: activeClients.length,
      properties_managed: totalProperties,
      monthly_fees: Math.round(monthlyFees),
    };
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
}));
