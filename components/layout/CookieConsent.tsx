'use client'
import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('birdnest-cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('birdnest-cookie-consent', 'accepted')
    setVisible(false)
    // Enable analytics
    const w = window as Window & { gtag?: (...args: unknown[]) => void }
    if (typeof window !== 'undefined' && w.gtag) {
      w.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' })
    }
  }

  const decline = () => {
    localStorage.setItem('birdnest-cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-white p-5 md:p-6">
      <div className="container-site flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-white/90 leading-relaxed">
            We use cookies to personalise your experience, remember preferences, and show relevant ads.
            By clicking "Accept All", you agree to our{' '}
            <a href="/cookies" className="underline hover:text-orange transition-colors">Cookie Policy</a>.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-sm font-medium text-white/60 hover:text-white px-4 py-2 border border-white/20 rounded-btn transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-sm font-semibold bg-orange text-white px-5 py-2 rounded-btn hover:bg-orange-dk transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
