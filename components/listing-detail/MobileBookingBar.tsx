'use client'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { type Listing } from '@/lib/mock-data'
import { formatPrice } from '@/lib/formatters'

interface MobileBookingBarProps {
  listing: Listing
}

export default function MobileBookingBar({ listing }: MobileBookingBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-lg font-bold text-ink">{formatPrice(listing.pricePerNight)}</span>
            <span className="text-xs text-ink/50">/ night</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-ink/50">
            <Star className="w-3 h-3 fill-orange text-orange" />
            <span className="font-medium">{listing.rating}</span>
            <span>({listing.reviewCount})</span>
          </div>
        </div>
        <Link
          href={`/book/${listing.slug}`}
          className="bg-orange text-white font-semibold px-6 py-3 rounded-btn hover:bg-orange-dk transition-colors text-sm flex-shrink-0"
        >
          Reserve Now
        </Link>
      </div>
    </div>
  )
}
