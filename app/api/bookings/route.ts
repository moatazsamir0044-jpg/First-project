import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateBookingRef, calculateNights } from '@/lib/formatters'
import { getListingById } from '@/lib/listings'
import { stripe } from '@/lib/stripe'
import { sendBookingConfirmation } from '@/lib/email'
import { rateLimit, clientKey } from '@/lib/rate-limit'
import { isDbConfigured, isStripeConfigured } from '@/lib/env'

const bookingSchema = z.object({
  listingId: z.string().min(1),
  guestName: z.string().min(2).max(120),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(8).max(30),
  nationality: z.string().max(80).optional().default(''),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1).max(20),
  eligibilityType: z.string().max(60),
  specialRequests: z.string().max(2000).optional(),
})

export async function POST(request: Request) {
  // 1) Rate limit: max 5 booking attempts per minute per IP
  const rl = rateLimit(clientKey(request, 'bookings'), { limit: 5, windowMs: 60_000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again shortly.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const data = bookingSchema.parse(body)

    // 2) Server-side validation against the real listing — never trust client price
    const listing = await getListingById(data.listingId)
    if (!listing || !listing.isActive) {
      return NextResponse.json(
        { success: false, message: 'This property is not available for booking.' },
        { status: 404 }
      )
    }

    const checkIn = new Date(data.checkIn)
    const checkOut = new Date(data.checkOut)
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return NextResponse.json({ success: false, message: 'Invalid dates.' }, { status: 400 })
    }
    if (checkOut <= checkIn) {
      return NextResponse.json(
        { success: false, message: 'Check-out must be after check-in.' },
        { status: 400 }
      )
    }
    if (checkIn < new Date(new Date().toDateString())) {
      return NextResponse.json(
        { success: false, message: 'Check-in cannot be in the past.' },
        { status: 400 }
      )
    }
    if (data.guests > listing.maxGuests) {
      return NextResponse.json(
        { success: false, message: `This property allows up to ${listing.maxGuests} guests.` },
        { status: 400 }
      )
    }

    // 3) Enforce eligibility policy on the SERVER (the UI check is not enough)
    if (
      data.nationality &&
      isArabNationality(data.nationality) &&
      !['married', 'family', 'corporate'].includes(data.eligibilityType.toLowerCase())
    ) {
      return NextResponse.json(
        { success: false, message: 'A marriage certificate is required for this booking type.' },
        { status: 400 }
      )
    }

    // 4) Compute the authoritative price server-side
    const nights = calculateNights(checkIn, checkOut)
    const totalPrice =
      nights * listing.pricePerNight + nights * listing.utilitiesEst + listing.cleaningFee

    const reference = generateBookingRef()

    // 5) Availability check + persist booking (when DB configured)
    let bookingId: string | null = null
    if (isDbConfigured()) {
      const { prisma } = await import('@/lib/prisma')

      const conflict = await prisma.booking.findFirst({
        where: {
          listingId: listing.id,
          status: { in: ['pending', 'confirmed'] },
          checkIn: { lt: checkOut },
          checkOut: { gt: checkIn },
        },
      })
      if (conflict) {
        return NextResponse.json(
          { success: false, message: 'Those dates are no longer available.' },
          { status: 409 }
        )
      }

      const booking = await prisma.booking.create({
        data: {
          reference,
          listingId: listing.id,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.guestPhone,
          nationality: data.nationality ?? '',
          checkIn,
          checkOut,
          guests: data.guests,
          totalPrice,
          status: 'pending',
          eligibilityType: data.eligibilityType,
          specialRequests: data.specialRequests,
        },
      })
      bookingId = booking.id
    }

    // 6) Create a Stripe PaymentIntent (when configured) so the client can pay
    let clientSecret: string | null = null
    if (isStripeConfigured() && stripe) {
      const intent = await stripe.paymentIntents.create({
        amount: totalPrice * 100, // EGP → piastres
        currency: 'egp',
        metadata: { reference, listingId: listing.id, bookingId: bookingId ?? '' },
        description: `BirdNest booking ${reference} — ${listing.title}`,
        receipt_email: data.guestEmail,
      })
      clientSecret = intent.client_secret
      if (isDbConfigured() && bookingId) {
        const { prisma } = await import('@/lib/prisma')
        await prisma.booking.update({
          where: { id: bookingId },
          data: { stripePaymentId: intent.id },
        })
      }
    }

    // 7) In demo mode (no Stripe), confirm immediately and email the guest.
    //    With Stripe, the webhook confirms + emails after payment succeeds.
    if (!isStripeConfigured()) {
      await sendBookingConfirmation({
        reference,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        listingTitle: listing.title,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        totalPrice,
      })
    }

    return NextResponse.json({
      success: true,
      reference,
      totalPrice,
      clientSecret, // null in demo mode; used by Stripe Elements in production
      requiresPayment: !!clientSecret,
      message: 'Booking created.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking data.', issues: error.issues },
        { status: 400 }
      )
    }
    console.error('[bookings] error', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// Minimal Arab-nationality check for server-side policy enforcement.
const ARAB_NATIONALITIES = [
  'egypt', 'saudi', 'uae', 'emirat', 'kuwait', 'qatar', 'bahrain', 'oman',
  'jordan', 'lebanon', 'syria', 'iraq', 'palestin', 'yemen', 'libya',
  'tunisia', 'algeria', 'morocc', 'sudan',
]
function isArabNationality(n: string): boolean {
  const v = n.toLowerCase()
  return ARAB_NATIONALITIES.some((a) => v.includes(a))
}
