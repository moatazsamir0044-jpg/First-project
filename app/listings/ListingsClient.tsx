'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import ListingCard from '@/components/listings/ListingCard'
import { mockListings } from '@/lib/mock-data'

const LOCATIONS = ['New Cairo', 'North Coast', 'El Gouna', 'Sheikh Zayed']
const AMENITIES = ['Pool', 'Gym', 'Beach Access', 'Beachfront', 'Workspace', 'Parking', 'Sea View', 'Kids Area', 'BBQ', 'Pet Friendly']

interface ListingsClientProps {
  defaultLocation: string
  defaultCheckIn: string
  defaultCheckOut: string
  defaultGuests: number
}

export default function ListingsClient({ defaultLocation, defaultCheckIn, defaultCheckOut, defaultGuests }: ListingsClientProps) {
  const router = useRouter()

  const [location, setLocation] = useState(defaultLocation)
  const [checkIn, setCheckIn] = useState(defaultCheckIn)
  const [checkOut, setCheckOut] = useState(defaultCheckOut)
  const [guests, setGuests] = useState(defaultGuests)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('popular')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    const merged = { location, checkIn, checkOut, guests: String(guests), ...updates }
    Object.entries(merged).forEach(([k, v]) => { if (v && v !== '1') params.set(k, v) })
    router.replace(`/listings${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  let filtered = mockListings.filter(l => {
    if (location && !l.area.toLowerCase().includes(location.toLowerCase()) &&
        !l.location.toLowerCase().includes(location.toLowerCase())) return false
    if (guests && l.maxGuests < guests) return false
    if (l.pricePerNight > maxPrice) return false
    if (selectedAmenities.length > 0 && !selectedAmenities.every(a => l.amenities.includes(a))) return false
    return true
  })

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.pricePerNight - b.pricePerNight)
  else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.pricePerNight - a.pricePerNight)
  else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)

  const clearAll = () => {
    setLocation(''); setCheckIn(''); setCheckOut(''); setGuests(1); setSelectedAmenities([])
    router.replace('/listings')
  }

  const inputClass = 'w-full border border-gray-200 rounded-btn px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] transition-colors'

  return (
    <main className="min-h-screen bg-[var(--color-ground)]">
      {/* Page header */}
      <div className="bg-white border-b border-[#e6dbcf] py-8">
        <div className="container-site">
          <h1
            className="text-3xl text-[var(--color-text)] mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Apartments &amp; Holiday Homes in Egypt
          </h1>
          <p className="text-[var(--color-text)]/60 text-sm mt-1">
            {filtered.length} nest{filtered.length !== 1 ? 's' : ''} found
            {location ? ` in ${location}` : ''}
            {guests > 1 ? ` · ${guests} guests` : ''}
          </p>
        </div>
      </div>

      <div className="container-site py-8">
        {/* Mobile filter toggle */}
        <button
          className="lg:hidden w-full flex items-center justify-between bg-white border border-gray-200 rounded-btn px-4 py-3 text-sm font-semibold text-[var(--color-text)] mb-4"
          onClick={() => setFiltersOpen(o => !o)}
          aria-expanded={filtersOpen}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-72 shrink-0 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-card border border-gray-100 p-6 space-y-6 lg:sticky lg:top-24">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)]/50 uppercase tracking-wider mb-2">
                  Location
                </label>
                <select
                  value={location}
                  onChange={e => { setLocation(e.target.value); updateURL({ location: e.target.value }) }}
                  className={inputClass}
                >
                  <option value="">All Egypt</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)]/50 uppercase tracking-wider mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => { setCheckIn(e.target.value); updateURL({ checkIn: e.target.value }) }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)]/50 uppercase tracking-wider mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => { setCheckOut(e.target.value); updateURL({ checkOut: e.target.value }) }}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)]/50 uppercase tracking-wider mb-2">
                  Guests
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { const v = Math.max(1, guests - 1); setGuests(v); updateURL({ guests: String(v) }) }}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)]"
                    aria-label="Decrease guests"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-[var(--color-text)] w-6 text-center">{guests}</span>
                  <button
                    onClick={() => { const v = guests + 1; setGuests(v); updateURL({ guests: String(v) }) }}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)]"
                    aria-label="Increase guests"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)]/50 uppercase tracking-wider mb-2">
                  Max Price (EGP/night)
                </label>
                <input
                  type="range"
                  min={500}
                  max={10000}
                  step={100}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[var(--color-accent-primary)]"
                />
                <div className="flex justify-between text-xs text-[var(--color-text)]/50 mt-1">
                  <span>EGP 500</span>
                  <span className="font-semibold text-[var(--color-text)]">EGP {maxPrice.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)]/50 uppercase tracking-wider mb-3">
                  Amenities
                </label>
                <div className="space-y-2">
                  {AMENITIES.map(amenity => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded accent-[var(--color-accent-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)]"
                      />
                      <span className="text-sm text-[var(--color-text)]/70 group-hover:text-[var(--color-text)] transition-colors">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {(location || checkIn || checkOut || guests > 1 || selectedAmenities.length > 0) && (
                <button
                  onClick={clearAll}
                  className="w-full text-sm text-[var(--color-accent-primary)] hover:underline py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)]"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[var(--color-text)]/60 font-medium">
                {filtered.length} nests found
              </p>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-btn px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent-primary)] bg-white focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)]"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3
                  className="text-2xl text-[var(--color-text)] mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  No nests found
                </h3>
                <p className="text-[var(--color-text)]/60 mb-6">Try adjusting your filters.</p>
                <button
                  onClick={clearAll}
                  className="bg-[var(--color-accent-primary)] text-white px-6 py-3 rounded-btn font-semibold hover:bg-[var(--color-accent-primary-dk)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    guests={guests}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
