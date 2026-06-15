'use client'
import { useState } from 'react'
import { ALL_COUNTRIES } from '@/lib/countries'

interface GuestDetails {
  name: string
  email: string
  phone: string
  nationality: string
  specialRequests: string
}

interface Props {
  onNext: (details: GuestDetails) => void
  onBack: () => void
  initial?: Partial<GuestDetails>
}

export default function StepDetails({ onNext, onBack, initial }: Props) {
  const [form, setForm] = useState<GuestDetails>({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    nationality: initial?.nationality || '',
    specialRequests: initial?.specialRequests || '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof GuestDetails, string>>>({})
  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryList, setShowCountryList] = useState(false)

  const filteredCountries = ALL_COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const validate = () => {
    const e: Partial<Record<keyof GuestDetails, string>> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.nationality) e.nationality = 'Nationality is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) onNext(form)
  }

  return (
    <div>
      <h2 className="font-heading text-2xl text-[#292a2b] mb-6">Your Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#292a2b] mb-1.5">Full Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="As on your ID"
            className={`w-full border ${errors.name ? 'border-red-400' : 'border-gray-200'} rounded-[10px] px-4 py-3 text-sm outline-none focus:border-[#f4603d] transition-colors`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#292a2b] mb-1.5">Email Address *</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className={`w-full border ${errors.email ? 'border-red-400' : 'border-gray-200'} rounded-[10px] px-4 py-3 text-sm outline-none focus:border-[#f4603d] transition-colors`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#292a2b] mb-1.5">Phone Number (WhatsApp) *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="+20 100 000 0000"
            className={`w-full border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-[10px] px-4 py-3 text-sm outline-none focus:border-[#f4603d] transition-colors`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-[#292a2b] mb-1.5">Nationality *</label>
          <input
            type="text"
            value={form.nationality || countrySearch}
            onChange={e => {
              if (!form.nationality) {
                setCountrySearch(e.target.value)
                setShowCountryList(true)
              }
            }}
            onFocus={() => { if (!form.nationality) setShowCountryList(true) }}
            onBlur={() => setTimeout(() => setShowCountryList(false), 150)}
            placeholder="Select your nationality"
            className={`w-full border ${errors.nationality ? 'border-red-400' : 'border-gray-200'} rounded-[10px] px-4 py-3 text-sm outline-none focus:border-[#f4603d] transition-colors`}
            readOnly={!!form.nationality}
          />
          {form.nationality && (
            <button
              type="button"
              onClick={() => { setForm({ ...form, nationality: '' }); setCountrySearch('') }}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 text-lg"
            >×</button>
          )}
          {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
          {showCountryList && !form.nationality && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-[10px] shadow-lg max-h-48 overflow-y-auto">
              {filteredCountries.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No countries found</div>
              ) : (
                filteredCountries.map(country => (
                  <button
                    key={country}
                    type="button"
                    onMouseDown={() => { setForm({ ...form, nationality: country }); setCountrySearch(country); setShowCountryList(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#292a2b] hover:bg-[#efe8e1] transition-colors"
                  >
                    {country}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#292a2b] mb-1.5">Special Requests <span className="font-normal text-[#292a2b]/40">(optional)</span></label>
          <textarea
            value={form.specialRequests}
            onChange={e => setForm({ ...form, specialRequests: e.target.value })}
            placeholder="Any special requirements, early check-in requests, etc."
            rows={3}
            className="w-full border border-gray-200 rounded-[10px] px-4 py-3 text-sm outline-none focus:border-[#f4603d] transition-colors resize-none"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="flex-1 border border-gray-200 text-[#292a2b] font-semibold py-3.5 rounded-[12px] hover:bg-gray-50 transition-colors">Back</button>
        <button onClick={handleSubmit} className="flex-1 bg-[#f4603d] hover:bg-[#dd4f2e] text-white font-semibold py-3.5 rounded-[12px] transition-colors">Continue</button>
      </div>
    </div>
  )
}
