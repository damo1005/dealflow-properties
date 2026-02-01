import { create } from "zustand";
import type { RequestAlert, AlertMatch } from "@/types/alerts";

interface AlertsState {
  alerts: RequestAlert[];
  matches: AlertMatch[];
  isLoading: boolean;
  selectedAlert: RequestAlert | null;
  
  setAlerts: (alerts: RequestAlert[]) => void;
  setMatches: (matches: AlertMatch[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedAlert: (alert: RequestAlert | null) => void;
  addAlert: (alert: RequestAlert) => void;
  updateAlert: (id: string, updates: Partial<RequestAlert>) => void;
  deleteAlert: (id: string) => void;
  toggleAlertActive: (id: string) => void;
}

export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: [],
  matches: [],
  isLoading: false,
  selectedAlert: null,

  setAlerts: (alerts) => set({ alerts }),
  setMatches: (matches) => set({ matches }),
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedAlert: (selectedAlert) => set({ selectedAlert }),
  
  addAlert: (alert) => set((state) => ({ 
    alerts: [alert, ...state.alerts] 
  })),
  
  updateAlert: (id, updates) => set((state) => ({
    alerts: state.alerts.map((alert) =>
      alert.id === id ? { ...alert, ...updates } : alert
    ),
  })),
  
  deleteAlert: (id) => set((state) => ({
    alerts: state.alerts.filter((alert) => alert.id !== id),
  })),
  
  toggleAlertActive: (id) => set((state) => ({
    alerts: state.alerts.map((alert) =>
      alert.id === id ? { ...alert, is_active: !alert.is_active } : alert
    ),
  })),
}));

// Mock data for development
export const mockAlerts: RequestAlert[] = [
  {
    id: "1",
    user_id: "user1",
    name: "Enfield Studios Under £1.5K",
    alert_for: "seeking",
    location_areas: ["EN3", "EN1", "N9"],
    location_radius_miles: null,
    location_center_lat: null,
    location_center_lng: null,
    budget_min: 1000,
    budget_max: 1500,
    property_types: ["studio", "1-bed"],
    move_in_date_from: null,
    move_in_date_to: null,
    duration_min_months: null,
    duration_max_months: null,
    must_be_self_contained: true,
    must_allow_pets: false,
    must_allow_children: false,
    must_have_parking: false,
    furnished_preference: "either",
    delivery_methods: ["email", "push", "whatsapp"],
    email_address: "damo@examwhisperer.com",
    phone_number: null,
    whatsapp_number: "+44 7939 115953",
    slack_webhook_url: null,
    webhook_url: null,
    frequency: "instant",
    digest_time: "09:00:00",
    digest_day: 1,
    ai_match_threshold: 70,
    exclude_keywords: ["party", "smoking"],
    include_keywords: ["professional", "quiet"],
    is_active: true,
    last_triggered_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    total_matches_sent: 12,
    max_alerts_per_day: 20,
    alerts_sent_today: 3,
    last_reset_date: new Date().toISOString().split('T')[0],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    user_id: "user1",
    name: "North London Families",
    alert_for: "seeking",
    location_areas: ["N9", "N18", "N17"],
    location_radius_miles: null,
    location_center_lat: null,
    location_center_lng: null,
    budget_min: 1500,
    budget_max: 2500,
    property_types: ["2-bed", "3-bed"],
    move_in_date_from: null,
    move_in_date_to: null,
    duration_min_months: 12,
    duration_max_months: null,
    must_be_self_contained: true,
    must_allow_pets: false,
    must_allow_children: true,
    must_have_parking: true,
    furnished_preference: "either",
    delivery_methods: ["email"],
    email_address: "damo@examwhisperer.com",
    phone_number: null,
    whatsapp_number: null,
    slack_webhook_url: null,
    webhook_url: null,
    frequency: "daily",
    digest_time: "09:00:00",
    digest_day: 1,
    ai_match_threshold: 75,
    exclude_keywords: null,
    include_keywords: ["family", "children"],
    is_active: true,
    last_triggered_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    total_matches_sent: 8,
    max_alerts_per_day: 20,
    alerts_sent_today: 0,
    last_reset_date: new Date().toISOString().split('T')[0],
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    user_id: "user1",
    name: "Hackney Professionals",
    alert_for: "seeking",
    location_areas: ["E8", "E9", "E5"],
    location_radius_miles: null,
    location_center_lat: null,
    location_center_lng: null,
    budget_min: 1200,
    budget_max: 1800,
    property_types: ["studio", "1-bed"],
    move_in_date_from: null,
    move_in_date_to: null,
    duration_min_months: 6,
    duration_max_months: null,
    must_be_self_contained: true,
    must_allow_pets: false,
    must_allow_children: false,
    must_have_parking: false,
    furnished_preference: "furnished",
    delivery_methods: ["email", "push"],
    email_address: "damo@examwhisperer.com",
    phone_number: null,
    whatsapp_number: null,
    slack_webhook_url: null,
    webhook_url: null,
    frequency: "instant",
    digest_time: null,
    digest_day: null,
    ai_match_threshold: 80,
    exclude_keywords: null,
    include_keywords: ["professional"],
    is_active: false,
    last_triggered_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    total_matches_sent: 5,
    max_alerts_per_day: 20,
    alerts_sent_today: 0,
    last_reset_date: new Date().toISOString().split('T')[0],
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockAlertMatches: AlertMatch[] = [
  {
    id: "m1",
    alert_id: "1",
    request_id: "1",
    match_score: 85,
    sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    delivery_method: "email",
    was_clicked: true,
    clicked_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    was_enquired: false,
    enquired_at: null,
  },
  {
    id: "m2",
    alert_id: "1",
    request_id: "3",
    match_score: 92,
    sent_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    delivery_method: "whatsapp",
    was_clicked: true,
    clicked_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    was_enquired: true,
    enquired_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];
