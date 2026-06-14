'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { clsx } from 'clsx'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState<'en' | 'ar'>('en')

  const navLinks = [
    { href: '/listings', label: 'Browse Nests' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="container-site flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="group-hover:scale-105 transition-transform">
            <circle cx="16" cy="16" r="16" fill="#f4603d"/>
            <path d="M16 8C12 8 9 11 9 14.5C9 17.5 11 19.5 13 21L16 24L19 21C21 19.5 23 17.5 23 14.5C23 11 20 8 16 8Z" fill="white"/>
            <circle cx="16" cy="13" r="2.5" fill="#f4603d"/>
            <path d="M13 20C13 20 10 17 9.5 15.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M19 20C19 20 22 17 22.5 15.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="font-heading text-xl font-semibold text-ink">BirdNest</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 hover:text-orange transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="text-sm font-medium text-ink/60 hover:text-ink px-2 py-1 border border-gray-200 rounded-pill transition-colors"
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <Link
            href="/contact?type=list"
            className="text-sm font-semibold text-green hover:text-green-dk transition-colors"
          >
            List Your Property
          </Link>
          <Link
            href="/listings"
            className="bg-orange text-white text-sm font-semibold px-4 py-2 rounded-btn hover:bg-orange-dk transition-colors"
          >
            Find a Nest
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-ink py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="text-sm font-medium text-ink/60 px-3 py-1.5 border border-gray-200 rounded-pill"
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            <Link
              href="/contact?type=list"
              className="text-sm font-semibold text-green"
              onClick={() => setMobileOpen(false)}
            >
              List Property
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
