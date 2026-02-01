-- =====================================================
-- CONTRACTOR DEMAND FEATURE - NEW TABLES ONLY
-- =====================================================

-- EPC ratings (properties needing work)
CREATE TABLE IF NOT EXISTS epc_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lmk_key TEXT UNIQUE,
  address TEXT,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  local_authority TEXT,
  property_type TEXT,
  built_form TEXT,
  floor_area DECIMAL,
  current_rating TEXT,
  current_score INTEGER,
  potential_rating TEXT,
  potential_score INTEGER,
  walls_description TEXT,
  walls_efficiency TEXT,
  roof_description TEXT,
  roof_efficiency TEXT,
  windows_description TEXT,
  windows_efficiency TEXT,
  heating_description TEXT,
  heating_efficiency TEXT,
  improvement_cost_range TEXT,
  lodgement_date DATE,
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractors (aggregated from multiple sources)
CREATE TABLE IF NOT EXISTS area_contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  trading_name TEXT,
  company_number TEXT,
  source TEXT,
  source_id TEXT,
  source_url TEXT,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  service_radius_miles INTEGER DEFAULT 25,
  regions_served TEXT[],
  phone TEXT,
  email TEXT,
  website TEXT,
  contact_name TEXT,
  trade_categories TEXT[],
  specialties TEXT[],
  ccs_score DECIMAL(3,1),
  ccs_project_count INTEGER,
  checkatrade_score DECIMAL(2,1),
  checkatrade_reviews INTEGER,
  trustmark_registered BOOLEAN DEFAULT false,
  gas_safe_number TEXT,
  niceic_number TEXT,
  fensa_number TEXT,
  company_status TEXT,
  incorporation_date DATE,
  sic_codes TEXT[],
  is_verified BOOLEAN DEFAULT false,
  last_verified DATE,
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_name, source)
);

-- User's saved contractors
CREATE TABLE IF NOT EXISTS user_contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  contractor_id UUID REFERENCES area_contractors(id) ON DELETE CASCADE,
  manual_name TEXT,
  manual_phone TEXT,
  manual_email TEXT,
  manual_trades TEXT[],
  status TEXT DEFAULT 'saved',
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_review TEXT,
  notes TEXT,
  last_contact DATE,
  projects_together INTEGER DEFAULT 0,
  total_spend DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contractor_id)
);

-- User's tracked planning apps
CREATE TABLE IF NOT EXISTS user_tracked_planning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  planning_id UUID REFERENCES planning_applications(id) ON DELETE CASCADE,
  notes TEXT,
  alert_on_decision BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, planning_id)
);

-- User's tracked sites
CREATE TABLE IF NOT EXISTS user_tracked_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  site_id UUID REFERENCES ccs_projects(id) ON DELETE CASCADE,
  notes TEXT,
  interested_in_contractor BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, site_id)
);

-- Precalculated demand scores by postcode district
CREATE TABLE IF NOT EXISTS demand_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode_district TEXT UNIQUE NOT NULL,
  planning_approved_count INTEGER DEFAULT 0,
  planning_pending_count INTEGER DEFAULT 0,
  ccs_active_sites INTEGER DEFAULT 0,
  low_epc_properties INTEGER DEFAULT 0,
  planning_score INTEGER DEFAULT 0,
  construction_score INTEGER DEFAULT 0,
  renovation_score INTEGER DEFAULT 0,
  overall_demand_score INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_epc_postcode ON epc_properties(postcode);
