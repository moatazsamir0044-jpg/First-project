'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, MapPin, Users, Bed, ShieldCheck } from 'lucide-react'
import { clsx } from 'clsx'
import { type Listing } from '@/lib/mock-data'
import StarRating from '@/components/shared/StarRating'
import RefundBadge from './RefundBadge'
import UrgencyBadge from './UrgencyBadge'
import { formatPrice } from '@/lib/formatters'

interface ListingCardProps {
  listing: Listing
  className?: string
  checkIn?: string
  checkOut?: string
  guests?: number
}

const ELIGIBILITY_LABELS: Record<string, { label: string; color: string }> = {
  couples: { label: 'Couples only', color: 'text-orange' },
  families: { label: 'Families & couples', color: 'text-ink/50' },
}

export default function ListingCard({ listing, className, checkIn, checkOut, guests }: ListingCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)

  const params = new URLSearchParams()
  if (checkIn) params.set('checkIn', checkIn)
  if (checkOut) params.set('checkOut', checkOut)
  if (guests && guests > 1) params.set('guests', String(guests))
  const paramStr = params.toString()
  const listingHref = `/listings/${listing.slug}${paramStr ? `?${paramStr}` : ''}`
  const eligibilityInfo = ELIGIBILITY_LABELS[listing.eligibility]

  return (
    <article className={clsx('group bg-white rounded-card overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--color-accent-primary)] focus-within:ring-offset-2', className)}>
      {/* Image */}
      <Link href={listingHref} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.images[imgIdx] || listing.images[0]}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {listing.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {listing.images.slice(0, 4).map((_, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); setImgIdx(i) }}
                className={clsx('w-1.5 h-1.5 rounded-full transition-colors', i === imgIdx ? 'bg-white' : 'bg-white/50')}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setWishlisted(!wishlisted) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 transition-transform"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={clsx('w-4 h-4 transition-colors', wishlisted ? 'fill-orange text-orange' : 'text-gray-500')} />
        </button>

        {/* Urgency badge top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <UrgencyBadge lastBooked={listing.lastBooked} viewCount={listing.viewCount} rating={listing.rating} />
        </div>

        {/* Verified badge bottom-left */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-xs font-semibold bg-white/90 backdrop-blur-sm text-[#237c58]">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-ink/50 mb-1.5">
          <MapPin className="w-3 h-3" />
          <span>{listing.location}, {listing.area}</span>
          {eligibilityInfo && (
            <>
              <span className="mx-1">·</span>
              <span className={clsx('font-medium', eligibilityInfo.color)}>{eligibilityInfo.label}</span>
            </>
          )}
        </div>

        <Link href={listingHref}>
          <h3 className="font-heading text-base font-semibold text-ink mb-2 line-clamp-2 group-hover:text-orange transition-colors">
            {listing.title}
          </h3>
        </Link>

        <div className="flex items-center gap-3 text-xs text-ink/50 mb-3">
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BR`}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Up to {listing.maxGuests}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <StarRating rating={listing.rating} size="sm" />
            <span className="text-xs font-semibold text-ink">{listing.rating}</span>
            <span className="text-xs text-ink/40">({listing.reviewCount})</span>
          </div>
          <RefundBadge policy={listing.refundPolicy} />
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-ink">{formatPrice(listing.pricePerNight)}</span>
            <span className="text-xs text-ink/40"> / night</span>
            {listing.utilitiesEst > 0 && (
              <div className="text-xs text-ink/40">+{formatPrice(listing.utilitiesEst)} est. utilities</div>
            )}
          </div>
          <Link
            href={listingHref}
            className="text-xs font-semibold bg-orange/10 text-orange hover:bg-orange hover:text-white transition-colors px-3 py-1.5 rounded-btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
