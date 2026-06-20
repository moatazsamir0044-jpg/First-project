'use client'
import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section className="py-16 bg-[#292a2b]">
      <div className="container-site max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold text-orange uppercase tracking-widest mb-3">Stay in the loop</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white mb-3">
          Get New Listings Before Anyone Else
        </h2>
        <p className="text-white/50 text-sm mb-8">
          New properties, seasonal deals, and destination guides — straight to your inbox. Unsubscribe anytime.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 bg-[#237c58]/20 border border-[#237c58]/30 rounded-card px-6 py-4">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#237c58]">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white font-medium">You're in! We'll be in touch soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-btn bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-orange transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange text-white font-semibold rounded-btn hover:bg-[#dd4f2e] transition-colors text-sm disabled:opacity-60 flex-shrink-0"
            >
              {loading ? 'Subscribing…' : 'Get Early Access'}
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-white/30">No spam. No sharing your data. Just the nests you'll love.</p>
      </div>
    </section>
  )
}
