import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function requireAdminKey(request: Request): boolean {
  return request.headers.get('x-admin-key') === process.env.ADMIN_SECRET_KEY
}

export async function GET(request: Request) {
  if (!requireAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const skip = (page - 1) * limit
  const status = searchParams.get('status')
  const listingId = searchParams.get('listingId')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (listingId) where.listingId = listingId
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    }
  }

  const [bookings, total, revenueAgg] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { listing: { select: { title: true, slug: true, area: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
    prisma.booking.aggregate({
      where: { ...where, status: 'confirmed' },
      _sum: { totalPrice: true },
    }),
  ])

  return NextResponse.json({
    bookings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    revenue: revenueAgg._sum.totalPrice ?? 0,
  })
}
