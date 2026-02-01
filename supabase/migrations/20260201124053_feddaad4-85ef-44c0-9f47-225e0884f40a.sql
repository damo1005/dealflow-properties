-- DOCUMENT VAULT TABLES
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text,
  file_size bigint,
  file_url text NOT NULL,
  category text,
  portfolio_property_id uuid REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  tenancy_id uuid REFERENCES public.tenancies(id) ON DELETE SET NULL,
  compliance_item_id uuid REFERENCES public.compliance_items(id) ON DELETE SET NULL,
  title text,
  description text,
  tags text[],
  is_favorite boolean DEFAULT false,
  is_shared boolean DEFAULT false,
  share_token uuid UNIQUE,
  share_expires_at timestamptz,
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_property ON public.documents(portfolio_property_id);

CREATE TABLE IF NOT EXISTS public.document_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_name text NOT NULL,
  parent_folder_id uuid REFERENCES public.document_folders(id) ON DELETE CASCADE,
  color text,
  icon text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_folders_user ON public.document_folders(user_id);

CREATE TABLE IF NOT EXISTS public.document_folder_items (
  document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE,
  folder_id uuid REFERENCES public.document_folders(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (document_id, folder_id)
);

-- MAP SEARCH TABLES
CREATE TABLE IF NOT EXISTS public.saved_map_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  search_name text NOT NULL,
  center_lat decimal(10, 7),
  center_lng decimal(10, 7),
  zoom_level integer,
  search_area jsonb,
  filters jsonb,
  enable_alerts boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_saved_map_searches_user ON public.saved_map_searches(user_id);

CREATE TABLE IF NOT EXISTS public.map_heat_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode_area text,
  heat_type text,
  intensity decimal(5,2),
  color text,
  property_count integer,
  avg_price decimal(12,2),
  avg_yield decimal(5,2),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(postcode_area, heat_type)
);

CREATE INDEX IF NOT EXISTS idx_heat_data_postcode ON public.map_heat_data(postcode_area);

-- INTEGRATION CATALOG
CREATE TABLE IF NOT EXISTS public.integration_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  category text,
  logo_url text,
  website_url text,
  requires_api_key boolean DEFAULT true,
  requires_oauth boolean DEFAULT false,
  features text[],
  available_in_tiers text[],
  is_active boolean DEFAULT true,
  is_beta boolean DEFAULT false,
  total_connections integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add columns to existing user_integrations if missing
ALTER TABLE public.user_integrations ADD COLUMN IF NOT EXISTS sync_frequency text DEFAULT 'daily';
ALTER TABLE public.user_integrations ADD COLUMN IF NOT EXISTS sync_errors integer DEFAULT 0;
ALTER TABLE public.user_integrations ADD COLUMN IF NOT EXISTS total_syncs integer DEFAULT 0;

-- RLS POLICIES
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_folder_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_map_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_heat_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own documents" ON public.documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own folders" ON public.document_folders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage folder items" ON public.document_folder_items FOR ALL USING (
  document_id IN (SELECT id FROM public.documents WHERE user_id = auth.uid())
);
CREATE POLICY "Users own map searches" ON public.saved_map_searches FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone reads heat data" ON public.map_heat_data FOR SELECT USING (true);
CREATE POLICY "Anyone reads catalog" ON public.integration_catalog FOR SELECT USING (true);

-- Insert integration catalog data
INSERT INTO public.integration_catalog (integration_key, name, description, category, requires_api_key, requires_oauth, features, available_in_tiers, is_active) VALUES
('stripe', 'Stripe', 'Accept payments and manage subscriptions', 'payments', true, false, ARRAY['Payment processing', 'Subscription management', 'Invoicing'], ARRAY['pro', 'premium'], true),
('xero', 'Xero', 'Sync your property finances with Xero accounting', 'accounting', false, true, ARRAY['Transaction sync', 'Invoice management', 'Tax reports'], ARRAY['pro', 'premium'], true),
('quickbooks', 'QuickBooks', 'Connect to QuickBooks for accounting', 'accounting', false, true, ARRAY['Transaction sync', 'Expense tracking', 'P&L reports'], ARRAY['pro', 'premium'], true),
('google_calendar', 'Google Calendar', 'Sync viewings and maintenance to your calendar', 'communication', false, true, ARRAY['Viewing sync', 'Maintenance reminders', 'Tenancy date alerts'], ARRAY['free', 'pro', 'premium'], true),
('zapier', 'Zapier', 'Connect to 5000+ apps via Zapier', 'automation', true, false, ARRAY['Custom workflows', 'Multi-app automation'], ARRAY['premium'], true),
('propertydata', 'PropertyData', 'Access market intelligence and area statistics', 'analytics', true, false, ARRAY['Market data', 'Area stats', 'Investment hotspots'], ARRAY['premium'], true),
('rightmove', 'Rightmove', 'Import properties from Rightmove searches', 'property_portals', false, false, ARRAY['Property import', 'Auto-save searches', 'Price alerts'], ARRAY['pro', 'premium'], true),
('zoopla', 'Zoopla', 'Import properties from Zoopla searches', 'property_portals', false, false, ARRAY['Property import', 'Market valuations'], ARRAY['pro', 'premium'], true),
('open_banking', 'Open Banking', 'Connect your bank accounts to auto-track transactions', 'banking', false, true, ARRAY['Auto-categorize transactions', 'Rent payment verification'], ARRAY['premium'], true)
ON CONFLICT (integration_key) DO NOTHING;

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
ON CONFLICT (id) DO NOTHING;