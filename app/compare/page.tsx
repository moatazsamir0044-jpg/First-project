'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockListings, type Listing } from '@/lib/mock-data'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import StarRating from '@/components/shared/StarRating'
import { formatPrice } from '@/lib/formatters'
import { MapPin, Bed, Bath, Users, Check, X } from 'lucide-react'

const ALL_AMENITIES = [
  'WiFi', 'Air Conditioning', 'Pool', 'Gym', 'Parking', 'Kitchen',
  'Washing Machine', 'TV', 'Balcony', 'Sea View', 'City View', 'Pet Friendly',
  'Kids Friendly', 'Elevator', '24/7 Security',
]

function CompareRow({ label, values }: { label: string; values: (string | React.ReactNode)[] }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pr-4 text-sm font-medium text-[var(--color-text)]/60 whitespace-nowrap w-36">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-3 px-4 text-sm text-[var(--color-text)] text-center">{v}</td>
      ))}
    </tr>
  )
}

function ComparePage() {
  const params = useSearchParams()
  const ids = (params.get('ids') || '').split(',').filter(Boolean)
  const listings = ids
    .map(id => mockListings.find(l => l.id === id))
    .filter((l): l is Listing => Boolean(l))
    .slice(0, 3)

  if (listings.length < 2) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-ground)] flex items-center justify-center">
          <div className="text-center py-24">
            <p className="text-lg font-semibold text-[var(--color-text)] mb-2">Not enough listings to compare</p>
            <p className="text-[var(--color-text)]/50 mb-6 text-sm">Select at least 2 listings from your wishlist</p>
            <Link href="/wishlist" className="bg-[var(--color-accent-primary)] text-white font-semibold px-6 py-3 rounded-btn hover:bg-[var(--color-accent-primary-dk)] transition-colors">
              Go to Wishlist
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const colWidth = listings.length === 2 ? 'w-1/2' : 'w-1/3'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-ground)]">
        <div className="container-site py-10">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-heading text-3xl text-[var(--color-text)]">Compare Nests</h1>
              <p className="text-sm text-[var(--color-text)]/50 mt-1">Side-by-side comparison of {listings.length} listings</p>
            </div>
            <Link href="/wishlist" className="text-sm font-medium text-[var(--color-accent-primary)] hover:underline">
              ← Back to Wishlist
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              {/* Image row */}
              <thead>
                <tr>
                  <th className="w-36" />
                  {listings.map(l => (
                    <th key={l.id} className={`${colWidth} px-4 pb-4 font-normal`}>
                      <div className="rounded-card overflow-hidden shadow-sm">
                        <div className="relative aspect-[4/3]">
                          <Image src={l.images[0]} alt={l.title} fill className="object-cover" sizes="400px" />
                        </div>
                        <div className="bg-white p-3 text-left">
                          <p className="font-heading font-semibold text-[var(--color-text)] text-sm leading-snug mb-1">{l.title}</p>
                          <p className="text-xs text-[var(--color-text)]/50 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" /> {l.location}, {l.area}
                          </p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white rounded-card shadow-sm">
                <CompareRow
                  label="Price / night"
                  values={listings.map(l => (
                    <span key={l.id} className="font-bold text-base text-[var(--color-text)]">{formatPrice(l.pricePerNight)}</span>
                  ))}
                />
                <CompareRow
                  label="Rating"
                  values={listings.map(l => (
                    <div key={l.id} className="flex flex-col items-center gap-0.5">
                      <StarRating rating={l.rating} size="sm" />
                      <span className="text-xs text-[var(--color-text)]/50">{l.rating} ({l.reviewCount})</span>
                    </div>
                  ))}
                />
                <CompareRow
                  label="Bedrooms"
                  values={listings.map(l => (
                    <span key={l.id} className="flex items-center justify-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-[var(--color-text)]/40" />
                      {l.bedrooms === 0 ? 'Studio' : `${l.bedrooms} BR`}
                    </span>
                  ))}
                />
                <CompareRow
                  label="Bathrooms"
                  values={listings.map(l => (
                    <span key={l.id} className="flex items-center justify-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-[var(--color-text)]/40" />
                      {l.bathrooms}
                    </span>
                  ))}
                />
                <CompareRow
                  label="Max guests"
                  values={listings.map(l => (
                    <span key={l.id} className="flex items-center justify-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[var(--color-text)]/40" />
                      {l.maxGuests}
                    </span>
                  ))}
                />
                <CompareRow
                  label="Refund policy"
                  values={listings.map(l => l.refundPolicy)}
                />
                <CompareRow
                  label="Eligibility"
                  values={listings.map(l => l.eligibility === 'couples' ? 'Couples only' : 'Families & couples')}
                />
                <CompareRow
                  label="Utilities est."
                  values={listings.map(l => l.utilitiesEst > 0 ? `+${formatPrice(l.utilitiesEst)}` : '—')}
                />

                {/* Amenities */}
                <tr>
                  <td colSpan={listings.length + 1} className="pt-5 pb-2 px-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text)]/40">Amenities</p>
                  </td>
                </tr>
                {ALL_AMENITIES.map(amenity => {
                  const has = listings.map(l => l.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase())))
                  if (!has.some(Boolean)) return null
                  return (
                    <CompareRow
                      key={amenity}
                      label={amenity}
                      values={has.map((h, i) => h
                        ? <Check key={i} className="w-4 h-4 text-[var(--color-accent-secondary)] mx-auto" />
                        : <X key={i} className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    />
                  )
                })}

                {/* Book buttons */}
                <tr>
                  <td />
                  {listings.map(l => (
                    <td key={l.id} className="py-5 px-4 text-center">
                      <Link
                        href={`/book/${l.slug}`}
                        className="inline-block bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-dk)] text-white text-sm font-semibold px-5 py-2.5 rounded-btn transition-colors"
                      >
                        Book this Nest
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function CompareInner() {
  return (
    <Suspense>
      <ComparePage />
    </Suspense>
  )
}

export default CompareInner
