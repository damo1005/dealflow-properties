-- Phase 15: AI Chat, Events, Rewards, Multi-Currency, API Marketplace

-- =====================================================
-- 15A: AI Chatbot Assistant
-- =====================================================

CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE SET NULL,
  action_type TEXT,
  action_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Copilot knowledge base for RAG
CREATE TABLE IF NOT EXISTS public.copilot_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 15B: Networking Events
-- =====================================================

CREATE TABLE IF NOT EXISTS public.networking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('meetup', 'webinar', 'conference', 'workshop', 'networking')),
  is_virtual BOOLEAN DEFAULT false,
  venue_name TEXT,
  venue_address TEXT,
  city TEXT,
  postcode TEXT,
  virtual_link TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  timezone TEXT DEFAULT 'Europe/London',
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  ticket_price DECIMAL(10,2),
  member_price DECIMAL(10,2),
  organiser_id UUID,
  organiser_name TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'live', 'completed', 'cancelled')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.networking_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  ticket_type TEXT DEFAULT 'standard',
  amount_paid DECIMAL(10,2),
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'no_show')),
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.event_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.networking_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  connected_user_id UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 15C: Landlord Rewards Program
-- =====================================================

CREATE TABLE IF NOT EXISTS public.reward_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  points_balance INTEGER DEFAULT 0,
  points_earned_total INTEGER DEFAULT 0,
  points_redeemed_total INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  tier_points INTEGER DEFAULT 0,
  login_streak_days INTEGER DEFAULT 0,
  last_login_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reward_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'bonus')),
  points INTEGER NOT NULL,
  balance_after INTEGER,
  source TEXT,
  source_details JSONB DEFAULT '{}',
  description TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reward_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('discount', 'service', 'product', 'feature')),
  points_cost INTEGER NOT NULL,
  value_description TEXT,
  discount_percent INTEGER,
  discount_amount DECIMAL(10,2),
  partner_name TEXT,
  partner_logo_url TEXT,
  min_tier TEXT DEFAULT 'bronze',
  stock_limit INTEGER,
  stock_remaining INTEGER,
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  offer_id UUID REFERENCES public.reward_offers(id) ON DELETE SET NULL,
  points_spent INTEGER,
  redemption_code TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  expires_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 15D: Multi-Currency Support
-- =====================================================

CREATE TABLE IF NOT EXISTS public.currency_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_currency TEXT DEFAULT 'GBP',
  home_currency TEXT DEFAULT 'GBP',
  auto_convert BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT DEFAULT 'GBP',
  target_currency TEXT NOT NULL,
  rate DECIMAL(12,6) NOT NULL,
  rate_date DATE NOT NULL,
  source TEXT DEFAULT 'ecb',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(base_currency, target_currency, rate_date)
);

CREATE TABLE IF NOT EXISTS public.foreign_income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  original_currency TEXT NOT NULL,
  original_amount DECIMAL(12,2) NOT NULL,
  exchange_rate DECIMAL(12,6),
  gbp_amount DECIMAL(12,2),
  conversion_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 15E: API Marketplace
-- =====================================================

CREATE TABLE IF NOT EXISTS public.api_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  developer_name TEXT,
  developer_url TEXT,
  category TEXT CHECK (category IN ('accounting', 'crm', 'marketing', 'analytics', 'utilities', 'storage', 'communication')),
  icon_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  is_free BOOLEAN DEFAULT true,
  monthly_price DECIMAL(10,2),
  install_count INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'pending', 'active', 'deprecated')),
  auth_url TEXT,
  webhook_url TEXT,
  docs_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  integration_id UUID REFERENCES public.api_integrations(id) ON DELETE CASCADE,
  is_connected BOOLEAN DEFAULT false,
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, integration_id)
);

CREATE TABLE IF NOT EXISTS public.integration_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES public.api_integrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(integration_id, user_id)
);

-- =====================================================
-- Enable RLS on all tables
-- =====================================================

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_actions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.networking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foreign_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies
-- =====================================================

