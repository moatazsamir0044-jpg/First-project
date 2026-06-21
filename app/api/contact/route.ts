import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, clientKey } from '@/lib/rate-limit'
import { sendContactNotification } from '@/lib/email'
import { isDbConfigured } from '@/lib/env'

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  enquiryType: z.string().max(60),
  message: z.string().min(10).max(4000),
})

export async function POST(request: Request) {
  // Rate limit: max 3 submissions per minute per IP (anti-spam)
  const rl = rateLimit(clientKey(request, 'contact'), { limit: 3, windowMs: 60_000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many messages. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    if (isDbConfigured()) {
      const { prisma } = await import('@/lib/prisma')
      await prisma.contactSubmission.create({ data })
    }

    await sendContactNotification(data)

    return NextResponse.json({
      success: true,
      message: "Message received. We'll be in touch within 2 hours.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid submission.', issues: error.issues },
        { status: 400 }
      )
    }
    console.error('[contact] error', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
