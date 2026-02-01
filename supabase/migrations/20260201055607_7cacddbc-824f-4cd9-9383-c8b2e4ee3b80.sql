-- Alert configurations for accommodation requests
CREATE TABLE request_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  
  -- Alert type
  alert_for TEXT NOT NULL DEFAULT 'seeking', -- 'seeking' or 'offering' or 'both'
  
  -- Location criteria
  location_areas TEXT[],
  location_radius_miles INTEGER,
  location_center_lat DECIMAL(10,8),
  location_center_lng DECIMAL(11,8),
  
  -- Budget criteria
  budget_min INTEGER,
  budget_max INTEGER,
  
  -- Property criteria
  property_types TEXT[],
  
  -- Date criteria
  move_in_date_from DATE,
  move_in_date_to DATE,
  duration_min_months INTEGER,
  duration_max_months INTEGER,
  
  -- Requirements filters
  must_be_self_contained BOOLEAN DEFAULT false,
  must_allow_pets BOOLEAN DEFAULT false,
  must_allow_children BOOLEAN DEFAULT false,
  must_have_parking BOOLEAN DEFAULT false,
  furnished_preference TEXT DEFAULT 'either',
  
  -- Alert delivery
  delivery_methods JSONB DEFAULT '["email", "push"]'::jsonb,
  email_address TEXT,
  phone_number TEXT,
  whatsapp_number TEXT,
  slack_webhook_url TEXT,
  webhook_url TEXT,
  
  -- Frequency
  frequency TEXT DEFAULT 'instant',
  digest_time TIME DEFAULT '09:00:00',
  digest_day INTEGER DEFAULT 1,
  
  -- Smart features
  ai_match_threshold INTEGER DEFAULT 70,
  exclude_keywords TEXT[],
  include_keywords TEXT[],
  
  -- State
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  total_matches_sent INTEGER DEFAULT 0,
  
  -- Rate limiting
  max_alerts_per_day INTEGER DEFAULT 20,
  alerts_sent_today INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert matches history
CREATE TABLE alert_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES request_alerts(id) ON DELETE CASCADE,
  request_id UUID REFERENCES accommodation_requests(id) ON DELETE CASCADE,
  match_score INTEGER,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_method TEXT,
  was_clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMPTZ,
  was_enquired BOOLEAN DEFAULT false,
  enquired_at TIMESTAMPTZ
);

-- Alert engagement tracking
CREATE TABLE alert_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES request_alerts(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Indexes
CREATE INDEX idx_request_alerts_user ON request_alerts(user_id);
CREATE INDEX idx_request_alerts_active ON request_alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_alert_matches_alert ON alert_matches(alert_id);
CREATE INDEX idx_alert_matches_request ON alert_matches(request_id);
CREATE INDEX idx_alert_engagement_alert ON alert_engagement(alert_id);

-- Enable RLS
ALTER TABLE request_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_engagement ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own alerts"
  ON request_alerts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own alert matches"
  ON alert_matches FOR SELECT
  USING (
    alert_id IN (
      SELECT id FROM request_alerts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own engagement"
  ON alert_engagement FOR SELECT
  USING (
    alert_id IN (
      SELECT id FROM request_alerts WHERE user_id = auth.uid()
    )
  );

-- Function to reset daily alert counts
CREATE OR REPLACE FUNCTION reset_daily_alert_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE request_alerts
  SET 
    alerts_sent_today = 0,
    last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_request_alerts_updated_at
  BEFORE UPDATE ON request_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();