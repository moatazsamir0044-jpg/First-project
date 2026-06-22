# BirdNest — Session Handoff

**Date:** 2026-06-22
**Repo:** `moatazsamir0044-jpg/first-project` (default branch `main`)
**Purpose:** Continue building the BirdNest holiday-rental website toward a live, secure, payment-enabled production site. This document is the single source of truth for what was done, the current state, key identifiers, and exactly what remains.

> How to use in a new session: open this file first. It captures everything from the previous session.

---

## 1. Project at a glance

- **Stack:** Next.js 14.2 (App Router) · TypeScript (strict) · Tailwind · Prisma 5 + PostgreSQL · NextAuth v5 (beta) · Stripe · Resend (email) · Anthropic (chatbot) · next-intl (EN/AR).
- **Hosting:** Vercel. **Database:** Supabase (PostgreSQL).
- **Tooling rule (CLAUDE.md):** `gstack` must be installed before AI work — verify with `test -d ~/.claude/skills/gstack/bin`. Use `/browse` for web browsing, `/qa`, `/ship`, etc.
- **Build/verify:** `npm install` then `npm run build` (runs `prisma generate` + `next build`). Type/lint errors now FAIL the build by design (see §3). `npx tsc --noEmit` and `npx next lint` should both be clean.

### Brand (already implemented — match exactly)
- Colors: orange `#f4603d` (dark `#dd4f2e`), green `#237c58` (dark `#1b6044`), cream `#efe8e1`, ink `#292a2b`, sky `#c9e1ea`.
- Fonts: **Recoleta** (headings), **Gilroy** (body). Logos in `public/images/logos/` (`logo-dark.png`, `logo-cream.png`, `logo-icon.png`, `logo-stacked-dark.png`).
- Motion utilities in `app/globals.css`: `animate-fade-up`, `animate-fade-in`, `animate-float`, `animate-pop`, `delay-100/200/300/500` (all respect `prefers-reduced-motion`).

---

## 2. Key identifiers (need these to continue)

| Thing | Value |
|---|---|
| GitHub repo | `moatazsamir0044-jpg/first-project` |
| Merged PRs this session | **#8** (registration portal + security + build fixes), **#9** (3-click checkout) |
| Vercel project (THIS repo) | **`first-project`** (there is a separate `birdnest-tracker` project — not this app) |
| Supabase org | `ikkzsqhxlolaagpbgmyf` ("moatazsamir0044-jpg's Org") |
| **Supabase project (BirdNest)** | **`birdnest-production`**, ref/id **`ngeqlmbqgauhhhmouqiq`**, region `eu-central-1`, Postgres 17 |
| Supabase API URL | `https://ngeqlmbqgauhhhmouqiq.supabase.co` |
| ⚠️ Do NOT use | Supabase project `trnvibgjjcahegjjxoaz` — that's a different app (task tracker) |

---

## 3. What was done this session

### A. Build is now genuinely error-free (PR #8)
- Removed `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` from `next.config.mjs` (they were hiding errors). Build now enforces both. Added `poweredByHeader: false`.
- Fixed: Stripe `apiVersion` (`2026-05-27.dahlia`), missing `listing` include in the Stripe refund webhook, missing React `key`s in `app/compare/page.tsx`, unused vars/imports, `explicit-any` usages. Added `globals.d.ts` (CSS module ambient types). Disabled the noisy `react/no-unescaped-entities` lint rule.
- **Verified:** `tsc`, `next lint`, and `next build` all pass.

