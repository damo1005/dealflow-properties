import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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
    const { property_id, ical_url } = await req.json()
    
    if (!property_id || !ical_url) {
      throw new Error('Missing property_id or ical_url')
    }
    
    console.log('Syncing iCal for property:', property_id)
    console.log('iCal URL:', ical_url)
    
    // Fetch iCal feed
    const response = await fetch(ical_url)
    if (!response.ok) {
      throw new Error(`Failed to fetch iCal: ${response.status}`)
    }
    
    const icalText = await response.text()
    console.log('Fetched iCal data, length:', icalText.length)
    
    // Parse iCal
    const events = parseICal(icalText)
    console.log('Parsed events:', events.length)
    
    let synced = 0
    let errors = 0
    
    // Upsert bookings
    for (const event of events) {
      try {
        const { error } = await supabase
          .from('str_bookings')
          .upsert({
            str_property_id: property_id,
            ical_uid: event.uid,
            guest_name: event.summary || 'Guest',
            checkin_date: event.start,
            checkout_date: event.end,
            status: 'confirmed',
            platform: detectPlatform(event.description || event.summary || ''),
            synced_from_ical: true,
            last_synced_at: new Date().toISOString()
          }, {
            onConflict: 'ical_uid'
          })
        
        if (error) {
          console.error('Error upserting booking:', error)
          errors++
        } else {
          synced++
        }
      } catch (err) {
        console.error('Error processing event:', err)
        errors++
      }
    }
    
    console.log(`Sync complete: ${synced} synced, ${errors} errors`)
    
    return new Response(JSON.stringify({ 
      synced, 
      errors,
      total_events: events.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error syncing iCal:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

interface ICalEvent {
  uid: string
  start: string
  end: string
  summary?: string
  description?: string
}

function parseICal(icalText: string): ICalEvent[] {
  const events: ICalEvent[] = []
  const lines = icalText.split(/\r?\n/)
  let current: Partial<ICalEvent> | null = null
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    
    // Handle line continuations (lines starting with space or tab)
    while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
      i++
      line += lines[i].substring(1)
    }
    
    if (line.startsWith('BEGIN:VEVENT')) {
      current = {}
    } else if (line.startsWith('END:VEVENT')) {
      if (current && current.uid && current.start && current.end) {
        events.push(current as ICalEvent)
      }
      current = null
    } else if (current) {
      if (line.startsWith('UID:')) {
        current.uid = line.substring(4).trim()
      } else if (line.startsWith('DTSTART')) {
        current.start = parseICalDate(line)
      } else if (line.startsWith('DTEND')) {
        current.end = parseICalDate(line)
      } else if (line.startsWith('SUMMARY:')) {
        current.summary = line.substring(8).trim()
      } else if (line.startsWith('DESCRIPTION:')) {
        current.description = line.substring(12).trim()
      }
    }
  }
  
  return events
}

function parseICalDate(line: string): string {
  // Handle various iCal date formats
  // DTSTART:20250201
  // DTSTART;VALUE=DATE:20250201
  // DTSTART:20250201T140000Z
  
  const match = line.match(/(\d{8})/)
  if (match) {
    const dateStr = match[1]
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`
  }
  return new Date().toISOString().split('T')[0]
}

function detectPlatform(text: string): string {
  if (!text) return 'unknown'
  const lower = text.toLowerCase()
  
  if (lower.includes('airbnb')) return 'airbnb'
  if (lower.includes('vrbo') || lower.includes('homeaway')) return 'vrbo'
  if (lower.includes('booking.com') || lower.includes('booking')) return 'booking.com'
  if (lower.includes('expedia')) return 'expedia'
  if (lower.includes('direct') || lower.includes('owner')) return 'direct'
  
  // Airbnb reservations often have specific patterns
  if (lower.includes('reserved') || lower.includes('not available')) return 'airbnb'
  
  return 'unknown'
}
