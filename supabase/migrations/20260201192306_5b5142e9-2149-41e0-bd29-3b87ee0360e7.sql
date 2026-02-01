-- Construction projects (from planning + active sites)
CREATE TABLE public.construction_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identifiers
  planning_reference TEXT,
  ccs_site_id TEXT, -- Considerate Constructors Scheme ID
  
  -- Location
  address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  
  -- Project details
  project_name TEXT,
  project_type TEXT, -- 'new_build', 'extension', 'conversion', 'refurbishment', 'infrastructure', 'commercial'
  description TEXT,
  units_count INTEGER,
  estimated_value DECIMAL,
  
  -- Status
  status TEXT DEFAULT 'planning', -- 'planning', 'approved', 'active', 'completed'
  is_ccs_registered BOOLEAN DEFAULT false,
  ccs_star_rating DECIMAL(2,1), -- 1-5 stars from CCS
  is_ultra_site BOOLEAN DEFAULT false, -- High-performing CCS site
  has_national_award BOOLEAN DEFAULT false,
  
  -- Dates
  submitted_date DATE,
  approved_date DATE,
  start_date DATE,
  expected_completion DATE,
  
  -- Source tracking
  data_source TEXT, -- 'construction_map', 'planning_data_gov', 'manual'
  source_url TEXT,
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(planning_reference),
  UNIQUE(ccs_site_id)
);

-- Companies/contractors involved in projects
CREATE TABLE public.project_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.construction_projects(id) ON DELETE CASCADE,
  
  -- Company info
  company_name TEXT NOT NULL,
  company_number TEXT, -- Companies House
  role TEXT NOT NULL, -- 'developer', 'client', 'main_contractor', 'subcontractor', 'architect', 'engineer'
  
  -- CCS registration
  is_ccs_registered BOOLEAN DEFAULT false,
  is_ccs_partner BOOLEAN DEFAULT false, -- Contractor/Supplier/Client Partner
  ccs_company_id TEXT,
  
  -- Contact details
  site_contact_name TEXT,
  site_phone TEXT,
  site_email TEXT,
  head_office_phone TEXT,
  head_office_email TEXT,
  website TEXT,
  
  -- Quality indicators
  checkatrade_url TEXT,
  checkatrade_rating DECIMAL(2,1),
  checkatrade_reviews INTEGER,
  ccs_rating DECIMAL(2,1),
  
  -- Companies House enrichment
  company_status TEXT,
  incorporation_date DATE,
  registered_address TEXT,
  sic_codes TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's saved contractors
CREATE TABLE public.my_contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.project_companies(id),
  
  -- Or manually added contractor
  manual_company_name TEXT,
  manual_contact_name TEXT,
  manual_phone TEXT,
  manual_email TEXT,
  manual_trades TEXT[],
  
  -- Relationship tracking
  status TEXT DEFAULT 'saved', -- 'saved', 'contacted', 'quoted', 'hired', 'completed', 'do_not_use'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  last_contact_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's tracked projects
CREATE TABLE public.tracked_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.construction_projects(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  alert_on_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Indexes
CREATE INDEX idx_projects_postcode ON public.construction_projects(postcode);
CREATE INDEX idx_projects_status ON public.construction_projects(status);
CREATE INDEX idx_projects_ccs ON public.construction_projects(is_ccs_registered);
CREATE INDEX idx_projects_location ON public.construction_projects(latitude, longitude);
CREATE INDEX idx_companies_ccs ON public.project_companies(is_ccs_registered);
CREATE INDEX idx_companies_project ON public.project_companies(project_id);
CREATE INDEX idx_my_contractors_user ON public.my_contractors(user_id);
CREATE INDEX idx_tracked_projects_user ON public.tracked_projects(user_id);

-- Enable RLS
ALTER TABLE public.construction_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.my_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view projects" ON public.construction_projects FOR SELECT USING (true);
CREATE POLICY "Public can view companies" ON public.project_companies FOR SELECT USING (true);

CREATE POLICY "Users can view own contractors" ON public.my_contractors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contractors" ON public.my_contractors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contractors" ON public.my_contractors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contractors" ON public.my_contractors FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tracked" ON public.tracked_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tracked" ON public.tracked_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tracked" ON public.tracked_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tracked" ON public.tracked_projects FOR DELETE USING (auth.uid() = user_id);