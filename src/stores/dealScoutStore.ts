import { create } from 'zustand';

export interface DealScout {
  id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  location_areas: string[];
  location_radius_miles?: number;
  location_center_lat?: number;
  location_center_lng?: number;
  price_min?: number;
  price_max?: number;
  property_types: string[];
  bedrooms_min?: number;
  bedrooms_max?: number;
  investment_strategy: string;
  prioritize_yield: boolean;
  prioritize_cash_flow: boolean;
  prioritize_capital_growth: boolean;
  prioritize_below_market: boolean;
  yield_min?: number;
  cash_flow_min?: number;
  bmv_min?: number;
  exclude_leasehold: boolean;
  exclude_shared_ownership: boolean;
  exclude_auction: boolean;
  exclude_new_build: boolean;
  require_parking: boolean;
  require_garden: boolean;
  max_chain_length?: number;
  alert_frequency: string;
  alert_score_threshold: number;
  alert_methods: string[];
  properties_found: number;
  properties_viewed: number;
  properties_saved: number;
  avg_score?: number;
  last_scan_at?: string;
  next_scan_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ScoutDiscovery {
  id: string;
  scout_id: string;
  property_id: string;
  discovered_at: string;
  source: string;
  listing_url?: string;
  overall_score: number;
  score_breakdown: {
    yield?: number;
    cashFlow?: number;
    bmv?: number;
    location?: number;
  };
  score_reasoning?: string;
  days_on_market?: number;
  price_changes?: Array<{
    date: string;
    old_price: number;
    new_price: number;
    change_pct: number;
  }>;
  is_price_reduced: boolean;
  total_price_reduction?: number;
  reduction_percentage?: number;
  estimated_market_value?: number;
  below_market_value?: number;
  bmv_percentage?: number;
  estimated_yield?: number;
  estimated_cash_flow?: number;
  estimated_roi?: number;
  opportunity_flags?: {
    hot_deal?: boolean;
    long_on_market?: boolean;
    price_reduced?: boolean;
    high_yield?: boolean;
  };
  risk_flags?: {
    high_crime?: boolean;
    flood_risk?: boolean;
    short_lease?: boolean;
  };
  was_alerted: boolean;
  was_viewed: boolean;
  was_saved: boolean;
  user_feedback?: string;
  status: string;
  property?: {
    id: string;
    address: string;
    postcode: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    property_type: string;
    images: string[];
  };
}

export interface MarketIntelligence {
  id: string;
  area: string;
  avg_price?: number;
  median_price?: number;
  price_per_sqft?: number;
  price_trend_3mo?: number;
  price_trend_12mo?: number;
  avg_rent?: number;
  median_rent?: number;
  avg_yield?: number;
  rental_demand?: string;
  avg_void_period_days?: number;
  properties_for_sale?: number;
  new_listings_30d?: number;
  properties_sold_30d?: number;
  avg_days_to_sell?: number;
  avg_sale_vs_asking?: number;
  investment_score?: number;
  growth_potential?: string;
  cash_flow_potential?: string;
  data_date: string;
}

interface ScoutWizardData {
  step: number;
  name: string;
  investment_strategy: string;
  target_yield: number;
  target_cash_flow: number;
  target_roi: number;
  investment_horizon: string;
  risk_tolerance: string;
  location_areas: string[];
  location_radius_miles: number;
  price_min: number;
  price_max: number;
  property_types: string[];
  bedrooms_min: number;
  bedrooms_max: number;
  exclude_leasehold: boolean;
  exclude_shared_ownership: boolean;
  require_parking: boolean;
  require_garden: boolean;
  priority_yield: number;
  priority_cash_flow: number;
  priority_bmv: number;
  priority_capital_growth: number;
  priority_location: number;
  min_score: number;
  alert_frequency: string;
  alert_methods: string[];
  scan_frequency: string;
}

interface DealScoutStore {
  scouts: DealScout[];
  discoveries: ScoutDiscovery[];
  marketIntel: MarketIntelligence[];
  selectedScoutId: string | null;
  isLoading: boolean;
  wizardData: ScoutWizardData;
  wizardOpen: boolean;
  
  setScouts: (scouts: DealScout[]) => void;
  addScout: (scout: DealScout) => void;
  updateScout: (id: string, updates: Partial<DealScout>) => void;
  deleteScout: (id: string) => void;
  setSelectedScoutId: (id: string | null) => void;
  setDiscoveries: (discoveries: ScoutDiscovery[]) => void;
  setMarketIntel: (intel: MarketIntelligence[]) => void;
  setIsLoading: (loading: boolean) => void;
  setWizardOpen: (open: boolean) => void;
  updateWizardData: (data: Partial<ScoutWizardData>) => void;
  resetWizardData: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialWizardData: ScoutWizardData = {
  step: 1,
  name: '',
  investment_strategy: 'btl',
  target_yield: 7,
  target_cash_flow: 200,
  target_roi: 12,
  investment_horizon: 'long',
  risk_tolerance: 'moderate',
  location_areas: [],
  location_radius_miles: 5,
  price_min: 100000,
  price_max: 300000,
  property_types: [],
  bedrooms_min: 1,
  bedrooms_max: 3,
  exclude_leasehold: false,
  exclude_shared_ownership: true,
  require_parking: false,
  require_garden: false,
  priority_yield: 90,
  priority_cash_flow: 85,
  priority_bmv: 70,
  priority_capital_growth: 50,
  priority_location: 60,
  min_score: 70,
  alert_frequency: 'instant',
  alert_methods: ['email', 'push'],
  scan_frequency: 'daily',
};

export const useDealScoutStore = create<DealScoutStore>((set) => ({
  scouts: [],
  discoveries: [],
  marketIntel: [],
  selectedScoutId: null,
  isLoading: false,
  wizardData: initialWizardData,
  wizardOpen: false,
  
  setScouts: (scouts) => set({ scouts }),
  addScout: (scout) => set((state) => ({ scouts: [...state.scouts, scout] })),
  updateScout: (id, updates) => set((state) => ({
    scouts: state.scouts.map((s) => (s.id === id ? { ...s, ...updates } : s)),
  })),
  deleteScout: (id) => set((state) => ({
    scouts: state.scouts.filter((s) => s.id !== id),
  })),
  setSelectedScoutId: (id) => set({ selectedScoutId: id }),
  setDiscoveries: (discoveries) => set({ discoveries }),
  setMarketIntel: (intel) => set({ marketIntel: intel }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setWizardOpen: (open) => set({ wizardOpen: open }),
  updateWizardData: (data) => set((state) => ({
    wizardData: { ...state.wizardData, ...data },
  })),
  resetWizardData: () => set({ wizardData: initialWizardData }),
  nextStep: () => set((state) => ({
    wizardData: { ...state.wizardData, step: state.wizardData.step + 1 },
  })),
  prevStep: () => set((state) => ({
    wizardData: { ...state.wizardData, step: Math.max(1, state.wizardData.step - 1) },
  })),
}));
