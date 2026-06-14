import { NextResponse } from 'next/server'
import { mockListings } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.toLowerCase() || ''

  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  const results = mockListings.filter(l =>
    l.title.toLowerCase().includes(q) ||
    l.location.toLowerCase().includes(q) ||
    l.area.toLowerCase().includes(q) ||
    l.description.toLowerCase().includes(q)
  ).slice(0, 8).map(l => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    location: l.location,
    area: l.area,
    image: l.images[0],
    pricePerNight: l.pricePerNight,
  }))

  return NextResponse.json({ results })
}
