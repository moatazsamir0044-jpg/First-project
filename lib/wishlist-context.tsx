'use client'
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface WishlistContextValue {
  wishlist: string[]
  compareList: string[]
  toggle: (id: string) => void
  isWishlisted: (id: string) => boolean
  toggleCompare: (id: string) => void
  isCompared: (id: string) => boolean
  clearCompare: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

const STORAGE_KEY = 'birdnest_wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [compareList, setCompareList] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setWishlist(JSON.parse(stored))
    } catch {}
  }, [])

  const toggle = useCallback((id: string) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      // Remove from compare if unliked
      if (prev.includes(id)) {
        setCompareList(c => c.filter(x => x !== id))
      }
      return next
    })
  }, [])

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist])

  const toggleCompare = useCallback((id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3) return prev // max 3 comparisons
      return [...prev, id]
    })
  }, [])

  const isCompared = useCallback((id: string) => compareList.includes(id), [compareList])

  const clearCompare = useCallback(() => setCompareList([]), [])

  return (
    <WishlistContext.Provider value={{ wishlist, compareList, toggle, isWishlisted, toggleCompare, isCompared, clearCompare }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
