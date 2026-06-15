'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isArabic, setIsArabic] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('bn-lang')
    if (saved === 'ar') {
      setIsArabic(true)
      document.documentElement.setAttribute('dir', 'rtl')
      document.documentElement.setAttribute('lang', 'ar')
    }
  }, [])

  const toggleLanguage = () => {
    const next = !isArabic
    setIsArabic(next)
    localStorage.setItem('bn-lang', next ? 'ar' : 'en')
    document.documentElement.setAttribute('dir', next ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', next ? 'ar' : 'en')
  }

  const navLinks = isArabic
    ? [
        { href: '/listings', label: 'تصفح العقارات' },
        { href: '/how-it-works', label: 'كيف يعمل' },
        { href: '/blog', label: 'المدونة' },
        { href: '/about', label: 'من نحن' },
        { href: '/contact', label: 'تواصل معنا' },
      ]
    : [
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
          <span className="font-heading text-xl font-semibold text-[#292a2b]">BirdNest</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[#292a2b]/70 hover:text-[#f4603d] transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="text-sm font-medium text-[#292a2b]/60 hover:text-[#292a2b] px-3 py-1.5 border border-gray-200 rounded-full transition-colors"
          >
            {isArabic ? 'EN' : 'عربي'}
          </button>
          <Link href="/contact?type=list" className="text-sm font-semibold text-[#237c58] hover:text-[#1b6044] transition-colors">
            {isArabic ? 'أضف عقارك' : 'List Your Property'}
          </Link>
          <Link href="/listings" className="bg-[#f4603d] text-white text-sm font-semibold px-4 py-2 rounded-[12px] hover:bg-[#dd4f2e] transition-colors">
            {isArabic ? 'ابحث عن عشك' : 'Find a Nest'}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-[#292a2b]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-base font-medium text-[#292a2b] py-1" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={toggleLanguage} className="text-sm font-medium text-[#292a2b]/60 px-3 py-1.5 border border-gray-200 rounded-full">
              {isArabic ? 'EN' : 'عربي'}
            </button>
            <Link href="/contact?type=list" className="text-sm font-semibold text-[#237c58]" onClick={() => setMobileOpen(false)}>
              {isArabic ? 'أضف عقارك' : 'List Property'}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
