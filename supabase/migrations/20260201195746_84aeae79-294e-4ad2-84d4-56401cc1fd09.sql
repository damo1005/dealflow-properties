-- CCS Projects cache table
CREATE TABLE IF NOT EXISTS public.ccs_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ccs_project_id TEXT UNIQUE NOT NULL,
  
  -- Project info
  project_name TEXT,
  project_description TEXT,
  project_category TEXT,
  
  -- Location
  address_line1 TEXT,
  address_line2 TEXT,
  address_line3 TEXT,
  town TEXT,
  county TEXT,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  region TEXT,
  local_authority TEXT,
  
  -- Companies
  client_name TEXT,
  client_contact TEXT,
  contractor_name TEXT,
  contractor_contact TEXT,
  
  -- Site Manager (key contact!)
  site_manager_name TEXT,
  site_manager_phone TEXT,
  site_manager_email TEXT,
  
  -- CCS Scores (from monitoring visits)
  overall_score DECIMAL(3,1),
  community_score DECIMAL(3,1),
  environment_score DECIMAL(3,1),
  workforce_score DECIMAL(3,1),
  last_visit_date DATE,
  visit_count INTEGER DEFAULT 0,
  
  -- Status
  is_ultra_site BOOLEAN DEFAULT false,
  has_award BOOLEAN DEFAULT false,
  award_details TEXT,
  registration_start DATE,
  registration_end DATE,
  
  -- Sync tracking
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  raw_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CCS metadata cache table
CREATE TABLE IF NOT EXISTS public.ccs_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metadata_type TEXT NOT NULL, -- 'region', 'local_authority', 'project_category'
  code TEXT,
  name TEXT NOT NULL,
  parent_code TEXT,
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metadata_type, code)
);

-- User's tracked CCS projects
CREATE TABLE IF NOT EXISTS public.tracked_ccs_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  ccs_project_id TEXT NOT NULL REFERENCES public.ccs_projects(ccs_project_id) ON DELETE CASCADE,
  notes TEXT,
  alert_on_score_change BOOLEAN DEFAULT true,
  alert_on_completion BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ccs_project_id)
);

-- User's saved contractors (from CCS data)
CREATE TABLE IF NOT EXISTS public.saved_contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- From CCS
  contractor_name TEXT NOT NULL,
  ccs_entity_id TEXT,
  
  -- Contact details
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  
  -- Quality metrics
  avg_ccs_score DECIMAL(3,1),
  total_projects INTEGER,
  active_projects INTEGER,
  
  -- User tracking
  status TEXT DEFAULT 'saved', -- 'saved', 'contacted', 'quoted', 'hired', 'completed', 'blacklisted'
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  notes TEXT,
  last_contact_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contractor_name)
);

-- Indexes for fast searches
CREATE INDEX IF NOT EXISTS idx_ccs_projects_postcode ON public.ccs_projects(postcode);
CREATE INDEX IF NOT EXISTS idx_ccs_projects_region ON public.ccs_projects(region);
CREATE INDEX IF NOT EXISTS idx_ccs_projects_contractor ON public.ccs_projects(contractor_name);
CREATE INDEX IF NOT EXISTS idx_ccs_projects_score ON public.ccs_projects(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_ccs_projects_location ON public.ccs_projects(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_ccs_projects_category ON public.ccs_projects(project_category);
CREATE INDEX IF NOT EXISTS idx_ccs_metadata_type ON public.ccs_metadata(metadata_type);

-- Enable RLS
ALTER TABLE public.ccs_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ccs_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_ccs_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_contractors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read ccs_projects" ON public.ccs_projects FOR SELECT USING (true);
CREATE POLICY "Public read ccs_metadata" ON public.ccs_metadata FOR SELECT USING (true);
CREATE POLICY "Users manage tracked projects" ON public.tracked_ccs_projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage saved contractors" ON public.saved_contractors FOR ALL USING (auth.uid() = user_id);

-- Function to find projects near a location using Haversine formula
CREATE OR REPLACE FUNCTION public.find_ccs_projects_near(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_miles INTEGER DEFAULT 5,
  min_score DECIMAL DEFAULT 0,
  category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  ccs_project_id TEXT,
  project_name TEXT,
  project_description TEXT,
  project_category TEXT,
  address_line1 TEXT,
  town TEXT,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  region TEXT,
  client_name TEXT,
  contractor_name TEXT,
  site_manager_name TEXT,
  site_manager_phone TEXT,
  site_manager_email TEXT,
  overall_score DECIMAL,
  community_score DECIMAL,
  environment_score DECIMAL,
  workforce_score DECIMAL,
  is_ultra_site BOOLEAN,
  has_award BOOLEAN,
  award_details TEXT,
  visit_count INTEGER,
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
    p.ccs_project_id,
    p.project_name,
    p.project_description,
    p.project_category,
    p.address_line1,
    p.town,
    p.postcode,
    p.latitude,
    p.longitude,
    p.region,
    p.client_name,
    p.contractor_name,
    p.site_manager_name,
    p.site_manager_phone,
    p.site_manager_email,
    p.overall_score,
    p.community_score,
    p.environment_score,
    p.workforce_score,
    p.is_ultra_site,
    p.has_award,
    p.award_details,
    p.visit_count,
    (
      3959 * acos(
        LEAST(1.0, GREATEST(-1.0,
          cos(radians(search_lat)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(search_lng)) + 
          sin(radians(search_lat)) * sin(radians(p.latitude))
        ))
      )
    )::DECIMAL as distance_miles
  FROM public.ccs_projects p
  WHERE 
    p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND (p.overall_score >= min_score OR p.overall_score IS NULL OR min_score = 0)
    AND (category_filter IS NULL OR p.project_category = category_filter)
    AND (
      3959 * acos(
        LEAST(1.0, GREATEST(-1.0,
          cos(radians(search_lat)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(search_lng)) + 
          sin(radians(search_lat)) * sin(radians(p.latitude))
        ))
      )
    ) <= radius_miles
  ORDER BY p.overall_score DESC NULLS LAST, distance_miles ASC;
END;
$$;

-- Contractor aggregation view
CREATE OR REPLACE VIEW public.contractor_stats AS
SELECT 
  contractor_name,
  COUNT(*) as total_projects,
  COUNT(*) FILTER (WHERE registration_end IS NULL OR registration_end > NOW()) as active_projects,
  ROUND(AVG(overall_score)::numeric, 1) as avg_score,
  MAX(overall_score) as best_score,
  COUNT(*) FILTER (WHERE is_ultra_site) as ultra_sites,
  COUNT(*) FILTER (WHERE has_award) as awards,
  array_agg(DISTINCT region) FILTER (WHERE region IS NOT NULL) as regions,
  array_agg(DISTINCT project_category) FILTER (WHERE project_category IS NOT NULL) as categories
FROM public.ccs_projects
WHERE contractor_name IS NOT NULL
GROUP BY contractor_name
HAVING COUNT(*) >= 1
ORDER BY avg_score DESC NULLS LAST, total_projects DESC;

-- Trigger for updated_at
CREATE TRIGGER update_ccs_projects_updated_at
  BEFORE UPDATE ON public.ccs_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();