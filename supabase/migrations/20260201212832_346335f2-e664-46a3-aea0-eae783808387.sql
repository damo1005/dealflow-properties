-- Push notification subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Push subscription data (from browser)
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  
  -- Device info
  user_agent TEXT,
  device_name TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_used TIMESTAMPTZ,
  failed_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, endpoint)
);

-- Email digest tracking
CREATE TABLE public.email_digest_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Digest details
  digest_type TEXT NOT NULL, -- 'daily', 'weekly'
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  
  -- Content summary
  new_listings_count INTEGER DEFAULT 0,
  price_drops_count INTEGER DEFAULT 0,
  saved_searches_count INTEGER DEFAULT 0,
  
  -- Delivery
  email_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  email_id TEXT, -- from email provider
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_push_subs_user ON public.push_subscriptions(user_id, is_active);
CREATE INDEX idx_digest_log_user ON public.email_digest_log(user_id, digest_type, created_at DESC);

-- RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_digest_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own push subs" ON public.push_subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own digest logs" ON public.email_digest_log FOR SELECT USING (auth.uid() = user_id);