CREATE INDEX IF NOT EXISTS idx_epc_rating ON epc_properties(current_rating);
CREATE INDEX IF NOT EXISTS idx_epc_location ON epc_properties(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_area_contractors_postcode ON area_contractors(postcode);
CREATE INDEX IF NOT EXISTS idx_area_contractors_trades ON area_contractors USING GIN(trade_categories);
CREATE INDEX IF NOT EXISTS idx_area_contractors_location ON area_contractors(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_demand_district ON demand_scores(postcode_district);
CREATE INDEX IF NOT EXISTS idx_demand_score ON demand_scores(overall_demand_score DESC);

-- RLS Policies for new tables
ALTER TABLE epc_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tracked_planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tracked_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read epc" ON epc_properties FOR SELECT USING (true);
CREATE POLICY "Public read contractors" ON area_contractors FOR SELECT USING (true);
CREATE POLICY "Public read demand" ON demand_scores FOR SELECT USING (true);

CREATE POLICY "Users manage own contractors" ON user_contractors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage tracked planning" ON user_tracked_planning FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage tracked sites" ON user_tracked_sites FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Find EPC properties near a location
CREATE OR REPLACE FUNCTION find_epc_near(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_miles INTEGER DEFAULT 5,
  rating_filter TEXT[] DEFAULT ARRAY['D', 'E', 'F', 'G']
)
RETURNS TABLE (
  id UUID,
  lmk_key TEXT,
  address TEXT,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  property_type TEXT,
  built_form TEXT,
  floor_area DECIMAL,
  current_rating TEXT,
  current_score INTEGER,
  potential_rating TEXT,
  potential_score INTEGER,
  walls_efficiency TEXT,
  roof_efficiency TEXT,
  windows_efficiency TEXT,
  heating_efficiency TEXT,
  distance_miles DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.lmk_key,
    e.address,
    e.postcode,
    e.latitude,
    e.longitude,
    e.property_type,
    e.built_form,
    e.floor_area,
    e.current_rating,
    e.current_score,
    e.potential_rating,
    e.potential_score,
    e.walls_efficiency,
    e.roof_efficiency,
    e.windows_efficiency,
    e.heating_efficiency,
    (3959 * acos(
      LEAST(1.0, GREATEST(-1.0,
        cos(radians(search_lat)) * cos(radians(e.latitude)) * 
        cos(radians(e.longitude) - radians(search_lng)) + 
        sin(radians(search_lat)) * sin(radians(e.latitude))
      ))
    ))::DECIMAL as distance_miles
  FROM epc_properties e
  WHERE 
    e.latitude IS NOT NULL 
    AND e.longitude IS NOT NULL
    AND e.current_rating = ANY(rating_filter)
    AND (
      3959 * acos(
        LEAST(1.0, GREATEST(-1.0,
          cos(radians(search_lat)) * cos(radians(e.latitude)) * 
          cos(radians(e.longitude) - radians(search_lng)) + 
          sin(radians(search_lat)) * sin(radians(e.latitude))
        ))
      )
    ) <= radius_miles
  ORDER BY e.current_score ASC, distance_miles ASC;
END;
$$;

-- Find contractors near a location
CREATE OR REPLACE FUNCTION find_contractors_near(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_miles INTEGER DEFAULT 25,
  trade_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  company_name TEXT,
  trading_name TEXT,
  source TEXT,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  phone TEXT,
  email TEXT,
  website TEXT,
  trade_categories TEXT[],
  specialties TEXT[],
  ccs_score DECIMAL,
  ccs_project_count INTEGER,
  checkatrade_score DECIMAL,
  checkatrade_reviews INTEGER,
  trustmark_registered BOOLEAN,
  is_verified BOOLEAN,
  distance_miles DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.company_name,
    c.trading_name,
    c.source,
    c.postcode,
    c.latitude,
    c.longitude,
    c.phone,
    c.email,
    c.website,
    c.trade_categories,
    c.specialties,
    c.ccs_score,
    c.ccs_project_count,
    c.checkatrade_score,
    c.checkatrade_reviews,
    c.trustmark_registered,
    c.is_verified,
    (3959 * acos(
      LEAST(1.0, GREATEST(-1.0,
        cos(radians(search_lat)) * cos(radians(c.latitude)) * 
        cos(radians(c.longitude) - radians(search_lng)) + 
        sin(radians(search_lat)) * sin(radians(c.latitude))
      ))
    ))::DECIMAL as distance_miles
  FROM area_contractors c
  WHERE 
    c.latitude IS NOT NULL 
    AND c.longitude IS NOT NULL
    AND (trade_filter IS NULL OR trade_filter = ANY(c.trade_categories))
    AND (
      3959 * acos(
        LEAST(1.0, GREATEST(-1.0,
          cos(radians(search_lat)) * cos(radians(c.latitude)) * 
          cos(radians(c.longitude) - radians(search_lng)) + 
          sin(radians(search_lat)) * sin(radians(c.latitude))
        ))
      )
    ) <= radius_miles
  ORDER BY c.ccs_score DESC NULLS LAST, c.checkatrade_score DESC NULLS LAST, distance_miles ASC;
END;
$$;

-- Find planning applications near a location (using existing table columns)
CREATE OR REPLACE FUNCTION find_planning_near(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_miles INTEGER DEFAULT 5,
  status_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  reference TEXT,
  address TEXT,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  local_authority TEXT,
  description TEXT,
  application_type TEXT,
  development_type TEXT,
  proposed_units INTEGER,
  status TEXT,
  submitted_date DATE,
  decision_date DATE,
  applicant_name TEXT,
  agent_company TEXT,
  distance_miles DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.application_reference,
    p.property_address,
    p.postcode,
    p.latitude,
    p.longitude,
    p.local_authority_name,
    p.proposal_description,
    p.application_type,
    p.development_type,
    p.number_of_units_proposed,
    p.status,
    p.received_date,
    p.decision_date,
    p.applicant_name,
    p.agent_company,
    (3959 * acos(
      LEAST(1.0, GREATEST(-1.0,
        cos(radians(search_lat)) * cos(radians(p.latitude)) * 
        cos(radians(p.longitude) - radians(search_lng)) + 
        sin(radians(search_lat)) * sin(radians(p.latitude))
      ))
    ))::DECIMAL as distance_miles
  FROM planning_applications p
  WHERE 
    p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND (status_filter IS NULL OR p.status = status_filter)
    AND (
      3959 * acos(
        LEAST(1.0, GREATEST(-1.0,
          cos(radians(search_lat)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(search_lng)) + 
          sin(radians(search_lat)) * sin(radians(p.latitude))
        ))
      )
    ) <= radius_miles
  ORDER BY distance_miles ASC;
END;
$$;

-- Calculate demand score for a postcode district
CREATE OR REPLACE FUNCTION calculate_demand_score(district TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  planning_count INTEGER;
  ccs_count INTEGER;
  epc_count INTEGER;
  score INTEGER;
BEGIN
  SELECT COUNT(*) INTO planning_count
  FROM planning_applications
  WHERE postcode LIKE district || '%'
    AND status = 'approved'
    AND decision_date > NOW() - INTERVAL '12 months';
  
  SELECT COUNT(*) INTO ccs_count
  FROM ccs_projects
  WHERE postcode LIKE district || '%';
  
  SELECT COUNT(*) INTO epc_count
  FROM epc_properties
  WHERE postcode LIKE district || '%'
    AND current_rating IN ('D', 'E', 'F', 'G')
    AND lodgement_date > NOW() - INTERVAL '3 years';
  
  score := LEAST(100, (
    (COALESCE(planning_count, 0) * 5) +
    (COALESCE(ccs_count, 0) * 10) +
    (COALESCE(epc_count, 0) * 0.5)
  )::INTEGER);
  
  RETURN score;
END;
$$;

-- Refresh all demand scores
CREATE OR REPLACE FUNCTION refresh_demand_scores()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  district TEXT;
BEGIN
  FOR district IN 
    SELECT DISTINCT SPLIT_PART(postcode, ' ', 1) as district
    FROM planning_applications
    WHERE postcode IS NOT NULL
    UNION
    SELECT DISTINCT SPLIT_PART(postcode, ' ', 1)
    FROM ccs_projects
    WHERE postcode IS NOT NULL
    UNION
    SELECT DISTINCT SPLIT_PART(postcode, ' ', 1)
    FROM epc_properties
    WHERE postcode IS NOT NULL
  LOOP
    INSERT INTO demand_scores (postcode_district, overall_demand_score, calculated_at)
    VALUES (district, calculate_demand_score(district), NOW())
    ON CONFLICT (postcode_district) 
    DO UPDATE SET 
      overall_demand_score = calculate_demand_score(district),
      calculated_at = NOW();
  END LOOP;
END;
$$;