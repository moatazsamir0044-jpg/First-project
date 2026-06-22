import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  return NextResponse.json(listing)
}
