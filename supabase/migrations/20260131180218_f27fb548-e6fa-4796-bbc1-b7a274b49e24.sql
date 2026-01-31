-- Create voice notes table for property viewing notes
CREATE TABLE IF NOT EXISTS public.voice_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id text, -- References external property ID from cached_properties
  property_address text NOT NULL,
  recording_date timestamptz DEFAULT now() NOT NULL,
  duration_seconds integer,
  transcript text,
  structured_analysis jsonb,
  audio_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for efficient queries
CREATE INDEX idx_voice_notes_property ON public.voice_notes(property_id);
CREATE INDEX idx_voice_notes_user ON public.voice_notes(user_id);
CREATE INDEX idx_voice_notes_date ON public.voice_notes(recording_date DESC);

-- Enable RLS
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;

-- Users can view their own voice notes
CREATE POLICY "Users can view their own voice notes"
ON public.voice_notes FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own voice notes
CREATE POLICY "Users can create their own voice notes"
ON public.voice_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own voice notes
CREATE POLICY "Users can update their own voice notes"
ON public.voice_notes FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own voice notes
CREATE POLICY "Users can delete their own voice notes"
ON public.voice_notes FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_voice_notes_updated_at
BEFORE UPDATE ON public.voice_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();