-- Chat Conversations
CREATE POLICY "Users can manage own conversations" ON public.chat_conversations
  FOR ALL USING (auth.uid() = user_id);

-- Chat Messages
CREATE POLICY "Users can manage own messages" ON public.chat_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.chat_conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid())
  );

-- AI Actions Log
CREATE POLICY "Users can view own actions" ON public.ai_actions_log
  FOR SELECT USING (auth.uid() = user_id);

-- Copilot Knowledge (public read)
CREATE POLICY "Anyone can read knowledge base" ON public.copilot_knowledge
  FOR SELECT USING (true);

-- Networking Events (public read, organiser write)
CREATE POLICY "Anyone can view events" ON public.networking_events
  FOR SELECT USING (status IN ('upcoming', 'live', 'completed'));

CREATE POLICY "Organisers can manage own events" ON public.networking_events
  FOR ALL USING (auth.uid() = organiser_id);

-- Event Registrations
CREATE POLICY "Users can manage own registrations" ON public.event_registrations
  FOR ALL USING (auth.uid() = user_id);

-- Event Connections
CREATE POLICY "Users can manage own connections" ON public.event_connections
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- Reward Accounts
CREATE POLICY "Users can view own reward account" ON public.reward_accounts
  FOR ALL USING (auth.uid() = user_id);

-- Reward Transactions
CREATE POLICY "Users can view own transactions" ON public.reward_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Reward Offers (public read)
CREATE POLICY "Anyone can view active offers" ON public.reward_offers
  FOR SELECT USING (is_active = true);

-- Reward Redemptions
CREATE POLICY "Users can manage own redemptions" ON public.reward_redemptions
  FOR ALL USING (auth.uid() = user_id);

-- Currency Settings
CREATE POLICY "Users can manage own currency settings" ON public.currency_settings
  FOR ALL USING (auth.uid() = user_id);

-- Exchange Rates (public read)
CREATE POLICY "Anyone can view exchange rates" ON public.exchange_rates
  FOR SELECT USING (true);

-- Foreign Income
CREATE POLICY "Users can manage own foreign income" ON public.foreign_income
  FOR ALL USING (auth.uid() = user_id);

-- API Integrations (public read)
CREATE POLICY "Anyone can view active integrations" ON public.api_integrations
  FOR SELECT USING (status = 'active');

-- User Integrations
CREATE POLICY "Users can manage own integrations" ON public.user_integrations
  FOR ALL USING (auth.uid() = user_id);

-- Integration Reviews
CREATE POLICY "Anyone can read reviews" ON public.integration_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own reviews" ON public.integration_reviews
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- Seed Data
-- =====================================================

