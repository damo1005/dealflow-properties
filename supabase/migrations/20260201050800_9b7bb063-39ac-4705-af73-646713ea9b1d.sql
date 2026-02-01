-- Comparison watches (for price/status alerts)
CREATE TABLE IF NOT EXISTS public.comparison_watches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id UUID REFERENCES public.comparisons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  alert_on_price_change BOOLEAN DEFAULT true,
  alert_on_status_change BOOLEAN DEFAULT true,
  price_threshold INTEGER DEFAULT 0,
  alert_frequency TEXT DEFAULT 'instant',
  last_alert_sent TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Comparison shares (for collaboration)
CREATE TABLE IF NOT EXISTS public.comparison_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id UUID REFERENCES public.comparisons(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID NOT NULL,
  shared_with_email TEXT NOT NULL,
  access_level TEXT DEFAULT 'view',
  viewed_at TIMESTAMPTZ,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Historical comparison snapshots for market timing
CREATE TABLE IF NOT EXISTS public.comparison_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id UUID REFERENCES public.comparisons(id) ON DELETE CASCADE NOT NULL,
  snapshot_date TIMESTAMPTZ DEFAULT now() NOT NULL,
  property_data JSONB NOT NULL,
  market_conditions JSONB
);

-- Add new columns to comparisons table
ALTER TABLE public.comparisons 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS user_ranking JSONB,
ADD COLUMN IF NOT EXISTS ai_recommendation JSONB,
ADD COLUMN IF NOT EXISTS decision_made BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS chosen_property_id TEXT,
ADD COLUMN IF NOT EXISTS decision_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS decision_notes TEXT,
ADD COLUMN IF NOT EXISTS decision_reasons JSONB;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_comparison_watches_active ON public.comparison_watches(is_active, comparison_id);
CREATE INDEX IF NOT EXISTS idx_comparison_shares_comparison ON public.comparison_shares(comparison_id);
CREATE INDEX IF NOT EXISTS idx_comparison_snapshots_comparison ON public.comparison_snapshots(comparison_id, snapshot_date DESC);

-- Enable RLS on new tables
ALTER TABLE public.comparison_watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comparison_watches
CREATE POLICY "Users can view own watches"
  ON public.comparison_watches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own watches"
  ON public.comparison_watches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watches"
  ON public.comparison_watches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own watches"
  ON public.comparison_watches FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for comparison_shares
CREATE POLICY "Users can view shares they created"
  ON public.comparison_shares FOR SELECT
  USING (auth.uid() = shared_by);

CREATE POLICY "Users can view shares sent to their email"
  ON public.comparison_shares FOR SELECT
  USING (shared_with_email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can create shares for their comparisons"
  ON public.comparison_shares FOR INSERT
  WITH CHECK (
    auth.uid() = shared_by AND
    EXISTS (
      SELECT 1 FROM public.comparisons 
      WHERE id = comparison_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete shares they created"
  ON public.comparison_shares FOR DELETE
  USING (auth.uid() = shared_by);

-- RLS Policies for comparison_snapshots
CREATE POLICY "Users can view snapshots for their comparisons"
  ON public.comparison_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.comparisons 
      WHERE id = comparison_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create snapshots for their comparisons"
  ON public.comparison_snapshots FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.comparisons 
      WHERE id = comparison_id AND user_id = auth.uid()
    )
  );

-- Trigger to create snapshot when comparison is updated
CREATE OR REPLACE FUNCTION public.create_comparison_snapshot()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.comparison_snapshots (comparison_id, property_data)
  VALUES (NEW.id, COALESCE(NEW.property_data, '[]'::jsonb));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS comparison_updated_snapshot ON public.comparisons;
CREATE TRIGGER comparison_updated_snapshot
  AFTER UPDATE OF property_data ON public.comparisons
  FOR EACH ROW
  WHEN (OLD.property_data IS DISTINCT FROM NEW.property_data)
  EXECUTE FUNCTION public.create_comparison_snapshot();