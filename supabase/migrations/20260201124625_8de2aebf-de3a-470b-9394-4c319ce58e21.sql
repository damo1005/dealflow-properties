-- Tax Calculations table for storing saved calculations
CREATE TABLE IF NOT EXISTS public.tax_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  calc_type text CHECK (calc_type IN ('sdlt', 'cgt', 'income_tax', 'section_24', 'incorporation')) NOT NULL,
  inputs jsonb NOT NULL,
  results jsonb NOT NULL,
  calculation_name text,
  notes text,
  property_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tax_calcs_user ON public.tax_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_calcs_type ON public.tax_calculations(calc_type);

-- SDLT rates reference table
CREATE TABLE IF NOT EXISTS public.sdlt_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  effective_from date NOT NULL,
  effective_to date,
  property_type text NOT NULL,
  buyer_type text NOT NULL,
  rate_bands jsonb NOT NULL,
  additional_property_surcharge decimal(5,2),
  non_uk_resident_surcharge decimal(5,2),
  is_current boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sdlt_rates_current ON public.sdlt_rates(is_current);

-- Insert current SDLT rates (2025/26)
INSERT INTO public.sdlt_rates (effective_from, property_type, buyer_type, rate_bands, additional_property_surcharge, non_uk_resident_surcharge, is_current) VALUES
('2025-04-01', 'residential', 'first_time_buyer', '[{"threshold": 0, "rate": 0}, {"threshold": 425000, "rate": 5}]'::jsonb, NULL, 2.0, true),
('2025-04-01', 'residential', 'standard', '[{"threshold": 0, "rate": 0}, {"threshold": 250000, "rate": 5}, {"threshold": 925000, "rate": 10}, {"threshold": 1500000, "rate": 12}]'::jsonb, NULL, 2.0, true),
('2025-04-01', 'residential', 'additional_property', '[{"threshold": 0, "rate": 3}, {"threshold": 250000, "rate": 8}, {"threshold": 925000, "rate": 13}, {"threshold": 1500000, "rate": 15}]'::jsonb, 3.0, 2.0, true)
ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sdlt_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own tax calculations" ON public.tax_calculations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone reads SDLT rates" ON public.sdlt_rates FOR SELECT USING (true);