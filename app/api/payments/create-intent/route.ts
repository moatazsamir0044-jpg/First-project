import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { calculateNights } from '@/lib/formatters'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const intentSchema = z.object({
  listingId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1),
  guestEmail: z.string().email(),
  guestName: z.string().min(2),
})

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
  }

  const ip = getClientIp(request)
  if (!rateLimit(`payment:${ip}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await request.json()
  const parsed = intentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const { listingId, checkIn, checkOut, guests, guestEmail, guestName } = parsed.data
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  const listing = await prisma.listing.findUnique({
    where: { id: listingId, isActive: true },
    select: { id: true, title: true, pricePerNight: true, cleaningFee: true, utilitiesEst: true, maxGuests: true },
  })

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (guests > listing.maxGuests) {
    return NextResponse.json({ error: `Maximum ${listing.maxGuests} guests` }, { status: 400 })
  }

  const nights = calculateNights(checkInDate, checkOutDate)
  if (nights < 1) {
    return NextResponse.json({ error: 'Minimum 1 night stay' }, { status: 400 })
  }

  const subtotal = listing.pricePerNight * nights
  const total = subtotal + listing.cleaningFee + listing.utilitiesEst

  // Stripe amounts are in smallest currency unit (piastres for EGP = 1/100 EGP)
  const amountInPiastres = total * 100

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPiastres,
    currency: 'egp',
    receipt_email: guestEmail,
    metadata: {
      listingId,
      listingTitle: listing.title,
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      guests: guests.toString(),
      nights: nights.toString(),
    },
    description: `BirdNest — ${listing.title} (${nights} nights)`,
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    breakdown: {
      nights,
      pricePerNight: listing.pricePerNight,
      subtotal,
      cleaningFee: listing.cleaningFee,
      utilitiesEst: listing.utilitiesEst,
      total,
    },
  })
}
