'use client'
import { useState } from 'react'
import { formatPrice } from '@/lib/formatters'
import { type Listing } from '@/lib/mock-data'
import { Shield, CreditCard } from 'lucide-react'

interface StepPaymentProps {
  listing: Listing
  total: number
  onBack: () => void
  onComplete: () => void
}

export default function StepPayment({ total, onBack, onComplete }: StepPaymentProps) {
  const [method, setMethod] = useState<'card' | 'bank'>('card')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    onComplete()
  }

  return (
    <div className="space-y-5">
      <h2 className="font-heading text-xl font-semibold text-ink">Payment</h2>

      {/* Order summary */}
      <div className="flex items-center justify-between p-4 bg-cream rounded-card">
        <span className="text-sm text-ink/60">Total due today</span>
        <span className="font-heading text-xl font-semibold text-orange">{formatPrice(total)}</span>
      </div>

      {/* Payment method */}
      <div>
        <p className="text-sm font-medium text-ink mb-3">Payment Method</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMethod('card')}
            className={`p-4 rounded-card border-2 text-sm font-medium transition-colors flex items-center gap-2 ${
              method === 'card' ? 'border-orange bg-orange/5 text-ink' : 'border-gray-200 text-ink/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Card Payment
          </button>
          <button
            onClick={() => setMethod('bank')}
            className={`p-4 rounded-card border-2 text-sm font-medium transition-colors flex items-center gap-2 ${
              method === 'bank' ? 'border-orange bg-orange/5 text-ink' : 'border-gray-200 text-ink/60'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Bank Transfer
          </button>
        </div>
      </div>

      {method === 'card' ? (
        <div className="space-y-3 p-5 bg-white border border-gray-100 rounded-card">
          <div>
            <label className="block text-xs font-medium text-ink/50 mb-1.5">CARD NUMBER</label>
            <input type="text" placeholder="1234 5678 9012 3456" className="w-full border border-gray-200 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-orange" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink/50 mb-1.5">EXPIRY</label>
              <input type="text" placeholder="MM / YY" className="w-full border border-gray-200 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-orange" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/50 mb-1.5">CVV</label>
              <input type="text" placeholder="123" className="w-full border border-gray-200 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-orange" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink/50 mb-1.5">NAME ON CARD</label>
            <input type="text" placeholder="As on card" className="w-full border border-gray-200 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-orange" />
          </div>
        </div>
      ) : (
        <div className="p-5 bg-sky/30 rounded-card space-y-2 text-sm">
          <p className="font-semibold text-ink">Bank Transfer Details</p>
          <p className="text-ink/60">Bank: <span className="font-medium text-ink">CIB Egypt</span></p>
          <p className="text-ink/60">Account Name: <span className="font-medium text-ink">BirdNest Egypt LLC</span></p>
          <p className="text-ink/60">Account Number: <span className="font-medium text-ink">1234567890</span></p>
          <p className="text-ink/60">IBAN: <span className="font-medium text-ink">EG12 3456 7890 1234 5678 9012 34</span></p>
          <p className="text-xs text-ink/40 mt-3">After transfer, send proof of payment via WhatsApp to confirm your booking.</p>
        </div>
      )}

      {/* Security badge */}
      <div className="flex items-center gap-2 text-xs text-ink/40">
        <Shield className="w-4 h-4 text-green" />
        <span>Secured by 256-bit SSL encryption. Your payment data is never stored.</span>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 border border-gray-200 text-sm font-medium text-ink py-3 rounded-btn hover:bg-gray-50 transition-colors">Back</button>
        <button
          onClick={handlePay}
          disabled={loading}
          className="flex-1 bg-orange text-white text-sm font-semibold py-3 rounded-btn hover:bg-orange-dk transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Processing...
            </>
          ) : `Pay ${formatPrice(total)}`}
        </button>
      </div>
    </div>
  )
}
