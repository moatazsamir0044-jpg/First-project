import { NextResponse } from 'next/server'
import { getActiveListings } from '@/lib/listings'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const guests = searchParams.get('guests')

  let listings = await getActiveListings()

  if (area) {
    listings = listings.filter(l =>
      l.area.toLowerCase().includes(area.toLowerCase()) ||
      l.location.toLowerCase().includes(area.toLowerCase())
    )
  }
  if (minPrice) listings = listings.filter(l => l.pricePerNight >= Number(minPrice))
  if (maxPrice) listings = listings.filter(l => l.pricePerNight <= Number(maxPrice))
  if (guests) listings = listings.filter(l => l.maxGuests >= Number(guests))

  return NextResponse.json({ listings, total: listings.length })
}
