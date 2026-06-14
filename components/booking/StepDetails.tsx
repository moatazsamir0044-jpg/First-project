'use client'
import { useState } from 'react'

interface GuestDetails {
  name: string
  email: string
  phone: string
  specialRequests: string
}

interface StepDetailsProps {
  onNext: (details: GuestDetails) => void
  onBack: () => void
  initial?: Partial<GuestDetails>
}

export default function StepDetails({ onNext, onBack, initial = {} }: StepDetailsProps) {
  const [form, setForm] = useState<GuestDetails>({
    name: initial.name || '',
    email: initial.email || '',
    phone: initial.phone || '',
    specialRequests: initial.specialRequests || '',
  })
  const [errors, setErrors] = useState<Partial<GuestDetails>>({})

  const validate = () => {
    const e: Partial<GuestDetails> = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) onNext(form)
  }

  const inputClass = (field: keyof GuestDetails) =>
    `w-full border ${errors[field] ? 'border-red-400' : 'border-gray-200'} rounded-btn px-4 py-3 text-sm outline-none focus:border-orange transition-colors`

  return (
    <div className="space-y-5">
      <h2 className="font-heading text-xl font-semibold text-ink">Guest Details</h2>
      <p className="text-sm text-ink/60">Please provide your details for the booking confirmation.</p>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Full Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="As it appears on your ID"
          className={inputClass('name')}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Email Address *</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="For booking confirmation"
          className={inputClass('email')}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">WhatsApp / Phone *</label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          placeholder="+20 1xx xxx xxxx"
          className={inputClass('phone')}
        />
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        <p className="text-xs text-ink/40 mt-1">We'll send your check-in details via WhatsApp</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Special Requests (optional)</label>
        <textarea
          value={form.specialRequests}
          onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))}
          placeholder="Any accessibility needs, early check-in requests, etc."
          rows={3}
          className="w-full border border-gray-200 rounded-btn px-4 py-3 text-sm outline-none focus:border-orange transition-colors resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-200 text-sm font-medium text-ink py-3 rounded-btn hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-orange text-white text-sm font-semibold py-3 rounded-btn hover:bg-orange-dk transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
