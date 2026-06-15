import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { mockListings } from '@/lib/mock-data'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
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
      eligibility: l.eligibility,
      images: l.images.slice(0, 1),
    }))

    const systemPrompt = `You are Nesty, BirdNest's friendly AI assistant. BirdNest is a curated property rental platform in Egypt with nests in New Cairo, Sahel (North Coast), El Gouna, and Sheikh Zayed. Your job is to help guests find the perfect nest based on what they describe. Be warm, helpful and conversational.

Here are all available listings:
${JSON.stringify(listingsSummary, null, 2)}

When a user describes what they want, analyze the available listings and return ONLY a valid JSON response (no markdown, no extra text) in this exact format:
{
  "message": "Your friendly response here",
  "matchingListingIds": ["id1", "id2"],
  "filters": {
    "location": "area name or null",
    "maxPrice": number or null,
    "minBedrooms": number or null
  }
}

Always respond in the same language the user writes in (Arabic or English). Keep responses concise and helpful. If no listings match, suggest alternatives and set matchingListingIds to [].`

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
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = { message: text, matchingListingIds: [], filters: {} }
    }

    const matchingListings = mockListings.filter(l => parsed.matchingListingIds?.includes(l.id))

    return NextResponse.json({
      message: parsed.message,
      matchingListings,
      filters: parsed.filters || {},
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ message: "I'm having trouble connecting right now. Please try again!", matchingListings: [], filters: {} }, { status: 200 })
  }
}
