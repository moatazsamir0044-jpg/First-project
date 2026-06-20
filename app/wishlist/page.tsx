'use client'
import { useWishlist } from '@/lib/wishlist-context'
import { mockListings } from '@/lib/mock-data'
import ListingCard from '@/components/listings/ListingCard'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function WishlistPage() {
  const { wishlist } = useWishlist()
  const savedListings = wishlist
    .map(id => mockListings.find(l => l.id === id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-ground)]">
        <div className="container-site py-12">
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl text-[var(--color-text)] mb-2">
                Saved Nests
              </h1>
              <p className="text-[var(--color-text)]/60">
                {savedListings.length === 0
                  ? 'You haven\'t saved any listings yet.'
                  : `${savedListings.length} listing${savedListings.length !== 1 ? 's' : ''} saved`}
              </p>
            </div>
            {savedListings.length > 0 && (
              <p className="text-sm text-[var(--color-text)]/50">
                Click <span className="inline-flex items-center gap-1 font-medium text-[var(--color-accent-secondary)]">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01"/></svg>
                  compare
                </span> on any card to compare up to 3 listings
              </p>
            )}
          </div>

          {savedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-accent-primary)]/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-[var(--color-accent-primary)]" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[var(--color-text)] mb-1">No saved listings yet</p>
                <p className="text-[var(--color-text)]/50 text-sm">Tap the heart on any listing to save it here</p>
              </div>
              <Link
                href="/listings"
                className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-dk)] text-white font-semibold px-6 py-3 rounded-btn transition-colors"
              >
                Browse Nests
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
