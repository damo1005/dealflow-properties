import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  location: string;
  radius: number;
  min_price: number | null;
  max_price: number | null;
  min_beds: number | null;
  max_beds: number | null;
  property_types: string[] | null;
  alert_enabled: boolean;
  alert_frequency: string;
  alert_email: boolean;
  last_alerted: string | null;
  alert_push: boolean;
  alert_in_app: boolean;
  last_checked: string | null;
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
    const { searchId, checkAll } = await req.json().catch(() => ({}));

    let searches: SavedSearch[] = [];

    if (searchId) {
      // Check specific search
      const { data, error } = await supabase
        .from('user_saved_searches')
        .select('*')
        .eq('id', searchId)
        .eq('alert_enabled', true)
        .single();
      
      if (error) throw error;
      if (data) searches = [data];
    } else if (checkAll) {
      // Check all searches that need checking based on frequency
      const { data, error } = await supabase
        .from('user_saved_searches')
        .select('*')
        .eq('alert_enabled', true)
        .or(`last_checked.is.null,last_checked.lt.${getCheckThreshold()}`);
      
      if (error) throw error;
      searches = data || [];
    }

    console.log(`Checking ${searches.length} saved searches`);

    const results = [];

    for (const search of searches) {
      try {
        const result = await checkSearchForNewListings(supabase, search);
        results.push(result);
      } catch (error: any) {
        console.error(`Error checking search ${search.id}:`, error);
        results.push({ searchId: search.id, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Alert check error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getCheckThreshold(): string {
  // Check searches that haven't been checked in the last hour
  const threshold = new Date(Date.now() - 60 * 60 * 1000);
  return threshold.toISOString();
}

async function checkSearchForNewListings(supabase: any, search: SavedSearch) {
  const lastChecked = search.last_checked ? new Date(search.last_checked) : new Date(0);
  
  // Build query for matching listings
  let query = supabase
    .from('property_listings')
    .select('*')
    .gt('created_at', lastChecked.toISOString())
    .eq('status', 'active');

  // Location filter
  if (search.location) {
    query = query.or(`outcode.ilike.%${search.location}%,postcode.ilike.%${search.location}%,address.ilike.%${search.location}%`);
  }

  if (search.min_price) query = query.gte('price', search.min_price);
  if (search.max_price) query = query.lte('price', search.max_price);
  if (search.min_beds) query = query.gte('bedrooms', search.min_beds);
  if (search.max_beds) query = query.lte('bedrooms', search.max_beds);
  if (search.property_types && search.property_types.length > 0) {
    query = query.in('property_type', search.property_types);
  }

  const { data: newListings, error } = await query.limit(50);
  
  if (error) throw error;

  const alertsSent = [];

  if (newListings && newListings.length > 0) {
    console.log(`Found ${newListings.length} new listings for search ${search.id}`);

    // Create individual notifications for each listing (up to 5)
    for (const listing of newListings.slice(0, 5)) {
      const notification = {
        user_id: search.user_id,
        type: 'new_listing',
        title: `New property in ${search.name}`,
        message: `${listing.bedrooms || '?'} bed ${listing.property_type || 'property'} - £${listing.price?.toLocaleString()} - ${listing.address}`,
        listing_id: listing.id,
        saved_search_id: search.id,
        data: {
          price: listing.price,
          bedrooms: listing.bedrooms,
          address: listing.address,
          thumbnail_url: listing.thumbnail_url,
          listing_url: listing.listing_url,
          gross_yield: listing.gross_yield,
        },
        is_read: false,
        is_archived: false,
      };

      // Insert notification
      if (search.alert_in_app !== false) {
        const { data: notif, error: notifError } = await supabase
          .from('notifications')
          .insert(notification)
          .select()
          .single();

        if (!notifError && notif) {
          alertsSent.push(notif);
        }
      }

      // Send email if enabled
      if (search.alert_email) {
        await sendEmailNotification(supabase, search.user_id, listing, search);
      }
    }

    // If multiple listings, create a summary notification
    if (newListings.length > 5) {
      await supabase
        .from('notifications')
        .insert({
          user_id: search.user_id,
          type: 'new_listing',
          title: `${newListings.length} new properties in ${search.name}`,
          message: `${newListings.length} new properties match your search criteria`,
          saved_search_id: search.id,
          data: {
            count: newListings.length,
            listings: newListings.slice(0, 5).map((l: any) => ({
              id: l.id,
              price: l.price,
              address: l.address,
              thumbnail_url: l.thumbnail_url,
            })),
          },
          is_read: false,
          is_archived: false,
        });
    }
  }

  // Update search with last checked time
  await supabase
    .from('user_saved_searches')
    .update({
      last_checked: new Date().toISOString(),
      last_alerted: newListings && newListings.length > 0 ? new Date().toISOString() : search.last_alerted,
      new_listings_count: newListings?.length || 0,
    })
    .eq('id', search.id);

  // Log the check
  await supabase
    .from('alert_check_log')
    .insert({
      saved_search_id: search.id,
      listings_found: newListings?.length || 0,
      new_listings: newListings?.length || 0,
      alerts_sent: alertsSent.length,
    });

  return {
    searchId: search.id,
    searchName: search.name,
    newListings: newListings?.length || 0,
    alertsSent: alertsSent.length,
  };
}

async function sendEmailNotification(supabase: any, userId: string, listing: any, search: SavedSearch) {
  try {
    // Get user email
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    if (!userData?.user?.email) {
      console.log(`No email found for user ${userId}`);
      return;
    }

    // Check notification preferences
    const { data: prefs } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (prefs && prefs.email_new_listings === false) {
      console.log(`Email notifications disabled for user ${userId}`);
      return;
    }

    // Check quiet hours
    if (prefs?.quiet_hours_enabled) {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = parseInt(prefs.quiet_hours_start?.split(':')[0] || '22');
      const endHour = parseInt(prefs.quiet_hours_end?.split(':')[0] || '8');
      
      if (currentHour >= startHour || currentHour < endHour) {
        console.log(`Skipping email during quiet hours for user ${userId}`);
        return;
      }
    }

    // Use Resend for email
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.log("No RESEND_API_KEY configured, skipping email");
      return;
    }

    const emailHtml = generateEmailHtml(listing, search);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PropertyTracker <alerts@mail.lovable.app>",
        to: userData.user.email,
        subject: `New property matches "${search.name}"`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Email send failed:", errorText);
    } else {
      console.log(`Email sent to ${userData.user.email} for listing ${listing.id}`);
    }
  } catch (error) {
    console.error("Email error:", error);
  }
}

function generateEmailHtml(listing: any, search: SavedSearch): string {
  const formatPrice = (price: number) => `£${price?.toLocaleString() || '0'}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🏠 New Property Alert</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">A new listing matches your "${search.name}" search</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
        <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          ${listing.thumbnail_url ? `<img src="${listing.thumbnail_url}" alt="Property" style="width: 100%; height: 200px; object-fit: cover;">` : ''}
          <div style="padding: 20px;">
            <h2 style="margin: 0 0 8px 0; color: #667eea; font-size: 22px;">${formatPrice(listing.price)}</h2>
            <p style="margin: 0 0 15px 0; color: #666;">${listing.address || 'Address not available'}</p>
            <div style="display: flex; gap: 15px; margin-bottom: 20px; color: #888; font-size: 14px;">
              <span>🛏️ ${listing.bedrooms || '?'} beds</span>
              <span>🏠 ${listing.property_type || 'Property'}</span>
              ${listing.gross_yield ? `<span>📈 ${listing.gross_yield}% yield</span>` : ''}
            </div>
            <a href="${listing.listing_url || '#'}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">View Property →</a>
          </div>
        </div>
        
        <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
          This alert was sent because you have alerts enabled for your "${search.name}" saved search.
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p style="margin: 0;">PropertyTracker Property Alerts</p>
      </div>
    </body>
    </html>
  `;
}
