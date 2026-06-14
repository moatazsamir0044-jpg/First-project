import Image from 'next/image'
import { type Listing } from '@/lib/mock-data'
import { formatPrice, calculateNights } from '@/lib/formatters'
import { MapPin, Calendar, Users } from 'lucide-react'
import StarRating from '@/components/shared/StarRating'

interface StepReviewProps {
  listing: Listing
  checkIn: string
  checkOut: string
  guests: number
  onNext: () => void
}

export default function StepReview({ listing, checkIn, checkOut, guests, onNext }: StepReviewProps) {
  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 1
  const subtotal = nights * listing.pricePerNight
  const utilitiesTotal = nights * listing.utilitiesEst
  const total = subtotal + utilitiesTotal + listing.cleaningFee

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-semibold text-ink">Review Your Stay</h2>

      {/* Property card */}
      <div className="flex gap-4 p-4 bg-cream rounded-card">
        <div className="relative w-24 h-24 rounded-card overflow-hidden shrink-0">
          <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink text-sm line-clamp-2 mb-1">{listing.title}</h3>
          <div className="flex items-center gap-1 text-xs text-ink/50 mb-2">
            <MapPin className="w-3 h-3" />
            {listing.location}, {listing.area}
          </div>
          <StarRating rating={listing.rating} size="sm" showValue />
        </div>
      </div>

      {/* Stay details */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-white border border-gray-100 rounded-card text-center">
          <Calendar className="w-4 h-4 text-orange mx-auto mb-1" />
          <p className="text-xs text-ink/50 mb-0.5">Check-in</p>
          <p className="text-sm font-semibold text-ink">{checkIn ? fmt(checkIn) : 'TBD'}</p>
        </div>
        <div className="p-3 bg-white border border-gray-100 rounded-card text-center">
          <Calendar className="w-4 h-4 text-orange mx-auto mb-1" />
          <p className="text-xs text-ink/50 mb-0.5">Check-out</p>
          <p className="text-sm font-semibold text-ink">{checkOut ? fmt(checkOut) : 'TBD'}</p>
        </div>
        <div className="p-3 bg-white border border-gray-100 rounded-card text-center">
          <Users className="w-4 h-4 text-orange mx-auto mb-1" />
          <p className="text-xs text-ink/50 mb-0.5">Guests</p>
          <p className="text-sm font-semibold text-ink">{guests}</p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-3 p-5 bg-white border border-gray-100 rounded-card">
        <h3 className="font-semibold text-sm text-ink mb-3">Price Breakdown</h3>
        <div className="flex justify-between text-sm">
          <span className="text-ink/60">{formatPrice(listing.pricePerNight)} × {nights} nights</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {utilitiesTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-ink/60">Estimated utilities</span>
            <span>{formatPrice(utilitiesTotal)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-ink/60">Cleaning fee</span>
          <span>{formatPrice(listing.cleaningFee)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-100">
          <span>Total (EGP)</span>
          <span className="text-orange">{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-orange text-white font-semibold py-3.5 rounded-btn hover:bg-orange-dk transition-colors"
      >
        Continue to Guest Details
      </button>
    </div>
  )
}
