import { NextResponse } from 'next/server'
import { mockListings } from '@/lib/mock-data'

export async function GET() {
  try {
    // Get all unique amenities from all listings
    const allAmenities = mockListings.flatMap(l => l.amenities)
    const unique = [...new Set(allAmenities)].sort()
    return NextResponse.json(unique)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
