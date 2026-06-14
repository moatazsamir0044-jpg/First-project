import { NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  enquiryType: z.string(),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // In production: save to DB and/or send email via Resend
    console.log('Contact submission:', data)

    return NextResponse.json({ success: true, message: 'Message received. We\'ll be in touch within 2 hours.' })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid submission' }, { status: 400 })
  }
}
