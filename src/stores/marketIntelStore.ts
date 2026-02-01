import { create } from 'zustand';
import type { MarketData, DistressedProperty, InvestmentHotspot, PlanningApplication } from '@/types/marketIntel';

interface MarketIntelState {
  // Current search
  currentPostcode: string;
  currentMarketData: MarketData | null;
  isLoading: boolean;
  error: string | null;
  
  // View state
  activeTab: 'market' | 'comparables' | 'trends' | 'opportunities';
  mapView: 'price' | 'yield' | 'growth' | 'score';
  
  // Distressed properties
  distressedProperties: DistressedProperty[];
  distressedFilters: {
    distressType: string[];
    maxPrice?: number;
    minDiscount?: number;
    postcodes: string[];
  };
  
  // Hotspots
  hotspots: InvestmentHotspot[];
  hotspotFilter: 'all' | 'btl' | 'growth' | 'yield' | 'hmo';
  savedHotspotIds: string[];
  
  // Planning
  planningApplications: PlanningApplication[];
  
  // Actions
  setCurrentPostcode: (postcode: string) => void;
  setCurrentMarketData: (data: MarketData | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: 'market' | 'comparables' | 'trends' | 'opportunities') => void;
  setMapView: (view: 'price' | 'yield' | 'growth' | 'score') => void;
  setDistressedProperties: (properties: DistressedProperty[]) => void;
  setDistressedFilters: (filters: Partial<MarketIntelState['distressedFilters']>) => void;
  setHotspots: (hotspots: InvestmentHotspot[]) => void;
  setHotspotFilter: (filter: 'all' | 'btl' | 'growth' | 'yield' | 'hmo') => void;
  toggleSavedHotspot: (id: string) => void;
  setPlanningApplications: (applications: PlanningApplication[]) => void;
}

export const useMarketIntelStore = create<MarketIntelState>((set) => ({
  currentPostcode: '',
  currentMarketData: null,
  isLoading: false,
  error: null,
  activeTab: 'market',
  mapView: 'price',
  distressedProperties: [],
  distressedFilters: {
    distressType: [],
    postcodes: [],
  },
  hotspots: [],
  hotspotFilter: 'all',
  savedHotspotIds: [],
  planningApplications: [],
  
  setCurrentPostcode: (postcode) => set({ currentPostcode: postcode }),
  setCurrentMarketData: (data) => set({ currentMarketData: data }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setMapView: (view) => set({ mapView: view }),
  setDistressedProperties: (properties) => set({ distressedProperties: properties }),
  setDistressedFilters: (filters) => set((state) => ({
    distressedFilters: { ...state.distressedFilters, ...filters }
  })),
  setHotspots: (hotspots) => set({ hotspots }),
  setHotspotFilter: (filter) => set({ hotspotFilter: filter }),
  toggleSavedHotspot: (id) => set((state) => ({
    savedHotspotIds: state.savedHotspotIds.includes(id)
      ? state.savedHotspotIds.filter((h) => h !== id)
      : [...state.savedHotspotIds, id]
  })),
  setPlanningApplications: (applications) => set({ planningApplications: applications }),
}));
