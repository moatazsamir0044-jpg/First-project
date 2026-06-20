'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/language-context'

const DESTINATIONS = [
  { value: '', label: 'All Egypt' },
  { value: 'New Cairo', label: 'New Cairo' },
  { value: 'North Coast', label: 'North Coast / Sahel' },
  { value: 'El Gouna', label: 'El Gouna' },
  { value: 'Sheikh Zayed', label: 'Sheikh Zayed' },
]

const TODAY = new Date().toISOString().split('T')[0]
const DEFAULT_CHECKIN = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
const DEFAULT_CHECKOUT = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]

export default function SearchWidget() {
  const router = useRouter()
  const { isArabic } = useLang()
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState(DEFAULT_CHECKIN)
  const [checkOut, setCheckOut] = useState(DEFAULT_CHECKOUT)
  const [guests, setGuests] = useState(2)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('guests', String(guests))
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-[16px] shadow-xl p-2 md:p-3 flex flex-col md:flex-row gap-2">
      <div className="flex-1 px-4 py-3 rounded-[12px] hover:bg-gray-50 transition-colors">
        <label className="block text-xs font-semibold text-[#292a2b]/50 uppercase tracking-wider mb-1">
          {isArabic ? 'الوجهة' : 'Destination'}
        </label>
        <select
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full text-sm font-medium text-[#292a2b] bg-transparent outline-none cursor-pointer"
        >
          {DESTINATIONS.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      <div className="hidden md:block w-px bg-gray-200" />

      <div className="flex-1 px-4 py-3 rounded-[12px] hover:bg-gray-50 transition-colors">
        <label className="block text-xs font-semibold text-[#292a2b]/50 uppercase tracking-wider mb-1">
          {isArabic ? 'تاريخ الوصول' : 'Check-in'}
        </label>
        <input
          type="date"
          value={checkIn}
          min={TODAY}
          onChange={e => setCheckIn(e.target.value)}
          className="w-full text-sm font-medium text-[#292a2b] bg-transparent outline-none cursor-pointer"
        />
      </div>

      <div className="hidden md:block w-px bg-gray-200" />

      <div className="flex-1 px-4 py-3 rounded-[12px] hover:bg-gray-50 transition-colors">
        <label className="block text-xs font-semibold text-[#292a2b]/50 uppercase tracking-wider mb-1">
          {isArabic ? 'تاريخ المغادرة' : 'Check-out'}
        </label>
        <input
          type="date"
          value={checkOut}
          min={checkIn || TODAY}
          onChange={e => setCheckOut(e.target.value)}
          className="w-full text-sm font-medium text-[#292a2b] bg-transparent outline-none cursor-pointer"
        />
      </div>

      <div className="hidden md:block w-px bg-gray-200" />

      <div className="flex-1 px-4 py-3 rounded-[12px] hover:bg-gray-50 transition-colors">
        <label className="block text-xs font-semibold text-[#292a2b]/50 uppercase tracking-wider mb-1">
          {isArabic ? 'الضيوف' : 'Guests'}
        </label>
        <div className="flex items-center gap-3">
          <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 md:w-7 md:h-7 rounded-full border border-gray-300 flex items-center justify-center text-[#292a2b] hover:border-[#f4603d] hover:text-[#f4603d] transition-colors font-bold text-lg leading-none">−</button>
          <span className="text-sm font-semibold text-[#292a2b] w-4 text-center">{guests}</span>
          <button onClick={() => setGuests(Math.min(20, guests + 1))} className="w-10 h-10 md:w-7 md:h-7 rounded-full border border-gray-300 flex items-center justify-center text-[#292a2b] hover:border-[#f4603d] hover:text-[#f4603d] transition-colors font-bold text-lg leading-none">+</button>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="bg-[#f4603d] hover:bg-[#dd4f2e] text-white font-semibold px-8 py-4 rounded-[12px] transition-colors whitespace-nowrap flex items-center gap-2 justify-center"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        {isArabic ? 'ابحث الآن' : 'Find Your Nest'}
      </button>
    </div>
  )
}
