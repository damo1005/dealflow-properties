-- Create scenarios table for what-if analysis
CREATE TABLE IF NOT EXISTS public.scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id text,
  name text NOT NULL,
  scenario_type text NOT NULL CHECK (scenario_type IN ('btl', 'brr', 'hmo', 'flip', 'commercial')),
  base_inputs jsonb NOT NULL DEFAULT '{}',
  scenario_variations jsonb NOT NULL DEFAULT '[]',
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX idx_scenarios_user ON public.scenarios(user_id);
CREATE INDEX idx_scenarios_property ON public.scenarios(property_id);
CREATE INDEX idx_scenarios_type ON public.scenarios(scenario_type);

-- Enable RLS
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Users can view their own scenarios
CREATE POLICY "Users can view their own scenarios"
ON public.scenarios FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own scenarios
CREATE POLICY "Users can create their own scenarios"
ON public.scenarios FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own scenarios
CREATE POLICY "Users can update their own scenarios"
ON public.scenarios FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own scenarios
CREATE POLICY "Users can delete their own scenarios"
ON public.scenarios FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_scenarios_updated_at
BEFORE UPDATE ON public.scenarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();