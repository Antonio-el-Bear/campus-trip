import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS')
    return new Response(null, { headers: corsHeaders });

  try {
    const {
      departure,
      destination,
      destinations,
      transportType,
      totalDays,
      tourismTypes,
      maxBudget,
      currency,
      additionalNotes,
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const tourismLabels = (tourismTypes || []).join(', ');

    const systemPrompt = `You are an expert travel planner for an international travel knowledge platform. You produce structured, research-based travel plans with a professional, credible, and international tone.

You must return a valid JSON object (no markdown, no code fences) with this exact structure:
{
  "title": "string - compelling trip title",
  "description": "string - 200-300 word professional trip description",
  "countries": ["array of countries visited"],
  "locations": ["array of specific cities/towns"],
  "transport": ["array of transport modes used"],
  "totalCost": number (estimated total cost per person in ${currency || 'EUR'}),
  "mainTransportLinks": [
    { "service": "name of airline/train/bus company for main journey to destination", "url": "booking or official website URL", "notes": "brief description" }
  ],
  "itinerary": [
    {
      "dayNumber": number,
      "locations": ["locations for this day"],
      "attractions": ["key attractions"],
      "activities": ["planned activities"],
      "notes": "practical notes",
      "transportBetweenLocations": [
        { "from": "origin city", "to": "destination city", "mode": "train/bus/flight/ferry/taxi", "service": "specific company name", "url": "booking URL for this service", "duration": "estimated duration", "cost": number }
      ],
      "accommodations": [
        { "name": "string", "location": "string", "pricePerNight": number, "url": "booking or official website URL" }
      ],
      "foodRecommendations": [
        { "name": "restaurant/place name", "cuisine": "type", "priceRange": "€/€€/€€€", "notes": "why recommended", "url": "website or Google Maps URL if known" }
      ]
    }
  ],
  "budgetBreakdown": {
    "transport": number,
    "accommodation": number,
    "food": number,
    "activities": number,
    "other": number,
    "total": number
  },
  "tips": ["array of 3-5 practical travel tips"]
}

Important rules:
- The itinerary MUST have exactly the number of days requested (including travel days)
- Day 1 should cover departure/travel, last day should cover return
- The trip may span MULTIPLE countries and cities — distribute days logically across all destinations
- CRITICAL: For EVERY day that involves moving between cities/locations, you MUST include at least one entry in transportBetweenLocations. Even for local transport within a city (e.g. taxi from airport to hotel), include it. Never leave transportBetweenLocations as an empty array if the traveller moves anywhere that day.
- CRITICAL: Every foodRecommendations entry MUST include a "url" field. Use the restaurant's official website, Google Maps link (format: https://maps.google.com/?q=Restaurant+Name+City), TripAdvisor link, or any relevant booking/review URL. NEVER leave the url field empty — always provide at least a Google Maps search URL.
- CRITICAL: Every accommodations entry MUST include a "url" field with a booking link (booking.com, hotels.com, or the hotel's official website). NEVER leave it empty.
- Include mainTransportLinks for the main journey from departure to the first destination (e.g. airlines, international train services)
- Stay within the maximum budget per person
- Provide up to 5 accommodation options per night (varied price ranges) with booking URLs
- Provide 5 food recommendations per day — each MUST have a url
- Base recommendations on the tourism classification chosen
- All costs in ${currency || 'EUR'}`;

    // Build destination description from structured data
    const destinationDesc = (destinations || [])
      .filter((d: any) => d.country)
      .map((d: any) => (d.cities ? `${d.cities} in ${d.country}` : d.country))
      .join(', then ');

    const userPrompt = `Create a detailed multi-destination travel plan with these parameters:
- Departure from: ${departure}
- Destinations (in order): ${destinationDesc || destination}
- Transport type for main travel: ${transportType}
- Total days (including travel): ${totalDays}
- Tourism type(s): ${tourismLabels}
- Maximum budget per person: ${maxBudget} ${currency || 'EUR'}
${additionalNotes ? `- Additional notes: ${additionalNotes}` : ''}

IMPORTANT: The traveller wants to visit ALL listed destinations. Distribute the days across all countries/cities logically. Include travel days between destinations. Generate a complete, optimized multi-destination itinerary.`;

    const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded. Please try again in a moment.',
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: 'AI credits depleted. Please add credits to continue.',
          }),
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      const t = await response.text();
      console.error('AI gateway error:', response.status, t);
      return new Response(JSON.stringify({ error: 'AI generation failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: 'No content generated' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse the JSON from the AI response
    let tripPlan;
    try {
      // Remove potential markdown code fences
      const cleaned = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      tripPlan = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse AI response:', content);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response', raw: content }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ tripPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('ai-trip-builder error:', e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
