import { NextResponse } from 'next/server'
import { verifyPaymobHmac } from '@/lib/paymob'
import { prisma } from '@/lib/prisma'
import { sendBookingConfirmation, sendBookingCancellation } from '@/lib/email'
import { calculateNights } from '@/lib/formatters'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown> & {
    obj?: Record<string, unknown>
    hmac?: string
    type?: string
  }

  const { searchParams } = new URL(request.url)
  const hmac = searchParams.get('hmac') ?? body.hmac

  if (!hmac || !process.env.PAYMOB_HMAC_SECRET) {
    return NextResponse.json({ error: 'HMAC missing or not configured' }, { status: 400 })
  }

  const transaction = body.obj ?? body
  if (!verifyPaymobHmac(transaction as Record<string, unknown>, hmac)) {
    return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 })
  }

  const txn = transaction as {
    success?: boolean
    pending?: boolean
    order?: { merchant_order_id?: string; id?: number }
    id?: number
    is_refunded?: boolean
    amount_cents?: number
  }

  const merchantOrderId = txn.order?.merchant_order_id
  if (!merchantOrderId) {
    return NextResponse.json({ received: true })
  }

  const booking = await prisma.booking.findFirst({
    where: { reference: merchantOrderId },
    include: { listing: { select: { title: true, pricePerNight: true, cleaningFee: true } } },
  })

  if (!booking) {
    return NextResponse.json({ received: true })
  }

  if (txn.success === true && !txn.pending) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'confirmed' },
    })

    const nights = calculateNights(booking.checkIn, booking.checkOut)
    sendBookingConfirmation({
      reference: booking.reference,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      listingTitle: booking.listing.title,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalPrice: booking.totalPrice,
      cleaningFee: booking.listing.cleaningFee,
      nights,
      pricePerNight: booking.listing.pricePerNight,
    }).catch(console.error)
  } else if (txn.success === false && !txn.pending) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'cancelled' },
    })
  } else if (txn.is_refunded) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'cancelled' },
    })
    const refundAmount = Math.round((txn.amount_cents ?? 0) / 100)
    sendBookingCancellation({
      reference: booking.reference,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      listingTitle: booking.listing.title ?? booking.reference,
      refundAmount,
    }).catch(console.error)
  }

  return NextResponse.json({ received: true })
}
