-- Auction houses
CREATE TABLE auction_houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  buyer_premium_pct DECIMAL(5,2) DEFAULT 1.2,
  regions TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auctions (events)
CREATE TABLE auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_house_id UUID REFERENCES auction_houses(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  auction_date TIMESTAMPTZ NOT NULL,
  auction_type TEXT,
  catalogue_url TEXT,
  
  total_lots INTEGER DEFAULT 0,
  lots_sold INTEGER DEFAULT 0,
  avg_sale_vs_guide DECIMAL(5,2),
  
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auction lots (properties)
CREATE TABLE auction_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  
  lot_number TEXT NOT NULL,
  address TEXT NOT NULL,
  postcode TEXT,
  property_type TEXT,
  bedrooms INTEGER,
  tenure TEXT,
  
  guide_price INTEGER,
  reserve_price INTEGER,
  estimated_value INTEGER,
  
  legal_pack_url TEXT,
  has_tenants BOOLEAN DEFAULT false,
  has_issues BOOLEAN DEFAULT false,
  issues_summary TEXT,
  
  sold BOOLEAN,
  sale_price INTEGER,
  buyer_premium INTEGER,
  total_price INTEGER,
  
  ai_score INTEGER,
  risk_flags JSONB DEFAULT '[]'::jsonb,
  opportunity_flags JSONB DEFAULT '[]'::jsonb,
  
  images TEXT[],
  description TEXT,
  
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User watches
CREATE TABLE auction_watches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lot_id UUID REFERENCES auction_lots(id) ON DELETE CASCADE,
  
  max_bid INTEGER,
  bid_rationale TEXT,
  notes TEXT,
  reminded BOOLEAN DEFAULT false,
  remind_before_hours INTEGER DEFAULT 24,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lot_id)
);

-- Bid calculations
CREATE TABLE bid_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lot_id UUID REFERENCES auction_lots(id) ON DELETE CASCADE,
  
  strategy TEXT,
  purchase_costs JSONB,
  refurb_costs INTEGER,
  target_yield DECIMAL(5,2),
  target_profit INTEGER,
  
  max_bid INTEGER,
  recommended_bid INTEGER,
  walk_away_price INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_auctions_date ON auctions(auction_date);
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auction_lots_auction ON auction_lots(auction_id);
CREATE INDEX idx_auction_lots_postcode ON auction_lots(postcode);
CREATE INDEX idx_auction_lots_status ON auction_lots(status);
CREATE INDEX idx_auction_watches_user ON auction_watches(user_id);
CREATE INDEX idx_auction_watches_lot ON auction_watches(lot_id);
CREATE INDEX idx_bid_calculations_user ON bid_calculations(user_id);

-- Enable RLS
ALTER TABLE auction_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_calculations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view auction houses"
  ON auction_houses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view auctions"
  ON auctions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view auction lots"
  ON auction_lots FOR SELECT
  USING (true);

CREATE POLICY "Users manage own watches"
  ON auction_watches FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage own bid calculations"
  ON bid_calculations FOR ALL
  USING (auth.uid() = user_id);

-- Insert sample auction houses
INSERT INTO auction_houses (name, website, buyer_premium_pct, regions) VALUES
('Essential Information Group', 'https://www.eigpropertyauctions.co.uk', 1.2, ARRAY['London', 'South East', 'Midlands']),
('Allsop', 'https://www.allsop.co.uk', 1.2, ARRAY['London', 'National']),
('SDL Auctions', 'https://www.sdlauctions.co.uk', 1.2, ARRAY['London', 'South']),
('Barnett Ross', 'https://www.barnett-ross.co.uk', 1.2, ARRAY['London', 'South East']);