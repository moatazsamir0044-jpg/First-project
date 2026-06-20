import { type Listing } from '@/lib/mock-data'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birdnestlife.com'

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
        '@id': `${siteUrl}/listings/${listing.slug}#lodging`,
        name: listing.title,
        description: listing.description,
        url: `${siteUrl}/listings/${listing.slug}`,
        image: listing.images.map((url, i) => ({
          '@type': 'ImageObject',
          url,
          position: i + 1,
        })),
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
        review: reviews.slice(0, 5).map(r => ({
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
          author: { '@type': 'Person', name: r.authorName },
          reviewBody: r.comment,
          datePublished: new Date(r.createdAt).toISOString().split('T')[0],
        })),
        numberOfRooms: listing.bedrooms || 1,
        amenityFeature: listing.amenities.map(a => ({
          '@type': 'LocationFeatureSpecification',
          name: a,
          value: true,
        })),
        makesOffer: {
          '@type': 'Offer',
          price: listing.pricePerNight,
          priceCurrency: 'EGP',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: listing.pricePerNight,
            priceCurrency: 'EGP',
            unitCode: 'DAY',
          },
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'BirdNest',
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Listings', item: `${siteUrl}/listings` },
          { '@type': 'ListItem', position: 3, name: listing.area, item: `${siteUrl}/listings?location=${encodeURIComponent(listing.area.toLowerCase())}` },
          { '@type': 'ListItem', position: 4, name: listing.title, item: `${siteUrl}/listings/${listing.slug}` },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
