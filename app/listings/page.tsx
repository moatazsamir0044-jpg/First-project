import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import ListingCard from '@/components/listings/ListingCard'
import FilterSidebar from '@/components/listings/FilterSidebar'
import SortBar from '@/components/listings/SortBar'
import { mockListings } from '@/lib/mock-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse All Properties – BirdNest Egypt',
  description: 'Find your perfect holiday home or serviced apartment across New Cairo, North Coast, El Gouna and Sheikh Zayed.',
}

interface SearchParams {
  area?: string
  minPrice?: string
  maxPrice?: string
  bedrooms?: string
  guests?: string
  amenities?: string
  refund?: string
  sort?: string
  checkIn?: string
  checkOut?: string
}

function filterAndSort(params: SearchParams) {
  let results = [...mockListings].filter(l => l.isActive)

  // Area filter
  if (params.area) {
    const area = params.area.toLowerCase().replace(/-/g, ' ')
    results = results.filter(l =>
      l.area.toLowerCase().includes(area) ||
      l.location.toLowerCase().includes(area)
    )
  }

  // Price filter
  if (params.minPrice) results = results.filter(l => l.pricePerNight >= Number(params.minPrice))
  if (params.maxPrice) results = results.filter(l => l.pricePerNight <= Number(params.maxPrice))

  // Bedrooms
  if (params.bedrooms) {
    if (params.bedrooms === 'Studio') results = results.filter(l => l.bedrooms === 0)
    else if (params.bedrooms === '4+') results = results.filter(l => l.bedrooms >= 4)
    else results = results.filter(l => l.bedrooms === Number(params.bedrooms))
  }

  // Guests
  if (params.guests) results = results.filter(l => l.maxGuests >= Number(params.guests))

  // Amenities
  if (params.amenities) {
    const required = params.amenities.split(',')
    results = results.filter(l => required.every(a => l.amenities.includes(a)))
  }

  // Refund policy
  if (params.refund) results = results.filter(l => l.refundPolicy === params.refund)

  // Sort
  switch (params.sort) {
    case 'price-asc': results.sort((a, b) => a.pricePerNight - b.pricePerNight); break
    case 'price-desc': results.sort((a, b) => b.pricePerNight - a.pricePerNight); break
    case 'rating': results.sort((a, b) => b.rating - a.rating); break
    case 'newest': results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
    default: results.sort((a, b) => b.viewCount - a.viewCount) // popular
  }

  return results
}

export default function ListingsPage({ searchParams }: { searchParams: SearchParams }) {
  const listings = filterAndSort(searchParams)
  const areaTitle = searchParams.area
    ? searchParams.area.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'All Egypt'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero banner */}
        <div className="bg-ink text-white py-10">
          <div className="container-site">
            <h1 className="font-heading text-3xl font-semibold mb-2">
              Properties in {areaTitle}
            </h1>
            <p className="text-white/60 text-sm">
              {listings.length} verified {listings.length === 1 ? 'property' : 'properties'} available
            </p>
          </div>
        </div>

        <div className="container-site py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <Suspense>
              <FilterSidebar />
            </Suspense>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <Suspense>
                <SortBar count={listings.length} total={mockListings.length} />
              </Suspense>

              {listings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🏡</div>
                  <h2 className="font-heading text-xl font-semibold text-ink mb-2">No properties found</h2>
                  <p className="text-ink/60 mb-6">Try adjusting your filters to see more results.</p>
                  <a href="/listings" className="bg-orange text-white font-semibold px-6 py-3 rounded-btn hover:bg-orange-dk transition-colors">
                    View All Properties
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {listings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton variant="fab" />
    </>
  )
}
