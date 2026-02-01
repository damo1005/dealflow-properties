-- Admin users (separate from regular users)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  admin_email TEXT UNIQUE NOT NULL,
  admin_role TEXT CHECK (admin_role IN ('super_admin', 'admin', 'support', 'content_moderator')) DEFAULT 'admin',
  
  can_manage_users BOOLEAN DEFAULT true,
  can_manage_content BOOLEAN DEFAULT true,
  can_view_financials BOOLEAN DEFAULT true,
  can_manage_settings BOOLEAN DEFAULT true,
  can_manage_affiliates BOOLEAN DEFAULT true,
  
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform settings
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  setting_type TEXT,
  category TEXT,
  
  description TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User activity log
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  activity_type TEXT,
  activity_details JSONB,
  
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity_log(created_at);

-- Feature usage tracking
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  feature_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  
  date DATE NOT NULL,
  
  UNIQUE(feature_name, date)
);

CREATE INDEX IF NOT EXISTS idx_feature_usage_date ON feature_usage(date);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON feature_usage(feature_name);

-- Affiliate commission tracking
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID REFERENCES auth.users(id),
  
  affiliate_network TEXT,
  advertiser TEXT,
  
  click_date TIMESTAMPTZ,
  conversion_date TIMESTAMPTZ,
  commission_amount DECIMAL(10,2),
  commission_status TEXT CHECK (commission_status IN ('pending', 'approved', 'paid', 'declined')),
  
  tracking_id TEXT,
  transaction_id TEXT,
  
  mortgage_amount DECIMAL(12,2),
  property_address TEXT,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_user ON affiliate_commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_status ON affiliate_commissions(commission_status);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_date ON affiliate_commissions(conversion_date);

-- Revenue tracking
CREATE TABLE IF NOT EXISTS revenue_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID REFERENCES auth.users(id),
  
  revenue_type TEXT CHECK (revenue_type IN ('subscription', 'affiliate', 'one_time')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  
  plan_name TEXT,
  billing_period TEXT,
  
  transaction_id TEXT,
  payment_method TEXT,
  
  status TEXT CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revenue_user ON revenue_log(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_type ON revenue_log(revenue_type);
CREATE INDEX IF NOT EXISTS idx_revenue_date ON revenue_log(transaction_date);

-- Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  
  user_id UUID REFERENCES auth.users(id),
  
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  
  status TEXT CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')) DEFAULT 'open',
  
  assigned_to UUID REFERENCES admin_users(id),
  
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);

-- Support ticket messages
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  
  sender_id UUID REFERENCES auth.users(id),
  sender_type TEXT CHECK (sender_type IN ('user', 'admin')),
  message TEXT NOT NULL,
  
  attachments TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON support_messages(ticket_id);

-- Admin announcements
CREATE TABLE IF NOT EXISTS admin_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  announcement_type TEXT CHECK (announcement_type IN ('info', 'warning', 'feature', 'maintenance')),
  
  target_users TEXT,
  
  is_active BOOLEAN DEFAULT true,
  show_banner BOOLEAN DEFAULT false,
  show_modal BOOLEAN DEFAULT false,
  
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content moderation queue
CREATE TABLE IF NOT EXISTS moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  content_type TEXT,
  content_id UUID NOT NULL,
  
  reported_by UUID REFERENCES auth.users(id),
  report_reason TEXT,
  
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'removed')) DEFAULT 'pending',
  moderated_by UUID REFERENCES admin_users(id),
  moderation_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  moderated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_type ON moderation_queue(content_type);

-- RLS Policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

-- Admin users can only be accessed by admins
CREATE POLICY "Admins only" ON admin_users FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users WHERE is_active = true)
);

-- Platform settings accessible by admins with settings permission
CREATE POLICY "Admins manage settings" ON platform_settings FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users WHERE can_manage_settings = true AND is_active = true)
);

-- Activity log viewable by admins
CREATE POLICY "Admins view activity" ON user_activity_log FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM admin_users WHERE is_active = true)
);

-- Feature usage viewable by admins
CREATE POLICY "Admins view feature usage" ON feature_usage FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM admin_users WHERE is_active = true)
);

-- Affiliate commissions viewable by admins
CREATE POLICY "Admins manage affiliates" ON affiliate_commissions FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users WHERE can_manage_affiliates = true AND is_active = true)
);

-- Revenue log viewable by admins with financials permission
CREATE POLICY "Admins view revenue" ON revenue_log FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM admin_users WHERE can_view_financials = true AND is_active = true)
);

-- Users can view their own tickets
CREATE POLICY "Users view own tickets" ON support_tickets FOR SELECT USING (
  auth.uid() = user_id
);

-- Admins can view all tickets
CREATE POLICY "Admins manage tickets" ON support_tickets FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users WHERE is_active = true)
);

-- Users can view messages on their tickets
CREATE POLICY "Users view own messages" ON support_messages FOR SELECT USING (
  ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid())
);

-- Admins can manage all messages
CREATE POLICY "Admins manage messages" ON support_messages FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users WHERE is_active = true)
);

-- Announcements viewable by admins
CREATE POLICY "Admins manage announcements" ON admin_announcements FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users WHERE is_active = true)
);

-- Moderation queue for admins with content permission
CREATE POLICY "Admins moderate content" ON moderation_queue FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users WHERE can_manage_content = true AND is_active = true)
);

-- Insert default platform settings
INSERT INTO platform_settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_name', '"DealFlow"', 'string', 'general', 'Platform name'),
('support_email', '"support@dealflow.co.uk"', 'string', 'general', 'Support email address'),
('free_tier_limit', '5', 'number', 'pricing', 'Max properties for free tier'),
('pro_tier_price', '29', 'number', 'pricing', 'Pro tier monthly price (GBP)'),
('premium_tier_price', '99', 'number', 'pricing', 'Premium tier monthly price (GBP)'),
('enable_mortgage_comparison', 'true', 'boolean', 'features', 'Enable mortgage comparison feature'),
('enable_str_management', 'true', 'boolean', 'features', 'Enable STR management'),
('enable_network', 'true', 'boolean', 'features', 'Enable deal network')
ON CONFLICT (setting_key) DO NOTHING;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS affiliate_commissions_updated_at ON affiliate_commissions;
CREATE TRIGGER affiliate_commissions_updated_at BEFORE UPDATE ON affiliate_commissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS platform_settings_updated_at ON platform_settings;
CREATE TRIGGER platform_settings_updated_at BEFORE UPDATE ON platform_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();