import { create } from 'zustand';
import type {
  AdminUser,
  PlatformSetting,
  AffiliateCommission,
  RevenueLog,
  SupportTicket,
  AdminAnnouncement,
  ModerationItem,
  AdminStats,
  UserWithProfile,
  FeatureUsage,
} from '@/types/admin';

interface AdminState {
  // Auth
  adminUser: AdminUser | null;
  isAdmin: boolean;
  isLoadingAdmin: boolean;

  // Users
  users: UserWithProfile[];
  selectedUser: UserWithProfile | null;
  isLoadingUsers: boolean;
  usersTotal: number;

  // Commissions
  commissions: AffiliateCommission[];
  isLoadingCommissions: boolean;

  // Revenue
  revenueLog: RevenueLog[];
  isLoadingRevenue: boolean;

  // Tickets
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  isLoadingTickets: boolean;

  // Settings
  settings: PlatformSetting[];
  isLoadingSettings: boolean;

  // Announcements
  announcements: AdminAnnouncement[];
  isLoadingAnnouncements: boolean;

  // Moderation
  moderationQueue: ModerationItem[];
  isLoadingModeration: boolean;

  // Stats
  stats: AdminStats | null;
  featureUsage: FeatureUsage[];

  // UI
  activeTab: string;

  // Actions
  setAdminUser: (user: AdminUser | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsLoadingAdmin: (loading: boolean) => void;

  setUsers: (users: UserWithProfile[]) => void;
  setSelectedUser: (user: UserWithProfile | null) => void;
  setIsLoadingUsers: (loading: boolean) => void;
  setUsersTotal: (total: number) => void;

  setCommissions: (commissions: AffiliateCommission[]) => void;
  setIsLoadingCommissions: (loading: boolean) => void;

  setRevenueLog: (revenue: RevenueLog[]) => void;
  setIsLoadingRevenue: (loading: boolean) => void;

  setTickets: (tickets: SupportTicket[]) => void;
  setSelectedTicket: (ticket: SupportTicket | null) => void;
  setIsLoadingTickets: (loading: boolean) => void;

  setSettings: (settings: PlatformSetting[]) => void;
  setIsLoadingSettings: (loading: boolean) => void;

  setAnnouncements: (announcements: AdminAnnouncement[]) => void;
  setIsLoadingAnnouncements: (loading: boolean) => void;

  setModerationQueue: (items: ModerationItem[]) => void;
  setIsLoadingModeration: (loading: boolean) => void;

  setStats: (stats: AdminStats) => void;
  setFeatureUsage: (usage: FeatureUsage[]) => void;

  setActiveTab: (tab: string) => void;

  reset: () => void;
}

const initialState = {
  adminUser: null,
  isAdmin: false,
  isLoadingAdmin: true,
  users: [],
  selectedUser: null,
  isLoadingUsers: false,
  usersTotal: 0,
  commissions: [],
  isLoadingCommissions: false,
  revenueLog: [],
  isLoadingRevenue: false,
  tickets: [],
  selectedTicket: null,
  isLoadingTickets: false,
  settings: [],
  isLoadingSettings: false,
  announcements: [],
  isLoadingAnnouncements: false,
  moderationQueue: [],
  isLoadingModeration: false,
  stats: null,
  featureUsage: [],
  activeTab: 'dashboard',
};

export const useAdminStore = create<AdminState>((set) => ({
  ...initialState,

  setAdminUser: (user) => set({ adminUser: user }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setIsLoadingAdmin: (loading) => set({ isLoadingAdmin: loading }),

  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setIsLoadingUsers: (loading) => set({ isLoadingUsers: loading }),
  setUsersTotal: (total) => set({ usersTotal: total }),

  setCommissions: (commissions) => set({ commissions }),
  setIsLoadingCommissions: (loading) => set({ isLoadingCommissions: loading }),

  setRevenueLog: (revenue) => set({ revenueLog: revenue }),
  setIsLoadingRevenue: (loading) => set({ isLoadingRevenue: loading }),

  setTickets: (tickets) => set({ tickets }),
  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),
  setIsLoadingTickets: (loading) => set({ isLoadingTickets: loading }),

  setSettings: (settings) => set({ settings }),
  setIsLoadingSettings: (loading) => set({ isLoadingSettings: loading }),

  setAnnouncements: (announcements) => set({ announcements }),
  setIsLoadingAnnouncements: (loading) => set({ isLoadingAnnouncements: loading }),

  setModerationQueue: (items) => set({ moderationQueue: items }),
  setIsLoadingModeration: (loading) => set({ isLoadingModeration: loading }),

  setStats: (stats) => set({ stats }),
  setFeatureUsage: (usage) => set({ featureUsage: usage }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  reset: () => set(initialState),
}));
