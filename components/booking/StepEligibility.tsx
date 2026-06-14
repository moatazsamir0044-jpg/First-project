'use client'
import { useState } from 'react'

interface StepEligibilityProps {
  eligibility: string
  onNext: (type: string) => void
  onBack: () => void
}

const ELIGIBILITY_OPTIONS = [
  { value: 'family', label: 'Family', description: 'Travelling with family members (married couple + children/relatives)' },
  { value: 'couple', label: 'Couple', description: 'Married or engaged couple' },
  { value: 'individual', label: 'Individual', description: 'Solo traveller' },
  { value: 'group', label: 'Group', description: 'Friends or colleagues (may require additional verification)' },
]

export default function StepEligibility({ eligibility, onNext, onBack }: StepEligibilityProps) {
  const [selected, setSelected] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  const handleNext = () => {
    if (!selected) { setError('Please select your group type'); return }
    if (!agreed) { setError('Please confirm you meet the property requirements'); return }
    setError('')
    onNext(selected)
  }

  return (
    <div className="space-y-5">
      <h2 className="font-heading text-xl font-semibold text-ink">Eligibility Confirmation</h2>
      <p className="text-sm text-ink/60">
        Egyptian law requires property owners to verify guest eligibility. Please select your group type.
      </p>

      <div className="space-y-3">
        {ELIGIBILITY_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className={`flex items-start gap-3 p-4 rounded-card border-2 cursor-pointer transition-colors ${
              selected === opt.value ? 'border-orange bg-orange/5' : 'border-gray-200 hover:border-orange/40'
            }`}
          >
            <input
              type="radio"
              name="eligibility"
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => { setSelected(opt.value); setError('') }}
              className="mt-0.5 text-orange focus:ring-orange"
            />
            <div>
              <p className="font-semibold text-sm text-ink">{opt.label}</p>
              <p className="text-xs text-ink/60 mt-0.5">{opt.description}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="p-4 bg-sky/40 rounded-card text-sm text-ink/70 leading-relaxed">
        <p className="font-semibold text-ink mb-1">Important Notice</p>
        <p>You may be asked to present a valid ID and proof of relationship at check-in. Misrepresentation may result in cancellation without refund.</p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => { setAgreed(e.target.checked); setError('') }}
          className="mt-0.5 rounded text-orange focus:ring-orange"
        />
        <span className="text-sm text-ink/70">
          I confirm that I meet the eligibility requirements for this property and agree to present valid identification upon request.
        </span>
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 border border-gray-200 text-sm font-medium text-ink py-3 rounded-btn hover:bg-gray-50 transition-colors">Back</button>
        <button onClick={handleNext} className="flex-1 bg-orange text-white text-sm font-semibold py-3 rounded-btn hover:bg-orange-dk transition-colors">Continue to Payment</button>
      </div>
    </div>
  )
}
