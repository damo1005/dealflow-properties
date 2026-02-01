export type JourneyPurpose = 'viewing' | 'inspection' | 'maintenance' | 'tenant_meeting' | 'other';

export interface MileageLog {
  id: string;
  user_id: string;
  portfolio_property_id: string | null;
  journey_date: string;
  from_location: string;
  to_location: string;
  purpose: JourneyPurpose;
  miles: number;
  rate_per_mile: number;
  vehicle: string | null;
  notes: string | null;
  created_at: string;
}

export interface ExpenseReceipt {
  id: string;
  user_id: string;
  portfolio_property_id: string | null;
  receipt_url: string;
  receipt_date: string | null;
  merchant: string | null;
  amount: number | null;
  category: string | null;
  ocr_data: Record<string, unknown>;
  created_at: string;
}

export const HMRC_MILEAGE_RATE = 0.45; // 45p per mile for first 10,000 miles
export const HMRC_MILEAGE_RATE_ABOVE = 0.25; // 25p per mile above 10,000

export const JOURNEY_PURPOSE_LABELS: Record<JourneyPurpose, string> = {
  viewing: 'Property Viewing',
  inspection: 'Property Inspection',
  maintenance: 'Maintenance Visit',
  tenant_meeting: 'Tenant Meeting',
  other: 'Other',
};
