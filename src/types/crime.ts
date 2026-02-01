export interface CrimeStatistics {
  id: string;
  property_address: string;
  postcode: string;
  latitude: number | null;
  longitude: number | null;
  police_force: string | null;
  neighbourhood_id: string | null;
  neighbourhood_name: string | null;
  total_crimes: number;
  crimes_per_1000_people: number | null;
  antisocial_behaviour: number;
  bicycle_theft: number;
  burglary: number;
  criminal_damage: number;
  drugs: number;
  other_theft: number;
  possession_weapons: number;
  public_order: number;
  robbery: number;
  shoplifting: number;
  theft_from_person: number;
  vehicle_crime: number;
  violence_sexual_offences: number;
  other_crime: number;
  crime_trend: 'increasing' | 'stable' | 'decreasing' | null;
  trend_percentage: number | null;
  vs_national_average: 'below' | 'average' | 'above' | null;
  vs_force_average: 'below' | 'average' | 'above' | null;
  safety_rating: 'Very Safe' | 'Safe' | 'Average' | 'Below Average' | 'High Crime' | null;
  safety_score: number | null;
  monthly_data: MonthlyData[] | null;
  data_period_start: string | null;
  data_period_end: string | null;
  last_updated_at: string;
  created_at: string;
}

export interface MonthlyData {
  month: string;
  count: number;
}

export interface CrimeBreakdown {
  category: string;
  count: number;
  percentage: number;
  icon: string;
  color: string;
}

export const SAFETY_RATING_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  'Very Safe': { bg: 'bg-green-100', text: 'text-green-800', icon: '🟢' },
  'Safe': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🔵' },
  'Average': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🟡' },
  'Below Average': { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🟠' },
  'High Crime': { bg: 'bg-red-100', text: 'text-red-800', icon: '🔴' },
};

export const CRIME_CATEGORIES: Record<string, { label: string; icon: string; color: string }> = {
  antisocial_behaviour: { label: 'Anti-social Behaviour', icon: '📢', color: 'bg-gray-500' },
  violence_sexual_offences: { label: 'Violence & Sexual Offences', icon: '⚠️', color: 'bg-red-500' },
  vehicle_crime: { label: 'Vehicle Crime', icon: '🚗', color: 'bg-blue-500' },
  burglary: { label: 'Burglary', icon: '🏠', color: 'bg-orange-500' },
  criminal_damage: { label: 'Criminal Damage', icon: '💥', color: 'bg-yellow-500' },
  other_theft: { label: 'Other Theft', icon: '👜', color: 'bg-purple-500' },
  public_order: { label: 'Public Order', icon: '📣', color: 'bg-pink-500' },
  drugs: { label: 'Drugs', icon: '💊', color: 'bg-green-500' },
  bicycle_theft: { label: 'Bicycle Theft', icon: '🚲', color: 'bg-cyan-500' },
  robbery: { label: 'Robbery', icon: '💰', color: 'bg-red-600' },
  shoplifting: { label: 'Shoplifting', icon: '🛒', color: 'bg-indigo-500' },
  theft_from_person: { label: 'Theft from Person', icon: '👤', color: 'bg-violet-500' },
  possession_weapons: { label: 'Possession of Weapons', icon: '🔪', color: 'bg-rose-600' },
  other_crime: { label: 'Other Crime', icon: '❓', color: 'bg-slate-500' },
};