-- Seed Copilot Knowledge Base
INSERT INTO public.copilot_knowledge (category, title, content, keywords, source_url) VALUES
('tax', 'Section 24 Explained', 'Section 24 restricts mortgage interest relief for individual landlords to basic rate (20%). Higher rate taxpayers can no longer deduct full mortgage interest from rental income. The restriction was phased in from 2017-2021.', ARRAY['section 24', 'mortgage interest', 'tax relief', 'finance costs'], 'https://www.gov.uk/guidance/changes-to-tax-relief-for-residential-landlords'),
('tax', 'Allowable Expenses', 'Landlords can claim: letting agent fees, legal fees for short leases, accountant fees, buildings and contents insurance, maintenance and repairs (not improvements), utility bills (if landlord pays), rent and ground rent, council tax (if landlord pays), services like cleaning or gardening.', ARRAY['expenses', 'deductible', 'allowable', 'tax', 'claim'], 'https://www.gov.uk/guidance/income-tax-when-you-rent-out-a-property-working-out-your-rental-income'),
('compliance', 'Gas Safety Certificate', 'Landlords must have gas appliances and flues checked annually by a Gas Safe registered engineer. The certificate (CP12) must be given to tenants within 28 days of the check and before they move in.', ARRAY['gas safety', 'cp12', 'certificate', 'annual', 'gas safe'], 'https://www.hse.gov.uk/gas/landlords/index.htm'),
('compliance', 'EPC Requirements', 'All rental properties must have a valid EPC (Energy Performance Certificate). From 2025, new tenancies require EPC rating C or above. From 2028, all tenancies require EPC C. EPCs are valid for 10 years.', ARRAY['epc', 'energy', 'efficiency', 'rating', 'certificate'], 'https://www.gov.uk/buy-sell-your-home/energy-performance-certificates'),
('compliance', 'Deposit Protection', 'Tenancy deposits must be protected in a government-approved scheme within 30 days of receipt. Landlords must provide prescribed information to tenants. Failure to comply can result in penalties of 1-3x the deposit amount.', ARRAY['deposit', 'protection', 'tds', 'dps', 'mydeposits'], 'https://www.gov.uk/tenancy-deposit-protection'),
('legal', 'Section 21 Notice', 'Section 21 allows landlords to end an assured shorthold tenancy without giving a reason. At least 2 months notice required. Cannot be served in first 4 months of tenancy. Requirements include valid gas certificate, EPC, and protected deposit.', ARRAY['section 21', 'notice', 'eviction', 'end tenancy', 'no fault'], 'https://www.gov.uk/evicting-tenants/section-21-and-section-8-notices'),
('legal', 'Section 8 Notice', 'Section 8 is used to evict tenants for breach of tenancy, such as rent arrears (Ground 8, 10, 11), anti-social behaviour, or property damage. Notice period varies by ground (2 weeks to 2 months).', ARRAY['section 8', 'eviction', 'rent arrears', 'breach', 'grounds'], 'https://www.gov.uk/evicting-tenants/section-21-and-section-8-notices'),
('investment', 'Yield Calculation', 'Gross Yield = (Annual Rent / Property Price) x 100. Net Yield accounts for expenses. Example: £12,000 rent / £200,000 price = 6% gross yield. A good BTL yield is typically 5-8% gross.', ARRAY['yield', 'gross', 'net', 'roi', 'return', 'calculation'], NULL),
('investment', 'SDLT on BTL', 'Buy-to-let properties attract an additional 3% surcharge on top of standard SDLT rates. Example: £200,000 BTL = £1,500 (0-125k at 3%) + £3,500 (125-200k at 5%) = £7,500 total.', ARRAY['sdlt', 'stamp duty', 'surcharge', 'btl', 'additional'], 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates')
ON CONFLICT DO NOTHING;

-- Seed sample networking events
INSERT INTO public.networking_events (title, description, event_type, is_virtual, venue_name, city, start_datetime, max_attendees, is_free, organiser_name, status) VALUES
('Manchester Property Investor Meetup', 'Join 50+ local investors for networking, a guest speaker on HMO strategies, and deal sharing. Free drinks and nibbles provided.', 'meetup', false, 'The Alchemist, Spinningfields', 'Manchester', NOW() + INTERVAL '14 days', 60, true, 'PropertyPro Manchester', 'upcoming'),
('Section 24 Tax Planning Webinar', 'Learn how to mitigate the effects of Section 24 on your portfolio. Includes Q&A session with property tax specialist.', 'webinar', true, NULL, NULL, NOW() + INTERVAL '7 days', 200, true, 'Property Tax Experts', 'upcoming'),
('Property Networking Birmingham', 'Monthly networking event for property investors in the Midlands. Great for deal sourcing and JV opportunities.', 'networking', false, 'The Grand Hotel', 'Birmingham', NOW() + INTERVAL '21 days', 40, false, 'Midlands Property Group', 'upcoming'),
('BTL Deal Analysis Workshop', 'Full-day workshop covering how to analyse buy-to-let deals. Includes templates and case studies. Lunch provided.', 'workshop', false, 'WeWork London', 'London', NOW() + INTERVAL '28 days', 20, false, 'Property Academy', 'upcoming')
ON CONFLICT DO NOTHING;

-- Seed reward offers
INSERT INTO public.reward_offers (title, description, category, points_cost, value_description, partner_name, min_tier, is_active) VALUES
('1 Month Free Pro', 'Get your next month of Pro subscription completely free', 'discount', 500, '£29 value', 'PropertyTracker', 'bronze', true),
('50% Off Annual Upgrade', 'Upgrade to Premium at half price for the first year', 'discount', 1000, 'Up to £600 savings', 'PropertyTracker', 'silver', true),
('£50 Screwfix Voucher', 'E-voucher for use in-store or online at Screwfix', 'product', 800, '£50 value', 'Screwfix', 'bronze', true),
('Free EPC Assessment', 'Free EPC assessment at participating assessors nationwide', 'service', 600, '£80 value', 'EPC Direct', 'bronze', true),
('20% Off Landlord Insurance', 'Apply discount to new Simply Business landlord insurance policy', 'discount', 400, 'Varies by policy', 'Simply Business', 'bronze', true),
('1-Hour Strategy Call', 'Video call with experienced property investment advisor', 'service', 2000, '£150 value', 'PropertyTracker', 'gold', true),
('Priority Support Access', 'Jump to the front of the support queue for 3 months', 'feature', 300, 'Exclusive benefit', 'PropertyTracker', 'silver', true),
('Landlord Book Bundle', 'Collection of 3 bestselling property investment books', 'product', 450, '£45 value', 'Amazon', 'bronze', true)
ON CONFLICT DO NOTHING;

-- Seed API integrations
INSERT INTO public.api_integrations (name, slug, description, category, developer_name, is_free, install_count, avg_rating, review_count, status) VALUES
('Xero Accounting', 'xero', 'Sync transactions, invoices, and reports to Xero automatically', 'accounting', 'Xero Limited', true, 2450, 4.80, 124, 'active'),
('QuickBooks', 'quickbooks', 'Two-way sync with QuickBooks Online for seamless accounting', 'accounting', 'Intuit', true, 1890, 4.60, 89, 'active'),
('Zapier', 'zapier', 'Connect to 5,000+ apps with automated workflows', 'utilities', 'Zapier Inc', true, 3120, 4.90, 201, 'active'),
('Slack', 'slack', 'Get property alerts and updates directly in Slack', 'communication', 'Slack Technologies', true, 1560, 4.70, 78, 'active'),
('Google Calendar', 'google-calendar', 'Sync viewings, inspections, and compliance dates', 'utilities', 'Google', true, 2890, 4.90, 156, 'active'),
('Mailchimp', 'mailchimp', 'Sync tenant data for email marketing campaigns', 'marketing', 'Mailchimp', true, 890, 4.40, 45, 'active'),
('Dropbox', 'dropbox', 'Auto-backup documents and photos to Dropbox', 'storage', 'Dropbox Inc', true, 1230, 4.60, 67, 'active'),
('Google Drive', 'google-drive', 'Store and sync all your property documents', 'storage', 'Google', true, 1890, 4.70, 89, 'active'),
('FreeAgent', 'freeagent', 'Sync with FreeAgent for small business accounting', 'accounting', 'FreeAgent', true, 650, 4.50, 34, 'active'),
('HubSpot CRM', 'hubspot', 'Manage leads and contacts with HubSpot integration', 'crm', 'HubSpot', true, 420, 4.50, 23, 'active')
ON CONFLICT DO NOTHING;

-- Seed exchange rates
INSERT INTO public.exchange_rates (base_currency, target_currency, rate, rate_date) VALUES
('GBP', 'EUR', 1.1878, CURRENT_DATE),
('GBP', 'USD', 1.2650, CURRENT_DATE),
('GBP', 'AED', 4.6450, CURRENT_DATE),
('GBP', 'SGD', 1.6890, CURRENT_DATE),
('GBP', 'HKD', 9.8750, CURRENT_DATE),
('GBP', 'AUD', 1.9340, CURRENT_DATE),
('GBP', 'CAD', 1.7120, CURRENT_DATE),
('GBP', 'CHF', 1.1050, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_reward_transactions_user ON public.reward_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user ON public.user_integrations(user_id);