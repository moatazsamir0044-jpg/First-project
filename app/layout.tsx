import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'BirdNest – Serviced Apartments & Holiday Homes in Cairo, Sahel & El Gouna',
  description: 'Book fully-furnished, verified apartments across Egypt. New Cairo, Sheikh Zayed, North Coast & El Gouna. Transparent pricing, no surprise fees.',
  keywords: 'Egypt apartments, Cairo holiday homes, El Gouna rental, North Coast apartments, Sahel vacation rental',
  openGraph: {
    title: 'BirdNest – Serviced Apartments & Holiday Homes in Egypt',
    description: 'Book fully-furnished, verified apartments across Egypt.',
    url: 'https://birdnestlife.com',
    siteName: 'BirdNest',
    images: [{ url: 'https://birdnestlife.com/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'BirdNest', description: 'Serviced Apartments & Holiday Homes in Egypt' },
  alternates: { canonical: 'https://birdnestlife.com' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Recoleta-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Gilroy-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Gilroy-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
