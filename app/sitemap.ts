import { MetadataRoute } from 'next'
import { mockListings } from '@/lib/mock-data'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birdnestlife.com'

const BLOG_SLUGS = [
  'best-neighbourhoods-new-cairo',
  'marassi-vs-fouka-bay',
  'el-gouna-guide',
  'birdnest-vs-airbnb-egypt',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const listingEntries: MetadataRoute.Sitemap = mockListings
    .filter(l => l.isActive !== false)
    .map(l => ({
      url: `${baseUrl}/listings/${l.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const arEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/ar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ar/listings`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/ar/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/ar/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/ar/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/ar/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/listings`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...blogEntries,
    ...listingEntries,
    ...arEntries,
  ]
}
