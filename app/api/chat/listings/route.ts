import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!rateLimit(`chat:${ip}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      message: 'Nesty is not configured yet. Please contact us via WhatsApp!',
      matchingListings: [],
      filters: {},
    })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const [body, listings] = await Promise.all([
    req.json(),
    prisma.listing.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        title: true,
        location: true,
        area: true,
        pricePerNight: true,
        bedrooms: true,
        maxGuests: true,
        amenities: true,
        rating: true,
        refundPolicy: true,
        eligibility: true,
      },
      orderBy: { rating: 'desc' },
    }),
  ])

  const { message, conversationHistory = [] } = body

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'message is required' }, { status: 400 })
  }

  const systemPrompt = `You are Nesty, BirdNest's friendly AI assistant. BirdNest is a curated property rental platform in Egypt with nests in New Cairo, North Coast (Sahel), El Gouna, and Sheikh Zayed. Help guests find the perfect nest.

Available listings:
${JSON.stringify(listings, null, 2)}

Return ONLY valid JSON (no markdown) in this exact format:
{"message": "Your friendly response", "matchingListingIds": ["id1", "id2"], "filters": {"location": null, "maxPrice": null, "minBedrooms": null}}

Always respond in the same language the user writes in (Arabic or English). Be warm and helpful.`

  try {
    const messages = [
      ...conversationHistory.slice(-10),
      { role: 'user' as const, content: message },
    ]

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    let parsed: { message: string; matchingListingIds?: string[]; filters?: Record<string, unknown> }
    try { parsed = JSON.parse(text) }
    catch { parsed = { message: text, matchingListingIds: [], filters: {} } }

    const ids = parsed.matchingListingIds ?? []
    const matchingListings = listings.filter((l: { id: string }) => ids.includes(l.id))

    return NextResponse.json({ message: parsed.message, matchingListings, filters: parsed.filters ?? {} })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Chat error:', msg)
    return NextResponse.json({ message: `Error: ${msg}`, matchingListings: [], filters: {} }, { status: 500 })
  }
}
