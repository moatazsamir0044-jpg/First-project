import Stripe from 'stripe'
import { isStripeConfigured } from './env'

// Only instantiate when a real secret key is present, so the app builds and
// runs in demo mode without Stripe credentials. Call sites must null-check.
export const stripe = isStripeConfigured()
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })
  : null
