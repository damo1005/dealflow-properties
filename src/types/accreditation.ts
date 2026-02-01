export interface LandlordAccreditation {
  id: string;
  user_id: string;
  scheme_name: string;
  provider: string | null;
  membership_number: string | null;
  accreditation_level: string | null;
  start_date: string | null;
  expiry_date: string | null;
  cpd_hours_required: number | null;
  cpd_hours_completed: number;
  annual_fee: number | null;
  certificate_url: string | null;
  status: 'active' | 'expired' | 'pending_renewal';
  auto_renew: boolean;
  created_at: string;
}

export interface PropertyLicense {
  id: string;
  portfolio_property_id: string | null;
  user_id: string;
  license_type: 'hmo_mandatory' | 'hmo_additional' | 'selective' | 'article4' | 'short_term_let';
  local_authority: string;
  license_number: string | null;
  application_date: string | null;
  granted_date: string | null;
  expiry_date: string | null;
  application_fee: number | null;
  max_occupants: number | null;
  conditions: Record<string, unknown> | null;
  status: 'pending' | 'active' | 'expired' | 'refused' | 'revoked';
  license_document_url: string | null;
  created_at: string;
}

export interface CPDActivity {
  id: string;
  accreditation_id: string | null;
  user_id: string;
  activity_name: string;
  provider: string | null;
  activity_date: string | null;
  hours: number | null;
  certificate_url: string | null;
  created_at: string;
}

export const ACCREDITATION_SCHEMES = [
  { value: 'nrla', label: 'NRLA (National Residential Landlords Association)' },
  { value: 'rla', label: 'RLA (Residential Landlords Association)' },
  { value: 'safeagent', label: 'Safeagent' },
  { value: 'landlord_accreditation_scotland', label: 'Landlord Accreditation Scotland' },
  { value: 'rent_smart_wales', label: 'Rent Smart Wales' },
  { value: 'london_landlord_accreditation', label: 'London Landlord Accreditation Scheme' },
  { value: 'local_authority', label: 'Local Authority Scheme' },
] as const;

export const LICENSE_TYPES = [
  { value: 'hmo_mandatory', label: 'Mandatory HMO License' },
  { value: 'hmo_additional', label: 'Additional HMO License' },
  { value: 'selective', label: 'Selective License' },
  { value: 'article4', label: 'Article 4 Direction' },
  { value: 'short_term_let', label: 'Short-Term Let License' },
] as const;
