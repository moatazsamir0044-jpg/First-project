import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''

  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  const listings = await prisma.listing.findMany({
    where: {
      isActive: true,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
        { area: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { titleAr: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      location: true,
      area: true,
      images: true,
      pricePerNight: true,
      rating: true,
      bedrooms: true,
    },
    take: 8,
    orderBy: { viewCount: 'desc' },
  })

  const results = listings.map(l => ({
    ...l,
    image: l.images[0] || null,
  }))

  return NextResponse.json({ results })
}
