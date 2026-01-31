import { create } from 'zustand';

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  filters: Record<string, unknown>;
  alerts_enabled: boolean;
  notification_frequency: 'instant' | 'daily' | 'weekly' | 'manual';
  paused: boolean;
  digest_time: string;
  max_properties_per_email: number;
  new_matches_count: number;
  total_matches_count: number;
  last_alert_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'new_match' | 'price_drop' | 'back_on_market' | 'digest';
  title: string;
  message?: string;
  property_id?: string;
  property_address?: string;
  property_price?: number;
  property_image?: string;
  saved_search_id?: string;
  read: boolean;
  clicked: boolean;
  created_at: string;
}

export interface UserNotificationPreferences {
  global_notifications_enabled: boolean;
  email_notifications_enabled: boolean;
  in_app_notifications_enabled: boolean;
  default_digest_time: string;
  max_emails_per_day: number;
}

interface SavedSearchesState {
  searches: SavedSearch[];
  notifications: Notification[];
  preferences: UserNotificationPreferences;
  isLoading: boolean;
  selectedSearchId: string | null;
  showCreateModal: boolean;
  
  // Actions
  setSearches: (searches: SavedSearch[]) => void;
  addSearch: (search: SavedSearch) => void;
  updateSearch: (id: string, updates: Partial<SavedSearch>) => void;
  deleteSearch: (id: string) => void;
  duplicateSearch: (id: string) => void;
  togglePause: (id: string) => void;
  
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  
  setPreferences: (preferences: Partial<UserNotificationPreferences>) => void;
  
  setSelectedSearchId: (id: string | null) => void;
  setShowCreateModal: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

const defaultPreferences: UserNotificationPreferences = {
  global_notifications_enabled: true,
  email_notifications_enabled: true,
  in_app_notifications_enabled: true,
  default_digest_time: '09:00',
  max_emails_per_day: 5,
};

// Mock data for demo
const mockSearches: SavedSearch[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'High Yield Manchester',
    description: 'Properties with 7%+ yield in Manchester area',
    filters: {
      location: 'Manchester',
      minYield: 7,
      maxPrice: 250000,
      propertyTypes: ['Terraced', 'Semi-detached'],
    },
    alerts_enabled: true,
    notification_frequency: 'daily',
    paused: false,
    digest_time: '09:00',
    max_properties_per_email: 10,
    new_matches_count: 3,
    total_matches_count: 47,
    last_alert_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'BMV Opportunities',
    description: 'Below market value properties nationwide',
    filters: {
      priceReduced: true,
      minDiscount: 10,
    },
    alerts_enabled: true,
    notification_frequency: 'instant',
    paused: false,
    digest_time: '09:00',
    max_properties_per_email: 5,
    new_matches_count: 0,
    total_matches_count: 23,
    last_alert_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'user-1',
    name: 'HMO Candidates',
    description: '4+ bed properties suitable for HMO conversion',
    filters: {
      minBedrooms: 4,
      propertyTypes: ['Detached', 'Semi-detached'],
      maxPrice: 400000,
    },
    alerts_enabled: false,
    notification_frequency: 'weekly',
    paused: true,
    digest_time: '09:00',
    max_properties_per_email: 10,
    new_matches_count: 5,
    total_matches_count: 12,
    last_alert_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    user_id: 'user-1',
    type: 'new_match',
    title: 'New Property Match',
    message: '123 Oak Street, Manchester - £245,000',
    property_address: '123 Oak Street, Manchester',
    property_price: 245000,
    property_image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    saved_search_id: '1',
    read: false,
    clicked: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'n2',
    user_id: 'user-1',
    type: 'price_drop',
    title: 'Price Reduced',
    message: '45 Victoria Road, Birmingham dropped by £15,000',
    property_address: '45 Victoria Road, Birmingham',
    property_price: 189000,
    read: false,
    clicked: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'n3',
    user_id: 'user-1',
    type: 'new_match',
    title: 'New Property Match',
    message: '78 Park Lane, Leeds - £425,000',
    property_address: '78 Park Lane, Leeds',
    property_price: 425000,
    saved_search_id: '2',
    read: true,
    clicked: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const useSavedSearchesStore = create<SavedSearchesState>((set) => ({
  searches: mockSearches,
  notifications: mockNotifications,
  preferences: defaultPreferences,
  isLoading: false,
  selectedSearchId: null,
  showCreateModal: false,
  
  setSearches: (searches) => set({ searches }),
  addSearch: (search) => set((state) => ({ searches: [search, ...state.searches] })),
  updateSearch: (id, updates) => set((state) => ({
    searches: state.searches.map((s) => (s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s)),
  })),
  deleteSearch: (id) => set((state) => ({
    searches: state.searches.filter((s) => s.id !== id),
  })),
  duplicateSearch: (id) => set((state) => {
    const original = state.searches.find((s) => s.id === id);
    if (!original) return state;
    const duplicate: SavedSearch = {
      ...original,
      id: `search-${Date.now()}`,
      name: `${original.name} (Copy)`,
      new_matches_count: 0,
      total_matches_count: 0,
      last_alert_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { searches: [duplicate, ...state.searches] };
  }),
  togglePause: (id) => set((state) => ({
    searches: state.searches.map((s) => (s.id === id ? { ...s, paused: !s.paused, updated_at: new Date().toISOString() } : s)),
  })),
  
  setNotifications: (notifications) => set({ notifications }),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
  })),
  clearNotifications: () => set({ notifications: [] }),
  
  setPreferences: (preferences) => set((state) => ({ preferences: { ...state.preferences, ...preferences } })),
  
  setSelectedSearchId: (id) => set({ selectedSearchId: id }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
