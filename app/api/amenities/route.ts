import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const listings = await prisma.listing.findMany({
    where: { isActive: true },
    select: { amenities: true },
  })

  const all = listings.flatMap((l: { amenities: string[] }) => l.amenities)
  const unique = [...new Set(all)].sort()

  return NextResponse.json(unique)
}
