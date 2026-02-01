-- Voice note shares table for team collaboration
CREATE TABLE IF NOT EXISTS public.voice_note_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_note_id UUID REFERENCES public.voice_notes(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID NOT NULL,
  shared_with_email TEXT NOT NULL,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- User viewing stats table for gamification
CREATE TABLE IF NOT EXISTS public.user_viewing_stats (
  user_id UUID PRIMARY KEY NOT NULL,
  total_viewings INTEGER DEFAULT 0,
  total_minutes_recorded INTEGER DEFAULT 0,
  most_detailed_note_id UUID REFERENCES public.voice_notes(id) ON DELETE SET NULL,
  last_viewing_date TIMESTAMPTZ,
  streak_days INTEGER DEFAULT 0,
  badges_earned JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add template_used and confidence_score columns to voice_notes if they don't exist
ALTER TABLE public.voice_notes 
ADD COLUMN IF NOT EXISTS template_used TEXT,
ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_voice_notes_user ON public.voice_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_notes_date ON public.voice_notes(recording_date DESC);
CREATE INDEX IF NOT EXISTS idx_voice_note_shares_note ON public.voice_note_shares(voice_note_id);
CREATE INDEX IF NOT EXISTS idx_voice_note_shares_email ON public.voice_note_shares(shared_with_email);

-- Enable RLS on new tables
ALTER TABLE public.voice_note_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_viewing_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for voice_note_shares
CREATE POLICY "Users can view shares they created"
  ON public.voice_note_shares FOR SELECT
  USING (auth.uid() = shared_by);

CREATE POLICY "Users can view shares sent to their email"
  ON public.voice_note_shares FOR SELECT
  USING (shared_with_email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can create shares for their own notes"
  ON public.voice_note_shares FOR INSERT
  WITH CHECK (
    auth.uid() = shared_by AND
    EXISTS (
      SELECT 1 FROM public.voice_notes 
      WHERE id = voice_note_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete shares they created"
  ON public.voice_note_shares FOR DELETE
  USING (auth.uid() = shared_by);

-- RLS Policies for user_viewing_stats
CREATE POLICY "Users can view own stats"
  ON public.user_viewing_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON public.user_viewing_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.user_viewing_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger for updating timestamps
CREATE TRIGGER update_user_viewing_stats_updated_at
  BEFORE UPDATE ON public.user_viewing_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();