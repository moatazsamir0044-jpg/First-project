import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Payment processor migrated to Paymob/Accept.
// Webhook is now handled at /api/webhooks/paymob
export async function POST() {
  return NextResponse.json({ error: 'Stripe webhooks are no longer in use' }, { status: 410 })
}
