-- ═══════════════════════════════════════════════════════════════════
-- ENHANCE EXISTING TABLES
-- ═══════════════════════════════════════════════════════════════════

-- Add columns to rent_payments that are missing
ALTER TABLE public.rent_payments 
ADD COLUMN IF NOT EXISTS due_date date,
ADD COLUMN IF NOT EXISTS amount decimal(10,2),
ADD COLUMN IF NOT EXISTS payment_date date,
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS late_fee decimal(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_reference text,
ADD COLUMN IF NOT EXISTS notes text;

-- Update expected_date to due_date if due_date is null
UPDATE public.rent_payments SET due_date = expected_date WHERE due_date IS NULL;
UPDATE public.rent_payments SET amount = expected_amount WHERE amount IS NULL;
UPDATE public.rent_payments SET payment_date = actual_date WHERE payment_date IS NULL;

-- Enhance tenancies table with additional fields
ALTER TABLE public.tenancies
ADD COLUMN IF NOT EXISTS rent_frequency text DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS deposit_reference text,
ADD COLUMN IF NOT EXISTS guarantor_name text,
ADD COLUMN IF NOT EXISTS guarantor_phone text,
ADD COLUMN IF NOT EXISTS guarantor_email text,
ADD COLUMN IF NOT EXISTS emergency_contact_name text,
ADD COLUMN IF NOT EXISTS emergency_contact_phone text,
ADD COLUMN IF NOT EXISTS notice_period_days integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS tenancy_type text DEFAULT 'AST',
ADD COLUMN IF NOT EXISTS rent_due_day integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Enhance compliance_items table
ALTER TABLE public.compliance_items
ADD COLUMN IF NOT EXISTS reminder_days_before integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS reminder_sent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_renew boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS contractor_name text,
ADD COLUMN IF NOT EXISTS contractor_phone text,
ADD COLUMN IF NOT EXISTS cost decimal(10,2),
ADD COLUMN IF NOT EXISTS document_url text,
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create tenant communications log if not exists
CREATE TABLE IF NOT EXISTS public.tenant_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenancy_id uuid REFERENCES public.tenancies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  communication_type text CHECK (communication_type IN ('email', 'phone', 'letter', 'in_person', 'text')),
  subject text,
  message text,
  direction text CHECK (direction IN ('sent', 'received')),
  attachments text[],
  created_at timestamptz DEFAULT now()
);

-- Create tenancy documents if not exists
CREATE TABLE IF NOT EXISTS public.tenancy_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenancy_id uuid REFERENCES public.tenancies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  document_type text NOT NULL,
  document_name text NOT NULL,
  document_url text,
  uploaded_at timestamptz DEFAULT now()
);

-- Compliance templates (standard UK requirements)
CREATE TABLE IF NOT EXISTS public.compliance_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_type text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  validity_months integer,
  is_mandatory boolean DEFAULT true,
  applies_to text[],
  default_reminder_days integer DEFAULT 30,
  legal_requirement text,
  penalty_for_non_compliance text,
  more_info_url text,
  created_at timestamptz DEFAULT now()
);

-- Compliance alerts log
CREATE TABLE IF NOT EXISTS public.compliance_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_item_id uuid REFERENCES public.compliance_items(id) ON DELETE CASCADE,
  alert_type text CHECK (alert_type IN ('30_days', '14_days', '7_days', 'expired', 'overdue')),
  sent_at timestamptz DEFAULT now(),
  email_sent boolean DEFAULT false,
  email_opened boolean DEFAULT false
);

-- Insert UK compliance requirements
INSERT INTO public.compliance_templates (
  compliance_type, display_name, description, validity_months, is_mandatory, applies_to, default_reminder_days, legal_requirement, penalty_for_non_compliance
) VALUES
('gas_safety', 'Gas Safety Certificate', 'Annual gas safety check by Gas Safe registered engineer', 12, true, ARRAY['btl', 'hmo'], 30, 'Gas Safety (Installation and Use) Regulations 1998', 'Fine up to £6,000 and/or 6 months imprisonment'),
('epc', 'Energy Performance Certificate (EPC)', 'Energy efficiency rating certificate', 120, true, ARRAY['btl', 'hmo', 'commercial'], 60, 'Energy Performance of Buildings Regulations 2012', 'Fine up to £5,000'),
('eicr', 'Electrical Installation Condition Report', '5-yearly electrical safety inspection', 60, true, ARRAY['btl', 'hmo'], 60, 'Electrical Safety Standards Regulations 2020', 'Fine up to £30,000'),
('pat_testing', 'PAT Testing', 'Portable Appliance Testing', 12, false, ARRAY['hmo', 'commercial'], 30, 'Electricity at Work Regulations 1989', 'Potential liability for accidents'),
('hmo_license', 'HMO License', 'License for Houses in Multiple Occupation', 60, true, ARRAY['hmo'], 90, 'Housing Act 2004', 'Unlimited fine'),
('fire_alarm', 'Fire Alarm Certificate', 'Fire alarm system inspection', 12, true, ARRAY['hmo'], 30, 'Regulatory Reform (Fire Safety) Order 2005', 'Unlimited fine'),
('legionella', 'Legionella Risk Assessment', 'Water system risk assessment', 24, true, ARRAY['btl', 'hmo'], 60, 'Health and Safety at Work Act 1974', 'Unlimited fine'),
('building_insurance', 'Buildings Insurance', 'Property buildings insurance', 12, true, ARRAY['btl', 'hmo', 'commercial'], 30, 'Lender requirement', 'Breach of mortgage terms'),
('landlord_insurance', 'Landlord Insurance', 'Public liability and contents insurance', 12, false, ARRAY['btl', 'hmo'], 30, 'Recommended', 'Personal liability for damages')
ON CONFLICT (compliance_type) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_tenant_comms_tenancy ON public.tenant_communications(tenancy_id);
CREATE INDEX IF NOT EXISTS idx_tenancy_docs_tenancy ON public.tenancy_documents(tenancy_id);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_item ON public.compliance_alerts(compliance_item_id);

-- ═══════════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE public.tenant_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenancy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own communications" ON public.tenant_communications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own documents" ON public.tenancy_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read templates" ON public.compliance_templates
  FOR SELECT USING (true);

CREATE POLICY "Users can view own compliance alerts" ON public.compliance_alerts
  FOR ALL USING (
    compliance_item_id IN (
      SELECT ci.id FROM public.compliance_items ci
      JOIN public.portfolio_properties pp ON ci.portfolio_property_id = pp.id
      WHERE pp.user_id = auth.uid()
    )
  );