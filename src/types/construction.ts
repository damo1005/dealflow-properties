export interface ConstructionProject {
  id: string;
  planning_reference?: string;
  ccs_site_id?: string;
  address: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  project_name?: string;
  project_type?: 'new_build' | 'extension' | 'conversion' | 'refurbishment' | 'infrastructure' | 'commercial';
  description?: string;
  units_count?: number;
  estimated_value?: number;
  status: 'planning' | 'approved' | 'active' | 'completed';
  is_ccs_registered: boolean;
  ccs_star_rating?: number;
  is_ultra_site: boolean;
  has_national_award: boolean;
  submitted_date?: string;
  approved_date?: string;
  start_date?: string;
  expected_completion?: string;
  data_source?: string;
  source_url?: string;
  last_synced?: string;
  created_at: string;
}

export interface ProjectCompany {
  id: string;
  project_id: string;
  company_name: string;
  company_number?: string;
  role: 'developer' | 'client' | 'main_contractor' | 'subcontractor' | 'architect' | 'engineer';
  is_ccs_registered: boolean;
  is_ccs_partner: boolean;
  ccs_company_id?: string;
  site_contact_name?: string;
  site_phone?: string;
  site_email?: string;
  head_office_phone?: string;
  head_office_email?: string;
  website?: string;
  checkatrade_url?: string;
  checkatrade_rating?: number;
  checkatrade_reviews?: number;
  ccs_rating?: number;
  company_status?: string;
  incorporation_date?: string;
  registered_address?: string;
  sic_codes?: string[];
  created_at: string;
}

export interface MyContractor {
  id: string;
  user_id: string;
  company_id?: string;
  manual_company_name?: string;
  manual_contact_name?: string;
  manual_phone?: string;
  manual_email?: string;
  manual_trades?: string[];
  status: 'saved' | 'contacted' | 'quoted' | 'hired' | 'completed' | 'do_not_use';
  rating?: number;
  notes?: string;
  last_contact_date?: string;
  created_at: string;
  company?: ProjectCompany;
}

export interface TrackedProject {
  id: string;
  user_id: string;
  project_id: string;
  notes?: string;
  alert_on_updates: boolean;
  created_at: string;
  project?: ConstructionProject;
}

export const PROJECT_STATUS_CONFIG = {
  planning: { label: 'Planning', color: 'bg-yellow-100 text-yellow-800', mapColor: '#EAB308' },
  approved: { label: 'Approved', color: 'bg-blue-100 text-blue-800', mapColor: '#3B82F6' },
  active: { label: 'Active', color: 'bg-green-100 text-green-800', mapColor: '#22C55E' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800', mapColor: '#6B7280' },
} as const;

export const PROJECT_TYPE_CONFIG = {
  new_build: { label: 'New Build', icon: '🏗️' },
  extension: { label: 'Extension', icon: '📐' },
  conversion: { label: 'Conversion', icon: '🔄' },
  refurbishment: { label: 'Refurbishment', icon: '🔧' },
  infrastructure: { label: 'Infrastructure', icon: '🚧' },
  commercial: { label: 'Commercial', icon: '🏢' },
} as const;

export const COMPANY_ROLE_CONFIG = {
  developer: { label: 'Developer', icon: '🏠' },
  client: { label: 'Client', icon: '👤' },
  main_contractor: { label: 'Main Contractor', icon: '🏗️' },
  subcontractor: { label: 'Subcontractor', icon: '🔧' },
  architect: { label: 'Architect', icon: '📐' },
  engineer: { label: 'Engineer', icon: '⚙️' },
} as const;

export const CONTRACTOR_STATUS_CONFIG = {
  saved: { label: 'Saved', color: 'bg-gray-100 text-gray-800' },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  quoted: { label: 'Quoted', color: 'bg-purple-100 text-purple-800' },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
  do_not_use: { label: 'Do Not Use', color: 'bg-red-100 text-red-800' },
} as const;

export function formatCCSRating(rating?: number): string {
  if (!rating) return '-';
  return `${rating.toFixed(1)}/5`;
}

export function getStatusColor(status: string): string {
  return PROJECT_STATUS_CONFIG[status as keyof typeof PROJECT_STATUS_CONFIG]?.color || 'bg-gray-100 text-gray-800';
}
