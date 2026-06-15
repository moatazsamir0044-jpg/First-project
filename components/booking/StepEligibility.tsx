'use client'
import { useState } from 'react'
import { isArabNational, ELIGIBILITY_POLICY, VISITS_POLICY } from '@/lib/policies'

interface Props {
  eligibility: string
  nationality: string
  onNext: (type: string) => void
  onBack: () => void
}

export default function StepEligibility({ eligibility, nationality, onNext, onBack }: Props) {
  const [stayType, setStayType] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const arabNational = isArabNational(nationality)

  const stayTypes = [
    { value: 'couple', label: 'Married Couple' },
    { value: 'family', label: 'Family' },
    { value: 'single', label: 'Single Traveller' },
    { value: 'corporate', label: 'Corporate Guest' },
  ]

  return (
    <div>
      <h2 className="font-heading text-2xl text-[#292a2b] mb-2">Who Is Staying?</h2>
      <p className="text-[#292a2b]/60 text-sm mb-6">Please confirm who will be staying at this property.</p>

      <div className={`p-4 rounded-[12px] mb-6 border ${arabNational ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-start gap-3">
          <span className="text-xl">{arabNational ? '⚠️' : '✅'}</span>
          <div>
            <p className="text-sm font-semibold text-[#292a2b] mb-1">
              {arabNational ? 'Arab National — Marriage Certificate Required' : 'Non-Arab National — No Certificate Required'}
            </p>
            <p className="text-sm text-[#292a2b]/70">
              {arabNational ? ELIGIBILITY_POLICY.arabNational : ELIGIBILITY_POLICY.nonArab}
            </p>
          </div>
        </div>
      </div>

      {arabNational && (
        <div className="p-4 rounded-[12px] bg-blue-50 border border-blue-100 mb-6">
          <p className="text-xs font-semibold text-[#292a2b]/50 uppercase tracking-wider mb-1">Visits Policy</p>
          <p className="text-sm text-[#292a2b]/70">{VISITS_POLICY}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stayTypes.map(type => (
          <button
            key={type.value}
            onClick={() => setStayType(type.value)}
            className={`p-4 rounded-[12px] border-2 text-sm font-semibold transition-all text-left ${
              stayType === type.value
                ? 'border-[#f4603d] bg-orange-50 text-[#f4603d]'
                : 'border-gray-200 text-[#292a2b] hover:border-gray-300'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <label className="flex items-start gap-3 cursor-pointer mb-8">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={e => setConfirmed(e.target.checked)}
          className="mt-0.5 accent-[#f4603d]"
        />
        <span className="text-sm text-[#292a2b]/70 leading-relaxed">
          I confirm that I meet the eligibility requirements for this property and understand that documentation may be requested at check-in.
        </span>
      </label>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-gray-200 text-[#292a2b] font-semibold py-3.5 rounded-[12px] hover:bg-gray-50 transition-colors">Back</button>
        <button
          onClick={() => stayType && confirmed && onNext(stayType)}
          disabled={!stayType || !confirmed}
          className="flex-1 bg-[#f4603d] hover:bg-[#dd4f2e] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-[12px] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
