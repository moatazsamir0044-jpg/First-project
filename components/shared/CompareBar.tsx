'use client'
import Link from 'next/link'
import { X, GitCompareArrows } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'
import { mockListings } from '@/lib/mock-data'

export default function CompareBar() {
  const { compareList, toggleCompare, clearCompare } = useWishlist()

  if (compareList.length === 0) return null

  const listings = compareList.map(id => mockListings.find(l => l.id === id)).filter(Boolean)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-night)] text-white shadow-2xl border-t-2 border-[var(--color-accent-primary)]">
      <div className="container-site py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-semibold shrink-0">
          <GitCompareArrows className="w-4 h-4 text-[var(--color-accent-primary)]" />
          <span>Compare ({compareList.length}/3)</span>
        </div>

        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {listings.map(listing => listing && (
            <div
              key={listing.id}
              className="flex items-center gap-2 bg-white/10 rounded-pill px-3 py-1.5 text-sm"
            >
              <span className="line-clamp-1 max-w-[160px]">{listing.title}</span>
              <button
                onClick={() => toggleCompare(listing.id)}
                className="hover:text-[var(--color-accent-primary)] transition-colors shrink-0"
                aria-label={`Remove ${listing.title} from compare`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Clear all
          </button>
          {compareList.length >= 2 && (
            <Link
              href={`/compare?ids=${compareList.join(',')}`}
              className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-dk)] text-white text-sm font-semibold px-4 py-2 rounded-btn transition-colors"
            >
              Compare now
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
