'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Users, Search } from 'lucide-react'

const LOCATIONS = [
  { value: '', label: 'All Egypt' },
  { value: 'new-cairo', label: 'New Cairo' },
  { value: 'north-coast', label: 'North Coast' },
  { value: 'el-gouna', label: 'El Gouna' },
  { value: 'sheikh-zayed', label: 'Sheikh Zayed' },
]

export default function SearchWidget() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  const today = new Date().toISOString().split('T')[0]

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('area', location)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests > 1) params.set('guests', guests.toString())
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-card shadow-xl p-4 md:p-3">
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:divide-x divide-gray-200">
        {/* Location */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2">
          <MapPin className="w-5 h-5 text-orange shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-ink/50 mb-0.5">Destination</label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full text-sm font-medium text-ink bg-transparent outline-none cursor-pointer"
            >
              {LOCATIONS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Check-in */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2">
          <Calendar className="w-5 h-5 text-orange shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-ink/50 mb-0.5">Check-in</label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              className="w-full text-sm font-medium text-ink bg-transparent outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2">
          <Calendar className="w-5 h-5 text-orange shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-ink/50 mb-0.5">Check-out</label>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              className="w-full text-sm font-medium text-ink bg-transparent outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2">
          <Users className="w-5 h-5 text-orange shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-ink/50 mb-0.5">Guests</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests(g => Math.max(1, g - 1))}
                className="w-6 h-6 rounded-full bg-cream text-ink font-bold text-sm flex items-center justify-center hover:bg-orange hover:text-white transition-colors"
              >
                −
              </button>
              <span className="text-sm font-medium text-ink w-4 text-center">{guests}</span>
              <button
                onClick={() => setGuests(g => Math.min(20, g + 1))}
                className="w-6 h-6 rounded-full bg-cream text-ink font-bold text-sm flex items-center justify-center hover:bg-orange hover:text-white transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="px-3 py-2 flex items-center">
          <button
            onClick={handleSearch}
            className="bg-orange text-white font-semibold px-6 py-3 rounded-btn hover:bg-orange-dk active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap w-full md:w-auto justify-center"
          >
            <Search className="w-4 h-4" />
            Find Your Nest
          </button>
        </div>
      </div>
    </div>
  )
}
