'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import BookingSteps from '@/components/booking/BookingSteps'
import StepReview from '@/components/booking/StepReview'
import StepDetails from '@/components/booking/StepDetails'
import StepEligibility from '@/components/booking/StepEligibility'
import StepPayment from '@/components/booking/StepPayment'
import BookingConfirmed from '@/components/booking/BookingConfirmed'
import { mockListings } from '@/lib/mock-data'
import { calculateNights, generateBookingRef } from '@/lib/formatters'
import Link from 'next/link'

interface GuestDetails {
  name: string
  email: string
  phone: string
  specialRequests: string
}

export default function BookPage({ params }: { params: { slug: string } }) {
  const listing = mockListings.find(l => l.slug === params.slug)
  if (!listing) return notFound()

  const searchParams = useSearchParams()
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = Number(searchParams.get('guests') || '2')

  const [step, setStep] = useState(1)
  const [guestDetails, setGuestDetails] = useState<GuestDetails | null>(null)
  const [eligibilityType, setEligibilityType] = useState('')
  const [bookingRef] = useState(generateBookingRef())

  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 1
  const total = nights * listing.pricePerNight + nights * listing.utilitiesEst + listing.cleaningFee

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container-site max-w-2xl">
          {/* Back link */}
          {step < 5 && (
            <Link href={`/listings/${listing.slug}`} className="flex items-center gap-1 text-sm text-ink/50 hover:text-orange mb-6 transition-colors">
              ← Back to property
            </Link>
          )}

          {step < 5 && <BookingSteps currentStep={step} />}

          <div className="bg-white rounded-card shadow-sm p-6 md:p-8">
            {step === 1 && (
              <StepReview
                listing={listing}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <StepDetails
                onNext={(details) => { setGuestDetails(details); setStep(3) }}
                onBack={() => setStep(1)}
                initial={guestDetails || undefined}
              />
            )}
            {step === 3 && (
              <StepEligibility
                eligibility={listing.eligibility}
                onNext={(type) => { setEligibilityType(type); setStep(4) }}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <StepPayment
                listing={listing}
                total={total}
                onBack={() => setStep(3)}
                onComplete={() => setStep(5)}
              />
            )}
            {step === 5 && (
              <BookingConfirmed
                reference={bookingRef}
                guestName={guestDetails?.name || 'Guest'}
                propertyTitle={listing.title}
                checkIn={checkIn || new Date().toISOString().split('T')[0]}
                checkOut={checkOut || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                totalPrice={total}
              />
            )}
          </div>
        </div>
      </main>
    </>
  )
}
