'use client'
import Link from 'next/link'
import MashrabiyaPattern from '@/components/shared/MashrabiyaPattern'
import SearchWidget from './SearchWidget'
import { useLang } from '@/lib/language-context'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=85'

export default function Hero() {
  const { isArabic } = useLang()

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '92vh' }}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      {/* Darkening scrim */}
      <div className="absolute inset-0 bg-[var(--color-night)]/50" />

      {/* Mashrabiya shutter — wraps whole section, reveals on load */}
      <MashrabiyaPattern variant="shutter" tileSize={56} className="absolute inset-0" />

      {/* Content */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: '92vh' }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-4 py-2 rounded-pill mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            {isArabic ? '+500 عقار موثق في جميع أنحاء مصر' : '500+ verified properties across Egypt'}
          </p>

          <h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {isArabic ? (
              <>
                منزلك بعيداً عن{' '}
                <span style={{ color: 'var(--color-accent-primary)' }}>المنزل</span>{' '}
                في مصر
              </>
            ) : (
              <>
                Your Home Away From{' '}
                <span style={{ color: 'var(--color-accent-primary)' }}>Home</span>{' '}
                in Egypt
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mx-auto mb-10">
            {isArabic
              ? 'اكتشف شققاً مفروشة بالكامل وشاليهات في القاهرة الجديدة، الساحل الشمالي، الجونة والشيخ زايد.'
              : 'Discover fully-furnished apartments and chalets in New Cairo, North Coast, El Gouna & Sheikh Zayed. No surprises. No hidden fees.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/listings"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-btn font-semibold text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-primary)]"
              style={{ background: 'var(--color-accent-primary)', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-primary-dk)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent-primary)')}
            >
              {isArabic ? 'ابحث عن عقار' : 'Find a stay'}
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-btn font-semibold border-2 border-white/60 text-white backdrop-blur-sm transition-all hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
            >
              {isArabic ? 'ابدأ الحجز' : 'Start booking'}
            </Link>
          </div>

          {/* Search widget */}
          <div className="w-full max-w-4xl mx-auto">
            <SearchWidget />
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-wrap justify-center gap-4 md:gap-16 px-6">
          {(isArabic
            ? [
                { value: '+500', label: 'عقار موثق' },
                { value: '+10,000', label: 'ضيف سعيد' },
                { value: '★4.8', label: 'متوسط التقييم' },
                { value: '24/7', label: 'دعم باللغتين' },
              ]
            : [
                { value: '500+', label: 'Verified Properties' },
                { value: '10,000+', label: 'Happy Guests' },
                { value: '4.8★', label: 'Average Rating' },
                { value: '24/7', label: 'Arabic & English Support' },
              ]
          ).map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-lg md:text-2xl font-semibold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
