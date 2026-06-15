'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'en' | 'ar'

interface LangContextType {
  lang: Lang
  isArabic: boolean
  toggleLang: () => void
  t: (en: string, ar: string) => string
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  isArabic: false,
  toggleLang: () => {},
  t: (en) => en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('bn-lang') as Lang
    if (saved === 'ar') {
      setLang('ar')
      document.documentElement.setAttribute('dir', 'rtl')
      document.documentElement.setAttribute('lang', 'ar')
    }
  }, [])

  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'ar' : 'en'
    setLang(next)
    localStorage.setItem('bn-lang', next)
    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', next)
  }

  const t = (en: string, ar: string) => lang === 'ar' ? ar : en

  return (
    <LangContext.Provider value={{ lang, isArabic: lang === 'ar', toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
