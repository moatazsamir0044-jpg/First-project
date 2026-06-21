// Lightweight in-memory rate limiter for public API routes.
// Protects /api/bookings, /api/contact and chat routes from spam/abuse.
//
// NOTE: in-memory state is per-instance. For multi-region/serverless scale,
// swap the Map for Upstash Redis (@upstash/ratelimit) — the call sites stay
// identical. This default is safe and effective for a single-region launch.

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  bucket.count += 1
  const allowed = bucket.count <= limit
  return { allowed, remaining: Math.max(0, limit - bucket.count), resetAt: bucket.resetAt }
}

// Best-effort client identifier from request headers.
export function clientKey(request: Request, scope: string): string {
  const fwd = request.headers.get('x-forwarded-for')
  const ip = (fwd ? fwd.split(',')[0] : '') || request.headers.get('x-real-ip') || 'unknown'
  return `${scope}:${ip.trim()}`
}

// Periodically drop expired buckets so the Map can't grow unbounded.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [k, b] of buckets) if (now > b.resetAt) buckets.delete(k)
  }, 5 * 60_000).unref?.()
}
