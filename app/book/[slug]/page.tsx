'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import QuickCheckout from '@/components/booking/QuickCheckout'
import BookingConfirmed from '@/components/booking/BookingConfirmed'
import { type Listing } from '@/lib/mock-data'
import { calculateNights, generateBookingRef } from '@/lib/formatters'

interface CheckoutData {
  name: string
  email: string
  phone: string
  nationality: string
  specialRequests: string
}

function BookingFlow({ slug }: { slug: string }) {
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = Number(searchParams.get('guests') || '2')

  const [done, setDone] = useState(false)
  const [details, setDetails] = useState<CheckoutData | null>(null)
  const [bookingRef] = useState(generateBookingRef())

  useEffect(() => {
    fetch(`/api/listings/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: Listing | null) => { setListing(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!listing) return notFound()

  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 1
  const total = nights * listing.pricePerNight + nights * listing.utilitiesEst + listing.cleaningFee

  return (
    <main className="min-h-screen bg-[var(--color-ground)] py-8">
      <div className="container-site max-w-5xl">
        {!done && (
          <Link
            href={`/listings/${listing.slug}`}
            className="inline-flex items-center gap-1 text-sm text-[var(--color-text)]/50 hover:text-[var(--color-accent-primary)] mb-6 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2"
          >
            ← Back to property
          </Link>
        )}

        {done ? (
          <div className="max-w-2xl mx-auto bg-white rounded-card shadow-sm p-6 md:p-8">
            <BookingConfirmed
              reference={bookingRef}
              guestName={details?.name || 'Guest'}
              propertyTitle={listing.title}
              checkIn={checkIn || new Date().toISOString().split('T')[0]}
              checkOut={checkOut || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              totalPrice={total}
            />
          </div>
        ) : (
          <QuickCheckout
            listing={listing}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            onComplete={(d) => { setDetails(d); setDone(true) }}
          />
        )}
      </div>
    </main>
  )
}

export default function BookPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
        <BookingFlow slug={params.slug} />
      </Suspense>
    </>
  )
}
