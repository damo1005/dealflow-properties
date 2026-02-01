-- Accommodation requests table
CREATE TABLE IF NOT EXISTS public.accommodation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL, -- 'seeking' or 'offering'
  status TEXT DEFAULT 'active', -- active, fulfilled, expired, cancelled
  
  -- Basic details
  location TEXT NOT NULL,
  postcode_area TEXT,
  property_type TEXT[] DEFAULT '{}',
  
  -- Guest/tenant details
  number_of_guests INTEGER DEFAULT 1,
  has_children BOOLEAN DEFAULT false,
  has_pets BOOLEAN DEFAULT false,
  
  -- Budget & dates
  budget_max INTEGER NOT NULL,
  budget_min INTEGER,
  move_in_date DATE,
  move_out_date DATE,
  duration_months INTEGER,
  
  -- Requirements
  self_contained BOOLEAN DEFAULT false,
  no_sharing BOOLEAN DEFAULT false,
  parking_required BOOLEAN DEFAULT false,
  furnished BOOLEAN,
  
  -- Description
  title TEXT NOT NULL,
  description TEXT,
  special_requirements TEXT,
  
  -- Contact
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  preferred_contact_method TEXT DEFAULT 'platform',
  whatsapp_number TEXT,
  
  -- Visibility
  is_public BOOLEAN DEFAULT true,
  show_contact_details BOOLEAN DEFAULT false,
  
  -- Engagement
  view_count INTEGER DEFAULT 0,
  enquiry_count INTEGER DEFAULT 0,
  
  -- Metadata
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries/responses to requests
CREATE TABLE IF NOT EXISTS public.request_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.accommodation_requests(id) ON DELETE CASCADE,
  enquirer_user_id UUID NOT NULL,
  
  -- Enquiry details
  message TEXT NOT NULL,
  property_id TEXT,
  offered_price INTEGER,
  available_from DATE,
  
  -- Contact exchange
  contact_details_shared BOOLEAN DEFAULT false,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected, withdrawn
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved/watched requests
CREATE TABLE IF NOT EXISTS public.saved_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  request_id UUID NOT NULL REFERENCES public.accommodation_requests(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, request_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_accommodation_requests_user ON public.accommodation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_accommodation_requests_status ON public.accommodation_requests(status);
CREATE INDEX IF NOT EXISTS idx_accommodation_requests_location ON public.accommodation_requests(postcode_area);
CREATE INDEX IF NOT EXISTS idx_accommodation_requests_created ON public.accommodation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_request_enquiries_request ON public.request_enquiries(request_id);
CREATE INDEX IF NOT EXISTS idx_request_enquiries_user ON public.request_enquiries(enquirer_user_id);

-- Enable RLS
ALTER TABLE public.accommodation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_requests ENABLE ROW LEVEL SECURITY;

-- Policies for accommodation_requests
CREATE POLICY "Anyone can view active public requests"
  ON public.accommodation_requests FOR SELECT
  USING (is_public = true AND status = 'active');

CREATE POLICY "Users can view own requests"
  ON public.accommodation_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests"
  ON public.accommodation_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests"
  ON public.accommodation_requests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own requests"
  ON public.accommodation_requests FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for request_enquiries
CREATE POLICY "Users can view enquiries on their requests"
  ON public.request_enquiries FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.accommodation_requests WHERE id = request_id
    ) OR auth.uid() = enquirer_user_id
  );

CREATE POLICY "Users can create enquiries"
  ON public.request_enquiries FOR INSERT
  WITH CHECK (auth.uid() = enquirer_user_id);

CREATE POLICY "Users can update own enquiries"
  ON public.request_enquiries FOR UPDATE
  USING (auth.uid() = enquirer_user_id);

-- Policies for saved_requests
CREATE POLICY "Users can view own saved requests"
  ON public.saved_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save requests"
  ON public.saved_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete saved requests"
  ON public.saved_requests FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update trigger
CREATE TRIGGER update_accommodation_requests_updated_at
  BEFORE UPDATE ON public.accommodation_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();