import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Find listings with recent price changes (reduced in last 24 hours)
    const { data: reducedListings, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('is_reduced', true)
      .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    console.log(`Found ${reducedListings?.length || 0} reduced listings`);

    let alertsSent = 0;

    for (const listing of reducedListings || []) {
      // Find users who have saved this listing
      const { data: savedBy } = await supabase
        .from('user_saved_properties')
        .select('user_id')
        .eq('listing_id', listing.id);

      for (const saved of savedBy || []) {
        // Check user preferences
        const { data: prefs } = await supabase
          .from('user_notification_preferences')
          .select('*')
          .eq('user_id', saved.user_id)
          .single();

        // Skip if user has disabled price drop notifications
        if (prefs && !prefs.email_price_drops && !prefs.push_price_drops) {
          continue;
        }

        // Check if we already sent a notification for this price drop
        const { data: existingNotif } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', saved.user_id)
          .eq('listing_id', listing.id)
          .eq('type', 'price_drop')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .single();

        if (existingNotif) {
          console.log(`Already notified user ${saved.user_id} about price drop for ${listing.id}`);
          continue;
        }

        // Create notification
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            user_id: saved.user_id,
            type: 'price_drop',
            title: 'Price Reduced!',
            message: `${listing.address} dropped from £${listing.original_price?.toLocaleString()} to £${listing.price?.toLocaleString()} (-${listing.reduction_percent}%)`,
            listing_id: listing.id,
            data: {
              old_price: listing.original_price,
              new_price: listing.price,
              reduction_percent: listing.reduction_percent,
              address: listing.address,
              thumbnail_url: listing.thumbnail_url,
              listing_url: listing.listing_url,
            },
            is_read: false,
            is_archived: false,
          });

        if (!notifError) {
          alertsSent++;
          console.log(`Created price drop notification for user ${saved.user_id}`);
        }

        // Send email if enabled
        if (prefs?.email_price_drops !== false) {
          await sendPriceDropEmail(supabase, saved.user_id, listing);
        }
      }

      // Record price history
      const { data: lastPrice } = await supabase
        .from('listing_price_history')
        .select('price')
        .eq('listing_id', listing.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      // Only record if price changed
      if (!lastPrice || lastPrice.price !== listing.price) {
        await supabase
          .from('listing_price_history')
          .insert({
            listing_id: listing.id,
            price: listing.price,
          });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        reducedListings: reducedListings?.length || 0,
        alertsSent 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Price drop check error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function sendPriceDropEmail(supabase: any, userId: string, listing: any) {
  try {
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    if (!userData?.user?.email) return;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.log("No RESEND_API_KEY configured, skipping email");
      return;
    }

    const formatPrice = (price: number) => `£${price?.toLocaleString() || '0'}`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📉 Price Drop Alert!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">A property you saved has been reduced</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
          <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            ${listing.thumbnail_url ? `<img src="${listing.thumbnail_url}" alt="Property" style="width: 100%; height: 200px; object-fit: cover;">` : ''}
            <div style="padding: 20px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 22px; font-weight: bold; color: #22c55e;">${formatPrice(listing.price)}</span>
                <span style="text-decoration: line-through; color: #999;">${formatPrice(listing.original_price)}</span>
                <span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">-${listing.reduction_percent}%</span>
              </div>
              <p style="margin: 0 0 15px 0; color: #666;">${listing.address || 'Address not available'}</p>
              <a href="${listing.listing_url || '#'}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">View Property →</a>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p style="margin: 0;">PropertyTracker Price Alerts</p>
        </div>
      </body>
      </html>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PropertyTracker <alerts@mail.lovable.app>",
        to: userData.user.email,
        subject: `Price Drop: ${listing.address}`,
        html: emailHtml,
      }),
    });
  } catch (error) {
    console.error("Price drop email error:", error);
  }
}
