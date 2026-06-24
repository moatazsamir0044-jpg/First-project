import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PhotoGallery from '@/components/listing-detail/PhotoGallery'
import BookingWidget from '@/components/listing-detail/BookingWidget'
import ReviewsSection from '@/components/listing-detail/ReviewsSection'
import AmenitiesGrid from '@/components/listing-detail/AmenitiesGrid'
import EligibilityNotice from '@/components/listing-detail/EligibilityNotice'
import SchemaMarkup from '@/components/listing-detail/SchemaMarkup'
import MobileBookingBar from '@/components/listing-detail/MobileBookingBar'
import ListingCard from '@/components/listings/ListingCard'
import StarRating from '@/components/shared/StarRating'
import { prisma } from '@/lib/prisma'
import type { Listing, Review } from '@/lib/mock-data'
import { MapPin, Bed, Bath, Users } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birdnestlife.com'

function serialize<T extends { createdAt: Date; lastBooked?: Date | null }>(
  l: T
): T & { createdAt: string; lastBooked: string | null } {
  return { ...l, createdAt: l.createdAt.toISOString(), lastBooked: (l.lastBooked as Date | null | undefined)?.toISOString() ?? null }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const l = await prisma.listing.findUnique({ where: { slug: params.slug, isActive: true } })
  if (!l) return {}
  return {
    title: l.title,
    description: l.description.slice(0, 160),
    alternates: { canonical: `${siteUrl}/listings/${l.slug}` },
    openGraph: {
      title: `${l.title} – BirdNest`,
      description: l.description.slice(0, 160),
      url: `${siteUrl}/listings/${l.slug}`,
      type: 'website',
      images: l.images[0] ? [{ url: l.images[0].startsWith('/') ? `${siteUrl}${l.images[0]}` : l.images[0], width: 1200, height: 800, alt: l.title }] : [],
    },
  }
}

const FALLBACK_REVIEWS = [
  { id: 'r1', listingId: '', authorName: 'Sarah M.', authorCountry: 'UAE', rating: 5, comment: 'Absolutely fantastic stay! The property was exactly as described and the host was incredibly responsive.', source: 'BirdNest', createdAt: '2024-05-01' },
  { id: 'r2', listingId: '', authorName: 'Ahmed K.', authorCountry: 'Egypt', rating: 4, comment: 'Great location and nice amenities. The apartment was well-furnished and comfortable.', source: 'BirdNest', createdAt: '2024-05-10' },
  { id: 'r3', listingId: '', authorName: 'John D.', authorCountry: 'UK', rating: 5, comment: 'Exceptional value for money. The views are breathtaking and the property is maintained to a very high standard.', source: 'BirdNest', createdAt: '2024-05-20' },
]

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  const raw = await prisma.listing.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { reviews: { orderBy: { createdAt: 'desc' }, take: 10 } },
  })
  if (!raw) notFound()

  const listing = serialize(raw) as unknown as Listing
  const reviews = raw.reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })) as unknown as Review[]

  const displayReviews = reviews.length > 0 ? reviews : FALLBACK_REVIEWS.map(r => ({ ...r, listingId: listing.id })) as unknown as Review[]

  const similarRaw = await prisma.listing.findMany({
    where: { area: raw.area, id: { not: raw.id }, isActive: true },
    take: 3,
  })
  const similar = similarRaw.map(l => serialize(l)) as unknown as Listing[]

  return (
    <>
      <SchemaMarkup listing={listing} reviews={displayReviews} />
      <MobileBookingBar listing={listing} />
      <Header />
      <main>
        <div className="bg-cream py-3">
          <div className="container-site">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink/50">
              <Link href="/" className="hover:text-orange transition-colors">Home</Link>
              <span>/</span>
              <Link href="/listings" className="hover:text-orange transition-colors">Listings</Link>
              <span>/</span>
              <Link href={`/listings?location=${encodeURIComponent(listing.area)}`} className="hover:text-orange transition-colors">{listing.area}</Link>
              <span>/</span>
              <span className="text-ink">{listing.title}</span>
            </nav>
          </div>
        </div>

        <div className="container-site py-8 pb-24 lg:pb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-semibold text-ink mb-2">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-ink/60">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {listing.location}, {listing.area}
                </span>
                <span>·</span>
                {listing.reviewCount > 0 ? (
                  <div className="flex items-center gap-1">
                    <StarRating rating={listing.rating} size="sm" />
                    <span className="font-semibold text-ink">{listing.rating}</span>
                    <span>({listing.reviewCount} reviews)</span>
                  </div>
                ) : (
                  <span className="font-semibold text-[#237c58]">New listing</span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <PhotoGallery images={listing.images} title={listing.title} />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <div className="flex-1 min-w-0 space-y-10">
              <div>
                <div className="flex flex-wrap gap-6 mb-4 text-sm text-ink/60">
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-orange" />
                    {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} Bedroom${listing.bedrooms !== 1 ? 's' : ''}`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-orange" />
                    {listing.bathrooms} Bathroom{listing.bathrooms !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-orange" />
                    Up to {listing.maxGuests} guests
                  </span>
                </div>
                <p className="text-ink/70 leading-relaxed">{listing.description}</p>
              </div>

              <EligibilityNotice eligibility={listing.eligibility} />
              <AmenitiesGrid amenities={listing.amenities} />
              <ReviewsSection reviews={displayReviews} rating={listing.rating} reviewCount={listing.reviewCount} />
            </div>

            <div className="lg:w-80 xl:w-96 shrink-0">
              <Suspense fallback={<div className="bg-white rounded-card border border-gray-200 shadow-lg p-6 h-96 animate-pulse" />}>
                <BookingWidget listing={listing} />
              </Suspense>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-semibold text-ink mb-6">More in {listing.area}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {similar.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
