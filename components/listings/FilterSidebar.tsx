'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'

const AMENITIES = ['Pool', 'Gym', 'Beach Access', 'Parking', 'WiFi', 'AC', 'Kitchen', 'Washer', 'Workspace', 'Pet Friendly', 'BBQ', 'Garden']
const REFUND_POLICIES = [
  { value: 'flexible', label: 'Flexible (Free cancellation)' },
  { value: 'moderate', label: 'Moderate refund' },
  { value: 'non-refundable', label: 'Non-refundable' },
]

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  const [priceMin, setPriceMin] = useState(searchParams.get('minPrice') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('maxPrice') || '')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get('amenities')?.split(',').filter(Boolean) || []
  )
  const [refundPolicy, setRefundPolicy] = useState(searchParams.get('refund') || '')
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '')

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (priceMin) params.set('minPrice', priceMin); else params.delete('minPrice')
    if (priceMax) params.set('maxPrice', priceMax); else params.delete('maxPrice')
    if (selectedAmenities.length) params.set('amenities', selectedAmenities.join(',')); else params.delete('amenities')
    if (refundPolicy) params.set('refund', refundPolicy); else params.delete('refund')
    if (bedrooms) params.set('bedrooms', bedrooms); else params.delete('bedrooms')
    router.push(`/listings?${params.toString()}`)
    setMobileOpen(false)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    if (searchParams.get('area')) params.set('area', searchParams.get('area')!)
    router.push(`/listings?${params.toString()}`)
    setPriceMin('')
    setPriceMax('')
    setSelectedAmenities([])
    setRefundPolicy('')
    setBedrooms('')
  }

  const toggleAmenity = (a: string) => {
    setSelectedAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    )
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Bedrooms */}
      <div>
        <h3 className="font-semibold text-sm text-ink mb-3">Bedrooms</h3>
        <div className="flex flex-wrap gap-2">
          {['Any', 'Studio', '1', '2', '3', '4+'].map(b => (
            <button
              key={b}
              onClick={() => setBedrooms(b === 'Any' ? '' : b)}
              className={`px-3 py-1.5 rounded-btn text-sm font-medium border transition-colors ${
                (b === 'Any' && !bedrooms) || bedrooms === b
                  ? 'bg-orange text-white border-orange'
                  : 'bg-white text-ink border-gray-200 hover:border-orange'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-semibold text-sm text-ink mb-3">Price per Night (EGP)</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            className="w-full border border-gray-200 rounded-btn px-3 py-2 text-sm outline-none focus:border-orange"
          />
          <span className="text-ink/40">–</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            className="w-full border border-gray-200 rounded-btn px-3 py-2 text-sm outline-none focus:border-orange"
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-semibold text-sm text-ink mb-3">Amenities</h3>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map(a => (
            <label key={a} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                className="rounded border-gray-300 text-orange focus:ring-orange"
              />
              <span className="text-sm text-ink">{a}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Refund policy */}
      <div>
        <h3 className="font-semibold text-sm text-ink mb-3">Cancellation Policy</h3>
        <div className="space-y-2">
          {REFUND_POLICIES.map(p => (
            <label key={p.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="refund"
                value={p.value}
                checked={refundPolicy === p.value}
                onChange={() => setRefundPolicy(p.value)}
                className="text-orange focus:ring-orange"
              />
              <span className="text-sm text-ink">{p.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={clearFilters}
          className="flex-1 border border-gray-200 text-sm font-medium text-ink py-2.5 rounded-btn hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 bg-orange text-white text-sm font-semibold py-2.5 rounded-btn hover:bg-orange-dk transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 text-sm font-medium text-ink px-4 py-2 rounded-btn shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="bg-white rounded-card border border-gray-100 p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-base font-semibold">Filters</h2>
            <SlidersHorizontal className="w-4 h-4 text-ink/40" />
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  )
}
