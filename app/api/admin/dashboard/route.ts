import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function requireAdminKey(request: Request): boolean {
  const key = request.headers.get('x-admin-key')
  return key === process.env.ADMIN_SECRET_KEY
}

export async function GET(request: Request) {
  if (!requireAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalListings,
    activeListings,
    totalBookings,
    confirmedBookings,
    pendingBookings,
    recentBookings,
    weekBookings,
    monthBookings,
    totalContacts,
    revenueAgg,
    monthRevenueAgg,
    topListings,
  ] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { isActive: true } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'confirmed' } }),
    prisma.booking.count({ where: { status: 'pending' } }),
    prisma.booking.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      include: { listing: { select: { title: true, area: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.booking.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.booking.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.contactSubmission.count(),
    prisma.booking.aggregate({
      where: { status: 'confirmed' },
      _sum: { totalPrice: true },
    }),
    prisma.booking.aggregate({
      where: { status: 'confirmed', createdAt: { gte: thirtyDaysAgo } },
      _sum: { totalPrice: true },
    }),
    prisma.listing.findMany({
      where: { isActive: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: { id: true, slug: true, title: true, viewCount: true, reviewCount: true, rating: true, area: true },
    }),
  ])

  return NextResponse.json({
    listings: { total: totalListings, active: activeListings },
    bookings: {
      total: totalBookings,
      confirmed: confirmedBookings,
      pending: pendingBookings,
      lastSevenDays: weekBookings,
      lastThirtyDays: monthBookings,
    },
    revenue: {
      allTime: revenueAgg._sum.totalPrice ?? 0,
      lastThirtyDays: monthRevenueAgg._sum.totalPrice ?? 0,
    },
    contacts: totalContacts,
    recentBookings,
    topListings,
  })
}
