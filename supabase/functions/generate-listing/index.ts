import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    const { 
      property_type,
      bedrooms,
      bathrooms,
      sleeps,
      amenities,
      unique_features,
      target_guests,
      location,
      nearby_attractions,
      property_id,
      user_id
    } = await req.json()
    
    console.log('Generating listing for property:', property_id)
    
    const prompt = `You are an expert Airbnb listing copywriter. Generate 3 compelling listing variations for this property:

Property Details:
- Type: ${property_type}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Sleeps: ${sleeps}
- Location: ${location}
- Amenities: ${amenities?.join(', ') || 'Standard amenities'}
- Unique Features: ${unique_features || 'Modern, well-maintained property'}
- Perfect For: ${target_guests?.join(', ') || 'All guests'}
- Nearby: ${nearby_attractions || 'Local attractions'}

For EACH of the 3 variations, provide:

1. TITLE (32 characters max, engaging, includes key features)
2. DESCRIPTION (Around 400-500 words, structured with):
   - Opening Hook (grab attention)
   - The Space (describe rooms, layout, style)
   - Guest Access (what guests can use)
   - The Neighborhood (local attractions, transport)
   - Getting Around (parking, public transport)
   - Other Things to Note (house rules preview, tips)

Requirements for ALL content:
- Use emotional, descriptive language
- Include Airbnb SEO keywords naturally
- Highlight unique selling points
- Set clear expectations
- Be welcoming and warm
- Avoid clichés like "home away from home"
- Use specific details, not generic phrases

Output ONLY valid JSON in this exact format:
{
  "variations": [
    {
      "title": "...",
      "description": "Full description text with all sections combined"
    },
    {
      "title": "...",
      "description": "Full description text with all sections combined"
    },
    {
      "title": "...",
      "description": "Full description text with all sections combined"
    }
  ],
  "house_rules": "Standard house rules text including check-in/out times, quiet hours, no smoking, etc.",
  "checkin_instructions": "Template check-in instructions with placeholders for code and specific details"
}`

    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 4000,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('API error:', error)
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    const content = data.choices[0].message.content
    
    console.log('Raw AI response:', content.substring(0, 200))
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonContent = content
    if (content.includes('```json')) {
      jsonContent = content.split('```json')[1].split('```')[0].trim()
    } else if (content.includes('```')) {
      jsonContent = content.split('```')[1].split('```')[0].trim()
    }
    
    const generated = JSON.parse(jsonContent)
    
    // Format for frontend with scores
    const result = {
      titles: generated.variations.map((v: any, i: number) => ({
        text: v.title,
        score: 85 + (i * 4) - Math.floor(Math.random() * 5)
      })),
      descriptions: generated.variations.map((v: any, i: number) => ({
        text: v.description,
        score: 80 + (i * 5) - Math.floor(Math.random() * 5)
      })),
      house_rules: generated.house_rules,
      checkin_instructions: generated.checkin_instructions
    }
    
    // Save to database if property_id and user_id provided
    if (property_id && user_id) {
      await supabase.from('listing_generations').insert({
        str_property_id: property_id,
        user_id: user_id,
        titles: result.titles,
        descriptions: result.descriptions,
        house_rules: result.house_rules,
        checkin_instructions: result.checkin_instructions,
        input_data: { property_type, bedrooms, bathrooms, sleeps, amenities, unique_features, target_guests, location, nearby_attractions }
      })
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error generating listing:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
