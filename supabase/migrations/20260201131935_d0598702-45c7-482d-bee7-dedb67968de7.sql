-- Flood Risk Data table
CREATE TABLE IF NOT EXISTS public.flood_risk_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  easting INTEGER,
  northing INTEGER,
  rivers_and_sea_risk TEXT CHECK (rivers_and_sea_risk IN ('Very Low', 'Low', 'Medium', 'High')),
  rivers_and_sea_annual_chance DECIMAL(5,2),
  surface_water_risk TEXT CHECK (surface_water_risk IN ('Very Low', 'Low', 'Medium', 'High')),
  surface_water_annual_chance DECIMAL(5,2),
  reservoir_risk BOOLEAN DEFAULT false,
  reservoir_risk_details TEXT,
  overall_flood_risk TEXT CHECK (overall_flood_risk IN ('Very Low', 'Low', 'Medium', 'High')),
  in_flood_zone_2 BOOLEAN DEFAULT false,
  in_flood_zone_3 BOOLEAN DEFAULT false,
  flood_defenses_present BOOLEAN DEFAULT false,
  defense_standard TEXT,
  recorded_flood_events JSONB,
  last_flood_event_date DATE,
  recommendations JSONB,
  current_warnings JSONB,
  current_alerts JSONB,
  insurance_implications TEXT,
  api_response JSONB,
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  last_warning_check_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flood Warnings table
CREATE TABLE IF NOT EXISTS public.flood_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warning_id TEXT UNIQUE,
  severity TEXT CHECK (severity IN ('Severe Flood Warning', 'Flood Warning', 'Flood Alert')),
  area_name TEXT NOT NULL,
  area_description TEXT,
  county TEXT,
  easting INTEGER,
  northing INTEGER,
  severity_level INTEGER,
  is_active BOOLEAN DEFAULT true,
  time_raised TIMESTAMPTZ,
  time_changed TIMESTAMPTZ,
  time_removed TIMESTAMPTZ,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint for flood risk
CREATE UNIQUE INDEX IF NOT EXISTS idx_flood_risk_unique ON public.flood_risk_data(postcode, property_address);

-- Crime Statistics table
CREATE TABLE IF NOT EXISTS public.crime_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  police_force TEXT,
  neighbourhood_id TEXT,
  neighbourhood_name TEXT,
  total_crimes INTEGER DEFAULT 0,
  crimes_per_1000_people DECIMAL(6,2),
  antisocial_behaviour INTEGER DEFAULT 0,
  bicycle_theft INTEGER DEFAULT 0,
  burglary INTEGER DEFAULT 0,
  criminal_damage INTEGER DEFAULT 0,
  drugs INTEGER DEFAULT 0,
  other_theft INTEGER DEFAULT 0,
  possession_weapons INTEGER DEFAULT 0,
  public_order INTEGER DEFAULT 0,
  robbery INTEGER DEFAULT 0,
  shoplifting INTEGER DEFAULT 0,
  theft_from_person INTEGER DEFAULT 0,
  vehicle_crime INTEGER DEFAULT 0,
  violence_sexual_offences INTEGER DEFAULT 0,
  other_crime INTEGER DEFAULT 0,
  crime_trend TEXT CHECK (crime_trend IN ('increasing', 'stable', 'decreasing')),
  trend_percentage DECIMAL(5,2),
  vs_national_average TEXT CHECK (vs_national_average IN ('below', 'average', 'above')),
  vs_force_average TEXT CHECK (vs_force_average IN ('below', 'average', 'above')),
  safety_rating TEXT CHECK (safety_rating IN ('Very Safe', 'Safe', 'Average', 'Below Average', 'High Crime')),
  safety_score INTEGER CHECK (safety_score BETWEEN 0 AND 100),
  monthly_data JSONB,
  data_period_start DATE,
  data_period_end DATE,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crime Incidents table
CREATE TABLE IF NOT EXISTS public.crime_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crime_id TEXT UNIQUE,
  category TEXT NOT NULL,
  month TEXT NOT NULL,
  street_name TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  outcome_status TEXT,
  outcome_category TEXT,
  outcome_date DATE,
  police_force TEXT,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint for crime stats
CREATE UNIQUE INDEX IF NOT EXISTS idx_crime_stats_unique ON public.crime_statistics(postcode, property_address);

-- Indexes for flood data
CREATE INDEX IF NOT EXISTS idx_flood_postcode ON public.flood_risk_data(postcode);
CREATE INDEX IF NOT EXISTS idx_flood_coords ON public.flood_risk_data(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_flood_risk_level ON public.flood_risk_data(overall_flood_risk);
CREATE INDEX IF NOT EXISTS idx_warnings_active ON public.flood_warnings(is_active, severity_level);

-- Indexes for crime data
CREATE INDEX IF NOT EXISTS idx_crime_stats_postcode ON public.crime_statistics(postcode);
CREATE INDEX IF NOT EXISTS idx_crime_stats_rating ON public.crime_statistics(safety_rating);
CREATE INDEX IF NOT EXISTS idx_crime_incidents_month ON public.crime_incidents(month DESC);
CREATE INDEX IF NOT EXISTS idx_crime_incidents_category ON public.crime_incidents(category);

-- RLS
ALTER TABLE public.flood_risk_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flood_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crime_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crime_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads flood risk" ON public.flood_risk_data FOR SELECT USING (true);
CREATE POLICY "Anyone reads flood warnings" ON public.flood_warnings FOR SELECT USING (true);
CREATE POLICY "Anyone reads crime stats" ON public.crime_statistics FOR SELECT USING (true);
CREATE POLICY "Anyone reads crime incidents" ON public.crime_incidents FOR SELECT USING (true);