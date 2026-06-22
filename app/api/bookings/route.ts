import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { generateBookingRef, calculateNights } from '@/lib/formatters'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sendBookingConfirmation, sendBookingNotificationToAdmin } from '@/lib/email'

const bookingSchema = z.object({
  listingId: z.string().min(1),
  guestName: z.string().min(2).max(200),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(8).max(30),
  nationality: z.string().min(2).max(100).default(''),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1).max(20),
  totalPrice: z.number().int().positive(),
  eligibilityType: z.string().min(1),
  specialRequests: z.string().max(1000).optional(),
  paymobOrderId: z.string().optional(),
})

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!rateLimit(`booking:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await request.json()
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking data', details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const checkInDate = new Date(data.checkIn)
  const checkOutDate = new Date(data.checkOut)

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return NextResponse.json({ error: 'Invalid dates' }, { status: 400 })
  }

  if (checkInDate >= checkOutDate) {
    return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 })
  }

  if (checkInDate < new Date()) {
    return NextResponse.json({ error: 'Check-in cannot be in the past' }, { status: 400 })
  }

  const listing = await prisma.listing.findUnique({
    where: { id: data.listingId, isActive: true },
    select: { id: true, title: true, maxGuests: true, cleaningFee: true, pricePerNight: true },
  })

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found or unavailable' }, { status: 404 })
  }

  if (data.guests > listing.maxGuests) {
    return NextResponse.json({ error: `Maximum ${listing.maxGuests} guests allowed` }, { status: 400 })
  }

  // Check availability
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

  const reference = generateBookingRef()
  const nights = calculateNights(checkInDate, checkOutDate)

  const booking = await prisma.booking.create({
    data: {
      reference,
      listingId: listing.id,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      nationality: data.nationality,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: data.guests,
      totalPrice: data.totalPrice,
      eligibilityType: data.eligibilityType,
      specialRequests: data.specialRequests,
      paymobOrderId: data.paymobOrderId,
      status: data.paymobOrderId ? 'pending' : 'confirmed',
    },
  })

  await prisma.listing.update({
    where: { id: listing.id },
    data: { lastBooked: new Date() },
  })

  // Send emails in background (don't block response)
  const emailPayload = {
    reference,
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    listingTitle: listing.title,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests: data.guests,
    totalPrice: data.totalPrice,
    cleaningFee: listing.cleaningFee,
    nights,
    pricePerNight: listing.pricePerNight,
  }

  sendBookingConfirmation(emailPayload).catch(console.error)
  sendBookingNotificationToAdmin({
    ...emailPayload,
    guestPhone: data.guestPhone,
    nationality: data.nationality,
  }).catch(console.error)

  return NextResponse.json({ success: true, reference, bookingId: booking.id }, { status: 201 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const reference = searchParams.get('reference')

  if (!email && !reference) {
    return NextResponse.json({ error: 'email or reference required' }, { status: 400 })
  }

  const where = reference
    ? { reference }
    : { guestEmail: email! }

  const bookings = await prisma.booking.findMany({
    where,
    include: { listing: { select: { title: true, slug: true, images: true, area: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ bookings })
}
