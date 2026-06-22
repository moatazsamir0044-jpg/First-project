# BirdNest — Technical & Deployment Guide
**For:** Technology / Development Department
**Date:** 22 June 2026
**Repo:** `moatazsamir0044-jpg/first-project` · default branch `main`
**Purpose:** Everything the dev team needs to understand how the codebase is built, what it is built on, and exactly what to do to take the site live for real bookings and payments.

---

## 1. System Overview

BirdNest is a **server-rendered Next.js 14 (App Router) web application** for holiday rentals. It is a single deployable unit: the front-end pages and the backend API both live in the same Next.js project and are deployed together to Vercel. Data is stored in a PostgreSQL database hosted on Supabase, accessed through Prisma ORM. Payments run through Stripe; transactional email through Resend; an optional AI chatbot through Anthropic.

```
        ┌─────────────────────────────────────────────┐
        │                  VERCEL                       │
        │   Next.js 14 App Router (Node 20 runtime)     │
        │                                               │
        │   ┌─────────────┐      ┌──────────────────┐   │
Client ─┼──▶│ React pages │      │ API route handlers│  │
        │   │ (app/*)     │─────▶│ (app/api/*)       │  │
        │   └─────────────┘      └────────┬─────────┘   │
        │         ▲                       │             │
        │         │ middleware.ts (CSP + security hdrs) │
        └─────────┼───────────────────────┼─────────────┘
                  │                        │ Prisma
                  │                        ▼
          ┌───────┴────────┐      ┌─────────────────┐
          │ Stripe (cards) │      │ Supabase Postgres│
          │ Resend (email) │      │ (eu-central-1)   │
          │ Anthropic (AI) │      └─────────────────┘
          └────────────────┘
```

---

## 2. Tech Stack (what it is built on)

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 14.2.35 | Server components + API routes in one project |
| Language | TypeScript | ^6 (strict) | Build fails on type errors (intentional) |
| UI | React | ^18 | |
| Styling | Tailwind CSS | ^3.4 | Brand tokens defined in `tailwind.config.ts` |
| ORM | Prisma | ^5.22 | `@prisma/client`; schema in `prisma/schema.prisma` |
| Database | PostgreSQL (Supabase) | PG 17 | Project `birdnest-production`, ref `ngeqlmbqgauhhhmouqiq` |
| Auth | NextAuth (Auth.js) | 5.0.0-beta.31 | Credentials + Google; JWT sessions |
| Payments | Stripe | server `^22`, JS `^9`, react `^6` | API version pinned `2026-05-27.dahlia` |
| Email | Resend | ^6.12 | `lib/email.ts` |
| i18n | next-intl | ^4.13 | EN / AR; messages in `messages/` |
| AI chatbot | @anthropic-ai/sdk | ^0.104 | `app/api/chat/*` |
| Maps | Mapbox GL + react-map-gl | ^3 / ^8 | Needs public token |
| Validation | Zod | ^4 | All API inputs validated |
| Hosting | Vercel | — | Project `first-project`, region `iad1` |

> ⚠️ **Note:** `vercel.json` declares `pnpm` as the install/build command, but the repo ships both `pnpm-lock.yaml` and `package-lock.json`. Pick one package manager and delete the other lockfile to avoid non-deterministic installs.

---

## 3. Repository Layout

```
app/                    Next.js App Router
├── api/                Backend API route handlers (see §5)
├── (pages)/            listings, book, account, auth, compare, wishlist,
│                       about, blog, contact, how-it-works, terms
├── ar/                 Arabic routes
├── layout.tsx          Root layout (wraps SessionProvider)
├── sitemap.ts robots.ts opengraph-image.tsx
components/             React components grouped by feature
│                       (auth, booking, home, listing-detail, listings,
│                        layout, shared, blog)
lib/                    Server/shared logic
├── auth.ts             NextAuth config (Credentials + Google)
├── prisma.ts           Prisma client singleton
├── stripe.ts           Lazy Stripe client
├── password.ts         scrypt hashing (no native deps)
├── rate-limit.ts       In-memory limiter (see gap in §9)
├── email.ts            Resend transactional email
├── policies.ts         Eligibility rules · formatters.ts · countries.ts
├── mock-data.ts        ⚠️ Demo data the public pages still render from
prisma/
├── schema.prisma       Source of truth for the data model
├── migrations/         3 migrations (drift — see §9)
└── seed.ts             12 listings + reviews
middleware.ts           CSP nonce + security headers
content/  messages/     MDX/blog content · i18n strings
```

