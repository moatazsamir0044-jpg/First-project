import { NextResponse } from 'next/server'
import { getActiveListings } from '@/lib/listings'

export async function GET() {
  const listings = await getActiveListings()
  const allAmenities = listings.flatMap(l => l.amenities)
  const unique = [...new Set(allAmenities)].sort()
  return NextResponse.json(unique)
}
