import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birdnestlife.com'

export const metadata: Metadata = {
  title: 'Blog & Travel Guides — BirdNest Egypt',
  description: 'Travel stories, neighbourhood guides, and stay-smart tips for Egypt holiday rentals. New Cairo, North Coast, El Gouna & Sheikh Zayed insider guides.',
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: 'Blog & Travel Guides — BirdNest Egypt',
    description: 'Travel stories, neighbourhood guides, and stay-smart tips for Egypt holiday rentals.',
    url: `${siteUrl}/blog`,
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
  },
}

const FEATURED = {
  slug: 'best-neighbourhoods-new-cairo',
  title: "The expat's guide to renting an apartment in New Cairo",
  excerpt: "From Fifth Settlement to Madinaty — what to expect on price, what to ask before you sign, and the five mistakes most first-timers make.",
  category: 'City Guide',
  readTime: '10 min',
  publishedAt: 'June 4, 2026',
  author: 'Mariam Adel',
  image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&q=80',
}

const POSTS = [
  {
    slug: 'flying-into-cairo',
    title: '10 things to know before flying into Cairo',
    excerpt: 'Visa-on-arrival, SIM cards, ride apps, and the airport-to-city hack that saves you an hour.',
    category: 'Travel Tips',
    readTime: '6 min',
    publishedAt: 'May 28, 2026',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&q=80',
  },
  {
    slug: 'marassi-vs-fouka-bay',
    title: 'Marassi vs Fouka Bay: Which North Coast Resort Is Right for You?',
    excerpt: 'Stanley vs Downtown vs Smouha. A neighbourhood-by-neighbourhood breakdown for first-time visitors.',
    category: 'Destination Guide',
    readTime: '8 min',
    publishedAt: 'May 19, 2026',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  },
  {
    slug: 'host-story-yasmine',
    title: "How Yasmine turned her grandmother's flat into Cairo's top-rated stay",
    excerpt: 'A weekend restoration project that became a full-time business — and what she\'d do differently today.',
    category: 'Host Story',
    readTime: '7 min',
    publishedAt: 'May 12, 2026',
    image: 'https://images.unsplash.com/photo-1503152394-c571994fd383?w=600&q=80',
  },
  {
    slug: 'where-locals-eat-zamalek',
    title: 'Where locals actually eat in Zamalek',
    excerpt: 'Skip the tourist traps. A koshary spot, a Lebanese hole-in-the-wall, and the best ful in the neighbourhood.',
    category: 'Food & Culture',
    readTime: '5 min',
    publishedAt: 'May 5, 2026',
    image: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=600&q=80',
  },
  {
    slug: 'el-gouna-guide',
    title: 'The Ultimate El Gouna Travel Guide',
    excerpt: 'Everything you need to know about the Red Sea\'s most charming town — from the lagoons to the nightlife.',
    category: 'Destination Guide',
    readTime: '10 min',
    publishedAt: 'April 28, 2026',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  },
  {
    slug: 'birdnest-vs-airbnb-egypt',
    title: 'BirdNest vs Airbnb in Egypt: Which is Better?',
    excerpt: 'Why a local specialist consistently outperforms global platforms for Egyptian vacation rentals.',
    category: 'Travel Tips',
    readTime: '5 min',
    publishedAt: 'April 20, 2026',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
  },
]

const CATEGORIES = ['All', 'City Guide', 'Destination Guide', 'Travel Tips', 'Host Story', 'Food & Culture']

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="bg-[#efe8e1] min-h-screen">
        {/* Hero */}
        <section className="pt-14 pb-6 text-center">
          <div className="container-site">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#237c58] bg-[#237c58]/10 px-4 py-1.5 rounded-full mb-4">The BirdNest Journal</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#292a2b] mb-4 leading-tight">Stories, guides &amp; tips<br className="hidden md:block" /> for travelling Egypt</h1>
            <p className="text-[#292a2b]/60 text-lg max-w-2xl mx-auto">Neighbourhood deep-dives, host interviews and stay-smart advice from our local team across Cairo, the Red Sea coast and beyond.</p>
          </div>
        </section>

        {/* Category pills */}
        <div className="container-site">
          <div className="flex flex-wrap gap-2 justify-center py-6">
            {CATEGORIES.map(c => (
              <span key={c} className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${c === 'All' ? 'bg-[#292a2b] text-white' : 'bg-white text-[#292a2b] border border-[#e6dbcf] hover:bg-[#292a2b] hover:text-white hover:border-[#292a2b]'}`}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="container-site pb-16">
          {/* Featured article */}
          <Link href={`/blog/${FEATURED.slug}`} className="group block">
            <article className="bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 mb-10 grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
                <img src={FEATURED.image} alt={FEATURED.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center gap-4">
                <span className="text-xs font-bold tracking-widest uppercase text-[#f4603d]">Featured · {FEATURED.category}</span>
                <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-[#292a2b] leading-snug group-hover:text-[#f4603d] transition-colors">{FEATURED.title}</h2>
                <p className="text-[#292a2b]/60 text-sm leading-relaxed">{FEATURED.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-[#292a2b]/50">
                  <span>By {FEATURED.author}</span>
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span>{FEATURED.readTime} read</span>
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span>{FEATURED.publishedAt}</span>
                </div>
              </div>
            </article>
          </Link>

          {/* Posts grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {POSTS.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <span className="text-xs font-bold tracking-widest uppercase text-[#f4603d]">{post.category}</span>
                    <h3 className="font-heading text-xl text-[#292a2b] leading-snug group-hover:text-[#f4603d] transition-colors">{post.title}</h3>
                    <p className="text-sm text-[#292a2b]/60 flex-1 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-[#292a2b]/40 pt-1">
                      <span>{post.readTime} read</span>
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span>{post.publishedAt}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <section className="bg-[#292a2b] text-white rounded-[16px] p-10 md:p-14 text-center">
            <h2 className="font-heading text-3xl md:text-4xl mb-3">Get the BirdNest newsletter</h2>
            <p className="text-white/70 max-w-lg mx-auto mb-7 text-sm leading-relaxed">One email a month with new guides, host interviews, and seasonal deals across Egypt. No spam, unsubscribe anytime.</p>
            <form className="flex flex-wrap gap-3 max-w-md mx-auto justify-center" onSubmit={undefined}>
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 min-w-[200px] px-4 py-3 rounded-[12px] text-[#292a2b] text-sm outline-none font-medium"
              />
              <button type="submit" className="bg-[#f4603d] hover:bg-[#dd4f2e] text-white font-semibold px-6 py-3 rounded-[12px] transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
