-- User Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties table (for full property data)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  address TEXT,
  postcode TEXT,
  price INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  property_type TEXT,
  tenure TEXT,
  images JSONB,
  description TEXT,
  listing_url TEXT,
  data JSONB,
  last_updated TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calculations table
CREATE TABLE IF NOT EXISTS public.calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID REFERENCES public.properties(id),
  calculator_type TEXT,
  inputs JSONB,
  results JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deal Packs table
CREATE TABLE IF NOT EXISTS public.deal_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID REFERENCES public.properties(id),
  template_name TEXT,
  content JSONB,
  pdf_url TEXT,
  share_link TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Logs table
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_type TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_postcode ON public.properties(postcode);
CREATE INDEX IF NOT EXISTS idx_calculations_user ON public.calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_packs_user ON public.deal_packs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_created ON public.usage_logs(user_id, created_at);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Properties policies (public read for cached data)
CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);

-- Calculations policies
CREATE POLICY "Users can view own calculations" ON public.calculations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create calculations" ON public.calculations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calculations" ON public.calculations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own calculations" ON public.calculations FOR DELETE USING (auth.uid() = user_id);

-- Deal Packs policies
CREATE POLICY "Users can view own deal packs" ON public.deal_packs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create deal packs" ON public.deal_packs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own deal packs" ON public.deal_packs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own deal packs" ON public.deal_packs FOR DELETE USING (auth.uid() = user_id);

-- Usage Logs policies
CREATE POLICY "Users can view own usage logs" ON public.usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create usage logs" ON public.usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger for new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();