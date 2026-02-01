import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PushPayload {
  userId: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const payload: PushPayload = await req.json();
    
    if (!payload.userId || !payload.title) {
      throw new Error("userId and title are required");
    }

    console.log(`Sending push notification to user ${payload.userId}: ${payload.title}`);

    // Get user's push subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', payload.userId)
      .eq('is_active', true);

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      console.log("No active subscriptions found");
      return new Response(
        JSON.stringify({ success: true, message: "No active subscriptions", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${subscriptions.length} active subscriptions`);

    // Check user notification preferences
    const { data: prefs } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', payload.userId)
      .single();

    // Check quiet hours
    if (prefs?.quiet_hours_enabled) {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = parseInt(prefs.quiet_hours_start?.split(':')[0] || '22');
      const endHour = parseInt(prefs.quiet_hours_end?.split(':')[0] || '8');
      
      const inQuietHours = startHour > endHour
        ? (currentHour >= startHour || currentHour < endHour)
        : (currentHour >= startHour && currentHour < endHour);
      
      if (inQuietHours) {
        console.log("Quiet hours active, skipping notification");
        return new Response(
          JSON.stringify({ success: true, message: "Quiet hours active", sent: 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Build push notification payload
    const pushPayload = {
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/badge-72x72.png',
      tag: payload.tag || 'dealflow-notification',
      data: {
        ...payload.data,
        url: payload.data?.url || '/',
        timestamp: Date.now(),
      },
      actions: payload.actions || [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
      requireInteraction: true,
      renotify: true,
    };

    let sentCount = 0;
    const failedEndpoints: string[] = [];

    // Note: In production, you would use the web-push library with proper VAPID authentication
    // For now, we'll simulate the push and update subscription status
    for (const sub of subscriptions) {
      try {
        // In a real implementation, you would send the push here using web-push
        // const webpush = require('web-push');
        // await webpush.sendNotification(sub, JSON.stringify(pushPayload));
        
        console.log(`Would send push to endpoint: ${sub.endpoint.substring(0, 50)}...`);
        
        // For demo purposes, mark as sent
        sentCount++;
        
        // Update last used
        await supabase
          .from('push_subscriptions')
          .update({ last_used: new Date().toISOString(), failed_count: 0 })
          .eq('id', sub.id);

      } catch (err: any) {
        console.error(`Push failed for ${sub.id}:`, err);
        
        // Check if subscription is expired (410 Gone)
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase
            .from('push_subscriptions')
            .update({ is_active: false })
            .eq('id', sub.id);
          failedEndpoints.push(sub.endpoint);
        } else {
          // Increment failed count
          const newFailedCount = (sub.failed_count || 0) + 1;
          await supabase
            .from('push_subscriptions')
            .update({ 
              failed_count: newFailedCount,
              is_active: newFailedCount < 5
            })
            .eq('id', sub.id);
        }
      }
    }

    console.log(`Push notifications sent: ${sentCount}/${subscriptions.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount, 
        total: subscriptions.length,
        failed: failedEndpoints.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Push notification error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
