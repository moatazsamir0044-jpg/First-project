import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const area = searchParams.get('area')
  const city = searchParams.get('city')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const guests = searchParams.get('guests')
  const bedrooms = searchParams.get('bedrooms')
  const amenities = searchParams.get('amenities')
  const refundPolicy = searchParams.get('refundPolicy')
  const eligibility = searchParams.get('eligibility')
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { isActive: true }

  if (area) where.area = { equals: area, mode: 'insensitive' }
  if (city) where.city = { equals: city, mode: 'insensitive' }
  if (minPrice || maxPrice) {
    where.pricePerNight = {
      ...(minPrice ? { gte: Number(minPrice) } : {}),
      ...(maxPrice ? { lte: Number(maxPrice) } : {}),
    }
  }
  if (guests) where.maxGuests = { gte: Number(guests) }
  if (bedrooms) where.bedrooms = { gte: Number(bedrooms) }
  if (refundPolicy) where.refundPolicy = refundPolicy
  if (eligibility) where.eligibility = { in: [eligibility, 'all'] }
  if (amenities) {
    const list = amenities.split(',').map(a => a.trim()).filter(Boolean)
    if (list.length) where.amenities = { hasEvery: list }
  }

  const validSortFields = ['pricePerNight', 'rating', 'viewCount', 'createdAt', 'lastBooked', 'reviewCount']
  const orderBy = validSortFields.includes(sortBy)
    ? { [sortBy]: sortDir }
    : { createdAt: 'desc' as const }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({ where, orderBy, skip, take: limit }),
    prisma.listing.count({ where }),
  ])

  return NextResponse.json({
    listings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: skip + listings.length < total,
  })
}
