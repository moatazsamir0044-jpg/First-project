import Link from 'next/link'
import { mockListings } from '@/lib/mock-data'
import ListingCard from '@/components/listings/ListingCard'
import { ArrowRight } from 'lucide-react'

export default function FeaturedListings() {
  const featured = mockListings.slice(0, 6)

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-site">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-orange mb-2 tracking-wide uppercase">Curated for you</p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-ink">Top Picks This Week</h2>
          </div>
          <Link
            href="/listings"
            className="hidden md:flex items-center gap-1 text-sm font-semibold text-orange hover:text-orange-dk transition-colors group"
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
            className="inline-flex items-center gap-2 bg-orange text-white font-semibold px-6 py-3 rounded-btn hover:bg-orange-dk transition-colors"
          >
            View All Nests
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
