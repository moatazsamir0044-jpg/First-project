import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LanguageProvider } from '@/lib/language-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import AuthSessionProvider from '@/lib/session-provider'
import FloatingButtons from '@/components/shared/FloatingButtons'
import CompareBar from '@/components/shared/CompareBar'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birdnestlife.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BirdNest – Serviced Apartments & Holiday Homes in Cairo, Sahel & El Gouna',
    template: '%s – BirdNest',
  },
  description: 'Book fully-furnished, verified apartments across Egypt. New Cairo, Sheikh Zayed, North Coast & El Gouna. Transparent pricing, no surprise fees. 500+ properties, 4.8★ average rating.',
  keywords: 'Egypt apartments, Cairo holiday homes, El Gouna rental, North Coast apartments, Sahel vacation rental, serviced apartments Egypt, holiday homes Egypt',
  openGraph: {
    title: 'BirdNest – Serviced Apartments & Holiday Homes in Egypt',
    description: 'Book fully-furnished, verified apartments across Egypt. New Cairo, Sheikh Zayed, North Coast & El Gouna. Transparent pricing, no surprise fees.',
    url: siteUrl,
    siteName: 'BirdNest',
    type: 'website',
    locale: 'en_EG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BirdNest – Holiday Homes in Egypt',
    description: 'Serviced Apartments & Holiday Homes in Egypt. New Cairo, North Coast, El Gouna & Sheikh Zayed.',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': siteUrl,
      'ar': `${siteUrl}/ar`,
    },
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Recoleta-SemiBold.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Gilroy-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Gilroy-SemiBold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Hreflang: English ↔ Arabic */}
        <link rel="alternate" hrefLang="en" href={siteUrl} />
        <link rel="alternate" hrefLang="ar" href={`${siteUrl}/ar`} />
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />
      </head>
      <body>
        <AuthSessionProvider>
          <LanguageProvider>
            <WishlistProvider>
              {children}
              <FloatingButtons />
              <CompareBar />
            </WishlistProvider>
          </LanguageProvider>
        </AuthSessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
