import { create } from 'zustand';
import { AreaYieldData, YieldMapFilters, TopArea } from '@/types/yieldMap';

interface YieldMapState {
  areas: AreaYieldData[];
  filters: YieldMapFilters;
  selectedArea: AreaYieldData | null;
  isLoading: boolean;
  
  // Actions
  setAreas: (areas: AreaYieldData[]) => void;
  setFilters: (filters: Partial<YieldMapFilters>) => void;
  setSelectedArea: (area: AreaYieldData | null) => void;
  setIsLoading: (loading: boolean) => void;
  
  // Computed
  getFilteredAreas: () => AreaYieldData[];
  getTopAreas: (limit?: number) => TopArea[];
  getYieldColor: (yield_value: number) => string;
}

// Mock UK yield data
const mockAreas: AreaYieldData[] = [
  { id: '1', postcode_district: 'M14', latitude: 53.4485, longitude: -2.2157, avg_gross_yield: 7.8, avg_property_price: 185000, avg_rent_pcm: 1200, yield_change_1y: 0.5, price_change_1y: 3.2, sample_size: 45 },
  { id: '2', postcode_district: 'M20', latitude: 53.4120, longitude: -2.2265, avg_gross_yield: 5.9, avg_property_price: 320000, avg_rent_pcm: 1575, yield_change_1y: -0.2, price_change_1y: 4.1, sample_size: 38 },
  { id: '3', postcode_district: 'M21', latitude: 53.4289, longitude: -2.2789, avg_gross_yield: 6.4, avg_property_price: 275000, avg_rent_pcm: 1465, yield_change_1y: 0.3, price_change_1y: 3.8, sample_size: 42 },
  { id: '4', postcode_district: 'L1', latitude: 53.4075, longitude: -2.9866, avg_gross_yield: 8.2, avg_property_price: 145000, avg_rent_pcm: 990, yield_change_1y: 0.8, price_change_1y: 5.2, sample_size: 55 },
  { id: '5', postcode_district: 'L8', latitude: 53.3889, longitude: -2.9620, avg_gross_yield: 9.1, avg_property_price: 120000, avg_rent_pcm: 910, yield_change_1y: 1.2, price_change_1y: 6.8, sample_size: 32 },
  { id: '6', postcode_district: 'BD1', latitude: 53.7940, longitude: -1.7520, avg_gross_yield: 8.5, avg_property_price: 95000, avg_rent_pcm: 675, yield_change_1y: 0.9, price_change_1y: 4.5, sample_size: 28 },
  { id: '7', postcode_district: 'S1', latitude: 53.3811, longitude: -1.4701, avg_gross_yield: 7.2, avg_property_price: 165000, avg_rent_pcm: 990, yield_change_1y: 0.4, price_change_1y: 3.9, sample_size: 41 },
  { id: '8', postcode_district: 'NG1', latitude: 52.9548, longitude: -1.1581, avg_gross_yield: 6.8, avg_property_price: 195000, avg_rent_pcm: 1105, yield_change_1y: 0.2, price_change_1y: 4.2, sample_size: 35 },
  { id: '9', postcode_district: 'B1', latitude: 52.4862, longitude: -1.8904, avg_gross_yield: 6.5, avg_property_price: 210000, avg_rent_pcm: 1140, yield_change_1y: 0.1, price_change_1y: 3.5, sample_size: 48 },
  { id: '10', postcode_district: 'LS1', latitude: 53.7964, longitude: -1.5477, avg_gross_yield: 7.0, avg_property_price: 175000, avg_rent_pcm: 1020, yield_change_1y: 0.6, price_change_1y: 4.8, sample_size: 52 },
  { id: '11', postcode_district: 'NE1', latitude: 54.9733, longitude: -1.6145, avg_gross_yield: 7.5, avg_property_price: 155000, avg_rent_pcm: 970, yield_change_1y: 0.7, price_change_1y: 5.1, sample_size: 39 },
  { id: '12', postcode_district: 'G1', latitude: 55.8617, longitude: -4.2583, avg_gross_yield: 6.9, avg_property_price: 185000, avg_rent_pcm: 1065, yield_change_1y: 0.3, price_change_1y: 4.3, sample_size: 44 },
];

const defaultFilters: YieldMapFilters = {
  viewType: 'gross_yield',
  propertyType: 'all',
  bedrooms: null,
  yieldRange: [0, 15],
  searchQuery: '',
};

export const useYieldMapStore = create<YieldMapState>((set, get) => ({
  areas: mockAreas,
  filters: defaultFilters,
  selectedArea: null,
  isLoading: false,

  setAreas: (areas) => set({ areas }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
  })),
  
  setSelectedArea: (area) => set({ selectedArea: area }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),

  getFilteredAreas: () => {
    const { areas, filters } = get();
    return areas.filter((area) => {
      const yield_val = area.avg_gross_yield || 0;
      if (yield_val < filters.yieldRange[0] || yield_val > filters.yieldRange[1]) {
        return false;
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!area.postcode_district.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  },

  getTopAreas: (limit = 10) => {
    const { areas } = get();
    return areas
      .filter((a) => a.avg_gross_yield)
      .sort((a, b) => (b.avg_gross_yield || 0) - (a.avg_gross_yield || 0))
      .slice(0, limit)
      .map((area, index) => ({
        rank: index + 1,
        postcode_district: area.postcode_district,
        avg_gross_yield: area.avg_gross_yield || 0,
        avg_property_price: area.avg_property_price || 0,
        avg_rent_pcm: area.avg_rent_pcm || 0,
        trend: (area.yield_change_1y || 0) > 0 ? 'up' as const : 
               (area.yield_change_1y || 0) < 0 ? 'down' as const : 'stable' as const,
      }));
  },

  getYieldColor: (yield_value: number) => {
    if (yield_value >= 8) return 'hsl(0, 70%, 50%)'; // Red
    if (yield_value >= 7) return 'hsl(30, 70%, 50%)'; // Orange
    if (yield_value >= 6) return 'hsl(50, 70%, 50%)'; // Yellow
    if (yield_value >= 5) return 'hsl(120, 50%, 45%)'; // Green
    return 'hsl(210, 70%, 50%)'; // Blue
  },
}));