### B. Registration / auth portal (PR #8) — previously missing entirely
- `lib/password.ts` — password hashing with Node's built-in **scrypt** (no native deps), constant-time verify.
- `lib/auth.ts` — added **Credentials** provider (email/password), kept Google OAuth, added `trustHost: true` and `secret` fallback (`NEXTAUTH_SECRET ?? AUTH_SECRET`). Session strategy = JWT; adds `role` to session.
- `app/api/auth/register/route.ts` — zod validation, rate limiting, enumeration-safe errors, password policy (8+, upper/lower/number).
- Pages: `app/auth/signin/page.tsx`, `app/auth/register/page.tsx` (branded split-panel, motion, bird logo, live password rules), `app/account/page.tsx` (protected dashboard listing the user's bookings).
- `lib/session-provider.tsx` wraps the app in `app/layout.tsx`; `components/layout/Header.tsx` has a session-aware account/sign-in link.
- DB: added `User.passwordHash` (Prisma schema + migration `prisma/migrations/20240103000000_add_user_password`).

### C. Security hardening (PR #8)
- `middleware.ts` — **nonce-based Content-Security-Policy** + `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. CSP allowlists Stripe, Mapbox, Google, Unsplash, Vercel.

### D. 3-click checkout (PR #9)
- `components/booking/QuickCheckout.tsx` — collapses the old 4-screen wizard (Review→Details→Eligibility→Payment) into ONE page with a sticky summary and a single **Confirm & pay** button. The 3 clicks: (1) choose who's staying, (2) tick eligibility, (3) Confirm & pay.
- Rewrote `app/book/[slug]/page.tsx` to use it. **Deleted** the now-unused `StepReview`, `StepDetails`, `StepEligibility`, `StepPayment`, `BookingSteps` components.

### E. Database provisioning (Supabase MCP — done directly on `birdnest-production`)
- Applied full schema matching `prisma/schema.prisma` (migration name `birdnest_initial_schema`). All 8 tables exist: `User`, `Account`, `Session`, `VerificationToken`, `Listing`, `Booking`, `Review`, `ContactSubmission`.
- **Enabled RLS** on all 8 tables (migration `enable_row_level_security`). Critical "anon-exposed" advisory is resolved; remaining notices are INFO-level "RLS enabled, no policy" — this is the intended locked-down state because the app uses Prisma over the direct Postgres connection (owner role bypasses RLS), not the Supabase anon API.
- **Seeded** 12 listings + 36 reviews (3 per listing) via SQL, matching `prisma/seed.ts`.

---

## 4. ⚠️ Outstanding work (what's NOT done) — prioritized

### P0 — Front-end is NOT wired to the database (biggest gap)
The public pages render from **mock data**, not the DB. The seeded listings will **not** appear on the live site until these are refactored to fetch from the API/DB:
- `app/listings/page.tsx` → uses `mockListings`
- `app/listings/[slug]/page.tsx` → uses `mockListings` / `mockReviews` (also `generateStaticParams` from mock)
- `app/book/[slug]/page.tsx` → uses `mockListings`
- `app/compare/page.tsx`, `app/wishlist/page.tsx` → mock
The backend already exists and reads the DB: `GET /api/listings`, `/api/listings/[slug]`, `/api/listings/[slug]/reviews`, `/api/listings/[slug]/availability`, `/api/search`, `/api/amenities`. **Task:** make pages consume these (or convert listing pages to server components querying Prisma). Decide on static vs dynamic rendering.

### P0 — Payment + booking creation are simulated
`QuickCheckout.tsx` simulates payment (`setTimeout`) and does **not** POST to `/api/bookings`, nor use `/api/payments/create-intent` or Stripe Elements. **Task:** wire the checkout to create a Stripe PaymentIntent, mount Stripe Elements, and create the booking via `POST /api/bookings` on success. The backend routes and Stripe webhook already exist.

### P0 — Set environment variables in Vercel (project `first-project`, Production)
Required to function:
- `DATABASE_URL` — Supabase → birdnest-production → **Connect → Transaction pooler** URI (port 6543), replace `[YOUR-PASSWORD]`. (Reset password under Settings → Database if unknown.) Use the **pooler** URL for runtime; the direct URL (5432) only for migrations.
- `NEXTAUTH_SECRET` — generate `openssl rand -base64 32` (one was generated last session but **generate a fresh one** and do not commit it).
- `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` — the production domain.
For payments: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` (add the webhook endpoint `…/api/webhooks/stripe` in Stripe first).
Optional: `GOOGLE_CLIENT_ID/SECRET`, `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `ADMIN_SECRET_KEY`, `ADMIN_EMAIL`.
> Note: the Vercel MCP integration in this workspace is **read-only for config** — it cannot write env vars. They must be set in the Vercel dashboard (or via `vercel env` CLI). After setting, **Redeploy**.

### P1 — Prisma migration drift (repo vs live DB)
- The repo's migration files do **not** create `Booking.nationality` (it exists in `schema.prisma` and in the live DB, but no migration adds it). If anyone runs `prisma migrate deploy` against a fresh DB, the column will be missing. **Task:** add a proper migration for `nationality` (and reconcile so `schema.prisma` ⇄ migrations match).
- The live `birdnest-production` DB was provisioned from `schema.prisma` directly, so its `_prisma_migrations` table does NOT list the repo migrations. Running `prisma migrate deploy` against it would try to re-apply and fail. **Task:** baseline it — `prisma migrate resolve --applied <migration_name>` for each existing migration, or treat the DB as the baseline.

### P1 — Rate limiter is in-memory
`lib/rate-limit.ts` uses an in-process `Map` — does not work across serverless instances. **Task:** move to Redis/Upstash before relying on it in production.

### P2 — Pre-launch
- Independent security review / penetration test before taking real payments.
- Connect the real domain + DNS.
- Consider tightening CSP if any third party is added.

---

## 5. Where we stopped
Last action: explained how to set Vercel env vars (the Vercel MCP can't write them; values like the DB password/Stripe keys live in the user's dashboards). Provided a generated `NEXTAUTH_SECRET` and step-by-step instructions. **Next concrete step:** the user sets the env vars in Vercel and redeploys — but note that even after that, the **front-end still shows mock data** until P0 item #1 (wire pages to the DB) is done.

## 6. Suggested order of work for the next session
1. Wire listing/detail/booking pages to the live DB via the existing API routes (P0 #1).
2. Wire real Stripe payment + `POST /api/bookings` into `QuickCheckout` (P0 #2).
3. Fix Prisma migration drift + baseline the live DB (P1).
4. Set Vercel env vars + redeploy (P0 #3) and verify end-to-end on the production URL.
5. Swap rate limiter to Upstash; schedule security review.

## 7. Useful commands
```bash
npm install && npm run build        # full build (must pass clean)
npx tsc --noEmit                     # typecheck
npx next lint                        # lint
# Branch + PR workflow used this session:
git checkout main && git pull
git checkout -b claude/<feature>
# ...changes...
git push -u origin claude/<feature>  # then open PR to main, squash-merge
```
