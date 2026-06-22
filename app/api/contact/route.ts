import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { sendContactNotification } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  enquiryType: z.enum(['general', 'booking', 'listing', 'partnership', 'complaint', 'other']),
  message: z.string().min(10).max(5000),
})

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const body = await request.json()
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission', details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data

  await prisma.contactSubmission.create({ data })

  sendContactNotification(data).catch(console.error)

  return NextResponse.json({ success: true, message: "Message received. We'll be in touch within 2 hours." })
}
