-- Create comparisons table for saved property comparisons
CREATE TABLE IF NOT EXISTS public.comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  property_ids text[] NOT NULL DEFAULT '{}',
  property_data jsonb DEFAULT '[]',
  calculator_inputs jsonb DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX idx_comparisons_user ON public.comparisons(user_id);
CREATE INDEX idx_comparisons_created ON public.comparisons(created_at DESC);

-- Enable RLS
ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;

-- Users can view their own comparisons
CREATE POLICY "Users can view their own comparisons"
ON public.comparisons FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own comparisons
CREATE POLICY "Users can create their own comparisons"
ON public.comparisons FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own comparisons
CREATE POLICY "Users can update their own comparisons"
ON public.comparisons FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own comparisons
CREATE POLICY "Users can delete their own comparisons"
ON public.comparisons FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_comparisons_updated_at
BEFORE UPDATE ON public.comparisons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();