import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const systemPrompt = `You are a property viewing notes analyzer for UK property investors. Analyze property viewing transcripts and extract structured insights.

Return ONLY valid JSON (no markdown, no backticks, no explanations) in this exact structure:

{
  "condition_assessment": {
    "overall": "Good" | "Fair" | "Poor",
    "rooms": [
      {"name": "Room name", "condition": "Good" | "Fair" | "Poor", "notes": "specific observations"}
    ],
    "urgent_issues": ["critical issue 1", "critical issue 2"]
  },
  "cost_estimates": {
    "cosmetic": [{"item": "description", "cost": number}],
    "essential": [{"item": "description", "cost": number}],
    "upgrades": [{"item": "description", "cost": number}],
    "total": number
  },
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"],
  "key_quotes": ["direct quote from viewing", "another key observation"],
  "overall_impression": {
    "sentiment": "Positive" | "Neutral" | "Negative",
    "interest_level": "High" | "Medium" | "Low",
    "next_action": "specific recommended next step"
  }
}

Guidelines:
- Be realistic with cost estimates for UK property market (2024 prices)
- Extract actual quotes from the transcript when available
- If information is missing, make reasonable assumptions based on context
- Identify any deal-breaker issues in urgent_issues
- Keep pros/cons concise and actionable
- Recommend specific next actions based on sentiment`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { transcript, propertyAddress, templateUsed } = await req.json();

    if (!transcript || transcript.trim().length === 0) {
      throw new Error("Transcript is required");
    }

    const templateContext = templateUsed
      ? `\nThe user was using the "${templateUsed}" template, so pay special attention to those aspects in your analysis.`
      : "";

    const userPrompt = `Analyze this property viewing transcript for: ${propertyAddress || "Unknown property"}${templateContext}

Transcript:
"${transcript}"

Extract condition assessments, cost estimates, pros/cons, key quotes, and overall impression. Be specific and actionable. Return valid JSON only.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 3000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No analysis content received from AI");
    }

    // Parse the JSON response - handle potential markdown wrapping
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.slice(7);
    }
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    let analysis;
    try {
      analysis = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", cleanedContent);
      throw new Error("Failed to parse AI analysis response");
    }

    // Validate required fields exist
    if (!analysis.condition_assessment) {
      analysis.condition_assessment = { overall: "Fair", rooms: [], urgent_issues: [] };
    }
    if (!analysis.cost_estimates) {
      analysis.cost_estimates = { cosmetic: [], essential: [], upgrades: [], total: 0 };
    }
    if (!analysis.overall_impression) {
      analysis.overall_impression = { sentiment: "Neutral", interest_level: "Medium", next_action: "Review transcript" };
    }
    if (!analysis.pros) analysis.pros = [];
    if (!analysis.cons) analysis.cons = [];
    if (!analysis.key_quotes) analysis.key_quotes = [];

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in analyze-viewing-notes:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        message: "Failed to analyze viewing notes. Please try again.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
