import Link from 'next/link'
import { mockListings } from '@/lib/mock-data'
import ListingCard from '@/components/listings/ListingCard'
import { ArrowRight } from 'lucide-react'

export default function FeaturedListings() {
  const featured = mockListings.filter(l => l.isActive).slice(0, 6)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-site">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-sm font-semibold text-[var(--color-accent-primary)] mb-2 tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Curated for you
            </p>
            <h2
              className="text-3xl md:text-4xl font-semibold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Top Picks This Week
            </h2>
          </div>
          <Link
            href="/listings"
            className="hidden md:flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-dk)] transition-colors group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2"
          >
            View All Nests
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 bg-[var(--color-accent-primary)] text-white font-semibold px-6 py-3 rounded-btn hover:bg-[var(--color-accent-primary-dk)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2"
          >
            View All Nests
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
