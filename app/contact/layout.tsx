import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birdnestlife.com'

export const metadata: Metadata = {
  title: 'Contact BirdNest – Get in Touch',
  description: 'Contact BirdNest for booking enquiries, property listings, or support. Our Egypt-based team speaks Arabic and English, available 24/7.',
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: 'Contact BirdNest – Get in Touch',
    description: 'Contact BirdNest for booking enquiries, property listings, or support. Our Egypt-based team speaks Arabic and English, available 24/7.',
    url: `${siteUrl}/contact`,
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
