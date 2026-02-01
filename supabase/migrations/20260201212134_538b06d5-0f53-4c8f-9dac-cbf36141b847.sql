-- Add missing columns to user_saved_searches
ALTER TABLE user_saved_searches 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS radius INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS min_price INTEGER,
ADD COLUMN IF NOT EXISTS max_price INTEGER,
ADD COLUMN IF NOT EXISTS min_beds INTEGER,
ADD COLUMN IF NOT EXISTS max_beds INTEGER,
ADD COLUMN IF NOT EXISTS property_types TEXT[],
ADD COLUMN IF NOT EXISTS include_sstc BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS alert_frequency TEXT DEFAULT 'instant',
ADD COLUMN IF NOT EXISTS alert_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS alert_push BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS alert_in_app BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_checked TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS new_listings_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add missing columns to notifications
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS listing_id UUID REFERENCES property_listings(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS data JSONB,
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS push_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS push_sent_at TIMESTAMPTZ;

-- Update existing 'read' column to 'is_read' via data migration if needed
UPDATE notifications SET is_read = read WHERE is_read IS NULL AND read IS NOT NULL;

-- Add missing columns to user_notification_preferences
ALTER TABLE user_notification_preferences
ADD COLUMN IF NOT EXISTS email_new_listings BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_price_drops BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_digest BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_digest_frequency TEXT DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS push_new_listings BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS push_price_drops BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS quiet_hours_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS quiet_hours_start TIME DEFAULT '22:00',
ADD COLUMN IF NOT EXISTS quiet_hours_end TIME DEFAULT '08:00',
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/London';

-- Create listing_price_history table
CREATE TABLE IF NOT EXISTS listing_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES property_listings(id) ON DELETE CASCADE NOT NULL,
  price INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alert_check_log table
CREATE TABLE IF NOT EXISTS alert_check_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_search_id UUID REFERENCES user_saved_searches(id) ON DELETE CASCADE,
  listings_found INTEGER DEFAULT 0,
  new_listings INTEGER DEFAULT 0,
  alerts_sent INTEGER DEFAULT 0,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_listing ON notifications(listing_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON user_saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_alert ON user_saved_searches(alert_enabled, last_checked);
CREATE INDEX IF NOT EXISTS idx_price_history_listing ON listing_price_history(listing_id, recorded_at DESC);

-- Enable RLS on new tables
ALTER TABLE listing_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_check_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Public read price history" ON listing_price_history;
CREATE POLICY "Public read price history" ON listing_price_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users see own alert logs" ON alert_check_log;
CREATE POLICY "Users see own alert logs" ON alert_check_log FOR SELECT USING (
  saved_search_id IN (SELECT id FROM user_saved_searches WHERE user_id = auth.uid())
);

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM notifications 
  WHERE user_id = p_user_id AND is_read = false AND is_archived = false;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;