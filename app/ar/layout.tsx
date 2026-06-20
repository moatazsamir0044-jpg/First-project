import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birdnestlife.com'

export const metadata: Metadata = {
  alternates: {
    canonical: `${siteUrl}/ar`,
    languages: {
      'en': siteUrl,
      'ar': `${siteUrl}/ar`,
    },
  },
}

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" lang="ar" style={{ fontFamily: "'Cairo', 'Gilroy', system-ui, sans-serif" }}>
      {children}
    </div>
  )
}
