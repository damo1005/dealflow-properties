import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-EMAIL] ${step}${detailsStr}`);
};

// Email templates
const templates: Record<string, (data: any) => { subject: string; html: string }> = {
  welcome_email: (data) => ({
    subject: "Welcome to DealFlow! 🏠",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #1a1a1a; margin: 0 0 16px;">Welcome to DealFlow! 🏠</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Hi ${data.name || 'there'},
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Thanks for joining DealFlow - the all-in-one platform for property investors. Here's what you can do:
            </p>
            <ul style="color: #4b5563; font-size: 16px; line-height: 1.8;">
              <li>Search and analyze properties</li>
              <li>Calculate ROI with our investment calculators</li>
              <li>Set up Deal Scouts to find opportunities</li>
              <li>Manage your portfolio</li>
            </ul>
            <a href="${data.loginUrl || 'https://dealflow.app'}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
              Get Started
            </a>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 32px;">
              If you have any questions, just reply to this email!
            </p>
          </div>
        </body>
      </html>
    `,
  }),

  email_verification: (data) => ({
    subject: "Verify your email address",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #1a1a1a; margin: 0 0 16px;">Verify Your Email</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Hi ${data.name || 'there'},
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Please verify your email address by clicking the button below:
            </p>
            <a href="${data.verificationUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
              Verify Email
            </a>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 32px;">
              Or copy this link: ${data.verificationUrl}
            </p>
            <p style="color: #9ca3af; font-size: 14px;">
              This link expires in 24 hours.
            </p>
          </div>
        </body>
      </html>
    `,
  }),

  password_reset: (data) => ({
    subject: "Reset your password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #1a1a1a; margin: 0 0 16px;">Reset Your Password</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Hi ${data.name || 'there'},
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password. Click the button below to set a new one:
            </p>
            <a href="${data.resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
              Reset Password
            </a>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 32px;">
              This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  }),

  deal_scout_alert: (data) => ({
    subject: `🏠 ${data.matchCount || 'New'} properties match your criteria!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #1a1a1a; margin: 0 0 16px;">🏠 New Property Matches!</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Hi ${data.name || 'there'},
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Your Deal Scout "<strong>${data.scoutName || 'Property Scout'}</strong>" found ${data.matchCount || 'new'} matching properties!
            </p>
            ${data.properties ? `
              <div style="margin: 24px 0;">
                ${data.properties.slice(0, 3).map((p: any) => `
                  <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
                    <h3 style="margin: 0 0 8px; color: #1a1a1a;">${p.address}</h3>
                    <p style="margin: 0; color: #2563eb; font-weight: 600;">£${p.price?.toLocaleString()}</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">${p.bedrooms} bed • ${p.propertyType}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            <a href="${data.viewUrl || 'https://dealflow.app/deal-scout'}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View All Matches
            </a>
          </div>
        </body>
      </html>
    `,
  }),

  weekly_digest: (data) => ({
    subject: "Your Weekly DealFlow Summary 📊",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #1a1a1a; margin: 0 0 16px;">Your Weekly Summary 📊</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Hi ${data.name || 'there'},
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Here's what happened this week:
            </p>
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280;">Properties Saved</span>
                <span style="color: #1a1a1a; font-weight: 600;">${data.propertiesSaved || 0}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280;">Scout Matches</span>
                <span style="color: #1a1a1a; font-weight: 600;">${data.scoutMatches || 0}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Pipeline Updates</span>
                <span style="color: #1a1a1a; font-weight: 600;">${data.pipelineUpdates || 0}</span>
              </div>
            </div>
            <a href="${data.dashboardUrl || 'https://dealflow.app/dashboard'}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Dashboard
            </a>
          </div>
        </body>
      </html>
    `,
  }),
};

interface SendEmailRequest {
  templateKey: string;
  to: string;
  data?: Record<string, any>;
  userId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { templateKey, to, data, userId }: SendEmailRequest = await req.json();
    
    if (!templateKey || !to) {
      throw new Error("templateKey and to are required");
    }
    
    logStep("Request parsed", { templateKey, to, userId });

    // Check if user has this email type enabled
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email_preferences")
        .eq("id", userId)
        .single();
      
      const preferences = profile?.email_preferences || {};
      if (preferences[templateKey] === false) {
        logStep("Email disabled by user preferences", { templateKey });
        return new Response(JSON.stringify({ success: false, reason: "disabled_by_user" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // Get template
    const template = templates[templateKey];
    if (!template) {
      throw new Error(`Unknown template: ${templateKey}`);
    }

    const { subject, html } = template(data || {});
    logStep("Template rendered", { subject });

    // Send email
    const emailResponse = await resend.emails.send({
      from: "DealFlow <noreply@dealflow.app>", // Replace with your verified domain
      to: [to],
      subject,
      html,
    });

    const resendId = (emailResponse as any).data?.id || (emailResponse as any).id || null;
    logStep("Email sent", { id: resendId });

    // Log the email
    await supabase.from("email_logs").insert({
      user_id: userId || null,
      template_key: templateKey,
      recipient_email: to,
      subject,
      status: "sent",
      resend_id: resendId,
    });

    return new Response(JSON.stringify({ success: true, id: resendId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
