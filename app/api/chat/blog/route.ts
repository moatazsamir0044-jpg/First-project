import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const BLOG_POSTS = [
  { slug: 'best-neighbourhoods-new-cairo', title: 'Best Neighbourhoods in New Cairo for Short Stays', excerpt: 'Discover the top areas in New Cairo for your next short stay — from Fifth Settlement to Hyde Park.', category: 'Destinations' },
  { slug: 'marassi-vs-fouka-bay', title: 'Marassi vs Fouka Bay: Which North Coast Resort Is Right for You?', excerpt: 'A detailed comparison of two of Egypt\'s most popular North Coast destinations.', category: 'Destinations' },
  { slug: 'el-gouna-guide', title: 'El Gouna: The Complete Short-Stay Guide', excerpt: 'Everything you need to know about staying in El Gouna — Egypt\'s most unique Red Sea town.', category: 'Destinations' },
  { slug: 'birdnest-vs-airbnb-egypt', title: 'BirdNest vs Airbnb Egypt: What\'s the Difference?', excerpt: 'An honest comparison of BirdNest and Airbnb for apartment rentals in Egypt.', category: 'Tips' },
]

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json()

    const systemPrompt = `You are Nesty, BirdNest's friendly travel guide AI. BirdNest is a curated property rental platform in Egypt. Your job is to help visitors discover which blog articles are most relevant to their Egypt trip.

Available blog posts:
${JSON.stringify(BLOG_POSTS, null, 2)}

Based on what the user tells you about their trip, recommend the most relevant blog posts. Return ONLY a valid JSON response (no markdown) in this exact format:
{
  "message": "Your friendly response here",
  "recommendedSlugs": ["slug1", "slug2"]
}

Always respond in the same language the user writes in. Be warm and knowledgeable about Egypt.`

    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ]

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: systemPrompt,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = { message: text, recommendedSlugs: [] }
    }

    const recommendedPosts = BLOG_POSTS.filter(p => parsed.recommendedSlugs?.includes(p.slug))

    return NextResponse.json({ message: parsed.message, recommendedPosts })
  } catch (error) {
    console.error('Blog chat error:', error)
    return NextResponse.json({ message: "I'm having trouble right now. Please try again!", recommendedPosts: [] }, { status: 200 })
  }
}
