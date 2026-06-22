import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ListingsClient from './ListingsClient'

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

interface PageProps {
  searchParams: { location?: string; checkIn?: string; checkOut?: string; guests?: string }
}

export default function ListingsPage({ searchParams }: PageProps) {
  return (
    <>
      <Header />
      <ListingsClient
        defaultLocation={searchParams.location || ''}
        defaultCheckIn={searchParams.checkIn || ''}
        defaultCheckOut={searchParams.checkOut || ''}
        defaultGuests={Number(searchParams.guests || '1')}
      />
      <Footer />
    </>
  )
}
