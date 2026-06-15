import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const BLOG_POSTS = [
  { slug: 'best-neighbourhoods-new-cairo', title: 'Best Neighbourhoods in New Cairo for Short Stays', category: 'Destinations' },
  { slug: 'marassi-vs-fouka-bay', title: 'Marassi vs Fouka Bay: Which North Coast Resort Is Right for You?', category: 'Destinations' },
  { slug: 'el-gouna-guide', title: 'El Gouna: The Complete Short-Stay Guide', category: 'Destinations' },
  { slug: 'birdnest-vs-airbnb-egypt', title: 'BirdNest vs Airbnb Egypt: What\'s the Difference?', category: 'Tips' },
]

export async function POST(req: NextRequest) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })
  try {
    const { message, conversationHistory = [] } = await req.json()

    const systemPrompt = `You are Nesty, BirdNest's friendly travel guide AI for Egypt. Help visitors discover relevant blog articles.

Blog posts:
${JSON.stringify(BLOG_POSTS, null, 2)}

Return ONLY valid JSON (no markdown):
{"message": "Your friendly response", "recommendedSlugs": ["slug1"]}

Respond in the same language the user writes in.`

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
    try { parsed = JSON.parse(text) }
    catch { parsed = { message: text, recommendedSlugs: [] } }

    const recommendedPosts = BLOG_POSTS.filter(p => parsed.recommendedSlugs?.includes(p.slug))

    return NextResponse.json({ message: parsed.message, recommendedPosts })
  } catch (error) {
    console.error('Blog chat error:', error)
    return NextResponse.json({ message: "I'm having trouble right now. Please try again!", recommendedPosts: [] })
  }
}
