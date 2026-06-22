import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createPaymobOrder, createPaymentKey, getPaymobIframeUrl } from '@/lib/paymob'
import { prisma } from '@/lib/prisma'
import { calculateNights, generateBookingRef } from '@/lib/formatters'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const schema = z.object({
  listingId: z.string().min(1),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1),
  guestName: z.string().min(2).max(200),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(8).max(30),
  nationality: z.string().min(2).max(100),
  eligibilityType: z.string().min(1),
  specialRequests: z.string().max(1000).optional(),
})

export async function POST(request: Request) {
  if (!process.env.PAYMOB_API_KEY || !process.env.PAYMOB_INTEGRATION_ID || !process.env.PAYMOB_IFRAME_ID) {
    return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
  }

  const ip = getClientIp(request)
  if (!rateLimit(`payment:${ip}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const { listingId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, nationality, eligibilityType, specialRequests } = parsed.data
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return NextResponse.json({ error: 'Invalid dates' }, { status: 400 })
  }
  if (checkInDate >= checkOutDate) {
    return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 })
  }

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

  const conflict = await prisma.booking.count({
    where: {
      listingId: listing.id,
      status: { in: ['pending', 'confirmed'] },
      AND: [{ checkIn: { lt: checkOutDate } }, { checkOut: { gt: checkInDate } }],
    },
  })
  if (conflict > 0) {
    return NextResponse.json({ error: 'Listing is not available for selected dates' }, { status: 409 })
  }

  const subtotal = listing.pricePerNight * nights
  const utilitiesTotal = listing.utilitiesEst * nights
  const total = subtotal + utilitiesTotal + listing.cleaningFee
  const amountCents = total * 100
  const reference = generateBookingRef()

  const nameParts = guestName.trim().split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ') || firstName

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const { authToken, orderId } = await createPaymobOrder({
    amountCents,
    currency: 'EGP',
    merchantOrderId: reference,
    items: [{ name: listing.title, amount_cents: subtotal * 100, description: `${nights} nights`, quantity: 1 }],
  })

  const paymentToken = await createPaymentKey({
    authToken,
    orderId,
    amountCents,
    currency: 'EGP',
    firstName,
    lastName,
    email: guestEmail,
    phone: guestPhone,
    integrationId: Number(process.env.PAYMOB_INTEGRATION_ID),
    redirectUrl: `${siteUrl}/booking/confirmed?reference=${reference}`,
  })

  await prisma.booking.create({
    data: {
      reference,
      listingId: listing.id,
      guestName,
      guestEmail,
      guestPhone,
      nationality,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice: total,
      eligibilityType,
      specialRequests,
      paymobOrderId: String(orderId),
      status: 'pending',
    },
  })

  await prisma.listing.update({
    where: { id: listing.id },
    data: { lastBooked: new Date() },
  })

  return NextResponse.json({
    iframeUrl: getPaymobIframeUrl(paymentToken),
    reference,
    breakdown: { nights, pricePerNight: listing.pricePerNight, subtotal, cleaningFee: listing.cleaningFee, utilitiesEst: listing.utilitiesEst, total },
  })
}
