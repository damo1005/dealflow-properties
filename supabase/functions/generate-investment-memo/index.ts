import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  tenure?: string;
  sqft?: number;
  estimatedRent?: number;
  estimatedValue?: number;
  calculatedYield?: number;
  calculatedCashFlow?: number;
  calculatedROI?: number;
  totalCashRequired?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const {
      property,
      otherProperties,
      memoType,
      includeComparison,
      includeRunnerUp,
      includeRisk,
      customSections,
    } = await req.json();

    const systemPrompt = `You are a professional property investment analyst writing investment memos for UK property investors.

Write clear, professional investment memos that are:
- Data-driven with specific numbers
- Realistic about risks and opportunities
- Actionable with clear next steps
- Appropriately detailed for the memo type

Use proper formatting with markdown headers, bullet points, and tables where appropriate.`;

    const propertyDetails = `
Property: ${property.address}
Price: ${formatCurrency(property.price)}
Type: ${property.propertyType || "Unknown"}
Bedrooms: ${property.bedrooms || "Unknown"}
Bathrooms: ${property.bathrooms || "Unknown"}
Tenure: ${property.tenure || "Unknown"}
Square Footage: ${property.sqft || "Unknown"} sqft
Estimated Rent: ${property.estimatedRent ? formatCurrency(property.estimatedRent) + "/mo" : "Unknown"}
Estimated Value: ${property.estimatedValue ? formatCurrency(property.estimatedValue) : "Unknown"}
Gross Yield: ${property.calculatedYield ? property.calculatedYield.toFixed(2) + "%" : "Unknown"}
Monthly Cash Flow: ${property.calculatedCashFlow ? formatCurrency(property.calculatedCashFlow) : "Unknown"}
ROI: ${property.calculatedROI ? property.calculatedROI.toFixed(2) + "%" : "Unknown"}
Total Cash Required: ${property.totalCashRequired ? formatCurrency(property.totalCashRequired) : "Unknown"}
`;

    let comparisonSection = "";
    if (includeComparison && otherProperties && otherProperties.length > 0) {
      comparisonSection = `
Compared Properties:
${otherProperties.map((p: Property) => `
- ${p.address}
  Price: ${formatCurrency(p.price)}
  Yield: ${p.calculatedYield ? p.calculatedYield.toFixed(2) + "%" : "N/A"}
  Cash Flow: ${p.calculatedCashFlow ? formatCurrency(p.calculatedCashFlow) : "N/A"}
`).join("")}
`;
    }

    const memoTypeInstructions: Record<string, string> = {
      internal: "Write a concise internal review memo for personal decision-making. Focus on key metrics and quick actionable insights.",
      partner: "Write a professional memo for presenting to a JV partner. Include ROI analysis, profit splits, and partnership value proposition.",
      lender: "Write a formal memo suitable for a mortgage broker or lender. Focus on property value, rental income stability, and borrower qualifications.",
      full: "Write a comprehensive due diligence report. Include detailed analysis of all aspects: financials, location, risks, opportunities, and market conditions.",
    };

    const userPrompt = `Create an investment memo for the following property:

${propertyDetails}

${comparisonSection}

Memo Type: ${memoType}
Instructions: ${memoTypeInstructions[memoType]}

${includeRunnerUp && otherProperties.length > 0 ? "Include a runner-up analysis comparing to the alternatives." : ""}
${includeRisk ? "Include a risk assessment section with mitigation strategies." : ""}
${customSections ? `Additional information to include: ${customSections}` : ""}

Format the memo with:
1. Executive Summary
2. Property Overview
3. Financial Analysis
4. ${includeComparison ? "Comparative Analysis" : "Market Context"}
5. ${includeRisk ? "Risk Assessment" : "Opportunities"}
6. Recommendation & Next Steps

Use markdown formatting.`;

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
        max_tokens: 4000,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    const memo = data.choices?.[0]?.message?.content;

    if (!memo) {
      throw new Error("No memo content generated");
    }

    return new Response(
      JSON.stringify({ success: true, memo }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in generate-investment-memo:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
