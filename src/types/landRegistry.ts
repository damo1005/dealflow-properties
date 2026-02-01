export interface LandRegistryData {
  id: string;
  property_address: string;
  postcode: string;
  uprn: string | null;
  title_number: string | null;
  tenure: 'freehold' | 'leasehold' | null;
  proprietor_name: string | null;
  proprietor_address: string | null;
  proprietorship_category: string | null;
  company_registration_number: string | null;
  date_proprietor_added: string | null;
  lease_term_years: number | null;
  lease_start_date: string | null;
  lease_expiry_date: string | null;
  ground_rent: number | null;
  has_charges: boolean;
  charge_count: number;
  charges: Charge[] | null;
  has_restrictions: boolean;
  restrictions: Restriction[] | null;
  last_sale_date: string | null;
  last_sale_price: number | null;
  last_sale_type: string | null;
  boundary_polygon: GeoJSONPolygon | null;
  title_plan_url: string | null;
  data_quality: 'basic' | 'summary' | 'official_copy';
  last_refreshed_at: string;
  api_response: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Charge {
  date: string;
  chargee: string;
  type: string;
  amount?: number;
}

export interface Restriction {
  type: string;
  description: string;
  date?: string;
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface PricePaidRecord {
  id: string;
  property_address: string;
  postcode: string;
  transaction_id: string | null;
  sale_price: number;
  sale_date: string;
  property_type: 'D' | 'S' | 'T' | 'F' | 'O' | null;
  old_new: 'Y' | 'N' | null;
  duration: 'F' | 'L' | null;
  transaction_category: string | null;
  record_status: string | null;
  created_at: string;
}

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  D: 'Detached',
  S: 'Semi-detached',
  T: 'Terraced',
  F: 'Flat/Maisonette',
  O: 'Other',
};

export const TENURE_LABELS: Record<string, string> = {
  F: 'Freehold',
  L: 'Leasehold',
};
