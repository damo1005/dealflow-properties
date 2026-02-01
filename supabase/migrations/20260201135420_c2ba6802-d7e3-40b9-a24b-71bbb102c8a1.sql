-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'editor', 'viewer', 'accountant', 'partner');

-- User roles table (separate from profiles for security)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'pro',
  max_members INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  custom_permissions JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES public.profiles(id),
  accepted_at TIMESTAMPTZ,
  UNIQUE(team_id, user_id)
);

-- Property access table
CREATE TABLE IF NOT EXISTS public.property_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  access_level TEXT DEFAULT 'viewer',
  can_view_financials BOOLEAN DEFAULT true,
  can_view_tenants BOOLEAN DEFAULT true,
  can_edit BOOLEAN DEFAULT false,
  ownership_percentage DECIMAL(5,2),
  investment_amount DECIMAL(12,2),
  UNIQUE(team_member_id, portfolio_property_id)
);

-- Team invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  property_ids UUID[] DEFAULT '{}',
  invitation_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  invited_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team activity log
CREATE TABLE IF NOT EXISTS public.team_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JV Deals table
CREATE TABLE IF NOT EXISTS public.jv_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id),
  deal_name TEXT,
  deal_type TEXT DEFAULT 'equity_split' CHECK (deal_type IN ('equity_split', 'profit_share', 'loan')),
  deal_start_date DATE,
  projected_exit_date DATE,
  total_investment DECIMAL(12,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'exited', 'dissolved')),
  exit_date DATE,
  exit_price DECIMAL(12,2),
  net_proceeds DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JV Partners table
CREATE TABLE IF NOT EXISTS public.jv_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jv_deal_id UUID REFERENCES public.jv_deals(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  partner_email TEXT,
  team_member_id UUID REFERENCES public.team_members(id),
  is_self BOOLEAN DEFAULT false,
  initial_investment DECIMAL(12,2) NOT NULL,
  additional_investments DECIMAL(12,2) DEFAULT 0,
  equity_percentage DECIMAL(5,2) NOT NULL,
  profit_percentage DECIMAL(5,2),
  distributions_received DECIMAL(12,2) DEFAULT 0,
  exit_proceeds DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JV Transactions table
CREATE TABLE IF NOT EXISTS public.jv_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jv_deal_id UUID REFERENCES public.jv_deals(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('capital_call', 'distribution', 'expense', 'income')),
  total_amount DECIMAL(12,2) NOT NULL,
  transaction_date DATE NOT NULL,
  description TEXT,
  split_type TEXT DEFAULT 'by_equity' CHECK (split_type IN ('by_equity', 'by_profit', 'custom')),
  custom_splits JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio shares table
CREATE TABLE IF NOT EXISTS public.portfolio_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  include_properties BOOLEAN DEFAULT true,
  include_financials BOOLEAN DEFAULT true,
  include_tenants BOOLEAN DEFAULT false,
  include_compliance BOOLEAN DEFAULT true,
  property_ids UUID[],
  custom_message TEXT,
  hide_addresses BOOLEAN DEFAULT false,
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  max_views INTEGER,
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Share views tracking
CREATE TABLE IF NOT EXISTS public.share_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_share_id UUID REFERENCES public.portfolio_shares(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('property', 'tenant', 'deal', 'transaction')),
  entity_id UUID NOT NULL,
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'action_item', 'question', 'important')),
  is_pinned BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  due_date DATE,
  assigned_to UUID REFERENCES public.profiles(id),
  visibility TEXT DEFAULT 'team' CHECK (visibility IN ('team', 'private')),
  mentioned_users UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note comments table
CREATE TABLE IF NOT EXISTS public.note_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_team_members_team ON public.team_members(team_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);
CREATE INDEX idx_property_access_member ON public.property_access(team_member_id);
CREATE INDEX idx_jv_deals_user ON public.jv_deals(user_id);
CREATE INDEX idx_jv_partners_deal ON public.jv_partners(jv_deal_id);
CREATE INDEX idx_portfolio_shares_user ON public.portfolio_shares(user_id);
CREATE INDEX idx_portfolio_shares_token ON public.portfolio_shares(share_token) WHERE is_active = true;
CREATE INDEX idx_notes_entity ON public.notes(entity_type, entity_id);
CREATE INDEX idx_notes_user ON public.notes(user_id);
CREATE INDEX idx_note_comments_note ON public.note_comments(note_id);

