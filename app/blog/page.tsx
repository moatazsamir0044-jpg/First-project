import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import BlogChatbot from '@/components/blog/BlogChatbot'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog & Guides – BirdNest Egypt',
  description: 'Destination guides, travel tips, and insider knowledge for holiday homes in Egypt.',
}

const POSTS = [
  {
    slug: 'best-neighbourhoods-new-cairo',
    title: 'Best Neighbourhoods in New Cairo for Families',
    excerpt: 'Fifth Settlement, Katameya, Madinaty — a comprehensive guide to choosing the right area for your Cairo stay.',
    category: 'Destination Guide',
    readTime: '6 min',
    publishedAt: '2024-05-15',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&q=80',
  },
  {
    slug: 'marassi-vs-fouka-bay',
    title: 'Marassi vs Fouka Bay: Which North Coast Resort is Right for You?',
    excerpt: 'An honest comparison of Egypt\'s two most iconic Mediterranean resorts — facilities, vibe, prices and who each suits best.',
    category: 'Comparison',
    readTime: '8 min',
    publishedAt: '2024-06-01',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  },
  {
    slug: 'el-gouna-guide',
    title: 'The Ultimate El Gouna Travel Guide',
    excerpt: 'Everything you need to know about the Red Sea\'s most charming town — from the lagoons to the nightlife.',
    category: 'Destination Guide',
    readTime: '10 min',
    publishedAt: '2024-06-10',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  },
  {
    slug: 'birdnest-vs-airbnb-egypt',
    title: 'BirdNest vs Airbnb in Egypt: Which is Better?',
    excerpt: 'Why a local specialist consistently outperforms global platforms for Egyptian vacation rentals.',
    category: 'Travel Tips',
    readTime: '5 min',
    publishedAt: '2024-06-20',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
  },
]

const CATEGORIES = ['All', 'Destination Guide', 'Comparison', 'Travel Tips', 'News']

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-cream py-16">
          <div className="container-site text-center">
            <h1 className="font-heading text-4xl font-semibold text-ink mb-4">Blog &amp; Guides</h1>
            <p className="text-ink/60 max-w-xl mx-auto">Destination guides, insider tips, and everything you need to plan the perfect Egypt getaway.</p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container-site">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              {CATEGORIES.map(c => (
                <button key={c} className={`px-4 py-2 rounded-pill text-sm font-medium transition-colors ${c === 'All' ? 'bg-orange text-white' : 'bg-cream text-ink hover:bg-orange/10 hover:text-orange'}`}>
                  {c}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {POSTS.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className={`rounded-card overflow-hidden shadow-sm hover:shadow-md transition-shadow ${i === 0 ? 'md:col-span-2' : ''}`}>
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-orange bg-orange/10 px-2.5 py-0.5 rounded-pill">{post.category}</span>
                        <span className="text-xs text-ink/40">{post.readTime} read</span>
                        <span className="text-xs text-ink/40">{new Date(post.publishedAt).toLocaleDateString('en-EG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h2 className="font-heading text-xl font-semibold text-ink mb-2 group-hover:text-orange transition-colors">{post.title}</h2>
                      <p className="text-sm text-ink/60 leading-relaxed">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton variant="fab" />
      <BlogChatbot />
    </>
  )
}
