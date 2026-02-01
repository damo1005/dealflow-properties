-- Drop existing incomplete tables if they exist
DROP TABLE IF EXISTS public.planning_comments CASCADE;
DROP TABLE IF EXISTS public.planning_alerts CASCADE;
DROP TABLE IF EXISTS public.planning_applications CASCADE;

-- Planning Applications table
CREATE TABLE public.planning_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address TEXT NOT NULL,
  postcode TEXT,
  application_reference TEXT NOT NULL,
  local_authority_name TEXT NOT NULL,
  received_date DATE,
  validated_date DATE,
  decision_date DATE,
  appeal_date DATE,
  proposal_description TEXT NOT NULL,
  development_type TEXT,
  application_type TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'refused', 'withdrawn', 'appealed', 'invalid', 'determined')),
  decision TEXT,
  decision_reason TEXT,
  conditions JSONB,
  applicant_name TEXT,
  applicant_type TEXT,
  agent_name TEXT,
  agent_company TEXT,
  existing_use TEXT,
  proposed_use TEXT,
  number_of_units_existing INTEGER,
  number_of_units_proposed INTEGER,
  gross_internal_area DECIMAL(10,2),
  site_area DECIMAL(10,2),
  number_of_storeys INTEGER,
  documents JSONB,
  easting INTEGER,
  northing INTEGER,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  consultation_end_date DATE,
  neighbour_notification_date DATE,
  site_notice_date DATE,
  portal_url TEXT,
  case_officer TEXT,
  ward TEXT,
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planning Comments table
CREATE TABLE public.planning_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.planning_applications(id) ON DELETE CASCADE,
  comment_type TEXT CHECK (comment_type IN ('objection', 'support', 'neutral')),
  comment_text TEXT,
  commenter_name TEXT,
  commenter_address TEXT,
  comment_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planning Alerts table
CREATE TABLE public.planning_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  postcode_area TEXT,
  radius_miles INTEGER DEFAULT 1,
  development_types TEXT[],
  include_approved BOOLEAN DEFAULT true,
  include_pending BOOLEAN DEFAULT true,
  include_refused BOOLEAN DEFAULT false,
  email_frequency TEXT CHECK (email_frequency IN ('immediate', 'daily', 'weekly')) DEFAULT 'weekly',
  last_notified_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_planning_unique_ref ON public.planning_applications(application_reference, local_authority_name);
CREATE INDEX idx_planning_postcode ON public.planning_applications(postcode);
CREATE INDEX idx_planning_status ON public.planning_applications(status);
CREATE INDEX idx_planning_decision_date ON public.planning_applications(decision_date DESC);
CREATE INDEX idx_planning_authority ON public.planning_applications(local_authority_name);
CREATE INDEX idx_planning_comments_app ON public.planning_comments(application_id);
CREATE INDEX idx_planning_alerts_user ON public.planning_alerts(user_id);

-- RLS
ALTER TABLE public.planning_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads planning apps" ON public.planning_applications FOR SELECT USING (true);
CREATE POLICY "Anyone reads comments" ON public.planning_comments FOR SELECT USING (true);
CREATE POLICY "Users own alerts" ON public.planning_alerts FOR ALL USING (auth.uid() = user_id);