# BirdNest — Deployment & Backend Guide

This document is for the dev department. The website's backend is **fully
implemented** and builds cleanly. It runs today in **demo mode** (no real
charges, no data saved) and switches to **full production mode** automatically
as each integration's environment variables are added. No code changes are
required to go live — only configuration.

---

## How "graceful degradation" works

Every integration is detected at runtime (`lib/env.ts`):

| If this env var is set… | …this becomes live |
|---|---|
| `DATABASE_URL` | Bookings, contact messages, availability checks persist to Postgres |
| `STRIPE_SECRET_KEY` | Real PaymentIntents are created; booking stays `pending` until paid |
| `STRIPE_WEBHOOK_SECRET` | Webhook verifies signatures and confirms paid bookings |
| `RESEND_API_KEY` | Confirmation + admin notification emails are sent |
| `ANTHROPIC_API_KEY` | The Nesty AI chatbot answers |

When a var is absent, that feature no-ops safely (logs instead of acting), so
the site never crashes during a staged rollout.

---

## Go-live checklist

### 1. Database (Supabase / any Postgres)
1. Create a Postgres database (Supabase free tier is fine to start).
2. Set `DATABASE_URL` (use the **pooled** connection string for serverless).
3. Run migrations:  `npm run db:migrate`
4. Seed listings:    `npm run db:seed`  *(edit `prisma/seed.ts` with real data + photos first)*

### 2. Stripe (payments)
1. Create a Stripe account and complete business verification (KYC).
2. Set `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` (use `sk_test_`/`pk_test_` to rehearse first).
3. Add a webhook endpoint in the Stripe dashboard pointing to:
   `https://YOUR_DOMAIN/api/webhooks/stripe`
   Subscribe to: `payment_intent.succeeded`, `payment_intent.payment_failed`.
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
5. **Frontend TODO:** the payment step (`components/booking/StepPayment.tsx`) still
   uses a mock card form. Wire it to Stripe Elements using the `clientSecret`
   now returned by `POST /api/bookings`. (Backend is ready; only the card UI needs connecting.)

### 3. Email (Resend)
1. Create a Resend account, verify your sending domain.
2. Set `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`.

### 4. Hosting (Vercel) + Domain
1. Import the GitHub repo into Vercel.
2. Add all environment variables (see `.env.example`).
3. Set `NEXT_PUBLIC_SITE_URL` to the real domain.
4. Add the custom domain in Vercel and point DNS.
5. Update `next.config.mjs` `serverActions.allowedOrigins` with the real domain.

### 5. Real content
- Replace placeholders before launch:
  - `NEXT_PUBLIC_WHATSAPP_NUMBER` (currently a placeholder).
  - Bank-transfer IBAN in `components/booking/StepPayment.tsx` (currently fake).
  - Listing photos/prices in `prisma/seed.ts`.

---

## Security work already completed in this pass

- ✅ Stripe webhook now **verifies signatures** (`constructEvent`) — forged events rejected.
- ✅ Booking API **validates server-side**: listing exists/active, dates valid & not past, guests ≤ capacity.
- ✅ **Price is recomputed on the server** — the client cannot set its own total.
- ✅ **Eligibility policy enforced on the backend**, not just the UI.
- ✅ **Availability check** prevents double-booking overlapping dates.
- ✅ Booking references now use **crypto-secure** randomness (no enumeration).
- ✅ **Rate limiting** on bookings (5/min), contact (3/min), and AI chat (15/min).
- ✅ AI chat **input length capped** (1000 chars) and history trimmed.
- ✅ Bookings and contact messages now **persist to the database**.
- ✅ Confirmation + admin **emails** sent on successful booking.

## Still recommended before accepting real money

- [ ] Connect the card UI to Stripe Elements (frontend task — see step 2.5).
- [ ] Replace the in-memory rate limiter with Upstash Redis for multi-instance scale (`lib/rate-limit.ts` is drop-in ready).
- [ ] Add authentication (`next-auth` is installed; no login routes yet) if guest accounts are wanted.
- [ ] Independent security review of the payment path before launch.
- [ ] Legal review: terms, refund policy, Egyptian e-commerce/data compliance.
