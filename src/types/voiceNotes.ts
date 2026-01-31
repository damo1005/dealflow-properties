export interface RoomCondition {
  name: string;
  condition: "Good" | "Fair" | "Poor";
  notes: string;
}

export interface CostItem {
  item: string;
  cost: number;
}

export interface ConditionAssessment {
  overall: "Good" | "Fair" | "Poor";
  rooms: RoomCondition[];
  urgent_issues: string[];
}

export interface CostEstimates {
  cosmetic: CostItem[];
  essential: CostItem[];
  upgrades: CostItem[];
  total: number;
}

export interface OverallImpression {
  sentiment: "Positive" | "Neutral" | "Negative";
  interest_level: "High" | "Medium" | "Low";
  next_action: string;
}

export interface StructuredAnalysis {
  condition_assessment: ConditionAssessment;
  cost_estimates: CostEstimates;
  pros: string[];
  cons: string[];
  key_quotes: string[];
  overall_impression: OverallImpression;
}

export interface VoiceNote {
  id: string;
  user_id: string;
  property_id: string | null;
  property_address: string;
  recording_date: string;
  duration_seconds: number | null;
  transcript: string | null;
  structured_analysis: StructuredAnalysis | null;
  audio_url: string | null;
  created_at: string;
  updated_at: string;
}
