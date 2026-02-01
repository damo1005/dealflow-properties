export interface FloodRiskData {
  id: string;
  property_address: string;
  postcode: string;
  latitude: number | null;
  longitude: number | null;
  rivers_and_sea_risk: 'Very Low' | 'Low' | 'Medium' | 'High' | null;
  rivers_and_sea_annual_chance: number | null;
  surface_water_risk: 'Very Low' | 'Low' | 'Medium' | 'High' | null;
  surface_water_annual_chance: number | null;
  reservoir_risk: boolean;
  reservoir_risk_details: string | null;
  overall_flood_risk: 'Very Low' | 'Low' | 'Medium' | 'High' | null;
  in_flood_zone_2: boolean;
  in_flood_zone_3: boolean;
  flood_defenses_present: boolean;
  defense_standard: string | null;
  recorded_flood_events: FloodEvent[] | null;
  last_flood_event_date: string | null;
  recommendations: FloodRecommendation[] | null;
  current_warnings: FloodWarning[] | null;
  current_alerts: FloodWarning[] | null;
  insurance_implications: string | null;
  last_checked_at: string;
  created_at: string;
}

export interface FloodEvent {
  date: string;
  description: string;
  severity: string;
}

export interface FloodRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FloodWarning {
  id: string;
  severity: string;
  areaName: string;
  message: string;
  timeRaised: string;
}

export const FLOOD_RISK_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  'Very Low': { bg: 'bg-green-100', text: 'text-green-800', icon: '🟢' },
  'Low': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🔵' },
  'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🟡' },
  'High': { bg: 'bg-red-100', text: 'text-red-800', icon: '🔴' },
};

export const FLOOD_RISK_DESCRIPTIONS: Record<string, string> = {
  'Very Low': 'Less than 0.1% annual chance (1 in 1000 years)',
  'Low': '0.1% to 1% annual chance (1 in 100-1000 years)',
  'Medium': '1% to 3.3% annual chance (1 in 30-100 years)',
  'High': 'Greater than 3.3% annual chance (more than 1 in 30 years)',
};
