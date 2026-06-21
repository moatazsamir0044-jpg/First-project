import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

function requireAdminKey(request: Request): boolean {
  return request.headers.get('x-admin-key') === process.env.ADMIN_SECRET_KEY
}

const listingSchema = z.object({
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(300),
  titleAr: z.string().min(2).max(300),
  description: z.string().min(10),
  descriptionAr: z.string().min(10),
  location: z.string().min(2),
  area: z.string().min(2),
  city: z.string().min(2),
  pricePerNight: z.number().int().positive(),
  utilitiesEst: z.number().int().min(0),
  cleaningFee: z.number().int().min(0),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(1),
  maxGuests: z.number().int().min(1),
  amenities: z.array(z.string()),
  images: z.array(z.string().url()),
  refundPolicy: z.enum(['flexible', 'moderate', 'non-refundable']),
  eligibility: z.enum(['all', 'families', 'couples', 'professionals']),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean().optional().default(true),
})

export async function GET(request: Request) {
  if (!requireAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const skip = (page - 1) * limit
  const isActive = searchParams.get('isActive')

  const where = isActive !== null ? { isActive: isActive !== 'false' } : {}

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { _count: { select: { bookings: true, reviews: true } } },
    }),
    prisma.listing.count({ where }),
  ])

  return NextResponse.json({ listings, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(request: Request) {
  if (!requireAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = listingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.listing.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
  }

  const listing = await prisma.listing.create({ data: parsed.data })
  return NextResponse.json(listing, { status: 201 })
}
