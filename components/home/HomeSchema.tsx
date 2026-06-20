const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birdnestlife.com'

export default function HomeSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'BirdNest',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          '@id': `${siteUrl}/#logo`,
          url: `${siteUrl}/images/logos/logo-dark.png`,
          width: 200,
          height: 200,
          caption: 'BirdNest',
        },
        description: 'Egypt\'s trusted platform for serviced apartments and holiday homes. Verified properties in New Cairo, North Coast, El Gouna, and Sheikh Zayed.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          availableLanguage: ['English', 'Arabic'],
        },
        areaServed: {
          '@type': 'Country',
          name: 'Egypt',
        },
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'BirdNest',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: ['en', 'ar'],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/listings?location={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'RealEstateListing',
        '@id': `${siteUrl}/#platform`,
        name: 'BirdNest – Holiday Homes & Serviced Apartments in Egypt',
        description: '500+ verified holiday homes and serviced apartments across New Cairo, North Coast, El Gouna, and Sheikh Zayed.',
        url: siteUrl,
        provider: { '@id': `${siteUrl}/#organization` },
        areaServed: [
          { '@type': 'City', name: 'New Cairo' },
          { '@type': 'Place', name: 'North Coast' },
          { '@type': 'City', name: 'El Gouna' },
          { '@type': 'City', name: 'Sheikh Zayed' },
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
