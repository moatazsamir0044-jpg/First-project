import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ListingCard from '@/components/listings/ListingCard'
import MashrabiyaPattern from '@/components/shared/MashrabiyaPattern'
import { mockListings } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Start Your Booking',
  description:
    'Choose a verified BirdNest property and start your booking. Transparent pricing, no hidden fees, flexible cancellation across New Cairo, North Coast, El Gouna & Sheikh Zayed.',
  alternates: { canonical: '/booking' },
}

export default function BookingEntryPage() {
  const bookable = mockListings.filter(l => l.isActive)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-ground)]">
        {/* Intro */}
        <section className="bg-white border-b border-[#e6dbcf] py-12 md:py-16">
          <div className="container-site text-center max-w-2xl mx-auto">
            <p
              className="text-sm font-semibold text-[var(--color-accent-primary)] mb-3 tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Start booking
            </p>
            <h1
              className="text-3xl md:text-5xl font-semibold text-[var(--color-text)] mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Choose your nest to begin
            </h1>
            <p className="text-[var(--color-text)]/60 leading-relaxed">
              Pick a verified property below to start your booking. You&apos;ll confirm dates,
              guest details, and eligibility before any payment — and you won&apos;t be charged yet.
            </p>
            <div className="mt-6">
              <Link
                href="/listings"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-secondary)] hover:text-[var(--color-accent-secondary-dk)] transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-secondary)] focus-visible:ring-offset-2"
              >
                Prefer to browse &amp; filter first? Explore all nests →
              </Link>
            </div>
          </div>
        </section>

        <MashrabiyaPattern variant="divider" tileSize={36} opacity={0.18} className="bg-[var(--color-ground)]" />

        {/* Bookable grid */}
        <section className="container-site py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookable.map(listing => (
              <ListingCard key={listing.id} listing={listing} bookNow />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
