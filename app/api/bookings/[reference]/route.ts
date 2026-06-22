import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { reference: string } }
) {
  const booking = await prisma.booking.findUnique({
    where: { reference: params.reference },
    include: {
      listing: {
        select: { title: true, slug: true, images: true, area: true, location: true },
      },
    },
  })

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  return NextResponse.json(booking)
}

export async function PATCH(
  request: Request,
  { params }: { params: { reference: string } }
) {
  const body = await request.json()
  const { status } = body

  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const booking = await prisma.booking.update({
    where: { reference: params.reference },
    data: { status },
  })

  return NextResponse.json(booking)
}
