import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { sendBookingConfirmation } from '@/lib/email'
import { isDbConfigured, isStripeWebhookConfigured } from '@/lib/env'

// Stripe needs the raw body to verify the signature — do not parse it first.
export async function POST(request: Request) {
  if (!stripe || !isStripeWebhookConfigured()) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const body = await request.text()
  const signature = headers().get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  // 1) Verify the event is genuinely from Stripe (rejects forged events)
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[stripe] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent
        await confirmBooking(intent)
        break
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent
        await markBookingFailed(intent)
        break
      }
      default:
        // Unhandled events are acknowledged so Stripe stops retrying.
        break
    }
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[stripe] handler error', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function confirmBooking(intent: Stripe.PaymentIntent) {
  if (!isDbConfigured()) return
  const { prisma } = await import('@/lib/prisma')

  const reference = intent.metadata?.reference
  const booking = reference
    ? await prisma.booking.findUnique({ where: { reference } })
    : await prisma.booking.findFirst({ where: { stripePaymentId: intent.id } })
  if (!booking) return

  // Idempotent: only act on the first transition to confirmed.
  if (booking.status === 'confirmed') return

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'confirmed', stripePaymentId: intent.id },
  })

  const listing = await prisma.listing.findUnique({ where: { id: booking.listingId } })
  await sendBookingConfirmation({
    reference: booking.reference,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    listingTitle: listing?.title ?? 'Your stay',
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    guests: booking.guests,
    totalPrice: booking.totalPrice,
  })
}

async function markBookingFailed(intent: Stripe.PaymentIntent) {
  if (!isDbConfigured()) return
  const { prisma } = await import('@/lib/prisma')
  const reference = intent.metadata?.reference
  const booking = reference
    ? await prisma.booking.findUnique({ where: { reference } })
    : await prisma.booking.findFirst({ where: { stripePaymentId: intent.id } })
  if (!booking || booking.status === 'confirmed') return
  await prisma.booking.update({ where: { id: booking.id }, data: { status: 'failed' } })
}
