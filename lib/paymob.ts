import crypto from 'crypto'

const PAYMOB_BASE = 'https://accept.paymob.com/api'

async function getAuthToken(): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE}/auth/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
  })
  if (!res.ok) throw new Error(`Paymob auth failed: ${res.status}`)
  const data = await res.json() as { token: string }
  return data.token
}

export async function createPaymobOrder(params: {
  amountCents: number
  currency: string
  merchantOrderId: string
  items: Array<{ name: string; amount_cents: number; description: string; quantity: number }>
}): Promise<{ authToken: string; orderId: number }> {
  const token = await getAuthToken()

  const res = await fetch(`${PAYMOB_BASE}/ecommerce/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: token,
      delivery_needed: false,
      amount_cents: params.amountCents,
      currency: params.currency,
      merchant_order_id: params.merchantOrderId,
      items: params.items,
    }),
  })
  if (!res.ok) throw new Error(`Paymob order creation failed: ${res.status}`)
  const order = await res.json() as { id: number }
  return { authToken: token, orderId: order.id }
}

export async function createPaymentKey(params: {
  authToken: string
  orderId: number
  amountCents: number
  currency: string
  firstName: string
  lastName: string
  email: string
  phone: string
  integrationId: number
  redirectUrl: string
}): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE}/acceptance/payment_keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: params.authToken,
      amount_cents: params.amountCents,
      expiration: 3600,
      order_id: params.orderId,
      billing_data: {
        apartment: 'N/A',
        floor: 'N/A',
        building: 'N/A',
        street: 'N/A',
        shipping_method: 'N/A',
        postal_code: 'N/A',
        city: 'N/A',
        country: 'EG',
        state: 'N/A',
        email: params.email,
        phone_number: params.phone,
        first_name: params.firstName,
        last_name: params.lastName,
      },
      currency: params.currency,
      integration_id: params.integrationId,
      redirect_url: params.redirectUrl,
    }),
  })
  if (!res.ok) throw new Error(`Paymob payment key creation failed: ${res.status}`)
  const data = await res.json() as { token: string }
  return data.token
}

export function getPaymobIframeUrl(paymentToken: string): string {
  const iframeId = process.env.PAYMOB_IFRAME_ID
  if (!iframeId) throw new Error('PAYMOB_IFRAME_ID is not configured')
  return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`
}

// Verify the HMAC-SHA512 signature Paymob sends in webhook callbacks.
// Paymob concatenates specific transaction fields in a fixed order before hashing.
export function verifyPaymobHmac(
  transactionData: Record<string, unknown>,
  receivedHmac: string
): boolean {
  const secret = process.env.PAYMOB_HMAC_SECRET
  if (!secret) return false

  const fields = [
    'amount_cents', 'created_at', 'currency', 'error_occured',
    'has_parent_transaction', 'id', 'integration_id', 'is_3d_secure',
    'is_auth', 'is_capture', 'is_refunded', 'is_standalone_payment',
    'is_voided', 'order', 'owner', 'pending',
    'source_data.pan', 'source_data.sub_type', 'source_data.type', 'success',
  ]

  const obj = transactionData as Record<string, unknown> & {
    order?: { id?: unknown }
    source_data?: { pan?: unknown; sub_type?: unknown; type?: unknown }
  }

  const concatenated = fields.map(field => {
    if (field === 'order') return String(obj.order?.id ?? '')
    if (field === 'source_data.pan') return String(obj.source_data?.pan ?? '')
    if (field === 'source_data.sub_type') return String(obj.source_data?.sub_type ?? '')
    if (field === 'source_data.type') return String(obj.source_data?.type ?? '')
    return String(obj[field] ?? '')
  }).join('')

  const computed = crypto.createHmac('sha512', secret).update(concatenated).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(receivedHmac))
}
