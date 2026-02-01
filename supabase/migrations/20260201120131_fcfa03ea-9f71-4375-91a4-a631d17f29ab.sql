-- Platform connections for multi-platform STR management
CREATE TABLE platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  str_property_id UUID REFERENCES str_properties(id) ON DELETE CASCADE NOT NULL,
  
  platform_name TEXT CHECK (platform_name IN (
    'airbnb', 'booking_com', 'vrbo', 'expedia', 
    'tripadvisor', 'google', 'hotels_com', 'agoda',
    'plum_guide', 'marriott', 'direct'
  )) NOT NULL,
  
  listing_url TEXT,
  ical_url TEXT,
  
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  sync_frequency TEXT DEFAULT 'hourly',
  sync_errors INTEGER DEFAULT 0,
  last_error TEXT,
  
  total_bookings INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_platform_connections_property ON platform_connections(str_property_id);
CREATE INDEX idx_platform_connections_platform ON platform_connections(platform_name);

-- Add platform_connection_id to str_bookings
ALTER TABLE str_bookings ADD COLUMN IF NOT EXISTS platform_connection_id UUID REFERENCES platform_connections(id);

-- Channel manager blocked dates
CREATE TABLE channel_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  str_property_id UUID REFERENCES str_properties(id) ON DELETE CASCADE NOT NULL,
  
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  reason TEXT CHECK (reason IN ('booked_other_platform', 'maintenance', 'personal', 'manual')),
  source_platform TEXT,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_channel_blocks_property ON channel_blocks(str_property_id);
CREATE INDEX idx_channel_blocks_dates ON channel_blocks(start_date, end_date);

-- Platform performance tracking
CREATE TABLE platform_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_connection_id UUID REFERENCES platform_connections(id) ON DELETE CASCADE NOT NULL,
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  bookings_count INTEGER DEFAULT 0,
  nights_booked INTEGER DEFAULT 0,
  gross_revenue DECIMAL(10,2) DEFAULT 0,
  platform_fees DECIMAL(10,2) DEFAULT 0,
  net_revenue DECIMAL(10,2) DEFAULT 0,
  
  average_nightly_rate DECIMAL(10,2),
  occupancy_rate DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(platform_connection_id, period_start, period_end)
);

CREATE INDEX idx_platform_performance_connection ON platform_performance(platform_connection_id);
CREATE INDEX idx_platform_performance_period ON platform_performance(period_start, period_end);

-- RLS Policies
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own platform connections" ON platform_connections FOR ALL USING (
  str_property_id IN (SELECT id FROM str_properties WHERE user_id = auth.uid())
);

CREATE POLICY "Users own channel blocks" ON channel_blocks FOR ALL USING (
  str_property_id IN (SELECT id FROM str_properties WHERE user_id = auth.uid())
);

CREATE POLICY "Users own platform performance" ON platform_performance FOR ALL USING (
  platform_connection_id IN (
    SELECT pc.id FROM platform_connections pc 
    JOIN str_properties sp ON pc.str_property_id = sp.id 
    WHERE sp.user_id = auth.uid()
  )
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS platform_connections_updated_at ON platform_connections;
CREATE TRIGGER platform_connections_updated_at BEFORE UPDATE ON platform_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();