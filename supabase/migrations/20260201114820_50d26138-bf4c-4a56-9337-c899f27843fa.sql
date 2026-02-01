-- STR properties
CREATE TABLE str_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic info
  property_name TEXT NOT NULL,
  address TEXT,
  postcode TEXT,
  property_type TEXT CHECK (property_type IN ('apartment', 'house', 'room', 'studio', 'villa', 'cottage')),
  
  bedrooms INTEGER CHECK (bedrooms >= 0),
  bathrooms DECIMAL(2,1) CHECK (bathrooms >= 0),
  sleeps INTEGER CHECK (sleeps > 0),
  square_feet INTEGER,
  
  -- Listing content
  title TEXT,
  description TEXT,
  house_rules TEXT,
  checkin_instructions TEXT,
  checkout_instructions TEXT,
  
  amenities TEXT[],
  unique_features TEXT,
  target_guests TEXT[],
  
  -- Listing optimization
  listing_score INTEGER CHECK (listing_score >= 0 AND listing_score <= 100),
  title_score INTEGER,
  description_score INTEGER,
  photos_score INTEGER,
  amenities_score INTEGER,
  last_optimized_at TIMESTAMPTZ,
  
  -- Pricing
  base_price_per_night DECIMAL(10,2),
  weekend_premium_pct INTEGER DEFAULT 20,
  cleaning_fee DECIMAL(10,2),
  extra_guest_fee DECIMAL(10,2),
  security_deposit DECIMAL(10,2),
  
  -- Seasonal pricing
  summer_rate DECIMAL(10,2),
  winter_rate DECIMAL(10,2),
  peak_season_rate DECIMAL(10,2),
  
  -- Discounts
  weekly_discount_pct INTEGER,
  monthly_discount_pct INTEGER,
  last_minute_discount_pct INTEGER,
  
  -- Platform links
  airbnb_url TEXT,
  airbnb_ical_url TEXT,
  vrbo_url TEXT,
  vrbo_ical_url TEXT,
  booking_com_url TEXT,
  booking_com_ical_url TEXT,
  
  -- Photos
  photo_urls TEXT[],
  photo_count INTEGER DEFAULT 0,
  photo_checklist_completed BOOLEAN DEFAULT false,
  
  -- Location highlights
  distance_to_beach_km DECIMAL(5,2),
  distance_to_city_center_km DECIMAL(5,2),
  nearby_attractions TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_listed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STR bookings (from iCal sync or manual entry)
CREATE TABLE str_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  str_property_id UUID REFERENCES str_properties(id) ON DELETE CASCADE NOT NULL,
  
  -- Booking details
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  guest_count INTEGER,
  
  checkin_date DATE NOT NULL,
  checkout_date DATE NOT NULL,
  nights INTEGER GENERATED ALWAYS AS (checkout_date - checkin_date) STORED,
  
  -- Financial
  nightly_rate DECIMAL(10,2),
  total_nights_cost DECIMAL(10,2),
  cleaning_fee DECIMAL(10,2),
  extra_fees DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  total_payout DECIMAL(10,2),
  
  -- Status
  status TEXT CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'completed')),
  platform TEXT,
  
  -- Communication
  booking_notes TEXT,
  special_requests TEXT,
  
  -- Sync
  external_booking_id TEXT,
  synced_from_ical BOOLEAN DEFAULT false,
  ical_uid TEXT UNIQUE,
  last_synced_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STR expenses
CREATE TABLE str_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  str_property_id UUID REFERENCES str_properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Expense details
  expense_date DATE NOT NULL,
  category TEXT CHECK (category IN (
    'mortgage', 'utilities', 'internet', 'cleaning', 
    'maintenance', 'supplies', 'toiletries', 'linens',
    'platform_fees', 'insurance', 'property_tax', 
    'hoa_fees', 'marketing', 'other'
  )),
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  
  -- Categorization
  is_recurring BOOLEAN DEFAULT false,
  recurrence_frequency TEXT CHECK (recurrence_frequency IN ('weekly', 'monthly', 'quarterly', 'annually')),
  
  -- Documentation
  receipt_url TEXT,
  vendor TEXT,
  
  -- Tax
  is_tax_deductible BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-generated listing content versions
CREATE TABLE listing_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  str_property_id UUID REFERENCES str_properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Generated content (3 versions each)
  titles JSONB NOT NULL,
  descriptions JSONB NOT NULL,
  house_rules TEXT,
  checkin_instructions TEXT,
  
  -- Input data used
  input_data JSONB,
  
  -- Selection tracking
  selected_title_index INTEGER,
  selected_description_index INTEGER,
  applied_to_listing BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message templates
CREATE TABLE str_message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  template_type TEXT CHECK (template_type IN (
    'booking_confirmation', 'pre_arrival', 'checkin_day',
    'during_stay', 'checkout_reminder', 'post_stay_review',
    'cancellation', 'modification', 'damage_report'
  )),
  template_name TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  
  variables TEXT[],
  send_timing TEXT,
  
  is_default BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photo checklists
CREATE TABLE str_photo_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  str_property_id UUID REFERENCES str_properties(id) ON DELETE CASCADE NOT NULL,
  
  room_name TEXT NOT NULL,
  photo_requirements JSONB NOT NULL,
  total_required INTEGER,
  completed_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar blocked dates
CREATE TABLE str_calendar_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  str_property_id UUID REFERENCES str_properties(id) ON DELETE CASCADE NOT NULL,
  
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT CHECK (reason IN ('maintenance', 'personal_use', 'blocked', 'other')),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_str_properties_user ON str_properties(user_id);
CREATE INDEX idx_str_properties_active ON str_properties(is_active, is_listed);
CREATE INDEX idx_str_bookings_property ON str_bookings(str_property_id);
CREATE INDEX idx_str_bookings_dates ON str_bookings(checkin_date, checkout_date);
CREATE INDEX idx_str_bookings_status ON str_bookings(status);
CREATE INDEX idx_str_expenses_property ON str_expenses(str_property_id);
CREATE INDEX idx_str_expenses_date ON str_expenses(expense_date);
CREATE INDEX idx_str_expenses_category ON str_expenses(category);
CREATE INDEX idx_listing_generations_property ON listing_generations(str_property_id);
CREATE INDEX idx_str_message_templates_type ON str_message_templates(template_type);

-- RLS Policies
ALTER TABLE str_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE str_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE str_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE str_message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE str_photo_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE str_calendar_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own STR properties" ON str_properties FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own STR bookings" ON str_bookings FOR ALL USING (
  str_property_id IN (SELECT id FROM str_properties WHERE user_id = auth.uid())
);

CREATE POLICY "Users own STR expenses" ON str_expenses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own listing generations" ON listing_generations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own message templates" ON str_message_templates FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own photo checklists" ON str_photo_checklists FOR ALL USING (
  str_property_id IN (SELECT id FROM str_properties WHERE user_id = auth.uid())
);

CREATE POLICY "Users own calendar blocks" ON str_calendar_blocks FOR ALL USING (
  str_property_id IN (SELECT id FROM str_properties WHERE user_id = auth.uid())
);

-- Triggers for auto-updating timestamps
CREATE TRIGGER str_properties_updated_at BEFORE UPDATE ON str_properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER str_bookings_updated_at BEFORE UPDATE ON str_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER str_message_templates_updated_at BEFORE UPDATE ON str_message_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();