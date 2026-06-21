// Central place to check which integrations are configured.
// Lets every route degrade gracefully to "demo mode" when keys are absent,
// and switch to full production behaviour the moment env vars are set.

export const isDbConfigured = (): boolean => !!process.env.DATABASE_URL

export const isStripeConfigured = (): boolean =>
  !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')

export const isStripeWebhookConfigured = (): boolean =>
  !!process.env.STRIPE_WEBHOOK_SECRET

export const isEmailConfigured = (): boolean => !!process.env.RESEND_API_KEY

export const siteUrl = (): string =>
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const adminEmail = (): string =>
  process.env.ADMIN_EMAIL || 'bookings@birdnestlife.com'

export const fromEmail = (): string =>
  process.env.FROM_EMAIL || 'BirdNest <bookings@birdnestlife.com>'
