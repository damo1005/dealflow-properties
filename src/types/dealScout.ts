export interface ScoutScoreBreakdown {
  yield: number;
  cashFlow: number;
  bmv: number;
  location: number;
  total: number;
}

export interface OpportunityFlags {
  hot_deal?: boolean;
  long_on_market?: boolean;
  price_reduced?: boolean;
  high_yield?: boolean;
  significant_bmv?: boolean;
  good_bmv?: boolean;
  low_crime?: boolean;
}

export interface RiskFlags {
  high_crime?: boolean;
  flood_risk?: boolean;
  short_lease?: boolean;
  high_service_charge?: boolean;
}

export interface PriceChange {
  date: string;
  old_price: number;
  new_price: number;
  change_pct: number;
}

export interface ScoutConfig {
  name: string;
  investment_strategy: 'btl' | 'brr' | 'hmo' | 'flip' | 'commercial';
  location_areas: string[];
  price_min: number;
  price_max: number;
  property_types: string[];
  bedrooms_min: number;
  bedrooms_max: number;
  yield_min: number;
  cash_flow_min: number;
  bmv_min: number;
  alert_frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  alert_score_threshold: number;
  alert_methods: ('email' | 'push' | 'whatsapp' | 'sms')[];
  exclude_leasehold: boolean;
  exclude_shared_ownership: boolean;
  exclude_auction: boolean;
  exclude_new_build: boolean;
  require_parking: boolean;
  require_garden: boolean;
}

export const INVESTMENT_STRATEGIES = [
  { value: 'btl', label: 'Buy-to-Let (BTL)', icon: '🏠', description: 'Long-term rental income' },
  { value: 'brr', label: 'Buy-Refurb-Refinance (BRR)', icon: '🔄', description: 'Add value, refinance, repeat' },
  { value: 'hmo', label: 'HMO', icon: '🏘️', description: 'Rent by the room' },
  { value: 'flip', label: 'Property Flip', icon: '🛠️', description: 'Buy, renovate, sell quickly' },
  { value: 'commercial', label: 'Commercial', icon: '🏢', description: 'Retail, office, industrial' },
] as const;

export const PROPERTY_TYPES = [
  { value: 'flat', label: 'Flat/Apartment' },
  { value: 'terraced', label: 'Terraced House' },
  { value: 'semi-detached', label: 'Semi-Detached' },
  { value: 'detached', label: 'Detached House' },
  { value: 'bungalow', label: 'Bungalow' },
] as const;

export const ALERT_FREQUENCIES = [
  { value: 'instant', label: 'Instant', description: 'Get notified as soon as a hot deal appears' },
  { value: 'hourly', label: 'Hourly', description: 'Group deals together if multiple found quickly' },
  { value: 'daily', label: 'Daily Digest', description: 'One email per day with all new deals' },
  { value: 'weekly', label: 'Weekly Digest', description: 'One email per week' },
] as const;

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-gray-500';
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-green-100 text-green-800';
  if (score >= 75) return 'bg-blue-100 text-blue-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-600';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Low';
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
