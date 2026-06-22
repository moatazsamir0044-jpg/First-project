import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const listingId = searchParams.get('listingId')
  const featured = searchParams.get('featured') === 'true'
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))

  const where = {
    ...(listingId ? { listingId } : {}),
    ...(featured ? { rating: { gte: 4.5 } } : {}),
  }

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      listing: { select: { title: true, slug: true, area: true } },
    },
  })

  return NextResponse.json({ reviews })
}
