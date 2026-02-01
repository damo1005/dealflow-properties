export interface AreaYieldData {
  id: string;
  postcode_district: string;
  latitude?: number;
  longitude?: number;
  avg_gross_yield?: number;
  avg_property_price?: number;
  avg_rent_pcm?: number;
  yield_change_1y?: number;
  price_change_1y?: number;
  sample_size?: number;
  data_date?: string;
}

export interface YieldMapFilters {
  viewType: 'gross_yield' | 'net_yield' | 'price_growth';
  propertyType: 'all' | 'houses' | 'flats';
  bedrooms: number | null;
  yieldRange: [number, number];
  searchQuery: string;
}

export interface TopArea {
  rank: number;
  postcode_district: string;
  area_name?: string;
  avg_gross_yield: number;
  avg_property_price: number;
  avg_rent_pcm: number;
  trend: 'up' | 'down' | 'stable';
}
