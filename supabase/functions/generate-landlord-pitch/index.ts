import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = userData.user;

    // Parse request body
    const body = await req.json();
    const { propertyAddress, monthlyOffer, keyBenefits, operatorName } = body;

    if (!propertyAddress || !monthlyOffer) {
      return new Response(
        JSON.stringify({ error: "propertyAddress and monthlyOffer are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check pitch count for free users (paywall: max 1 for free plan)
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const isPaid =
      profile?.subscription_tier &&
      profile.subscription_tier !== "free" &&
      profile.subscription_tier !== "";

    // Count existing pitches generated (stored in ai_actions_log)
    const { count } = await supabaseClient
      .from("ai_actions_log")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("action_type", "landlord_pitch");

    if (!isPaid && (count ?? 0) >= 1) {
      return new Response(
        JSON.stringify({
          error: "Free plan limit reached. Upgrade to generate more pitch letters.",
          requiresUpgrade: true,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Anthropic API
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const systemPrompt = `You are an experienced R2SA operator writing a guaranteed rent proposal to a landlord. Write a professional, 3-paragraph letter that:
(1) introduces the operator and their track record,
(2) explains the guaranteed rent model and what it means for the landlord — guaranteed monthly income, no voids, no tenant management, professional property care,
(3) makes the specific offer with monthly amount.
Tone: professional but warm. Length: 300-400 words.
Do NOT include placeholder brackets like [name] — use the details provided directly.`;

    const name = operatorName || user.user_metadata?.full_name || "the operator";
    const benefits = keyBenefits || "guaranteed monthly rent, professional property management, no void periods";

    const userPrompt = `Write a guaranteed rent proposal letter for the following:

Property: ${propertyAddress}
Operator name: ${name}
Monthly rent offer: £${monthlyOffer}
Key benefits to highlight: ${benefits}

Write the letter addressed to "Dear Landlord" and sign off with the operator name.`;

    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("Anthropic API error:", aiResponse.status, errorText);
      throw new Error("AI generation failed");
    }

    const aiData = await aiResponse.json();
    const pitchText = aiData.content?.[0]?.text;

    if (!pitchText) {
      throw new Error("No content returned from AI");
    }

    // Log the action
    await supabaseClient.from("ai_actions_log").insert({
      user_id: user.id,
      action_type: "landlord_pitch",
      action_details: {
        property_address: propertyAddress,
        monthly_offer: monthlyOffer,
      },
    });

    return new Response(
      JSON.stringify({ pitch: pitchText }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-landlord-pitch error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
