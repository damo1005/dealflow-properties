import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!stripeKey) {
    logStep("ERROR", { message: "STRIPE_SECRET_KEY not set" });
    return new Response("Server configuration error", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Helper to log revenue events
  async function logRevenueEvent(eventType: string, data: {
    stripeEventId: string;
    amountCents?: number;
    currency?: string;
    customerId?: string;
    userId?: string;
    subscriptionId?: string;
    planName?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const { error } = await supabase
        .from('revenue_events')
        .insert({
          stripe_event_id: data.stripeEventId,
          event_type: eventType,
          amount_cents: data.amountCents || 0,
          currency: data.currency || 'gbp',
          customer_id: data.customerId,
          user_id: data.userId,
          subscription_id: data.subscriptionId,
          plan_name: data.planName,
          metadata: data.metadata || {}
        });

      if (error) {
        logStep("Failed to log revenue event", { error });
      } else {
        logStep("Revenue event logged", { eventType, amount: data.amountCents });
      }
    } catch (err) {
      logStep("Error logging revenue event", { error: err });
    }
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    let event: Stripe.Event;
    
    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        logStep("Webhook signature verification failed", { error: err });
        return new Response("Webhook signature verification failed", { status: 400 });
      }
    } else {
      // In development/testing, parse without verification
      event = JSON.parse(body);
      logStep("Webhook parsed without signature verification (dev mode)");
    }

    logStep("Event received", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const tier = session.metadata?.tier;
        const customerId = session.customer as string;
        
        logStep("Checkout completed", { userId, tier, customerId });
        
        if (userId && tier) {
          const { error } = await supabase
            .from("profiles")
            .update({
              subscription_tier: tier,
              stripe_customer_id: customerId,
            })
            .eq("id", userId);
          
          if (error) {
            logStep("Failed to update profile", { error });
          } else {
            logStep("Profile updated successfully", { userId, tier });
          }

          // Log revenue event for subscription created
          await logRevenueEvent('subscription_created', {
            stripeEventId: event.id,
            amountCents: session.amount_total || 0,
            currency: session.currency || 'gbp',
            customerId,
            userId,
            planName: tier,
            metadata: { sessionId: session.id }
          });
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        logStep("Subscription created", { customerId });
        
        // Find user by stripe_customer_id
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, subscription_tier")
          .eq("stripe_customer_id", customerId)
          .single();

        await logRevenueEvent('subscription_created', {
          stripeEventId: event.id,
          customerId,
          userId: profile?.id,
          subscriptionId: subscription.id,
          planName: profile?.subscription_tier,
          metadata: { status: subscription.status }
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;
        
        logStep("Subscription updated", { customerId, status });
        
        // Find user by stripe_customer_id
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();
        
        if (profile) {
          if (status === "active") {
            // Get the price to determine tier
            const priceId = subscription.items.data[0]?.price.id;
            let tier = "free";
            
            // Map price IDs to tiers
            if (priceId?.includes("pro")) {
              tier = "pro";
            } else if (priceId?.includes("premium")) {
              tier = "premium";
            }
            
            await supabase
              .from("profiles")
              .update({ subscription_tier: tier })
              .eq("id", profile.id);
            
            logStep("Subscription tier updated", { userId: profile.id, tier });
          } else if (status === "canceled" || status === "unpaid") {
            await supabase
              .from("profiles")
              .update({ subscription_tier: "free" })
              .eq("id", profile.id);
            
            logStep("Subscription cancelled, reverted to free", { userId: profile.id });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        logStep("Subscription deleted", { customerId });
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();
        
        if (profile) {
          await supabase
            .from("profiles")
            .update({ subscription_tier: "free" })
            .eq("id", profile.id);
          
          logStep("Profile reverted to free tier", { userId: profile.id });
        }

        // Log cancellation
        await logRevenueEvent('subscription_cancelled', {
          stripeEventId: event.id,
          customerId,
          userId: profile?.id,
          subscriptionId: subscription.id,
          metadata: { cancelledAt: subscription.canceled_at }
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        logStep("Payment succeeded", { customerId, amount: invoice.amount_paid });
        
        // Find user by stripe_customer_id
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, subscription_tier")
          .eq("stripe_customer_id", customerId)
          .single();

        // Log revenue event
        await logRevenueEvent('payment_succeeded', {
          stripeEventId: event.id,
          amountCents: invoice.amount_paid,
          currency: invoice.currency,
          customerId,
          userId: profile?.id,
          subscriptionId: invoice.subscription as string || undefined,
          planName: profile?.subscription_tier,
          metadata: { invoiceId: invoice.id }
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        logStep("Payment failed", { customerId, invoiceId: invoice.id });
        
        // Find user
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        // Log failed payment
        await logRevenueEvent('payment_failed', {
          stripeEventId: event.id,
          amountCents: invoice.amount_due,
          currency: invoice.currency,
          customerId,
          userId: profile?.id,
          subscriptionId: invoice.subscription as string || undefined,
          metadata: { invoiceId: invoice.id, reason: 'payment_failed' }
        });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
