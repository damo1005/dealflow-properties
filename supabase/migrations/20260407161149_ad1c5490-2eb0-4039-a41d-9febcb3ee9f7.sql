
-- Active construction sites
CREATE TABLE IF NOT EXISTS construction_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_reference TEXT UNIQUE,
  site_name TEXT,
  address TEXT NOT NULL,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  local_authority TEXT,
  project_type TEXT,
  description TEXT,
  estimated_value DECIMAL,
  units_count INTEGER,
  client_name TEXT,
  contractor_name TEXT,
  contractor_phone TEXT,
  contractor_email TEXT,
  site_manager TEXT,
  site_manager_phone TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  expected_completion DATE,
  is_ccs_registered BOOLEAN DEFAULT false,
  ccs_score DECIMAL(2,1),
  data_source TEXT DEFAULT 'generated',
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Renovation opportunities
CREATE TABLE IF NOT EXISTS renovation_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  property_type TEXT,
  bedrooms INTEGER,
  build_year INTEGER,
  epc_rating TEXT,
  epc_potential TEXT,
  estimated_condition TEXT,
  renovation_potential TEXT,
  work_types TEXT[],
  estimated_cost_low DECIMAL,
  estimated_cost_high DECIMAL,
  data_source TEXT DEFAULT 'generated',
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Local contractors directory
CREATE TABLE IF NOT EXISTS local_contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL UNIQUE,
  trading_name TEXT,
  company_number TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  trade_categories TEXT[],
  specialties TEXT[],
  service_radius_miles INTEGER DEFAULT 25,
  checkatrade_url TEXT,
  checkatrade_rating DECIMAL(2,1),
  checkatrade_reviews INTEGER,
  google_rating DECIMAL(2,1),
  google_reviews INTEGER,
  is_gas_safe BOOLEAN DEFAULT false,
  gas_safe_number TEXT,
  is_niceic BOOLEAN DEFAULT false,
  is_trustmark BOOLEAN DEFAULT false,
  is_federation_master_builders BOOLEAN DEFAULT false,
  established_year INTEGER,
  employees_count TEXT,
  data_source TEXT DEFAULT 'generated',
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Area demand metrics
CREATE TABLE IF NOT EXISTS area_demand_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode_area TEXT NOT NULL UNIQUE,
  planning_apps_count INTEGER DEFAULT 0,
  active_sites_count INTEGER DEFAULT 0,
  renovation_opportunities_count INTEGER DEFAULT 0,
  contractors_count INTEGER DEFAULT 0,
  demand_score INTEGER,
  demand_level TEXT,
  supply_demand_ratio DECIMAL,
  avg_contractor_rating DECIMAL(2,1),
  last_calculated TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sites_location ON construction_sites(latitude, longitude);
CREATE INDEX idx_sites_postcode ON construction_sites(postcode);
CREATE INDEX idx_reno_location ON renovation_opportunities(latitude, longitude);
CREATE INDEX idx_reno_postcode ON renovation_opportunities(postcode);
CREATE INDEX idx_local_contractors_location ON local_contractors(latitude, longitude);
CREATE INDEX idx_local_contractors_postcode ON local_contractors(postcode);

-- RLS
ALTER TABLE construction_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE renovation_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_demand_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sites" ON construction_sites FOR SELECT USING (true);
CREATE POLICY "Public read reno" ON renovation_opportunities FOR SELECT USING (true);
CREATE POLICY "Public read contractors" ON local_contractors FOR SELECT USING (true);
CREATE POLICY "Public read metrics" ON area_demand_metrics FOR SELECT USING (true);

CREATE POLICY "Service insert sites" ON construction_sites FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update sites" ON construction_sites FOR UPDATE USING (true);
CREATE POLICY "Service insert reno" ON renovation_opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update reno" ON renovation_opportunities FOR UPDATE USING (true);
CREATE POLICY "Service insert contractors" ON local_contractors FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update contractors" ON local_contractors FOR UPDATE USING (true);
CREATE POLICY "Service insert metrics" ON area_demand_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update metrics" ON area_demand_metrics FOR UPDATE USING (true);
