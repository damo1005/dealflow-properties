import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  property_type: string | null;
  images: string[] | null;
  estimated_yield: number | null;
  roi_potential: number | null;
  days_on_market: number | null;
}

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  filters: Record<string, unknown>;
  notification_frequency: string;
  last_alert_at: string | null;
  max_properties_per_email: number;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function generatePropertyCardHtml(property: Property, appUrl: string): string {
  const imageUrl = property.images?.[0] || "https://placehold.co/400x300/1a1a2e/ffffff?text=No+Image";
  
  return `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px; background: white;">
      <img src="${imageUrl}" alt="${property.address}" style="width: 100%; height: 200px; object-fit: cover;" />
      <div style="padding: 16px;">
        <h3 style="margin: 0 0 8px; font-size: 16px; color: #1f2937;">${property.address}</h3>
        <p style="margin: 0 0 12px; font-size: 24px; font-weight: bold; color: #3b82f6;">${formatCurrency(property.price)}</p>
        <div style="display: flex; gap: 16px; margin-bottom: 12px; font-size: 14px; color: #6b7280;">
          ${property.bedrooms ? `<span>🛏 ${property.bedrooms} beds</span>` : ""}
          ${property.bathrooms ? `<span>🛁 ${property.bathrooms} baths</span>` : ""}
          ${property.property_type ? `<span>🏠 ${property.property_type}</span>` : ""}
        </div>
        <div style="display: flex; gap: 16px; margin-bottom: 16px; font-size: 14px;">
          ${property.estimated_yield ? `<span style="color: #059669;">Yield: ${property.estimated_yield.toFixed(1)}%</span>` : ""}
          ${property.roi_potential ? `<span style="color: #3b82f6;">ROI: ${property.roi_potential.toFixed(1)}%</span>` : ""}
          ${property.days_on_market ? `<span style="color: #6b7280;">${property.days_on_market} days on market</span>` : ""}
        </div>
        <a href="${appUrl}/property/${property.id}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">View Property</a>
      </div>
    </div>
  `;
}

