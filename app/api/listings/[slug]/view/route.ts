import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  await prisma.listing.updateMany({
    where: { slug: params.slug, isActive: true },
    data: { viewCount: { increment: 1 } },
  })
  return NextResponse.json({ ok: true })
}
