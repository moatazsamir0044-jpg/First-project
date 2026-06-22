import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url)
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')

  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: 'checkIn and checkOut are required' }, { status: 400 })
  }

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return NextResponse.json({ error: 'Invalid dates' }, { status: 400 })
  }

  if (checkInDate >= checkOutDate) {
    return NextResponse.json({ error: 'checkOut must be after checkIn' }, { status: 400 })
  }

  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug, isActive: true },
    select: { id: true },
  })

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  const conflictingBookings = await prisma.booking.count({
    where: {
      listingId: listing.id,
      status: { in: ['pending', 'confirmed'] },
      AND: [
        { checkIn: { lt: checkOutDate } },
        { checkOut: { gt: checkInDate } },
      ],
    },
  })

  return NextResponse.json({ available: conflictingBookings === 0 })
}
