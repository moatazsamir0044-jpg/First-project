'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Star, ShieldCheck, Clock, BadgeCheck } from 'lucide-react'
import { type Listing } from '@/lib/mock-data'
import { formatPrice, calculateNights } from '@/lib/formatters'
import RefundBadge from '@/components/listings/RefundBadge'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

interface BookingWidgetProps {
  listing: Listing
}

const ELIGIBILITY_NOTICE: Record<string, string> = {
  couples: 'Couples only — marriage certificate may be required at check-in.',
  families: 'Families & couples — ID verification at check-in.',
}

export default function BookingWidget({ listing }: BookingWidgetProps) {
  const searchParams = useSearchParams()
  const today = new Date().toISOString().split('T')[0]
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '')
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '')
  const [guests, setGuests] = useState(Number(searchParams.get('guests') || '2'))

  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 0
  const subtotal = nights * listing.pricePerNight
  const utilitiesTotal = nights * listing.utilitiesEst
  const cleaningFee = listing.cleaningFee
  const total = subtotal + utilitiesTotal + cleaningFee

  const bookUrl = checkIn && checkOut
    ? `/book/${listing.slug}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    : `/book/${listing.slug}`

  const viewsThisWeek = Math.floor(listing.viewCount * 0.3) || 34

  return (
    <div className="bg-white rounded-card border border-gray-200 shadow-lg p-6 sticky top-24">
      {/* Price */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-heading text-2xl font-semibold text-ink">{formatPrice(listing.pricePerNight)}</span>
        <span className="text-ink/50 text-sm">/ night</span>
      </div>
      {listing.utilitiesEst > 0 && (
        <p className="text-xs text-ink/40 mb-1">+{formatPrice(listing.utilitiesEst)} estimated utilities</p>
      )}

      {/* Rating + social proof */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-orange text-orange" />
          <span className="font-semibold">{listing.rating}</span>
          <span className="text-ink/40">({listing.reviewCount} reviews)</span>
        </div>
        <span className="text-xs text-ink/50 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#237c58] animate-pulse inline-block" />
          {viewsThisWeek} viewed this week
        </span>
      </div>

      {/* Eligibility warning — shown BEFORE dates */}
      {ELIGIBILITY_NOTICE[listing.eligibility] && (
        <div className="mb-3 flex gap-2 p-2.5 bg-orange/5 border border-orange/20 rounded-lg text-xs text-orange/90">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>{ELIGIBILITY_NOTICE[listing.eligibility]}</span>
        </div>
      )}

      {/* Date picker */}
      <div className="border border-gray-200 rounded-card overflow-hidden mb-3">
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          <div className="p-3">
            <label className="block text-xs font-semibold text-ink/50 mb-1">CHECK-IN</label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              className="text-sm font-medium text-ink w-full outline-none cursor-pointer"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-semibold text-ink/50 mb-1">CHECK-OUT</label>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              className="text-sm font-medium text-ink w-full outline-none cursor-pointer"
            />
          </div>
        </div>
        <div className="border-t border-gray-200 p-3">
          <label className="block text-xs font-semibold text-ink/50 mb-2">GUESTS</label>
          <div className="flex items-center gap-4">
            <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:border-orange transition-colors">−</button>
            <span className="font-medium text-sm">{guests} guest{guests !== 1 ? 's' : ''}</span>
            <button onClick={() => setGuests(g => Math.min(listing.maxGuests, g + 1))} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:border-orange transition-colors">+</button>
          </div>
          <p className="text-xs text-ink/40 mt-1">Max {listing.maxGuests} guests</p>
        </div>
      </div>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="space-y-2 mb-4 p-4 bg-cream rounded-card text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">{formatPrice(listing.pricePerNight)} × {nights} night{nights !== 1 ? 's' : ''}</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          {utilitiesTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-ink/60">Est. utilities</span>
              <span className="font-medium">{formatPrice(utilitiesTotal)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-ink/60">Cleaning fee</span>
            <span className="font-medium">{formatPrice(cleaningFee)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t border-ink/10">
            <span>Total</span>
            <span className="text-orange">{formatPrice(total)}</span>
          </div>
        </div>
      )}

      {/* Peak season nudge */}
      <div className="flex items-center gap-1.5 mb-3 text-xs text-[#237c58] font-medium">
        <Clock className="w-3.5 h-3.5" />
        Peak season — dates fill fast. Reserve to hold yours.
      </div>

      {/* CTA */}
      <Link
        href={bookUrl}
        className="block w-full bg-orange text-white font-semibold py-3.5 rounded-btn text-center hover:bg-orange-dk transition-colors mb-3 text-sm"
      >
        {nights > 0 ? `Reserve for ${formatPrice(total)}` : 'Check Availability'}
      </Link>

      <WhatsAppButton
        variant="inline"
        message={`Hi! I'm interested in booking "${listing.title}" on BirdNest.`}
        className="w-full justify-center mb-4 text-sm"
      />

      <RefundBadge policy={listing.refundPolicy} className="w-full justify-center mb-4" />

      {/* Trust badges */}
      <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { icon: ShieldCheck, label: 'Verified listing' },
          { icon: BadgeCheck, label: 'No hidden fees' },
          { icon: Clock, label: '24/7 support' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon className="w-4 h-4 text-[#237c58]" />
            <span className="text-[10px] text-ink/50 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-ink/40 mt-3">You won't be charged yet</p>
    </div>
  )
}
