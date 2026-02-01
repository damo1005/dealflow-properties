import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface UserDigestData {
  userId: string;
  email: string;
  displayName: string;
  newListings: any[];
  priceDrops: any[];
  savedSearches: any[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  try {
    const { digestType = 'daily', userId } = await req.json().catch(() => ({}));

    console.log(`Processing ${digestType} digest${userId ? ` for user ${userId}` : ' for all users'}`);

    // Get time period
    const now = new Date();
    const periodStart = new Date(now);
    
    if (digestType === 'daily') {
      periodStart.setDate(periodStart.getDate() - 1);
    } else if (digestType === 'weekly') {
      periodStart.setDate(periodStart.getDate() - 7);
    }

    // Get users who want digest emails
    let usersQuery = supabase
      .from('user_notification_preferences')
      .select('user_id, email_digest, email_digest_frequency')
      .eq('email_digest', true)
      .eq('email_digest_frequency', digestType);

    if (userId) {
      usersQuery = usersQuery.eq('user_id', userId);
    }

    const { data: users, error: usersError } = await usersQuery;
    if (usersError) throw usersError;

    if (!users || users.length === 0) {
      console.log("No users opted in for digest");
      return new Response(
        JSON.stringify({ success: true, message: "No users opted in for digest", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${users.length} users for ${digestType} digest`);

    let sentCount = 0;
    const results = [];

    for (const userPref of users) {
      try {
        const digestData = await gatherDigestData(
          supabase, 
          userPref.user_id, 
          periodStart, 
          now
        );

        if (!digestData.email) {
          console.log(`No email for user ${userPref.user_id}`);
          continue;
        }

        // Skip if nothing to report
        if (digestData.newListings.length === 0 && digestData.priceDrops.length === 0) {
          console.log(`Nothing to report for user ${userPref.user_id}`);
          continue;
        }

        console.log(`Sending digest to ${digestData.email}: ${digestData.newListings.length} listings, ${digestData.priceDrops.length} price drops`);

        // Send email
        const emailResult = await sendDigestEmail(
          RESEND_API_KEY,
          digestData, 
          digestType, 
          periodStart, 
          now
        );

        // Log the digest
        await supabase.from('email_digest_log').insert({
          user_id: userPref.user_id,
          digest_type: digestType,
          period_start: periodStart.toISOString(),
          period_end: now.toISOString(),
          new_listings_count: digestData.newListings.length,
          price_drops_count: digestData.priceDrops.length,
          saved_searches_count: digestData.savedSearches.length,
          email_sent: emailResult.success,
          sent_at: emailResult.success ? new Date().toISOString() : null,
          email_id: emailResult.emailId,
        });

        if (emailResult.success) {
          sentCount++;
        }

        results.push({
          userId: userPref.user_id,
          success: emailResult.success,
          newListings: digestData.newListings.length,
          priceDrops: digestData.priceDrops.length,
        });

      } catch (err: any) {
        console.error(`Digest failed for user ${userPref.user_id}:`, err);
        results.push({
          userId: userPref.user_id,
          success: false,
          error: err.message,
        });
      }
    }

    console.log(`Digest complete: ${sentCount}/${users.length} sent`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount, 
        total: users.length,
        results 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Daily digest error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function gatherDigestData(
  supabase: any,
  userId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<UserDigestData> {
  // Get user info
  const { data: userData } = await supabase.auth.admin.getUserById(userId);

  // Get user's saved searches
  const { data: savedSearches } = await supabase
    .from('user_saved_searches')
    .select('*')
    .eq('user_id', userId)
    .eq('alert_enabled', true);

  // Get new listings matching saved searches
  const newListings: any[] = [];
  
  for (const search of savedSearches || []) {
    let query = supabase
      .from('property_listings')
      .select('*')
      .gte('created_at', periodStart.toISOString())
      .lte('created_at', periodEnd.toISOString())
      .eq('status', 'active');

    // Location filter
    if (search.location) {
      query = query.or(`outcode.ilike.%${search.location}%,postcode.ilike.%${search.location}%,address.ilike.%${search.location}%`);
    }

    if (search.min_price) query = query.gte('price', search.min_price);
    if (search.max_price) query = query.lte('price', search.max_price);
    if (search.min_beds) query = query.gte('bedrooms', search.min_beds);

    const { data: listings } = await query.limit(10);
    
    if (listings) {
      for (const listing of listings) {
        if (!newListings.find(l => l.id === listing.id)) {
          newListings.push({
            ...listing,
            matchedSearch: search.name,
          });
        }
      }
    }
  }

  // Get price drops on saved properties
  const { data: savedProperties } = await supabase
    .from('user_saved_properties')
    .select(`
      listing_id,
      property_listings (*)
    `)
    .eq('user_id', userId);

  const priceDrops: any[] = [];
  
  for (const saved of savedProperties || []) {
    if (saved.property_listings?.is_reduced) {
      const { data: priceHistory } = await supabase
        .from('listing_price_history')
        .select('*')
        .eq('listing_id', saved.listing_id)
        .gte('recorded_at', periodStart.toISOString())
        .order('recorded_at', { ascending: false })
        .limit(2);

      if (priceHistory && priceHistory.length >= 2) {
        priceDrops.push({
          ...saved.property_listings,
          previousPrice: priceHistory[1].price,
          newPrice: priceHistory[0].price,
          dropPercent: Math.round((1 - priceHistory[0].price / priceHistory[1].price) * 100),
        });
      } else if (saved.property_listings.original_price) {
        priceDrops.push({
          ...saved.property_listings,
          previousPrice: saved.property_listings.original_price,
          newPrice: saved.property_listings.price,
          dropPercent: saved.property_listings.reduction_percent || 0,
        });
      }
    }
  }

  return {
    userId,
    email: userData?.user?.email || '',
    displayName: userData?.user?.user_metadata?.full_name || userData?.user?.email?.split('@')[0] || 'Investor',
    newListings: newListings.slice(0, 20),
    priceDrops,
    savedSearches: savedSearches || [],
  };
}

async function sendDigestEmail(
  resendApiKey: string | undefined,
  data: UserDigestData,
  digestType: string,
  periodStart: Date,
  periodEnd: Date
): Promise<{ success: boolean; emailId?: string }> {
  if (!resendApiKey) {
    console.log("No RESEND_API_KEY, skipping email");
    return { success: false };
  }

  const periodLabel = digestType === 'daily' ? 'Daily' : 'Weekly';
  const dateRange = `${periodStart.toLocaleDateString('en-GB')} - ${periodEnd.toLocaleDateString('en-GB')}`;

  const html = generateDigestEmailHtml(data, periodLabel, dateRange);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PropertyTracker <digest@mail.lovable.app>",
        to: data.email,
        subject: `📊 Your ${periodLabel} Property Digest - ${data.newListings.length} new listings`,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend error:", errorText);
      return { success: false };
    }

    const result = await response.json();
    console.log(`Email sent successfully: ${result.id}`);
    return { success: true, emailId: result.id };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false };
  }
}

function generateDigestEmailHtml(
  data: UserDigestData,
  periodLabel: string,
  dateRange: string
): string {
  const formatPrice = (price: number) => `£${price?.toLocaleString() || '0'}`;
  
  const listingsHtml = data.newListings.slice(0, 10).map(listing => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #eee;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="100" style="vertical-align: top;">
              ${listing.thumbnail_url 
                ? `<img src="${listing.thumbnail_url}" alt="Property" style="width: 90px; height: 70px; object-fit: cover; border-radius: 6px;">`
                : `<div style="width: 90px; height: 70px; background: #f0f0f0; border-radius: 6px;"></div>`
              }
            </td>
            <td style="vertical-align: top; padding-left: 15px;">
              <div style="font-size: 16px; font-weight: 600; color: #667eea; margin-bottom: 4px;">
                ${formatPrice(listing.price)}
              </div>
              <div style="font-size: 14px; color: #333; margin-bottom: 4px;">
                ${listing.address || 'Address not available'}
              </div>
              <div style="font-size: 12px; color: #666;">
                ${listing.bedrooms || '?'} bed • ${listing.property_type || 'Property'}
                ${listing.gross_yield ? ` • ${listing.gross_yield}% yield` : ''}
              </div>
              <div style="font-size: 11px; color: #999; margin-top: 4px;">
                Matched: ${listing.matchedSearch}
              </div>
            </td>
            <td width="80" style="vertical-align: middle; text-align: right;">
              <a href="${listing.listing_url || '#'}" style="display: inline-block; padding: 8px 16px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">
                View
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const priceDropsHtml = data.priceDrops.length > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; background: #fff8e6; border-radius: 12px; overflow: hidden;">
      <tr>
        <td style="padding: 20px;">
          <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #333;">
            💰 Price Drops on Saved Properties
          </h2>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${data.priceDrops.map(listing => `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ffe4b0;">
                  <div style="font-size: 14px; color: #333; margin-bottom: 4px;">
                    ${listing.address}
                  </div>
                  <div style="font-size: 14px;">
                    <span style="text-decoration: line-through; color: #999;">${formatPrice(listing.previousPrice)}</span>
                    <span style="color: #16a34a; font-weight: 600; margin-left: 8px;">${formatPrice(listing.newPrice)}</span>
                    <span style="background: #dcfce7; color: #16a34a; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 8px;">
                      -${listing.dropPercent}%
                    </span>
                  </div>
                </td>
              </tr>
            `).join('')}
          </table>
        </td>
      </tr>
    </table>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">
              📊 ${periodLabel} Property Digest
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
              ${dateRange}
            </p>
          </td>
        </tr>
        
        <!-- Stats Summary -->
        <tr>
          <td style="background: white; padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" style="text-align: center; padding: 15px;">
                  <div style="font-size: 28px; font-weight: 700; color: #667eea;">
                    ${data.newListings.length}
                  </div>
                  <div style="font-size: 12px; color: #666; text-transform: uppercase;">
                    New Listings
                  </div>
                </td>
                <td width="33%" style="text-align: center; padding: 15px; border-left: 1px solid #eee; border-right: 1px solid #eee;">
                  <div style="font-size: 28px; font-weight: 700; color: #16a34a;">
                    ${data.priceDrops.length}
                  </div>
                  <div style="font-size: 12px; color: #666; text-transform: uppercase;">
                    Price Drops
                  </div>
                </td>
                <td width="33%" style="text-align: center; padding: 15px;">
                  <div style="font-size: 28px; font-weight: 700; color: #f59e0b;">
                    ${data.savedSearches.length}
                  </div>
                  <div style="font-size: 12px; color: #666; text-transform: uppercase;">
                    Active Alerts
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- New Listings -->
        <tr>
          <td style="background: white; padding: 0 20px 20px 20px;">
            <h2 style="margin: 20px 0 15px 0; font-size: 18px; color: #333;">
              🏠 New Properties Matching Your Searches
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              ${listingsHtml}
            </table>
            ${data.newListings.length > 10 ? `
              <div style="text-align: center; margin-top: 15px;">
                <a href="#" style="color: #667eea; text-decoration: none; font-size: 14px;">
                  View all ${data.newListings.length} new listings →
                </a>
              </div>
            ` : ''}
          </td>
        </tr>
        
        <!-- Price Drops -->
        <tr>
          <td style="background: white; padding: 0 20px 20px 20px;">
            ${priceDropsHtml}
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="background: white; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <a href="#" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
              View All Properties
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 20px; text-align: center;">
            <p style="font-size: 12px; color: #999; margin: 0 0 10px 0;">
              You're receiving this because you enabled ${periodLabel.toLowerCase()} digests.
            </p>
            <p style="font-size: 12px; color: #999; margin: 0;">
              <a href="#" style="color: #667eea; text-decoration: none;">
                Manage notification settings
              </a>
              &nbsp;•&nbsp;
              <a href="#" style="color: #999; text-decoration: none;">
                Unsubscribe
              </a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
