'use client'
import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Calendar, Users, Shield, CreditCard, Check, Loader2 } from 'lucide-react'
import { type Listing } from '@/lib/mock-data'
import { formatPrice, calculateNights } from '@/lib/formatters'
import { isArabNational, ELIGIBILITY_POLICY } from '@/lib/policies'
import { ALL_COUNTRIES } from '@/lib/countries'
import StarRating from '@/components/shared/StarRating'

interface CheckoutData {
  name: string
  email: string
  phone: string
  nationality: string
  specialRequests: string
}

interface QuickCheckoutProps {
  listing: Listing
  checkIn: string
  checkOut: string
  guests: number
  onComplete: (details: CheckoutData) => void
}

const STAY_TYPES = [
  { value: 'couple', label: 'Married Couple' },
  { value: 'family', label: 'Family' },
  { value: 'single', label: 'Single Traveller' },
  { value: 'corporate', label: 'Corporate Guest' },
]

export default function QuickCheckout({ listing, checkIn, checkOut, guests, onComplete }: QuickCheckoutProps) {
  const [form, setForm] = useState<CheckoutData>({ name: '', email: '', phone: '', nationality: '', specialRequests: '' })
  const [stayType, setStayType] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryList, setShowCountryList] = useState(false)

  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 1
  const subtotal = nights * listing.pricePerNight
  const utilitiesTotal = nights * listing.utilitiesEst
  const total = subtotal + utilitiesTotal + listing.cleaningFee

  const fmt = (d: string) => (d ? new Date(d).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD')
  const arabNational = isArabNational(form.nationality)
  const filteredCountries = ALL_COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.nationality) e.nationality = 'Nationality is required'
    if (!stayType) e.stayType = 'Please tell us who is staying'
    if (!confirmed) e.confirmed = 'Please confirm eligibility to continue'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = async () => {
    if (!validate()) {
      const firstError = document.querySelector('[data-error="true"]')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          checkIn,
          checkOut,
          guests,
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: form.phone,
          nationality: form.nationality,
          eligibilityType: stayType,
          specialRequests: form.specialRequests || undefined,
        }),
      })
      const data = await res.json() as { iframeUrl?: string; error?: string }
      if (!res.ok || !data.iframeUrl) {
        setErrors({ submit: data.error ?? 'Payment setup failed. Please try again.' })
        setLoading(false)
        return
      }
      // Redirect to Paymob hosted payment page
      window.location.href = data.iframeUrl
    } catch {
      setErrors({ submit: 'Network error. Please check your connection and try again.' })
      setLoading(false)
    }
  }

  const inputCls = (hasError?: string) =>
    `w-full border ${hasError ? 'border-red-400' : 'border-gray-200'} rounded-btn px-4 py-3 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/15 transition`

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      {/* ── Left: single consolidated form ─────────────────────────── */}
      <div className="bg-white rounded-card shadow-sm p-6 md:p-8 space-y-8 animate-fade-up">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-ink">Confirm and pay</h1>
          <p className="text-ink/55 text-sm mt-1">Everything on one page — you’re three clicks from your nest.</p>
        </div>

        {/* Contact details */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg text-ink">Your details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div data-error={!!errors.name}>
              <label className="block text-sm font-semibold text-ink mb-1.5">Full name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="As on your ID" className={inputCls(errors.name)} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div data-error={!!errors.email}>
              <label className="block text-sm font-semibold text-ink mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={inputCls(errors.email)} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div data-error={!!errors.phone}>
              <label className="block text-sm font-semibold text-ink mb-1.5">Phone (WhatsApp) *</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+20 100 000 0000" className={inputCls(errors.phone)} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div className="relative" data-error={!!errors.nationality}>
              <label className="block text-sm font-semibold text-ink mb-1.5">Nationality *</label>
              <input
                value={form.nationality || countrySearch}
                onChange={e => { if (!form.nationality) { setCountrySearch(e.target.value); setShowCountryList(true) } }}
                onFocus={() => { if (!form.nationality) setShowCountryList(true) }}
                onBlur={() => setTimeout(() => setShowCountryList(false), 150)}
                placeholder="Select your nationality"
                readOnly={!!form.nationality}
                className={inputCls(errors.nationality)}
              />
              {form.nationality && (
                <button type="button" onClick={() => { setForm({ ...form, nationality: '' }); setCountrySearch('') }} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 text-lg" aria-label="Clear nationality">×</button>
              )}
              {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
              {showCountryList && !form.nationality && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-btn shadow-lg max-h-48 overflow-y-auto">
                  {filteredCountries.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">No countries found</div>
                  ) : (
                    filteredCountries.map(country => (
                      <button key={country} type="button" onMouseDown={() => { setForm({ ...form, nationality: country }); setCountrySearch(country); setShowCountryList(false) }} className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-cream transition-colors">
                        {country}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Who is staying + eligibility */}
        <section className="space-y-4" data-error={!!errors.stayType}>
          <h2 className="font-heading text-lg text-ink">Who is staying?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STAY_TYPES.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => setStayType(type.value)}
                className={`p-3 rounded-btn border-2 text-sm font-semibold transition-all ${stayType === type.value ? 'border-orange bg-orange/5 text-orange' : 'border-gray-200 text-ink hover:border-gray-300'}`}
              >
                {type.label}
              </button>
            ))}
          </div>
          {errors.stayType && <p className="text-red-500 text-xs">{errors.stayType}</p>}

          {form.nationality && (
            <div className={`p-4 rounded-btn border text-sm animate-fade-in ${arabNational ? 'bg-orange/5 border-orange/30' : 'bg-green/5 border-green/30'}`}>
              <p className="font-semibold text-ink mb-1">
                {arabNational ? '⚠️ Arab National — marriage certificate may be required' : '✅ No certificate required'}
              </p>
              <p className="text-ink/70">{arabNational ? ELIGIBILITY_POLICY.arabNational : ELIGIBILITY_POLICY.nonArab}</p>
            </div>
          )}

          <label className="flex items-start gap-3 cursor-pointer" data-error={!!errors.confirmed}>
            <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 accent-orange w-4 h-4" />
            <span className="text-sm text-ink/70 leading-relaxed">
              I confirm I meet the eligibility requirements for this property and understand documentation may be requested at check-in.
            </span>
          </label>
          {errors.confirmed && <p className="text-red-500 text-xs">{errors.confirmed}</p>}
        </section>

        {/* Payment */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg text-ink">Payment</h2>
          <div className="p-5 bg-white border border-gray-100 rounded-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-ink/40" />
              <div>
                <p className="text-sm font-semibold text-ink">Credit / Debit Card</p>
                <p className="text-xs text-ink/50">You will be taken to Accept to complete payment securely</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1a1a2e] bg-gray-100 px-2 py-1 rounded">VISA</span>
              <span className="text-xs font-bold text-red-600 bg-gray-100 px-2 py-1 rounded">MC</span>
            </div>
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-btn px-4 py-3">{errors.submit}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-ink/40">
            <Shield className="w-4 h-4 text-green" />
            Payments powered by Accept (Paymob) · 256-bit SSL · Your card data never touches our servers.
          </div>
        </section>
      </div>

      {/* ── Right: sticky summary with the single pay button ───────── */}
      <aside className="bg-white rounded-card shadow-sm p-6 lg:sticky lg:top-6 animate-fade-up delay-100">
        <div className="flex gap-3 pb-4 border-b border-gray-100">
          <div className="relative w-20 h-20 rounded-card overflow-hidden shrink-0">
            <Image src={listing.images[0]} alt={listing.title} fill sizes="80px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-ink text-sm line-clamp-2">{listing.title}</h3>
            <p className="flex items-center gap-1 text-xs text-ink/50 mt-1"><MapPin className="w-3 h-3" />{listing.area}</p>
            <div className="mt-1"><StarRating rating={listing.rating} size="sm" showValue /></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-b border-gray-100 text-center">
          <div><Calendar className="w-4 h-4 text-orange mx-auto mb-1" /><p className="text-[11px] text-ink/50">Check-in</p><p className="text-xs font-semibold text-ink">{fmt(checkIn)}</p></div>
          <div><Calendar className="w-4 h-4 text-orange mx-auto mb-1" /><p className="text-[11px] text-ink/50">Check-out</p><p className="text-xs font-semibold text-ink">{fmt(checkOut)}</p></div>
          <div><Users className="w-4 h-4 text-orange mx-auto mb-1" /><p className="text-[11px] text-ink/50">Guests</p><p className="text-xs font-semibold text-ink">{guests}</p></div>
        </div>

        <div className="space-y-2 py-4 text-sm">
          <div className="flex justify-between"><span className="text-ink/60">{formatPrice(listing.pricePerNight)} × {nights} nights</span><span>{formatPrice(subtotal)}</span></div>
          {utilitiesTotal > 0 && <div className="flex justify-between"><span className="text-ink/60">Estimated utilities</span><span>{formatPrice(utilitiesTotal)}</span></div>}
          <div className="flex justify-between"><span className="text-ink/60">Cleaning fee</span><span>{formatPrice(listing.cleaningFee)}</span></div>
          <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-100"><span>Total (EGP)</span><span className="text-orange">{formatPrice(total)}</span></div>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-orange text-white font-semibold py-3.5 rounded-btn hover:bg-orange-dk transition-colors disabled:opacity-70 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : <><Check className="w-4 h-4" /> Confirm &amp; pay {formatPrice(total)}</>}
        </button>
        <p className="text-[11px] text-ink/40 text-center mt-2">Free cancellation within policy · No hidden fees</p>
      </aside>
    </div>
  )
}
