-- Add additional fields to saved_searches table
ALTER TABLE public.saved_searches 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS notification_frequency text DEFAULT 'manual' CHECK (notification_frequency IN ('instant', 'daily', 'weekly', 'manual')),
ADD COLUMN IF NOT EXISTS paused boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS digest_time time DEFAULT '09:00:00',
ADD COLUMN IF NOT EXISTS max_properties_per_email integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS new_matches_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_matches_count integer DEFAULT 0;

-- Create notifications table for in-app and email notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('new_match', 'price_drop', 'back_on_market', 'digest')),
  title text NOT NULL,
  message text,
  property_id uuid,
  property_address text,
  property_price numeric,
  property_image text,
  saved_search_id uuid REFERENCES public.saved_searches(id) ON DELETE SET NULL,
  read boolean DEFAULT false,
  clicked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

-- Create email_logs table to track sent emails and prevent duplicates
CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  saved_search_id uuid REFERENCES public.saved_searches(id) ON DELETE CASCADE,
  property_ids text[] DEFAULT '{}',
  email_type text NOT NULL CHECK (email_type IN ('instant', 'daily', 'weekly')),
  sent_at timestamp with time zone DEFAULT now() NOT NULL,
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_logs
CREATE POLICY "Users can view their own email logs"
ON public.email_logs FOR SELECT
USING (auth.uid() = user_id);

-- Create user_notification_preferences table
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  global_notifications_enabled boolean DEFAULT true,
  email_notifications_enabled boolean DEFAULT true,
  in_app_notifications_enabled boolean DEFAULT true,
  default_digest_time time DEFAULT '09:00:00',
  max_emails_per_day integer DEFAULT 5,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on user_notification_preferences
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_notification_preferences
CREATE POLICY "Users can view their own preferences"
ON public.user_notification_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.user_notification_preferences FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
ON public.user_notification_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for efficient notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_search ON public.email_logs(user_id, saved_search_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_alerts ON public.saved_searches(user_id, alerts_enabled, paused);