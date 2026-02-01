-- =============================================
-- PROMPT 1: User Activity Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  entity_type TEXT,
  entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON public.user_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON public.user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- PROMPT 2: Revenue Events Table (Admin Dashboard)
-- =============================================
CREATE TABLE IF NOT EXISTS public.revenue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'gbp',
  customer_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  subscription_id TEXT,
  plan_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revenue_events_created_at ON public.revenue_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_events_user_id ON public.revenue_events(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_events_event_type ON public.revenue_events(event_type);

ALTER TABLE public.revenue_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view revenue" ON public.revenue_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "System can insert revenue" ON public.revenue_events
  FOR INSERT WITH CHECK (true);

-- =============================================
-- PROMPT 2: User Analytics Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_path TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON public.user_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON public.user_analytics(event_type);

ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics" ON public.user_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own analytics" ON public.user_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- PROMPT 4: Community Profiles Table (Demo Data)
-- =============================================
CREATE TABLE IF NOT EXISTS public.community_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  investor_type TEXT,
  portfolio_size TEXT,
  experience_years INTEGER,
  specialties TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_demo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_profiles_investor_type ON public.community_profiles(investor_type);

-- Public read access for demo content
ALTER TABLE public.community_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community profiles" ON public.community_profiles
  FOR SELECT USING (true);

-- =============================================
-- PROMPT 4: Community Posts Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.community_profiles(id),
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion',
  images TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_demo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON public.community_posts(post_type);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community posts" ON public.community_posts
  FOR SELECT USING (true);

-- =============================================
-- PROMPT 4: Community Comments Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.community_profiles(id),
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_demo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments(post_id);

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community comments" ON public.community_comments
  FOR SELECT USING (true);

-- =============================================
-- PROMPT 5: Deal Scout Schema Updates
-- =============================================
ALTER TABLE public.deal_scouts ADD COLUMN IF NOT EXISTS next_scan_at TIMESTAMPTZ;
ALTER TABLE public.deal_scouts ADD COLUMN IF NOT EXISTS api_calls_used INTEGER DEFAULT 0;
ALTER TABLE public.deal_scouts ADD COLUMN IF NOT EXISTS alert_threshold INTEGER DEFAULT 70;