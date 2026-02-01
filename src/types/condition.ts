export interface PropertyInspection {
  id: string;
  portfolio_property_id: string;
  user_id: string;
  inspection_type: 'move_in' | 'move_out' | 'routine' | 'inventory';
  inspection_date: string;
  inspector_name?: string;
  overall_rating?: number;
  overall_notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  report_url?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  room_conditions?: RoomCondition[];
  issues_found?: number;
}

export interface RoomCondition {
  id: string;
  inspection_id: string;
  room_name: string;
  walls_rating?: number;
  flooring_rating?: number;
  ceiling_rating?: number;
  fixtures_rating?: number;
  overall_rating?: number;
  notes?: string;
  photo_urls?: string[];
}

export interface PropertyIssue {
  id: string;
  portfolio_property_id: string;
  inspection_id?: string;
  reported_by?: string;
  title: string;
  description?: string;
  room_name?: string;
  category: 'plumbing' | 'electrical' | 'structural' | 'cosmetic' | 'appliance' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'reported' | 'in_progress' | 'resolved';
  resolved_at?: string;
  resolution_cost?: number;
  photo_urls?: string[];
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ConditionSummary {
  overall_rating: number;
  last_inspection_date?: string;
  open_issues: number;
  next_inspection_due?: string;
}
