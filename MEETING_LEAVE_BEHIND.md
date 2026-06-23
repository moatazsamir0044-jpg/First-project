# Verdnest Website Enhancement — Proposed Collaboration Plan

**Prepared for:** Commercial Director, Tech Director, Ecommerce Manager
**Date:** June 2026
**Author:** Moataz Samir

---

## The Situation in One Sentence

A fully functional prototype of a modernised Verdnest website has been built and is ready for review — and the goal of this meeting is to agree on a safe, controlled way to bring these improvements into the live site, on a timeline the tech team owns entirely.

---

## What This Is NOT Asking For

Before anything else, it is worth being direct about three things this proposal does **not** require:

| Concern | Reality |
|---|---|
| "Move the live database to a new system" | **No migration needed.** All features are additive — new columns at most, never replacing existing data. |
| "Switch the payment gateway" | **No change to the gateway.** Stripe (or the existing provider) stays exactly as-is. No client payment ever touches the prototype until tech signs off. |
| "Give full codebase access" | **Not required.** Two paths work: (A) features delivered as pull requests the tech team reviews line-by-line, or (B) full code + spec handed over for the tech team to implement themselves. |

---

## Proposed Phased Plan

### Phase 1 — Review (Week 1–2)
**Owner: Tech Director**

- Spin up a private staging environment using the prototype code
- Stripe runs in **test mode** — zero real money, zero client data
- Tech director reviews all code before anything proceeds
- No connection to the live database; uses a separate test database

**What the tech director controls:** Everything. He can reject, modify, or pause at any step.

### Phase 2 — Select & Approve Features (Week 2–3)
**Owner: Tech Director + Ecommerce Manager**

- Walk through the feature list together (see attached)
- Choose which features to adopt first (suggested: checkout flow + search filters + security headers)
- Tech director decides: implement himself from the spec, or review PRs submitted by Moataz

### Phase 3 — Staged Rollout (Week 3–6)
**Owner: Tech Director**

- Features merged one at a time, each fully tested before the next
- Staging environment verified by ecommerce manager for business outcomes
- No feature goes live without tech director approval

### Phase 4 — Live (When tech director confirms ready)
- Real Stripe keys enabled only after independent security confirmation
- DNS, domain, and hosting remain under tech team control throughout

---

## What the Tech Director Gets

- **Full control over every merge.** Nothing reaches production without his review.
- **No big-bang risk.** One feature at a time. Roll back any single feature without affecting others.
- **A security-hardened codebase** as a starting point (CSP headers, HSTS, RLS on all DB tables, scrypt password hashing — all built in and documented).
- **Time saved.** The features are already built and tested. He reviews and integrates rather than building from scratch.

---

## The Minimum We Are Asking For Today

> **Agree on which 2–3 features to adopt first, name who owns the staging setup, and set a date for the Phase 1 review.**

That is the only deliverable needed from this meeting. Everything else follows from that.

---

## Appendix: Security Architecture Summary

The prototype was built with security as a first priority:

- **Content Security Policy** — nonce-based, explicitly allowlists only Stripe, Google, Mapbox, and Vercel. Blocks all other third-party script injection.
- **HSTS with preload** — forces HTTPS on all connections for 2 years.
- **Clickjacking protection** — `X-Frame-Options: DENY` on every response.
- **Row-Level Security** — enabled on all 8 database tables.
- **Password hashing** — industry-standard scrypt with constant-time comparison (no timing attacks).
- **Rate limiting** on all authentication routes.
- **Enumeration-safe errors** — registration never reveals whether an email exists.
- **No card data stored** — Stripe handles all card tokenisation; our server never sees raw card numbers.

A full independent security review is recommended before enabling real payments — and is built into Phase 4.
