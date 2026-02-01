-- Email templates table
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read templates
CREATE POLICY "Templates are viewable by authenticated users"
ON public.email_templates FOR SELECT
TO authenticated
USING (true);

-- Insert default templates
INSERT INTO public.email_templates (template_key, name, subject, description) VALUES
('welcome_email', 'Welcome Email', 'Welcome to DealFlow!', 'Sent after user signs up'),
('email_verification', 'Email Verification', 'Verify your email address', 'Sent to verify email address'),
('password_reset', 'Password Reset', 'Reset your password', 'Sent when user requests password reset'),
('deal_scout_alert', 'Deal Scout Alert', 'New properties match your criteria!', 'Sent when Deal Scout finds matches'),
('weekly_digest', 'Weekly Digest', 'Your weekly DealFlow summary', 'Weekly summary of activity');

-- Add email preferences to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_preferences JSONB DEFAULT '{
  "welcome_email": true,
  "email_verification": true,
  "password_reset": true,
  "deal_scout_alert": true,
  "weekly_digest": true
}'::jsonb;

-- Add trigger for updated_at
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();