function generateEmailHtml(
  searchName: string,
  properties: Property[],
  appUrl: string
): string {
  const propertyCards = properties.map((p) => generatePropertyCardHtml(p, appUrl)).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 32px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px;">DealFlow</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Property Investment Platform</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="margin: 0 0 8px; color: #1f2937; font-size: 20px;">New Matches Found! 🏠</h2>
          <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px;">
            We found <strong>${properties.length}</strong> new ${properties.length === 1 ? "property" : "properties"} matching your search: <strong>"${searchName}"</strong>
          </p>

          <!-- Property Cards -->
          ${propertyCards}

          <!-- CTA -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="${appUrl}/saved-searches" style="display: inline-block; padding: 14px 32px; background-color: #1f2937; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">View All Matches</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">
            You're receiving this because you have email alerts enabled for "${searchName}".
          </p>
          <p style="margin: 0; font-size: 12px;">
            <a href="${appUrl}/saved-searches" style="color: #3b82f6; text-decoration: none;">Update Preferences</a>
            <span style="color: #d1d5db; margin: 0 8px;">|</span>
            <a href="${appUrl}/settings" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>

      <!-- Tracking Pixel -->
      <img src="${appUrl}/api/track-email?type=open" width="1" height="1" style="display: none;" />
    </body>
    </html>
  `;
}

async function getMatchingProperties(
  filters: Record<string, unknown>,
  lastAlertAt: string | null,
  maxProperties: number
): Promise<Property[]> {
  let query = supabase
    .from("cached_properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(maxProperties);

  // Apply filters
  if (filters.minPrice) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters.minBedrooms) {
    query = query.gte("bedrooms", filters.minBedrooms);
  }
  if (filters.maxBedrooms) {
    query = query.lte("bedrooms", filters.maxBedrooms);
  }
  if (filters.propertyTypes && (filters.propertyTypes as string[]).length > 0) {
    query = query.in("property_type", filters.propertyTypes as string[]);
  }
  if (filters.minYield) {
    query = query.gte("estimated_yield", filters.minYield);
  }

  // Only get properties added after last alert
  if (lastAlertAt) {
    query = query.gt("created_at", lastAlertAt);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return data || [];
}

async function getUserEmail(userId: string): Promise<string | null> {
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !data.user) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data.user.email || null;
}

async function processSearch(
  search: SavedSearch,
  appUrl: string
): Promise<{ sent: boolean; propertiesCount: number }> {
  console.log(`Processing search: ${search.name} (${search.id})`);

  // Get matching properties
  const properties = await getMatchingProperties(
    search.filters,
    search.last_alert_at,
    search.max_properties_per_email || 10
  );

  if (properties.length === 0) {
    console.log(`No new properties for search: ${search.name}`);
    return { sent: false, propertiesCount: 0 };
  }

  // Get user email
  const userEmail = await getUserEmail(search.user_id);
  if (!userEmail) {
    console.error(`No email found for user: ${search.user_id}`);
    return { sent: false, propertiesCount: 0 };
  }

  // Generate email
  const emailHtml = generateEmailHtml(search.name, properties, appUrl);

  // Send email
  try {
    const { error: sendError } = await resend.emails.send({
      from: "DealFlow <alerts@yourdomain.com>",
      to: [userEmail],
      subject: `${properties.length} new ${properties.length === 1 ? "property" : "properties"} matching "${search.name}"`,
      html: emailHtml,
    });

    if (sendError) {
      console.error("Error sending email:", sendError);
      return { sent: false, propertiesCount: properties.length };
    }

    // Update last_alert_at
    const { data: currentSearch } = await supabase
      .from("saved_searches")
      .select("total_matches_count")
      .eq("id", search.id)
      .single();
    
    await supabase
      .from("saved_searches")
      .update({ 
        last_alert_at: new Date().toISOString(),
        new_matches_count: 0,
        total_matches_count: (currentSearch?.total_matches_count || 0) + properties.length
      })
      .eq("id", search.id);

    // Log the email
    await supabase.from("email_logs").insert({
      user_id: search.user_id,
      saved_search_id: search.id,
      property_ids: properties.map((p) => p.id),
      email_type: search.notification_frequency,
    });

    // Create in-app notifications
    const notifications = properties.map((p) => ({
      user_id: search.user_id,
      type: "new_match" as const,
      title: "New Property Match",
      message: `${p.address} - ${formatCurrency(p.price)}`,
      property_id: p.id,
      property_address: p.address,
      property_price: p.price,
      property_image: p.images?.[0],
      saved_search_id: search.id,
    }));

    await supabase.from("notifications").insert(notifications);

    console.log(`Sent ${properties.length} properties to ${userEmail}`);
    return { sent: true, propertiesCount: properties.length };
  } catch (error) {
    console.error("Error in email send:", error);
    return { sent: false, propertiesCount: properties.length };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { frequency, searchId, appUrl = "https://dealflow.app" } = await req.json();

    let query = supabase
      .from("saved_searches")
      .select("*")
      .eq("alerts_enabled", true)
      .eq("paused", false);

    // Filter by frequency if provided
    if (frequency) {
      query = query.eq("notification_frequency", frequency);
    }

    // Or process a specific search
    if (searchId) {
      query = query.eq("id", searchId);
    }

    const { data: searches, error } = await query;

    if (error) {
      console.error("Error fetching searches:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch searches" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${searches?.length || 0} searches to process`);

    const results = [];
    for (const search of searches || []) {
      const result = await processSearch(search as SavedSearch, appUrl);
      results.push({ searchId: search.id, searchName: search.name, ...result });
    }

    const totalSent = results.filter((r) => r.sent).length;
    const totalProperties = results.reduce((sum, r) => sum + r.propertiesCount, 0);

    console.log(`Processed ${results.length} searches, sent ${totalSent} emails with ${totalProperties} total properties`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        emailsSent: totalSent,
        totalProperties,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in send-property-alerts:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
