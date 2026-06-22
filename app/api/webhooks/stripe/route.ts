import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendBookingConfirmation, sendBookingCancellation } from '@/lib/email'
import { calculateNights } from '@/lib/formatters'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook configuration missing' }, { status: 400 })
  }

  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Stripe webhook signature verification failed:', msg)
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as { id: string; metadata: Record<string, string> }
        const meta = pi.metadata

        const booking = await prisma.booking.findFirst({
          where: { stripePaymentId: pi.id },
          include: { listing: { select: { title: true, pricePerNight: true, cleaningFee: true } } },
        })

        if (booking) {
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
        } else if (meta.listingId && meta.guestEmail) {
          console.log('Payment succeeded for unregistered booking, metadata:', meta)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as { id: string }
        await prisma.booking.updateMany({
          where: { stripePaymentId: pi.id },
          data: { status: 'cancelled' },
        })
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as { payment_intent: string; amount_refunded: number }
        const booking = await prisma.booking.findFirst({
          where: { stripePaymentId: charge.payment_intent },
          include: { listing: { select: { title: true } } },
        })
        if (booking) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'cancelled' },
          })
          sendBookingCancellation({
            reference: booking.reference,
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            listingTitle: booking.listing.title ?? booking.reference,
            refundAmount: Math.round(charge.amount_refunded / 100),
          }).catch(console.error)
        }
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
