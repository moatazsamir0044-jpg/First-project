import { type Listing } from '@/lib/mock-data'

interface SchemaMarkupProps {
  listing: Listing
  reviews: Array<{
    authorName: string
    authorCountry: string
    rating: number
    comment: string
    createdAt: Date | string
  }>
}

export default function SchemaMarkup({ listing, reviews }: SchemaMarkupProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LodgingBusiness',
        '@id': `https://birdnestlife.com/listings/${listing.slug}#lodging`,
        name: listing.title,
        description: listing.description,
        url: `https://birdnestlife.com/listings/${listing.slug}`,
        image: listing.images,
        address: {
          '@type': 'PostalAddress',
          addressLocality: listing.location,
          addressRegion: listing.area,
          addressCountry: 'EG',
        },
        ...(listing.latitude && listing.longitude && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: listing.latitude,
            longitude: listing.longitude,
          },
        }),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: listing.rating,
          reviewCount: listing.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
        numberOfRooms: listing.bedrooms || 1,
        amenityFeature: listing.amenities.map(a => ({
          '@type': 'LocationFeatureSpecification',
          name: a,
          value: true,
        })),
        priceRange: `EGP ${listing.pricePerNight}/night`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://birdnestlife.com' },
          { '@type': 'ListItem', position: 2, name: 'Listings', item: 'https://birdnestlife.com/listings' },
          { '@type': 'ListItem', position: 3, name: listing.title, item: `https://birdnestlife.com/listings/${listing.slug}` },
        ],
      },
      ...reviews.slice(0, 5).map(r => ({
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
        author: { '@type': 'Person', name: r.authorName },
        reviewBody: r.comment,
        datePublished: new Date(r.createdAt).toISOString().split('T')[0],
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
