-- Phase 11: Bank Feeds, Tenant Portal, Deal Finder, Mileage, Regional Calculators
-- First create tenants table if not exists

-- =====================================================
-- Core Tenants Table (prerequisite)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  move_in_date DATE,
  move_out_date DATE,
  rent_amount DECIMAL(10,2),
  deposit_amount DECIMAL(10,2),
  payment_day INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'notice', 'vacated')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tenants" ON public.tenants
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 11A: Bank Feed Integration
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bank_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT DEFAULT 'truelayer',
  institution_id TEXT,
  institution_name TEXT,
  account_id TEXT,
  account_name TEXT,
  account_type TEXT,
  currency TEXT DEFAULT 'GBP',
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ,
  sync_enabled BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_connection_id UUID REFERENCES public.bank_connections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  external_id TEXT,
  transaction_date DATE NOT NULL,
  description TEXT,
  merchant_name TEXT,
  amount DECIMAL(12,2) NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit')),
  category_auto TEXT,
  category_confirmed TEXT,
  property_id_suggested UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  property_id_confirmed UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  matched_transaction_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'created', 'ignored')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bank_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  rule_name TEXT,
  match_type TEXT CHECK (match_type IN ('contains', 'exact', 'regex')),
  match_value TEXT NOT NULL,
  assign_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  assign_category TEXT,
  auto_create BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11B: Tenant Portal
-- =====================================================

CREATE TABLE IF NOT EXISTS public.tenant_portal_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  invite_token TEXT,
  invite_sent_at TIMESTAMPTZ,
  invite_accepted_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('plumbing', 'electrical', 'heating', 'appliance', 'structural', 'other')),
  location TEXT,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'emergency')),
  photo_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'acknowledged', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  landlord_notes TEXT,
  scheduled_date DATE,
  contractor_name TEXT,
  contractor_phone TEXT,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  tenant_rating INTEGER CHECK (tenant_rating BETWEEN 1 AND 5),
  tenant_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tenant_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('tenant', 'landlord')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11C: Property Sourcing Engine
-- =====================================================

CREATE TABLE IF NOT EXISTS public.sourcing_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  postcodes TEXT[] DEFAULT '{}',
  radius_miles INTEGER,
  property_types TEXT[] DEFAULT '{}',
  min_beds INTEGER,
  max_beds INTEGER,
  min_price DECIMAL(12,2),
  max_price DECIMAL(12,2),
  min_yield DECIMAL(5,2),
  max_price_per_sqft DECIMAL(8,2),
  include_keywords TEXT[] DEFAULT '{}',
  exclude_keywords TEXT[] DEFAULT '{}',
  sources TEXT[] DEFAULT ARRAY['rightmove','zoopla','onthemarket'],
  include_auctions BOOLEAN DEFAULT true,
  notify_instant BOOLEAN DEFAULT false,
  notify_daily BOOLEAN DEFAULT true,
  notify_email BOOLEAN DEFAULT true,
  notify_push BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  matches_found INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sourced_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES public.sourcing_alerts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_id TEXT,
  address TEXT,
  postcode TEXT,
  property_type TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  price DECIMAL(12,2),
  price_qualifier TEXT,
  price_history JSONB DEFAULT '[]',
  estimated_rent DECIMAL(10,2),
  estimated_yield DECIMAL(5,2),
  deal_score INTEGER,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  floorplan_url TEXT,
  listing_status TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'saved', 'analysed', 'dismissed')),
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_checked_at TIMESTAMPTZ,
  price_changed_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  saved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11D: Mileage & Expense Tracker
-- =====================================================

CREATE TABLE IF NOT EXISTS public.mileage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  journey_date DATE NOT NULL,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('viewing', 'inspection', 'maintenance', 'tenant_meeting', 'other')),
  miles DECIMAL(8,2) NOT NULL,
  rate_per_mile DECIMAL(5,2) DEFAULT 0.45,
  vehicle TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.expense_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  receipt_url TEXT NOT NULL,
  receipt_date DATE,
  merchant TEXT,
  amount DECIMAL(10,2),
  category TEXT,
  ocr_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Enable RLS
-- =====================================================

ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sourcing_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sourced_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mileage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_receipts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies
-- =====================================================

CREATE POLICY "Users can manage own bank connections" ON public.bank_connections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bank transactions" ON public.bank_transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bank rules" ON public.bank_rules
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage tenant portal users" ON public.tenant_portal_users
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.tenants t WHERE t.id = tenant_id AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage maintenance requests" ON public.maintenance_requests
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.tenants t WHERE t.id = tenant_id AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage tenant messages" ON public.tenant_messages
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.tenants t WHERE t.id = tenant_id AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own sourcing alerts" ON public.sourcing_alerts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sourced properties" ON public.sourced_properties
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own mileage logs" ON public.mileage_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own expense receipts" ON public.expense_receipts
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_tenants_user ON public.tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_user ON public.bank_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_status ON public.bank_transactions(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_tenant ON public.maintenance_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_alerts_user ON public.sourcing_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_sourced_properties_alert ON public.sourced_properties(alert_id);
CREATE INDEX IF NOT EXISTS idx_mileage_logs_user ON public.mileage_logs(user_id);