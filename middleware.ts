import { NextResponse, type NextRequest } from 'next/server'

// Security middleware: injects a per-request nonce-based Content-Security-Policy
// plus standard hardening headers on every HTML response. Next.js automatically
// applies the nonce to its own scripts when it sees the nonce in the CSP header.
//
// Allowed third parties: Stripe (payments), Mapbox (maps), Google (OAuth +
// avatars + fonts), Unsplash (listing imagery), Vercel (analytics/speed-insights).
export function middleware(request: NextRequest) {
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' https://js.stripe.com https://va.vercel-scripts.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://lh3.googleusercontent.com https://*.mapbox.com https://*.tiles.mapbox.com`,
    `connect-src 'self' https://api.stripe.com https://api.mapbox.com https://events.mapbox.com https://*.tiles.mapbox.com https://vitals.vercel-insights.com`,
    `frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://accounts.google.com`,
    `worker-src 'self' blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), browsing-topics=(), interest-cohort=()'
  )

  return response
}

export const config = {
  // Run on everything except static assets, image optimizer output, and metadata files.
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|otf|ttf|woff|woff2)).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
