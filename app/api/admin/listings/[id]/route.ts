import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

function requireAdminKey(request: Request): boolean {
  return request.headers.get('x-admin-key') === process.env.ADMIN_SECRET_KEY
}

const updateSchema = z.object({
  title: z.string().min(2).max(300).optional(),
  titleAr: z.string().min(2).max(300).optional(),
  description: z.string().min(10).optional(),
  descriptionAr: z.string().min(10).optional(),
  location: z.string().min(2).optional(),
  area: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  pricePerNight: z.number().int().positive().optional(),
  utilitiesEst: z.number().int().min(0).optional(),
  cleaningFee: z.number().int().min(0).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(1).optional(),
  maxGuests: z.number().int().min(1).optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  refundPolicy: z.enum(['flexible', 'moderate', 'non-refundable']).optional(),
  eligibility: z.enum(['all', 'families', 'couples', 'professionals']).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!requireAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      bookings: { orderBy: { createdAt: 'desc' }, take: 20 },
      reviews: { orderBy: { createdAt: 'desc' }, take: 20 },
      _count: { select: { bookings: true, reviews: true } },
    },
  })

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  return NextResponse.json(listing)
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!requireAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const listing = await prisma.listing.update({
    where: { id: params.id },
    data: parsed.data,
  })

  return NextResponse.json(listing)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!requireAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Soft delete — deactivate instead of destroying
  await prisma.listing.update({
    where: { id: params.id },
    data: { isActive: false },
  })

  return NextResponse.json({ success: true })
}
