-- EPC Certificates table
CREATE TABLE IF NOT EXISTS public.epc_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  building_reference_number TEXT,
  certificate_hash TEXT UNIQUE NOT NULL,
  lodgement_date DATE NOT NULL,
  lodgement_datetime TIMESTAMPTZ,
  current_energy_rating TEXT CHECK (current_energy_rating IN ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
  current_energy_efficiency INTEGER CHECK (current_energy_efficiency BETWEEN 0 AND 100),
  potential_energy_rating TEXT CHECK (potential_energy_rating IN ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
  potential_energy_efficiency INTEGER CHECK (potential_energy_efficiency BETWEEN 0 AND 100),
  current_co2_emissions DECIMAL(8,2),
  current_co2_emissions_rating TEXT,
  potential_co2_emissions DECIMAL(8,2),
  potential_co2_emissions_rating TEXT,
  current_energy_cost DECIMAL(10,2),
  potential_energy_cost DECIMAL(10,2),
  property_type TEXT,
  built_form TEXT,
  total_floor_area DECIMAL(8,2),
  number_habitable_rooms INTEGER,
  number_heated_rooms INTEGER,
  walls_description TEXT,
  walls_energy_efficiency TEXT,
  roof_description TEXT,
  roof_energy_efficiency TEXT,
  floor_description TEXT,
  floor_energy_efficiency TEXT,
  windows_description TEXT,
  windows_energy_efficiency TEXT,
  main_heating_description TEXT,
  main_heating_energy_efficiency TEXT,
  main_fuel TEXT,
  heating_cost_current DECIMAL(10,2),
  heating_cost_potential DECIMAL(10,2),
  hot_water_description TEXT,
  hot_water_energy_efficiency TEXT,
  hot_water_cost_current DECIMAL(10,2),
  hot_water_cost_potential DECIMAL(10,2),
  lighting_description TEXT,
  lighting_energy_efficiency TEXT,
  lighting_cost_current DECIMAL(10,2),
  lighting_cost_potential DECIMAL(10,2),
  improvements JSONB,
  assessor_name TEXT,
  assessor_company TEXT,
  inspection_date DATE,
  epc_local_authority TEXT,
  constituency TEXT,
  county TEXT,
  transaction_type TEXT,
  tenure TEXT,
  api_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for EPC
CREATE INDEX IF NOT EXISTS idx_epc_postcode ON public.epc_certificates(postcode);
CREATE INDEX IF NOT EXISTS idx_epc_address ON public.epc_certificates(property_address);
CREATE INDEX IF NOT EXISTS idx_epc_rating ON public.epc_certificates(current_energy_rating);
CREATE INDEX IF NOT EXISTS idx_epc_lodgement ON public.epc_certificates(lodgement_date DESC);

-- RLS for EPC
ALTER TABLE public.epc_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads EPCs" ON public.epc_certificates FOR SELECT USING (true);