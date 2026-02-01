-- Add onboarding columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS user_motivation text,
ADD COLUMN IF NOT EXISTS primary_strategy text,
ADD COLUMN IF NOT EXISTS secondary_strategies text[],
ADD COLUMN IF NOT EXISTS budget_range text,
ADD COLUMN IF NOT EXISTS target_locations text[],
ADD COLUMN IF NOT EXISTS completed_onboarding boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamp with time zone;