-- RLS Policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jv_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jv_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jv_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_comments ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Teams policies
CREATE POLICY "Users can view teams they belong to" ON public.teams FOR SELECT 
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.team_members WHERE team_id = teams.id AND user_id = auth.uid() AND status = 'active'
  ));
CREATE POLICY "Owners can manage their teams" ON public.teams FOR ALL USING (owner_id = auth.uid());

-- Team members policies
CREATE POLICY "Team members can view other members" ON public.team_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid() AND tm.status = 'active'
  ) OR EXISTS (
    SELECT 1 FROM public.teams t WHERE t.id = team_members.team_id AND t.owner_id = auth.uid()
  ));
CREATE POLICY "Team owners can manage members" ON public.team_members FOR ALL
  USING (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_members.team_id AND t.owner_id = auth.uid()));

-- Property access policies
CREATE POLICY "Users can view property access for their teams" ON public.property_access FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.team_members tm 
    WHERE tm.id = property_access.team_member_id AND tm.user_id = auth.uid()
  ));

-- Team invitations policies
CREATE POLICY "Team owners can manage invitations" ON public.team_invitations FOR ALL
  USING (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_invitations.team_id AND t.owner_id = auth.uid()));

-- Activity log policies
CREATE POLICY "Team members can view activity" ON public.team_activity_log FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_activity_log.team_id AND tm.user_id = auth.uid() AND tm.status = 'active'
  ) OR EXISTS (
    SELECT 1 FROM public.teams t WHERE t.id = team_activity_log.team_id AND t.owner_id = auth.uid()
  ));

-- JV Deals policies
CREATE POLICY "Users can manage own JV deals" ON public.jv_deals FOR ALL USING (user_id = auth.uid());

-- JV Partners policies
CREATE POLICY "Users can view JV partners for their deals" ON public.jv_partners FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.jv_deals jd WHERE jd.id = jv_partners.jv_deal_id AND jd.user_id = auth.uid()));
CREATE POLICY "Users can manage JV partners for their deals" ON public.jv_partners FOR ALL
  USING (EXISTS (SELECT 1 FROM public.jv_deals jd WHERE jd.id = jv_partners.jv_deal_id AND jd.user_id = auth.uid()));

-- JV Transactions policies
CREATE POLICY "Users can manage JV transactions for their deals" ON public.jv_transactions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.jv_deals jd WHERE jd.id = jv_transactions.jv_deal_id AND jd.user_id = auth.uid()));

-- Portfolio shares policies
CREATE POLICY "Users can manage own shares" ON public.portfolio_shares FOR ALL USING (user_id = auth.uid());

-- Share views policies (public read for tracking)
CREATE POLICY "Anyone can create share views" ON public.share_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Share owners can view analytics" ON public.share_views FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.portfolio_shares ps WHERE ps.id = share_views.portfolio_share_id AND ps.user_id = auth.uid()));

-- Notes policies
CREATE POLICY "Users can view notes they have access to" ON public.notes FOR SELECT
  USING (user_id = auth.uid() OR (visibility = 'team' AND team_id IN (
    SELECT tm.team_id FROM public.team_members tm WHERE tm.user_id = auth.uid() AND tm.status = 'active'
  )));
CREATE POLICY "Users can create notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.notes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own notes" ON public.notes FOR DELETE USING (user_id = auth.uid());

-- Note comments policies
CREATE POLICY "Users can view comments on visible notes" ON public.note_comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.notes n WHERE n.id = note_comments.note_id AND (
      n.user_id = auth.uid() OR (n.visibility = 'team' AND n.team_id IN (
        SELECT tm.team_id FROM public.team_members tm WHERE tm.user_id = auth.uid() AND tm.status = 'active'
      ))
    )
  ));
CREATE POLICY "Users can add comments" ON public.note_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.note_comments FOR DELETE USING (user_id = auth.uid());

-- Trigger for notes updated_at
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();