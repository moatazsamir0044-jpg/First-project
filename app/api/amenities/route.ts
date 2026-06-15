import { NextResponse } from 'next/server'
import { mockListings } from '@/lib/mock-data'

export async function GET() {
  const allAmenities = mockListings.flatMap(l => l.amenities)
  const unique = [...new Set(allAmenities)].sort()
  return NextResponse.json(unique)
}
