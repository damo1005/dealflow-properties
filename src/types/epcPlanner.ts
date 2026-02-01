export interface EPCAssessment {
  id: string;
  portfolio_property_id: string;
  user_id: string;
  current_rating: string | null;
  current_score: number | null;
  certificate_date: string | null;
  certificate_expiry: string | null;
  target_rating: string;
  target_deadline: string;
  recommendations: EPCRecommendation[];
  planned_improvements: string[];
  total_estimated_cost: number | null;
  projected_rating: string | null;
  projected_score: number | null;
  status: 'not_started' | 'planning' | 'in_progress' | 'complete';
  created_at: string;
}

export interface EPCImprovement {
  id: string;
  assessment_id: string;
  measure_type: EPCMeasureType;
  description: string | null;
  cost_low: number | null;
  cost_high: number | null;
  score_improvement: number | null;
  annual_savings: number | null;
  status: 'recommended' | 'planned' | 'completed' | 'skipped';
  completed_date: string | null;
  actual_cost: number | null;
  grant_eligible: boolean;
  grant_name: string | null;
  grant_amount: number | null;
  created_at: string;
}

export type EPCMeasureType = 
  | 'loft_insulation'
  | 'cavity_wall'
  | 'solid_wall'
  | 'floor_insulation'
  | 'double_glazing'
  | 'boiler'
  | 'heating_controls'
  | 'solar_pv'
  | 'heat_pump'
  | 'draught_proofing'
  | 'hot_water_cylinder'
  | 'led_lighting';

export interface EPCRecommendation {
  measure: EPCMeasureType;
  description: string;
  cost_range: string;
  score_improvement: number;
  annual_savings: number;
  roi_years: number;
}
