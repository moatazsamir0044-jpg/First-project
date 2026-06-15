import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import PhotoGallery from '@/components/listing-detail/PhotoGallery'
import BookingWidget from '@/components/listing-detail/BookingWidget'
import ReviewsSection from '@/components/listing-detail/ReviewsSection'
import AmenitiesGrid from '@/components/listing-detail/AmenitiesGrid'
import EligibilityNotice from '@/components/listing-detail/EligibilityNotice'
import SchemaMarkup from '@/components/listing-detail/SchemaMarkup'
import ListingCard from '@/components/listings/ListingCard'
import StarRating from '@/components/shared/StarRating'
import { mockListings, mockReviews } from '@/lib/mock-data'
import { MapPin, Bed, Bath, Users } from 'lucide-react'
import Link from 'next/link'

export async function generateStaticParams() {
  return mockListings.map(l => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const listing = mockListings.find(l => l.slug === params.slug)
  if (!listing) return {}
  return {
    title: `${listing.title} – BirdNest`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: [listing.images[0]],
    },
  }
}

export default function ListingDetailPage({ params }: { params: { slug: string } }) {
  const listing = mockListings.find(l => l.slug === params.slug)
  if (!listing) notFound()

  const reviews = mockReviews.filter(r => r.listingId === listing.id)
  // Add some mock reviews if none exist
  const displayReviews = reviews.length > 0 ? reviews : [
    { id: 'r1', listingId: listing.id, authorName: 'Sarah M.', authorCountry: 'UAE', rating: 5, comment: 'Absolutely fantastic stay! The property was exactly as described and the host was incredibly responsive.', source: 'BirdNest', createdAt: new Date('2024-05-01') },
    { id: 'r2', listingId: listing.id, authorName: 'Ahmed K.', authorCountry: 'Egypt', rating: 4, comment: 'Great location and nice amenities. The apartment was well-furnished and comfortable.', source: 'BirdNest', createdAt: new Date('2024-05-10') },
    { id: 'r3', listingId: listing.id, authorName: 'John D.', authorCountry: 'UK', rating: 5, comment: 'Exceptional value for money. The views are breathtaking and the property is maintained to a very high standard.', source: 'BirdNest', createdAt: new Date('2024-05-20') },
  ]

  const similar = mockListings.filter(l => l.area === listing.area && l.id !== listing.id).slice(0, 3)

  return (
    <>
      <SchemaMarkup listing={listing} reviews={displayReviews} />
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="bg-cream py-3">
          <div className="container-site">
            <nav className="flex items-center gap-2 text-xs text-ink/50">
              <Link href="/" className="hover:text-orange transition-colors">Home</Link>
              <span>/</span>
              <Link href="/listings" className="hover:text-orange transition-colors">Listings</Link>
              <span>/</span>
              <Link href={`/listings?area=${listing.area.toLowerCase().replace(/ /g, '-')}`} className="hover:text-orange transition-colors">{listing.area}</Link>
              <span>/</span>
              <span className="text-ink">{listing.title}</span>
            </nav>
          </div>
        </div>

        <div className="container-site py-8">
          {/* Title section */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-semibold text-ink mb-2">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-ink/60">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {listing.location}, {listing.area}
                </span>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <StarRating rating={listing.rating} size="sm" />
                  <span className="font-semibold text-ink">{listing.rating}</span>
                  <span>({listing.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo gallery */}
          <div className="mb-8">
            <PhotoGallery images={listing.images} title={listing.title} />
          </div>

          {/* Main content + sidebar */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left content */}
            <div className="flex-1 min-w-0 space-y-10">
              {/* Property overview */}
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

              {/* Eligibility */}
              <EligibilityNotice eligibility={listing.eligibility} />

              {/* Amenities */}
              <AmenitiesGrid amenities={listing.amenities} />

              {/* Reviews */}
              <ReviewsSection reviews={displayReviews} rating={listing.rating} reviewCount={listing.reviewCount} />
            </div>

            {/* Booking widget */}
            <div className="lg:w-80 xl:w-96 shrink-0">
              <Suspense fallback={<div className="bg-white rounded-card border border-gray-200 shadow-lg p-6 h-96 animate-pulse" />}>
                <BookingWidget listing={listing} />
              </Suspense>
            </div>
          </div>

          {/* Similar properties */}
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
      <WhatsAppButton variant="fab" message={`Hi! I'm interested in "${listing.title}".`} />
    </>
  )
}
