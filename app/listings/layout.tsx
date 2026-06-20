import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birdnestlife.com'

export const metadata: Metadata = {
  title: 'Apartments & Holiday Homes in Egypt',
  description: 'Browse 500+ verified serviced apartments and holiday homes across New Cairo, North Coast, El Gouna, and Sheikh Zayed. Filter by location, guests, and amenities.',
  alternates: { canonical: `${siteUrl}/listings` },
  openGraph: {
    title: 'Apartments & Holiday Homes in Egypt – BirdNest',
    description: 'Browse 500+ verified serviced apartments and holiday homes across New Cairo, North Coast, El Gouna, and Sheikh Zayed.',
    url: `${siteUrl}/listings`,
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'BirdNest Listings – Holiday Homes in Egypt' }],
    type: 'website',
  },
}

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
