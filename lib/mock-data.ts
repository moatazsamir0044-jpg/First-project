export type Listing = {
  id: string
  slug: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  location: string
  area: string
  city: string
  pricePerNight: number
  utilitiesEst: number
  cleaningFee: number
  bedrooms: number
  bathrooms: number
  maxGuests: number
  amenities: string[]
  images: string[]
  rating: number
  reviewCount: number
  refundPolicy: string
  eligibility: string
  isActive: boolean
  lastBooked: Date | null
  viewCount: number
  latitude: number | null
  longitude: number | null
  createdAt: Date
  unitCode?: string
  view?: string
  sizeSqm?: number | null
  furnishCategory?: string | null
  bedConfigKing?: number
  bedConfigSingle?: number
  sourceUrl?: string
}

export type Review = {
  id: string
  listingId: string
  authorName: string
  authorCountry: string
  rating: number
  comment: string
  source: string
  createdAt: Date
}

export const mockListings: Listing[] = []

export const mockReviews: Review[] = []

export const destinations = [
  {
    id: 'new-cairo',
    name: 'New Cairo',
    nameAr: 'القاهرة الجديدة',
    description: 'Modern living in Cairo\'s most prestigious district',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&q=80',
    propertyCount: 0,
    slug: 'new-cairo',
  },
  {
    id: 'north-coast',
    name: 'North Coast',
    nameAr: 'الساحل الشمالي',
    description: 'Mediterranean beaches and luxury resorts',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    propertyCount: 0,
    slug: 'north-coast',
  },
  {
    id: 'el-gouna',
    name: 'El Gouna',
    nameAr: 'الجونة',
    description: 'The Venice of the Red Sea',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    propertyCount: 0,
    slug: 'el-gouna',
  },
  {
    id: 'sheikh-zayed',
    name: 'Sheikh Zayed',
    nameAr: 'الشيخ زايد',
    description: 'Upscale compounds and urban convenience',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    propertyCount: 0,
    slug: 'sheikh-zayed',
  },
]
