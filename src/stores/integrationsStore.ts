import { create } from 'zustand';
import { APIIntegration, UserIntegration, IntegrationReview } from '@/types/integrations';

interface IntegrationsState {
  integrations: APIIntegration[];
  userIntegrations: UserIntegration[];
  reviews: IntegrationReview[];
  isLoading: boolean;
  selectedCategory: string | null;
  
  setCategory: (category: string | null) => void;
  connectIntegration: (integrationId: string) => void;
  disconnectIntegration: (integrationId: string) => void;
  getConnectedIntegrations: () => APIIntegration[];
  getIntegrationsByCategory: (category?: string | null) => APIIntegration[];
}

const mockIntegrations: APIIntegration[] = [
  { id: '1', name: 'Xero Accounting', slug: 'xero', description: 'Sync transactions, invoices, and reports to Xero automatically', long_description: null, developer_name: 'Xero Limited', developer_url: 'https://xero.com', category: 'accounting', icon_url: null, screenshots: [], is_free: true, monthly_price: null, install_count: 2450, avg_rating: 4.80, review_count: 124, status: 'active', auth_url: null, webhook_url: null, docs_url: null, created_at: new Date().toISOString() },
  { id: '2', name: 'QuickBooks', slug: 'quickbooks', description: 'Two-way sync with QuickBooks Online for seamless accounting', long_description: null, developer_name: 'Intuit', developer_url: 'https://quickbooks.intuit.com', category: 'accounting', icon_url: null, screenshots: [], is_free: true, monthly_price: null, install_count: 1890, avg_rating: 4.60, review_count: 89, status: 'active', auth_url: null, webhook_url: null, docs_url: null, created_at: new Date().toISOString() },
  { id: '3', name: 'Zapier', slug: 'zapier', description: 'Connect to 5,000+ apps with automated workflows', long_description: null, developer_name: 'Zapier Inc', developer_url: 'https://zapier.com', category: 'utilities', icon_url: null, screenshots: [], is_free: true, monthly_price: null, install_count: 3120, avg_rating: 4.90, review_count: 201, status: 'active', auth_url: null, webhook_url: null, docs_url: null, created_at: new Date().toISOString() },
  { id: '4', name: 'Slack', slug: 'slack', description: 'Get property alerts and updates directly in Slack', long_description: null, developer_name: 'Slack Technologies', developer_url: 'https://slack.com', category: 'communication', icon_url: null, screenshots: [], is_free: true, monthly_price: null, install_count: 1560, avg_rating: 4.70, review_count: 78, status: 'active', auth_url: null, webhook_url: null, docs_url: null, created_at: new Date().toISOString() },
  { id: '5', name: 'Google Calendar', slug: 'google-calendar', description: 'Sync viewings, inspections, and compliance dates', long_description: null, developer_name: 'Google', developer_url: 'https://calendar.google.com', category: 'utilities', icon_url: null, screenshots: [], is_free: true, monthly_price: null, install_count: 2890, avg_rating: 4.90, review_count: 156, status: 'active', auth_url: null, webhook_url: null, docs_url: null, created_at: new Date().toISOString() },
  { id: '6', name: 'Mailchimp', slug: 'mailchimp', description: 'Sync tenant data for email marketing campaigns', long_description: null, developer_name: 'Mailchimp', developer_url: 'https://mailchimp.com', category: 'marketing', icon_url: null, screenshots: [], is_free: true, monthly_price: null, install_count: 890, avg_rating: 4.40, review_count: 45, status: 'active', auth_url: null, webhook_url: null, docs_url: null, created_at: new Date().toISOString() },
  { id: '7', name: 'Dropbox', slug: 'dropbox', description: 'Auto-backup documents and photos to Dropbox', long_description: null, developer_name: 'Dropbox Inc', developer_url: 'https://dropbox.com', category: 'storage', icon_url: null, screenshots: [], is_free: true, monthly_price: null, install_count: 1230, avg_rating: 4.60, review_count: 67, status: 'active', auth_url: null, webhook_url: null, docs_url: null, created_at: new Date().toISOString() },
  { id: '8', name: 'Google Drive', slug: 'google-drive', description: 'Store and sync all your property documents', long_description: null, developer_name: 'Google', developer_url: 'https://drive.google.com', category: 'storage', icon_url: null, screenshots: [], is_free: true, monthly_price: null, install_count: 1890, avg_rating: 4.70, review_count: 89, status: 'active', auth_url: null, webhook_url: null, docs_url: null, created_at: new Date().toISOString() },
  { id: '9', name: 'FreeAgent', slug: 'freeagent', description: 'Sync with FreeAgent for small business accounting', long_description: null, developer_name: 'FreeAgent', developer_url: 'https://freeagent.com', category: 'accounting', icon_url: null, screenshots: [], is_free: true, monthly_price: null, install_count: 650, avg_rating: 4.50, review_count: 34, status: 'active', auth_url: null, webhook_url: null, docs_url: null, created_at: new Date().toISOString() },
  { id: '10', name: 'HubSpot CRM', slug: 'hubspot', description: 'Manage leads and contacts with HubSpot integration', long_description: null, developer_name: 'HubSpot', developer_url: 'https://hubspot.com', category: 'crm', icon_url: null, screenshots: [], is_free: true, monthly_price: null, install_count: 420, avg_rating: 4.50, review_count: 23, status: 'active', auth_url: null, webhook_url: null, docs_url: null, created_at: new Date().toISOString() },
];

export const useIntegrationsStore = create<IntegrationsState>((set, get) => ({
  integrations: mockIntegrations,
  userIntegrations: [],
  reviews: [],
  isLoading: false,
  selectedCategory: null,

  setCategory: (category) => set({ selectedCategory: category }),

  connectIntegration: (integrationId) => {
    const existing = get().userIntegrations.find(ui => ui.integration_id === integrationId);
    if (existing) return;

    const userIntegration: UserIntegration = {
      id: crypto.randomUUID(),
      user_id: 'current-user',
      integration_id: integrationId,
      is_connected: true,
      settings: {},
      last_sync_at: new Date().toISOString(),
      sync_status: 'synced',
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      userIntegrations: [...state.userIntegrations, userIntegration],
      integrations: state.integrations.map(i => 
        i.id === integrationId ? { ...i, install_count: i.install_count + 1 } : i
      ),
    }));
  },

  disconnectIntegration: (integrationId) => {
    set((state) => ({
      userIntegrations: state.userIntegrations.filter(ui => ui.integration_id !== integrationId),
    }));
  },

  getConnectedIntegrations: () => {
    const { integrations, userIntegrations } = get();
    const connectedIds = userIntegrations.filter(ui => ui.is_connected).map(ui => ui.integration_id);
    return integrations.filter(i => connectedIds.includes(i.id));
  },

  getIntegrationsByCategory: (category) => {
    const { integrations } = get();
    if (!category) return integrations;
    return integrations.filter(i => i.category === category);
  },
}));
