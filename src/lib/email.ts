import { supabase } from "@/integrations/supabase/client";

export type EmailTemplateKey = 
  | "welcome_email"
  | "email_verification"
  | "password_reset"
  | "deal_scout_alert"
  | "weekly_digest";

export interface EmailPreferences {
  welcome_email: boolean;
  email_verification: boolean;
  password_reset: boolean;
  deal_scout_alert: boolean;
  weekly_digest: boolean;
}

export const DEFAULT_EMAIL_PREFERENCES: EmailPreferences = {
  welcome_email: true,
  email_verification: true,
  password_reset: true,
  deal_scout_alert: true,
  weekly_digest: true,
};

export const EMAIL_TEMPLATE_LABELS: Record<EmailTemplateKey, { label: string; description: string }> = {
  welcome_email: {
    label: "Welcome Email",
    description: "Receive a welcome email when you sign up",
  },
  email_verification: {
    label: "Email Verification",
    description: "Receive emails to verify your email address",
  },
  password_reset: {
    label: "Password Reset",
    description: "Receive password reset emails",
  },
  deal_scout_alert: {
    label: "Deal Scout Alerts",
    description: "Get notified when Deal Scout finds matching properties",
  },
  weekly_digest: {
    label: "Weekly Digest",
    description: "Receive a weekly summary of your activity",
  },
};

interface SendEmailParams {
  templateKey: EmailTemplateKey;
  to: string;
  data?: Record<string, any>;
  userId?: string;
}

export async function sendEmail({ templateKey, to, data, userId }: SendEmailParams) {
  try {
    const { data: response, error } = await supabase.functions.invoke("send-email", {
      body: { templateKey, to, data, userId },
    });

    if (error) throw error;

    return { success: true, data: response };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, name: string, userId?: string) {
  return sendEmail({
    templateKey: "welcome_email",
    to: email,
    data: { name, loginUrl: `${window.location.origin}/dashboard` },
    userId,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string, name?: string) {
  return sendEmail({
    templateKey: "password_reset",
    to: email,
    data: { name, resetUrl },
  });
}

export async function sendDealScoutAlert(
  email: string,
  userId: string,
  scoutName: string,
  properties: any[],
  viewUrl: string
) {
  return sendEmail({
    templateKey: "deal_scout_alert",
    to: email,
    data: {
      scoutName,
      matchCount: properties.length,
      properties,
      viewUrl,
    },
    userId,
  });
}

export async function updateEmailPreferences(userId: string, preferences: Partial<EmailPreferences>) {
  const { error } = await supabase
    .from("profiles")
    .update({ email_preferences: preferences })
    .eq("id", userId);

  if (error) throw error;
  return { success: true };
}

export async function getEmailPreferences(userId: string): Promise<EmailPreferences> {
  const { data, error } = await supabase
    .from("profiles")
    .select("email_preferences")
    .eq("id", userId)
    .single();

  if (error) throw error;

  const prefs = data?.email_preferences;
  if (prefs && typeof prefs === "object" && !Array.isArray(prefs)) {
    return {
      welcome_email: (prefs as Record<string, unknown>).welcome_email !== false,
      email_verification: (prefs as Record<string, unknown>).email_verification !== false,
      password_reset: (prefs as Record<string, unknown>).password_reset !== false,
      deal_scout_alert: (prefs as Record<string, unknown>).deal_scout_alert !== false,
      weekly_digest: (prefs as Record<string, unknown>).weekly_digest !== false,
    };
  }

  return DEFAULT_EMAIL_PREFERENCES;
}
