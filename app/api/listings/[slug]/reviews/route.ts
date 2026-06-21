import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const reviewSchema = z.object({
  authorName: z.string().min(2).max(100),
  authorCountry: z.string().min(2).max(100),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(2000),
  source: z.string().optional().default('BirdNest'),
})

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const skip = (page - 1) * limit

  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  })

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { listingId: listing.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { listingId: listing.id } }),
  ])

  return NextResponse.json({ reviews, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const ip = getClientIp(request)
  if (!rateLimit(`review:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  })

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  const body = await request.json()
  const data = reviewSchema.safeParse(body)
  if (!data.success) {
    return NextResponse.json({ error: 'Invalid data', details: data.error.flatten() }, { status: 400 })
  }

  const review = await prisma.review.create({
    data: { listingId: listing.id, ...data.data },
  })

  // Recompute rating for listing
  const agg = await prisma.review.aggregate({
    where: { listingId: listing.id },
    _avg: { rating: true },
    _count: true,
  })

  await prisma.listing.update({
    where: { id: listing.id },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._count,
    },
  })

  return NextResponse.json(review, { status: 201 })
}
