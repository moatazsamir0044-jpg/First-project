import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ListingsClient from './ListingsClient'
import { prisma } from '@/lib/prisma'
import type { Listing } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birdnestlife.com'

export const metadata: Metadata = {
  title: 'Apartments & Holiday Homes in Egypt',
  description: 'Browse verified serviced apartments and holiday homes across New Cairo, North Coast, El Gouna, and Sheikh Zayed. Filter by location, guests, and amenities.',
  alternates: { canonical: `${siteUrl}/listings` },
  openGraph: {
    title: 'Apartments & Holiday Homes in Egypt – BirdNest',
    description: 'Browse verified serviced apartments and holiday homes across New Cairo, North Coast, El Gouna, and Sheikh Zayed.',
    url: `${siteUrl}/listings`,
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'BirdNest Listings – Holiday Homes in Egypt' }],
    type: 'website',
  },
}

interface PageProps {
  searchParams: { location?: string; checkIn?: string; checkOut?: string; guests?: string }
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const dbListings = await prisma.listing.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  const listings = dbListings.map(l => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    lastBooked: l.lastBooked?.toISOString() ?? null,
  })) as unknown as Listing[]

  return (
    <>
      <Header />
      <ListingsClient
        listings={listings}
        defaultLocation={searchParams.location || ''}
        defaultCheckIn={searchParams.checkIn || ''}
        defaultCheckOut={searchParams.checkOut || ''}
        defaultGuests={Number(searchParams.guests || '1')}
      />
      <Footer />
    </>
  )
}
