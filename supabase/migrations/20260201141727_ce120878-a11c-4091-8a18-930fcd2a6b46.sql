-- Phase 10: Growth & Community Features (Fixed)

-- Feature 10C: Auction Integration - Add alerts table
CREATE TABLE IF NOT EXISTS public.auction_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  postcodes TEXT[] DEFAULT '{}',
  property_types TEXT[] DEFAULT '{}',
  max_guide_price DECIMAL(12,2),
  min_yield DECIMAL(5,2),
  auction_houses TEXT[] DEFAULT '{}',
  notify_new_lots BOOLEAN DEFAULT true,
  notify_price_changes BOOLEAN DEFAULT true,
  notify_auction_reminder BOOLEAN DEFAULT true,
  reminder_days_before INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature 10D: Insurance Management
CREATE TABLE IF NOT EXISTS public.insurance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  policy_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  policy_number TEXT,
  buildings_cover DECIMAL(12,2),
  contents_cover DECIMAL(12,2),
  liability_cover DECIMAL(12,2),
  rent_guarantee_months INTEGER,
  legal_expenses_cover DECIMAL(10,2),
  excess_amount DECIMAL(10,2),
  annual_premium DECIMAL(10,2),
  payment_frequency TEXT DEFAULT 'annual',
  monthly_premium DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  policy_document_url TEXT,
  status TEXT DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.insurance_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  quote_reference TEXT,
  policy_type TEXT,
  buildings_cover DECIMAL(12,2),
  contents_cover DECIMAL(12,2),
  excess_amount DECIMAL(10,2),
  features JSONB DEFAULT '{}',
  annual_premium DECIMAL(10,2),
  quote_date DATE,
  valid_until DATE,
  status TEXT DEFAULT 'quoted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature 10E: Legal Document Templates
CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  template_content TEXT NOT NULL,
  placeholders JSONB DEFAULT '[]',
  version TEXT,
  last_updated DATE,
  jurisdiction TEXT DEFAULT 'england_wales',
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  tenancy_id UUID REFERENCES public.tenancies(id) ON DELETE SET NULL,
  document_name TEXT NOT NULL,
  filled_content TEXT NOT NULL,
  filled_values JSONB DEFAULT '{}',
  pdf_url TEXT,
  status TEXT DEFAULT 'draft',
  sent_for_signing_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signed_document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.auction_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own auction alerts" ON public.auction_alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own insurance policies" ON public.insurance_policies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own insurance quotes" ON public.insurance_quotes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view document templates" ON public.document_templates FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Users can manage own generated documents" ON public.generated_documents FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_auction_alerts_user ON public.auction_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_insurance_policies_user ON public.insurance_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_insurance_quotes_user ON public.insurance_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user ON public.generated_documents(user_id);

-- Trigger
CREATE TRIGGER update_insurance_policies_updated_at BEFORE UPDATE ON public.insurance_policies 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed document templates
INSERT INTO public.document_templates (name, description, category, template_content, placeholders, version, last_updated) VALUES
('Assured Shorthold Tenancy Agreement', 'Standard AST for England & Wales', 'tenancy', 'ASSURED SHORTHOLD TENANCY AGREEMENT

This Agreement is made on {{agreement_date}}

BETWEEN:
Landlord: {{landlord_name}} of {{landlord_address}}
Tenant: {{tenant_name}}

PROPERTY: {{property_address}}

TERM: {{tenancy_start_date}} to {{tenancy_end_date}}
RENT: {{rent_amount}} per {{rent_period}}
DEPOSIT: {{deposit_amount}}', 
'["agreement_date", "landlord_name", "landlord_address", "tenant_name", "property_address", "tenancy_start_date", "tenancy_end_date", "rent_amount", "rent_period", "deposit_amount"]', 'v3.2', '2026-01-15'),
('Section 21 Notice (Form 6A)', 'No-fault eviction notice - 2 months minimum', 'notices', 'NOTICE REQUIRING POSSESSION
(Section 21 Housing Act 1988)

To: {{tenant_name}}
Of: {{property_address}}

I/We give you notice that I/we require possession of the dwelling-house known as {{property_address}} after {{notice_end_date}}.

Dated: {{notice_date}}
Signed: {{landlord_name}}', 
'["tenant_name", "property_address", "notice_end_date", "notice_date", "landlord_name"]', 'v2.1', '2026-01-10'),
('Section 13 Rent Increase Notice', 'Formal rent increase for periodic tenancy', 'notices', 'NOTICE OF INCREASE OF RENT
(Section 13 Housing Act 1988)

To: {{tenant_name}}
Address: {{property_address}}

I propose to increase the rent from {{current_rent}} to {{new_rent}} per {{rent_period}}.
The new rent will take effect from {{effective_date}}.

Dated: {{notice_date}}
Signed: {{landlord_name}}',
'["tenant_name", "property_address", "current_rent", "new_rent", "rent_period", "effective_date", "notice_date", "landlord_name"]', 'v1.5', '2026-01-12'),
('Late Rent Reminder - Friendly', 'First reminder for overdue rent', 'letters', 'Dear {{tenant_name}},

I hope this letter finds you well. I am writing to remind you that the rent payment of {{rent_amount}} for {{property_address}} was due on {{due_date}} and we have not yet received it.

If you have already made this payment, please disregard this letter.

Kind regards,
{{landlord_name}}',
'["tenant_name", "rent_amount", "property_address", "due_date", "landlord_name"]', 'v1.2', '2026-01-08'),
('Late Rent Warning - Formal', 'Second notice before legal action', 'letters', 'FORMAL NOTICE - RENT ARREARS

Dear {{tenant_name}},

Despite our previous reminder, we have not received payment for rent arrears totaling {{arrears_amount}} for the property at {{property_address}}.

We must receive full payment within 14 days of the date of this letter to avoid further action.

Yours faithfully,
{{landlord_name}}',
'["tenant_name", "arrears_amount", "property_address", "landlord_name"]', 'v1.3', '2026-01-08');