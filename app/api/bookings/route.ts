import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateBookingRef } from '@/lib/formatters'

const bookingSchema = z.object({
  listingId: z.string(),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(8),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().min(1).max(20),
  totalPrice: z.number().positive(),
  eligibilityType: z.string(),
  specialRequests: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = bookingSchema.parse(body)
    const reference = generateBookingRef()

    // In production: save to DB, charge via Stripe, send confirmation email
    console.log('Booking:', { reference, ...data })

    return NextResponse.json({ success: true, reference, message: 'Booking confirmed!' })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid booking data' }, { status: 400 })
  }
}
