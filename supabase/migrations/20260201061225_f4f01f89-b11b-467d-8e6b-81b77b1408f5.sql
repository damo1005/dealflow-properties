-- User profiles (extended for social network)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Professional info
  display_name TEXT,
  bio TEXT,
  profile_photo_url TEXT,
  cover_photo_url TEXT,
  
  -- Experience
  investor_type TEXT DEFAULT 'beginner',
  years_investing INTEGER DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  
  -- Portfolio stats (public)
  properties_count INTEGER DEFAULT 0,
  portfolio_value INTEGER,
  portfolio_yield DECIMAL(5,2),
  
  -- Location
  location_city TEXT,
  location_country TEXT DEFAULT 'UK',
  
  -- Social
  linkedin_url TEXT,
  twitter_handle TEXT,
  website TEXT,
  
  -- Preferences
  looking_for TEXT[] DEFAULT '{}',
  open_to_jv BOOLEAN DEFAULT false,
  open_to_mentor BOOLEAN DEFAULT false,
  
  -- Privacy
  profile_visibility TEXT DEFAULT 'public',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connections (following/followers)
CREATE TABLE user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  
  connection_type TEXT DEFAULT 'follow',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Posts (deals, questions, insights)
CREATE TABLE network_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  post_type TEXT NOT NULL,
  
  -- Content
  title TEXT,
  content TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Deal-specific
  deal_type TEXT,
  asking_price INTEGER,
  location_area TEXT,
  
  -- JV-specific
  jv_structure TEXT,
  jv_equity_split TEXT,
  jv_investment_required INTEGER,
  
  -- Engagement
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  -- Visibility
  visibility TEXT DEFAULT 'public',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post reactions
CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES network_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  reaction_type TEXT DEFAULT 'like',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comments
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES network_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  parent_comment_id UUID REFERENCES post_comments(id),
  
  content TEXT NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (DMs)
CREATE TABLE user_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  
  content TEXT NOT NULL,
  
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups/Communities
CREATE TABLE network_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  
  group_type TEXT,
  location_area TEXT,
  
  member_count INTEGER DEFAULT 0,
  
  visibility TEXT DEFAULT 'public',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group members
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES network_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  role TEXT DEFAULT 'member',
  
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- JV match preferences
CREATE TABLE jv_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  capital_available INTEGER,
  skills TEXT[] DEFAULT '{}',
  
  looking_for_skills TEXT[] DEFAULT '{}',
  looking_for_capital BOOLEAN DEFAULT false,
  
  preferred_strategies TEXT[] DEFAULT '{}',
  preferred_locations TEXT[] DEFAULT '{}',
  
  min_deal_size INTEGER,
  max_deal_size INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_location ON user_profiles(location_city);
CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX idx_user_connections_follower ON user_connections(follower_id);
CREATE INDEX idx_user_connections_following ON user_connections(following_id);
CREATE INDEX idx_network_posts_user ON network_posts(user_id);
CREATE INDEX idx_network_posts_type ON network_posts(post_type);
CREATE INDEX idx_network_posts_created ON network_posts(created_at DESC);
CREATE INDEX idx_post_comments_post ON post_comments(post_id);
CREATE INDEX idx_user_messages_recipient ON user_messages(recipient_id);
CREATE INDEX idx_user_messages_sender ON user_messages(sender_id);
CREATE INDEX idx_group_members_group ON group_members(group_id);

-- RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE jv_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles viewable" ON user_profiles FOR SELECT USING (profile_visibility = 'public');
CREATE POLICY "Own profile editable" ON user_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own connections" ON user_connections FOR ALL USING (auth.uid() = follower_id);
CREATE POLICY "View connections" ON user_connections FOR SELECT USING (true);

CREATE POLICY "Public posts viewable" ON network_posts FOR SELECT USING (visibility = 'public');
CREATE POLICY "Users manage own posts" ON network_posts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own reactions" ON post_reactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "View reactions" ON post_reactions FOR SELECT USING (true);

CREATE POLICY "Users manage own comments" ON post_comments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "View comments" ON post_comments FOR SELECT USING (true);

CREATE POLICY "Messages viewable by participants" ON user_messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users send messages" ON user_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "View public groups" ON network_groups FOR SELECT USING (visibility = 'public');
CREATE POLICY "Users create groups" ON network_groups FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "View group members" ON group_members FOR SELECT USING (true);
CREATE POLICY "Users manage own membership" ON group_members FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own jv preferences" ON jv_preferences FOR ALL USING (auth.uid() = user_id);