---

## 4. Data Model (`prisma/schema.prisma`)

8 models. Postgres in `eu-central-1`, all 8 tables created and RLS-enabled; 12 listings + 36 reviews seeded.

- **User** — `id, name, email, emailVerified, image, passwordHash, role(default "user"), createdAt`. Relations: accounts, sessions, bookings.
- **Account / Session / VerificationToken** — standard NextAuth/Auth.js adapter tables.
- **Listing** — slug, title/titleAr, description(Ar), location/area/city, `pricePerNight`, `utilitiesEst`, `cleaningFee`, bedrooms/bathrooms/maxGuests, `amenities[]`, `images[]`, rating, reviewCount, refundPolicy, eligibility, isActive, lat/lng. Indexed on area, isActive, pricePerNight, rating.
- **Booking** — `reference`(unique), listingId, userId?, guest{Name,Email,Phone}, `nationality`(default ""), checkIn/checkOut, guests, `totalPrice`, `status`(pending/confirmed/cancelled), `stripePaymentId`, eligibilityType, specialRequests. Indexed on listingId, guestEmail, status, (checkIn,checkOut).
- **Review** — listingId, authorName, authorCountry, rating, comment, source.
- **ContactSubmission** — name, email, enquiryType, message.

Prices are stored as **integers (EGP)**; Stripe charges in piastres (`total * 100`), currency `egp`.

---

## 5. API Surface (`app/api/*`)

All handlers validate input with Zod, are rate-limited, and read/write the DB via Prisma. **These already exist and work against the live DB** — the gap is that the front-end pages don't all call them yet (§9).

| Route | Method | Purpose |
|---|---|---|
| `/api/listings` | GET | List/filter active listings |
| `/api/listings/[slug]` | GET | Single listing |
| `/api/listings/[slug]/reviews` | GET | Reviews for a listing |
| `/api/listings/[slug]/availability` | GET | Date availability |
| `/api/listings/[slug]/view` | POST | Increment view count |
| `/api/search` | GET | Search with filters |
| `/api/amenities` | GET | Amenity list |
| `/api/bookings` | POST/GET | Create booking / look up by email or reference |
| `/api/bookings/[reference]` | GET | Single booking |
| `/api/payments/create-intent` | POST | Create Stripe PaymentIntent, returns `clientSecret` + price breakdown |
| `/api/webhooks/stripe` | POST | Handles `payment_intent.succeeded/failed`, `charge.refunded` → updates booking status + emails |
| `/api/auth/register` | POST | Register (zod, rate limit, enumeration-safe, password policy) |
| `/api/auth/[...nextauth]` | * | NextAuth handler |
| `/api/contact` | POST | Contact form |
| `/api/reviews` | POST | Submit review |
| `/api/chat/listings`, `/api/chat/blog` | POST | Anthropic chatbot |
| `/api/admin/*` | * | Dashboard, bookings, listings CRUD (guarded by `ADMIN_SECRET_KEY`) |

---

## 6. Authentication (`lib/auth.ts`)

- NextAuth v5 (beta). **Two providers:** Credentials (email/password) and Google OAuth.
- Session strategy = **JWT**; `role` is added to the token/session.
- `trustHost: true`; secret resolves from `NEXTAUTH_SECRET ?? AUTH_SECRET`.
- Passwords hashed with Node's built-in **scrypt** (`lib/password.ts`) — constant-time verify, no native dependencies (good for serverless).
- Registration (`/api/auth/register`) enforces 8+ chars with upper/lower/number, is rate-limited, and returns enumeration-safe errors.

---

## 7. Payments — Current vs Target State

**The backend payment path is fully built. The front-end checkout is not yet wired to it — it simulates payment.**

Current (`components/booking/QuickCheckout.tsx`):
```ts
// Payment is processed by the backend (Stripe). Simulated here until live keys are wired.
await new Promise(r => setTimeout(r, 1500))   // ← FAKE. No charge, no booking created.
onComplete(form)
```
The card fields are plain `<input>`s — **not** Stripe Elements. No call to `/api/payments/create-intent` or `/api/bookings`.

