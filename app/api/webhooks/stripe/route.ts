import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  // In production: verify webhook signature with stripe.webhooks.constructEvent()
  // Then handle events: payment_intent.succeeded, payment_intent.payment_failed etc.
  try {
    const event = JSON.parse(body)
    console.log('Stripe webhook event:', event.type)

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Update booking status to confirmed
        break
      case 'payment_intent.payment_failed':
        // Update booking status to failed, notify guest
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
