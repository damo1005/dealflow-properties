-- Airbnb listings (from Inside Airbnb CSV)
CREATE TABLE airbnb_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airbnb_id TEXT UNIQUE NOT NULL,
  name TEXT,
  description TEXT,
  host_id TEXT,
  host_name TEXT,
  host_since DATE,
  host_is_superhost BOOLEAN DEFAULT false,
  host_listings_count INTEGER,
  neighbourhood TEXT,
  neighbourhood_group TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  postcode TEXT,
  city TEXT,
  room_type TEXT,
  property_type TEXT,
  accommodates INTEGER,
  bedrooms INTEGER,
  beds INTEGER,
  bathrooms DECIMAL,
  amenities TEXT[],
  price_per_night DECIMAL,
  cleaning_fee DECIMAL,
  service_fee DECIMAL,
  minimum_nights INTEGER,
  maximum_nights INTEGER,
  availability_30 INTEGER,
  availability_60 INTEGER,
  availability_90 INTEGER,
  availability_365 INTEGER,
  number_of_reviews INTEGER,
  number_of_reviews_ltm INTEGER,
  first_review DATE,
  last_review DATE,
  reviews_per_month DECIMAL,
  review_scores_rating INTEGER,
  review_scores_accuracy INTEGER,
  review_scores_cleanliness INTEGER,
  review_scores_checkin INTEGER,
  review_scores_communication INTEGER,
  review_scores_location INTEGER,
  review_scores_value INTEGER,
  estimated_occupancy_rate DECIMAL,
  estimated_monthly_revenue DECIMAL,
  estimated_annual_revenue DECIMAL,
  instant_bookable BOOLEAN,
  listing_url TEXT,
  picture_url TEXT,
  last_scraped DATE,
  source TEXT DEFAULT 'inside_airbnb',
  data_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Area statistics (aggregated)
CREATE TABLE airbnb_area_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_name TEXT NOT NULL,
  area_type TEXT,
  city TEXT,
  total_listings INTEGER,
  entire_home_count INTEGER,
  private_room_count INTEGER,
  shared_room_count INTEGER,
  avg_price_entire_home DECIMAL,
  avg_price_private_room DECIMAL,
  median_price_entire_home DECIMAL,
  median_price_private_room DECIMAL,
  min_price DECIMAL,
  max_price DECIMAL,
  price_25th_percentile DECIMAL,
  price_75th_percentile DECIMAL,
  avg_occupancy_rate DECIMAL,
  avg_monthly_revenue DECIMAL,
  avg_annual_revenue DECIMAL,
  avg_reviews_per_month DECIMAL,
  avg_review_score DECIMAL,
  total_hosts INTEGER,
  multi_listing_hosts INTEGER,
  superhost_count INTEGER,
  avg_listings_per_host DECIMAL,
  avg_availability_365 INTEGER,
  avg_minimum_nights INTEGER,
  data_date DATE,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(area_name, area_type, city, data_date)
);

-- User's SA properties for comparison
CREATE TABLE user_sa_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  property_type TEXT,
  bedrooms INTEGER,
  beds INTEGER,
  bathrooms DECIMAL,
  accommodates INTEGER,
  nightly_rate DECIMAL,
  cleaning_fee DECIMAL,
  minimum_nights INTEGER DEFAULT 1,
  actual_occupancy_rate DECIMAL,
  actual_monthly_revenue DECIMAL,
  btl_monthly_rent DECIMAL,
  btl_yield DECIMAL,
  airbnb_url TEXT,
  vrbo_url TEXT,
  booking_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved competitor sets
CREATE TABLE user_competitor_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sa_property_id UUID REFERENCES user_sa_properties(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES airbnb_listings(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sa_property_id, listing_id)
);

-- Price alerts
CREATE TABLE airbnb_price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  area_name TEXT,
  postcode TEXT,
  room_type TEXT,
  alert_type TEXT,
  threshold_value DECIMAL,
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data sync log
CREATE TABLE airbnb_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT,
  source_url TEXT,
  data_date DATE,
  listings_imported INTEGER,
  areas_calculated INTEGER,
  status TEXT,
  error_message TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_airbnb_postcode ON airbnb_listings(postcode);
CREATE INDEX idx_airbnb_city ON airbnb_listings(city);
CREATE INDEX idx_airbnb_neighbourhood ON airbnb_listings(neighbourhood);
CREATE INDEX idx_airbnb_location ON airbnb_listings(latitude, longitude);
CREATE INDEX idx_airbnb_room_type ON airbnb_listings(room_type);
CREATE INDEX idx_airbnb_price ON airbnb_listings(price_per_night);
CREATE INDEX idx_area_stats_lookup ON airbnb_area_stats(area_name, city);
CREATE INDEX idx_user_sa_props ON user_sa_properties(user_id);

-- RLS
ALTER TABLE airbnb_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE airbnb_area_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sa_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_competitor_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE airbnb_price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE airbnb_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read listings" ON airbnb_listings FOR SELECT USING (true);
CREATE POLICY "Public read stats" ON airbnb_area_stats FOR SELECT USING (true);
CREATE POLICY "Public read sync log" ON airbnb_sync_log FOR SELECT USING (true);
CREATE POLICY "Users manage own SA" ON user_sa_properties FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own competitors" ON user_competitor_sets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own alerts" ON airbnb_price_alerts FOR ALL USING (auth.uid() = user_id);

-- Function to estimate occupancy from reviews
CREATE OR REPLACE FUNCTION estimate_occupancy(reviews_per_month DECIMAL, review_rate DECIMAL DEFAULT 0.5)
RETURNS DECIMAL 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN LEAST(95, GREATEST(0, ROUND((reviews_per_month / COALESCE(review_rate, 0.5) * 2.5 / 30 * 100)::DECIMAL, 1)));
END;
$$;

-- Function to calculate revenue
CREATE OR REPLACE FUNCTION estimate_monthly_revenue(price DECIMAL, occupancy_rate DECIMAL)
RETURNS DECIMAL 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN ROUND(price * 30 * (occupancy_rate / 100), 2);
END;
$$;