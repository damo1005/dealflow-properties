import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LANDLORD_SYSTEM_PROMPT = `You are Landlord Co-Pilot, an AI assistant for UK property investors and landlords.

KNOWLEDGE AREAS:
- UK tenancy law (Housing Act 1988, Section 21/8, AST rules, Renters Reform Bill)
- Tax (rental income, allowable expenses, mortgage interest relief at 20%, stamp duty, CGT)
- Compliance (Gas Safety CP12, EPC, EICR, HMO licensing, deposit protection)
- Landlord responsibilities and best practices

PERSONALITY:
- Professional but friendly and approachable
- Give clear, structured answers with actionable steps
- Use emojis sparingly for visual clarity (📋 ✓ ❌ 💡 ⚠️)
- Always cite sources when mentioning specific laws or regulations
- Acknowledge when something requires professional advice (solicitor, accountant)

RESPONSE FORMAT:
- Use **bold** for key points
- Use bullet lists for steps or multiple items
- Use emoji headers for sections
- Keep answers concise but comprehensive
- Always offer relevant follow-up questions or next steps

IMPORTANT DISCLAIMERS:
- For complex legal matters, recommend consulting a solicitor
- For tax calculations over £10k, recommend consulting an accountant
- Laws change - recommend checking gov.uk for latest information
- You provide guidance, not legal or financial advice

When given portfolio context, personalize answers with specific property details.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId, userId, portfolioContext } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get Supabase client for knowledge base lookup
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get last user message for keyword matching
    const lastMessage = messages[messages.length - 1]?.content || "";
    const searchTerms = lastMessage.toLowerCase();

    // Fetch relevant knowledge from database
    let relevantKnowledge = "";
    const { data: knowledgeData } = await supabase
      .from("copilot_knowledge")
      .select("*");

    if (knowledgeData) {
      const matchedKnowledge = knowledgeData.filter((k: any) => {
        const keywords = k.keywords || [];
        return keywords.some((kw: string) => searchTerms.includes(kw.toLowerCase())) ||
          searchTerms.includes(k.title.toLowerCase()) ||
          searchTerms.includes(k.category.toLowerCase());
      });

      if (matchedKnowledge.length > 0) {
        relevantKnowledge = "\n\nRELEVANT KNOWLEDGE BASE:\n" + 
          matchedKnowledge.map((k: any) => 
            `[${k.category.toUpperCase()}] ${k.title}: ${k.content} (Source: ${k.source_url})`
          ).join("\n");
      }
    }

    // Build system prompt with context
    let systemPrompt = LANDLORD_SYSTEM_PROMPT;
    
    if (portfolioContext && portfolioContext.length > 0) {
      systemPrompt += `\n\nUSER'S PORTFOLIO CONTEXT:\n${JSON.stringify(portfolioContext, null, 2)}`;
    }

    systemPrompt += relevantKnowledge;

    // Call Lovable AI Gateway
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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream response back
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-copilot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
