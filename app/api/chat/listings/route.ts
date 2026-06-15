import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { mockListings } from '@/lib/mock-data'

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ message: "Nesty is not configured yet. Please contact us via WhatsApp!", matchingListings: [], filters: {} })
  }
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  try {
    const { message, conversationHistory = [] } = await req.json()

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
    console.error('Chat error:', error)
    return NextResponse.json({ message: "I'm having trouble right now. Please try again!", matchingListings: [], filters: {} })
  }
}
