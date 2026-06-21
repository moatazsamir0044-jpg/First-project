// Data-access layer for listings. Reads from the database when DATABASE_URL is
// configured; otherwise falls back to mock data so the site works as a demo.
// Booking validation goes through getListingById so prices/capacity are always
// verified server-side against the source of truth.

import { isDbConfigured } from './env'
import { mockListings, type Listing } from './mock-data'

export async function getListingById(id: string): Promise<Listing | null> {
  if (isDbConfigured()) {
    const { prisma } = await import('./prisma')
    const row = await prisma.listing.findUnique({ where: { id } })
    return (row as unknown as Listing) ?? null
  }
  return mockListings.find((l) => l.id === id) ?? null
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  if (isDbConfigured()) {
    const { prisma } = await import('./prisma')
    const row = await prisma.listing.findUnique({ where: { slug } })
    return (row as unknown as Listing) ?? null
  }
  return mockListings.find((l) => l.slug === slug) ?? null
}

export async function getActiveListings(): Promise<Listing[]> {
  if (isDbConfigured()) {
    const { prisma } = await import('./prisma')
    const rows = await prisma.listing.findMany({ where: { isActive: true } })
    return rows as unknown as Listing[]
  }
  return mockListings.filter((l) => l.isActive)
}
