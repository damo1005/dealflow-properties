import { create } from 'zustand';

export interface SearchFilters {
  // Location
  location: string;
  region: string;
  counties: string[];
  radius: number;
  
  // Property Type
  propertyTypes: string[];
  includeCommercial: boolean;
  
  // Price & Financials
  minPrice: number;
  maxPrice: number;
  priceReduced: boolean;
  belowMarketValue: number;
  
  // Bedrooms & Bathrooms
  minBedrooms: number;
  maxBedrooms: number;
  minBathrooms: number;
  maxBathrooms: number;
  
  // Features
  features: string[];
  needsModernisation: boolean;
  backOnMarket: boolean;
  repossessed: boolean;
  
  // Investment Metrics
  minYield: number;
  maxPurchasePrice: number;
  targetROI: number;
}

export interface Property {
  id: string;
  address: string;
  postcode: string;
  price: number;
  originalPrice?: number;
  priceReduced: boolean;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  images: string[];
  daysOnMarket: number;
  estimatedYield: number;
  roiPotential: number;
  features: string[];
  description: string;
  createdAt: string;
}

interface SearchState {
  filters: SearchFilters;
  viewMode: 'grid' | 'list';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  results: Property[];
  selectedProperties: string[];
  isLoading: boolean;
  totalResults: number;
  currentPage: number;
  itemsPerPage: number;
  filtersOpen: boolean;
  
  // Actions
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setResults: (results: Property[]) => void;
  togglePropertySelection: (id: string) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setTotalResults: (total: number) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  toggleFilters: () => void;
}

const defaultFilters: SearchFilters = {
  location: '',
  region: '',
  counties: [],
  radius: 10,
  propertyTypes: [],
  includeCommercial: false,
  minPrice: 0,
  maxPrice: 1000000,
  priceReduced: false,
  belowMarketValue: 0,
  minBedrooms: 0,
  maxBedrooms: 10,
  minBathrooms: 0,
  maxBathrooms: 5,
  features: [],
  needsModernisation: false,
  backOnMarket: false,
  repossessed: false,
  minYield: 0,
  maxPurchasePrice: 0,
  targetROI: 0,
};

export const useSearchStore = create<SearchState>((set) => ({
  filters: defaultFilters,
  viewMode: 'grid',
  sortBy: 'relevance',
  sortOrder: 'desc',
  results: [],
  selectedProperties: [],
  isLoading: false,
  totalResults: 0,
  currentPage: 1,
  itemsPerPage: 12,
  filtersOpen: true,
  
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setResults: (results) => set({ results }),
  togglePropertySelection: (id) =>
    set((state) => ({
      selectedProperties: state.selectedProperties.includes(id)
        ? state.selectedProperties.filter((p) => p !== id)
        : [...state.selectedProperties, id],
    })),
  clearSelection: () => set({ selectedProperties: [] }),
  setLoading: (loading) => set({ isLoading: loading }),
  setTotalResults: (total) => set({ totalResults: total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (items) => set({ itemsPerPage: items }),
  toggleFilters: () => set((state) => ({ filtersOpen: !state.filtersOpen })),
}));