**Target flow to implement:**
1. On mount / date selection → `POST /api/payments/create-intent` → receive `clientSecret`.
2. Mount **Stripe Elements** (`@stripe/react-stripe-js`) with the `clientSecret`; replace the plain card inputs with `<PaymentElement>`.
3. On submit → `stripe.confirmPayment(...)`.
4. Create the booking: `POST /api/bookings` with `stripePaymentId` set (status starts `pending`).
5. Stripe fires `payment_intent.succeeded` → `/api/webhooks/stripe` flips the booking to `confirmed` and sends the confirmation email.

Everything in steps 1, 4, and 5 already exists server-side. The work is steps 2–3 plus the two fetch calls.

---

## 8. Security (already in place)

- **`middleware.ts`** sets a per-request **nonce-based CSP** plus `Strict-Transport-Security` (2y, preload), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a locked-down `Permissions-Policy`. CSP allowlists Stripe, Mapbox, Google, Unsplash, Vercel.
- `poweredByHeader: false`.
- All API inputs validated with Zod; rate limiting on register/booking/payment endpoints.
- Stripe webhook verifies the signature against `STRIPE_WEBHOOK_SECRET`.
- Supabase RLS enabled on all tables (Prisma connects as owner over the direct connection, which bypasses RLS by design — the anon API is locked).

---

## 9. Gaps Blocking Go-Live (with exact files)

### P0 — Front-end renders mock data, not the DB
These files import the **mock arrays** (`mockListings`/`mockReviews`) instead of calling the API/Prisma:
- `app/listings/page.tsx`
- `app/listings/[slug]/page.tsx` (also `generateStaticParams` is built from mock — switch to DB or make it dynamic)
- `app/book/[slug]/page.tsx`
- `app/booking/page.tsx`
- `app/compare/page.tsx`
- `app/wishlist/page.tsx`
- `app/sitemap.ts`
- `components/home/FeaturedListings.tsx`, `components/shared/CompareBar.tsx`

**Fix:** convert these to server components querying Prisma directly, or fetch the existing API routes. Decide static vs dynamic rendering per page. Keep importing the `Listing` **type** from `lib/mock-data.ts` is fine; stop importing the **data**.

### P0 — Checkout simulates payment
`QuickCheckout.tsx` — implement the §7 target flow (Stripe Elements + the two fetches).

### P0 — Vercel environment variables not set
See §10. Nothing runtime works without these.

### P1 — Prisma migration drift
- `Booking.nationality` exists in `schema.prisma` and in the live DB, but **no migration creates it**. A fresh `prisma migrate deploy` would produce a DB missing that column. **Add a migration for `nationality`.**
- The live DB was provisioned from the schema directly, so its `_prisma_migrations` table doesn't list the repo's 3 migrations (`20240101_init`, `20240102_add_indexes_and_user_booking`, `20240103_add_user_password`). Running `migrate deploy` against it would try to re-apply and fail. **Baseline it:** `prisma migrate resolve --applied <name>` for each existing migration.

### P1 — In-memory rate limiter
`lib/rate-limit.ts` uses a process-local `Map` — ineffective across Vercel's serverless instances. Move to **Upstash/Redis** before relying on it.

### P2 — Pre-launch
Independent security review / pen-test before real payments; connect production domain + DNS; verify Resend deliverability end-to-end; native-speaker review of Arabic strings.

### Housekeeping
- Duplicate lockfiles (`pnpm-lock.yaml` + `package-lock.json`) — keep one.
- `vercel.json` region is `iad1` (US) while the DB is `eu-central-1` (EU). For lowest latency, move the Vercel region to an EU region (e.g. `fra1`).

---

## 10. Environment Variables (set in Vercel → Production, then Redeploy)

> The Vercel MCP integration is read-only for config — set these in the **Vercel dashboard** or via `vercel env`. Never commit them.

**Required for the site to function**

| Var | Where to get it | Notes |
|---|---|---|
| `DATABASE_URL` | Supabase → birdnest-production → Connect → **Transaction pooler** (port 6543) | Use the **pooler** URL for runtime; direct (5432) only for migrations. Replace `[YOUR-PASSWORD]`. |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | Generate fresh; don't commit. |
| `NEXTAUTH_URL` | Production domain | e.g. `https://birdnestlife.com` |
| `NEXT_PUBLIC_SITE_URL` | Production domain | Same as above |

