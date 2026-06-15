'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useLang } from '@/lib/language-context'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isArabic, toggleLang } = useLang()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'} border-b border-gray-100`}>
      <div className="container-site flex items-center justify-between h-24">
        <Link href="/" className="flex items-center">
          <Image src="/images/logos/logo-dark.png" alt="BirdNest" width={200} height={200} className="h-20 w-auto" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[#292a2b]/70 hover:text-[#f4603d] transition-colors font-body">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleLang} className="text-sm font-medium text-[#292a2b]/60 hover:text-[#292a2b] px-3 py-1.5 border border-gray-200 rounded-full transition-colors">
            {isArabic ? 'EN' : 'عربي'}
          </button>
          <Link href="/contact?type=list" className="text-sm font-semibold text-[#237c58] hover:text-[#1b6044] transition-colors">
            {isArabic ? 'أضف عقارك' : 'List Your Property'}
          </Link>
          <Link href="/listings" className="bg-[#f4603d] text-white text-sm font-semibold px-4 py-2 rounded-[12px] hover:bg-[#dd4f2e] transition-colors">
            {isArabic ? 'ابحث عن عشك' : 'Find a Nest'}
          </Link>
        </div>

        <button className="md:hidden p-2 text-[#292a2b]" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-base font-medium text-[#292a2b] py-1" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={toggleLang} className="text-sm font-medium text-[#292a2b]/60 px-3 py-1.5 border border-gray-200 rounded-full">
              {isArabic ? 'EN' : 'عربي'}
            </button>
            <Link href="/listings" className="bg-[#f4603d] text-white text-sm font-semibold px-4 py-2 rounded-[12px] hover:bg-[#dd4f2e] transition-colors" onClick={() => setMobileOpen(false)}>
              {isArabic ? 'ابحث' : 'Find a Nest'}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
