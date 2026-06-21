import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { mockListings } from '@/lib/mock-data'
import { rateLimit, clientKey } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ message: "Nesty is not configured yet. Please contact us via WhatsApp!", matchingListings: [], filters: {} })
  }
  // Rate limit AI calls to control cost/abuse: 15 messages/min per IP
  const rl = rateLimit(clientKey(req, 'chat'), { limit: 15, windowMs: 60_000 })
  if (!rl.allowed) {
    return NextResponse.json({ message: "You're sending messages too fast — give Nesty a moment! 🪺", matchingListings: [], filters: {} }, { status: 429 })
  }
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  try {
    const { message, conversationHistory = [] } = await req.json()

    // Cap input size to prevent prompt-stuffing / runaway cost
    if (typeof message !== 'string' || message.length === 0 || message.length > 1000) {
      return NextResponse.json({ message: 'Please keep your message short and try again.', matchingListings: [], filters: {} }, { status: 400 })
    }

    const listingsSummary = mockListings.map(l => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      location: l.location,
      area: l.area,
      pricePerNight: l.pricePerNight,
      bedrooms: l.bedrooms,
      maxGuests: l.maxGuests,
      amenities: l.amenities,
      rating: l.rating,
    }))

    const systemPrompt = `You are Nesty, BirdNest's friendly AI assistant. BirdNest is a curated property rental platform in Egypt with nests in New Cairo, Sahel (North Coast), El Gouna, and Sheikh Zayed. Help guests find the perfect nest.

Available listings:
${JSON.stringify(listingsSummary, null, 2)}

Return ONLY valid JSON (no markdown) in this exact format:
{"message": "Your friendly response", "matchingListingIds": ["id1", "id2"], "filters": {"location": null, "maxPrice": null, "minBedrooms": null}}

Always respond in the same language the user writes in (Arabic or English). Be warm and helpful.`

    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ]

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    let parsed
    try { parsed = JSON.parse(text) }
    catch { parsed = { message: text, matchingListingIds: [], filters: {} } }

    const matchingListings = mockListings.filter(l => parsed.matchingListingIds?.includes(l.id))

    return NextResponse.json({ message: parsed.message, matchingListings, filters: parsed.filters || {} })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Chat error:', msg)
    return NextResponse.json({ message: `Error: ${msg}`, matchingListings: [], filters: {} })
  }
}