**Required for payments**

| Var | Notes |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe dashboard (live key) |
| `STRIPE_PUBLISHABLE_KEY` | Used client-side by Stripe Elements |
| `STRIPE_WEBHOOK_SECRET` | After adding the endpoint `…/api/webhooks/stripe` in Stripe |

**Optional / feature-dependent**

`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Google login) · `RESEND_API_KEY` (emails) · `ANTHROPIC_API_KEY` (chatbot) · `NEXT_PUBLIC_MAPBOX_TOKEN` (maps) · `NEXT_PUBLIC_WHATSAPP_NUMBER` · `ADMIN_SECRET_KEY`, `ADMIN_EMAIL` (admin routes).

> Note: `next.config.mjs` `serverActions.allowedOrigins` lists `birdnestlife.com` — confirm that is the real production domain and update if not.

---

## 11. Deployment Runbook (to first live booking)

1. **Wire pages to the DB** (P0 #1) — verify seeded listings render on `/listings`.
2. **Wire Stripe into checkout** (P0 #2) — Elements + create-intent + create-booking.
3. **Baseline + fix migrations** (P1) — add `nationality` migration; `migrate resolve --applied` for the 3 existing ones against the live DB.
4. **Set env vars in Vercel** (§10) for Production.
5. **Add the Stripe webhook** endpoint in Stripe → copy `STRIPE_WEBHOOK_SECRET` into Vercel.
6. **Redeploy** on Vercel.
7. **End-to-end test on the production URL:**
   - Browse → seeded listings appear.
   - Make a booking with a Stripe **test** card → PaymentIntent created → booking row written → webhook flips to `confirmed` → confirmation email received → booking shows in `/account`.
8. **Switch Stripe to live keys**, connect the domain + DNS, re-test once.
9. **Schedule the security review** before announcing publicly.

**Build/verify locally:** `npm install && npm run build` (runs `prisma generate` + `next build`; type + lint errors fail the build). `npx tsc --noEmit` and `npx next lint` should both be clean.

---

## 12. What the Dev Team Should Start Doing Now

**This week (unblocks go-live):**
1. Pick one owner for the **DB-wiring** task (P0 #1) and one for the **Stripe checkout** task (P0 #2) — they're independent and can run in parallel.
2. Owner/lead with Vercel access: set the **environment variables** (§10) and add the **Stripe webhook**. This is an hour of work and blocks all runtime testing.
3. Add the **`nationality` migration** and **baseline the live DB** so the schema and migrations agree.

**Immediately, as standing practice:**
4. **Resolve the lockfile/package-manager split** (pick pnpm or npm) before more installs diverge.
5. **Set up a Vercel Preview/staging environment** with its own Supabase project (or branch DB) so testing never touches production data.
6. **Move the rate limiter to Upstash** and add the env vars.
7. **Add basic tests** around the booking + payment path (the money path deserves coverage) and wire them into CI on PRs.
8. **Adopt the branch + PR workflow** already in use: branch from `main`, open a PR, squash-merge.

**Before public launch:**
9. Commission an independent **security review / pen-test**.
10. Verify **Resend** deliverability (SPF/DKIM on the sending domain).
11. Have a native speaker review the **Arabic** content.
12. Consider building a minimal **admin UI** on top of the existing `/api/admin/*` routes so non-developers can manage listings, availability, and bookings.

---

## 13. Key Identifiers

| Thing | Value |
|---|---|
| GitHub repo | `moatazsamir0044-jpg/first-project` (default `main`) |
| Vercel project | `first-project` (NOT `birdnest-tracker`) |
| Supabase org | `ikkzsqhxlolaagpbgmyf` |
| Supabase project | `birdnest-production`, ref `ngeqlmbqgauhhhmouqiq`, `eu-central-1`, PG 17 |
| Supabase API URL | `https://ngeqlmbqgauhhhmouqiq.supabase.co` |
| ⚠️ Do NOT touch | Supabase `trnvibgjjcahegjjxoaz` — different app (task tracker) |
