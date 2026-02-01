-- Deal pack templates
CREATE TABLE IF NOT EXISTS deal_pack_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  color_scheme TEXT DEFAULT 'professional',
  font_family TEXT DEFAULT 'inter',
  primary_color TEXT DEFAULT '#2563eb',
  include_comparables BOOLEAN DEFAULT true,
  include_area_analysis BOOLEAN DEFAULT true,
  include_photos BOOLEAN DEFAULT true,
  include_floor_plan BOOLEAN DEFAULT false,
  include_risk_assessment BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  is_system_template BOOLEAN DEFAULT true,
  created_by UUID,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deal pack views (tracking who viewed)
CREATE TABLE IF NOT EXISTS deal_pack_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_pack_id UUID REFERENCES deal_packs(id) ON DELETE CASCADE,
  viewer_email TEXT,
  viewer_name TEXT,
  viewer_ip INET,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INTEGER,
  pages_viewed INTEGER,
  downloaded BOOLEAN DEFAULT false,
  sections_viewed TEXT[],
  clicked_links TEXT[]
);

-- Deal pack comments/feedback
CREATE TABLE IF NOT EXISTS deal_pack_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_pack_id UUID REFERENCES deal_packs(id) ON DELETE CASCADE,
  commenter_email TEXT NOT NULL,
  commenter_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  section_id TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand profiles (for white-labeling)
CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  tagline TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  linkedin_url TEXT,
  twitter_handle TEXT,
  instagram_handle TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  secondary_color TEXT DEFAULT '#64748b',
  font_family TEXT DEFAULT 'inter',
  company_number TEXT,
  vat_number TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deal pack sections library (reusable content blocks)
CREATE TABLE IF NOT EXISTS deal_pack_section_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  section_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to deal_packs if they don't exist
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS pack_type TEXT;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'::jsonb;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS property_data JSONB;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS calculations JSONB;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS custom_content JSONB;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS contact_details JSONB;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS color_scheme TEXT;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS word_doc_url TEXT;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS powerpoint_url TEXT;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS parent_pack_id UUID;
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE deal_packs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deal_pack_templates_type ON deal_pack_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_deal_pack_views_pack ON deal_pack_views(deal_pack_id);
CREATE INDEX IF NOT EXISTS idx_deal_pack_comments_pack ON deal_pack_comments(deal_pack_id);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user ON brand_profiles(user_id);

-- Enable RLS
ALTER TABLE deal_pack_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_pack_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_pack_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_pack_section_library ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view system templates"
  ON deal_pack_templates FOR SELECT
  USING (is_system_template = true);

CREATE POLICY "Users can view own templates"
  ON deal_pack_templates FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Users can create templates"
  ON deal_pack_templates FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates"
  ON deal_pack_templates FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete own templates"
  ON deal_pack_templates FOR DELETE
  USING (created_by = auth.uid());

CREATE POLICY "Users can manage own brand profiles"
  ON brand_profiles FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own section library"
  ON deal_pack_section_library FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Pack owners can view their views"
  ON deal_pack_views FOR SELECT
  USING (
    deal_pack_id IN (
      SELECT id FROM deal_packs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert views"
  ON deal_pack_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Pack owners can view comments"
  ON deal_pack_comments FOR SELECT
  USING (
    deal_pack_id IN (
      SELECT id FROM deal_packs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert comments"
  ON deal_pack_comments FOR INSERT
  WITH CHECK (true);

-- Insert default system templates
INSERT INTO deal_pack_templates (name, description, template_type, sections, is_system_template, is_default) VALUES
('Professional BTL Report', 'Comprehensive Buy-to-Let analysis with cash flow projections', 'btl', 
 '[{"id":"cover","title":"Cover Page","enabled":true,"order":0},{"id":"executive","title":"Executive Summary","enabled":true,"order":1},{"id":"property","title":"Property Overview","enabled":true,"order":2},{"id":"financial","title":"Financial Analysis","enabled":true,"order":3},{"id":"market","title":"Market Analysis","enabled":true,"order":4},{"id":"strategy","title":"Investment Strategy","enabled":true,"order":5},{"id":"risk","title":"Risk Assessment","enabled":true,"order":6},{"id":"next-steps","title":"Next Steps","enabled":true,"order":7},{"id":"about","title":"About Us","enabled":true,"order":8}]'::jsonb,
 true, true),
('BRR Investment Pack', 'Buy-Refurb-Refinance analysis with refurbishment costs', 'brr',
 '[{"id":"cover","title":"Cover Page","enabled":true,"order":0},{"id":"executive","title":"Executive Summary","enabled":true,"order":1},{"id":"property","title":"Property Overview","enabled":true,"order":2},{"id":"refurb","title":"Refurbishment Plan","enabled":true,"order":3},{"id":"financial","title":"Financial Analysis","enabled":true,"order":4},{"id":"exit","title":"Exit Strategy","enabled":true,"order":5},{"id":"risk","title":"Risk Assessment","enabled":true,"order":6}]'::jsonb,
 true, false),
('HMO Business Plan', 'Multi-let analysis with room-by-room breakdown', 'hmo',
 '[{"id":"cover","title":"Cover Page","enabled":true,"order":0},{"id":"executive","title":"Executive Summary","enabled":true,"order":1},{"id":"property","title":"Property Overview","enabled":true,"order":2},{"id":"rooms","title":"Room Analysis","enabled":true,"order":3},{"id":"licensing","title":"Licensing Requirements","enabled":true,"order":4},{"id":"financial","title":"Financial Analysis","enabled":true,"order":5},{"id":"management","title":"Management Plan","enabled":true,"order":6}]'::jsonb,
 true, false),
('JV Partner Proposal', 'Partnership pitch with equity split options', 'jv',
 '[{"id":"cover","title":"Cover Page","enabled":true,"order":0},{"id":"opportunity","title":"The Opportunity","enabled":true,"order":1},{"id":"property","title":"Property Overview","enabled":true,"order":2},{"id":"financial","title":"Financial Projections","enabled":true,"order":3},{"id":"structure","title":"Partnership Structure","enabled":true,"order":4},{"id":"returns","title":"Returns Distribution","enabled":true,"order":5},{"id":"exit","title":"Exit Strategy","enabled":true,"order":6},{"id":"about","title":"About Us","enabled":true,"order":7}]'::jsonb,
 true, false),
('Lender Submission', 'Bank-ready format with conservative projections', 'lender',
 '[{"id":"cover","title":"Cover Page","enabled":true,"order":0},{"id":"executive","title":"Executive Summary","enabled":true,"order":1},{"id":"borrower","title":"Borrower Profile","enabled":true,"order":2},{"id":"property","title":"Property Details","enabled":true,"order":3},{"id":"valuation","title":"Valuation Evidence","enabled":true,"order":4},{"id":"financial","title":"Financial Analysis","enabled":true,"order":5},{"id":"exit","title":"Exit Strategy","enabled":true,"order":6},{"id":"documents","title":"Supporting Documents","enabled":true,"order":7}]'::jsonb,
 true, false)
ON CONFLICT DO NOTHING;

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON brand_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_deal_pack_templates_updated_at
  BEFORE UPDATE ON deal_pack_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();