import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import Link from 'next/link'

const POSTS: Record<string, {
  title: string
  description: string
  content: string
  category: string
  readTime: string
  publishedAt: string
  image: string
  author: string
}> = {
  'best-neighbourhoods-new-cairo': {
    title: 'Best Neighbourhoods in New Cairo for Families',
    description: 'Fifth Settlement, Katameya, Madinaty — a comprehensive guide to choosing the right area for your Cairo stay.',
    category: 'Destination Guide',
    readTime: '6 min',
    publishedAt: '2024-05-15',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&q=80',
    author: 'BirdNest Team',
    content: `
# Best Neighbourhoods in New Cairo for Families

New Cairo has transformed into one of Egypt's most desirable residential and vacation destinations. But with so many compounds and neighbourhoods to choose from, where should you base yourself for a family holiday?

## Fifth Settlement (التجمع الخامس)

The beating heart of New Cairo, Fifth Settlement offers the widest range of serviced apartments and vacation homes. You're walking distance from Waterway Compound, Cairo Festival City, and Point 90 Mall.

**Best for:** Families who want maximum convenience and dining options.
**Average nightly rate:** EGP 1,800 – 3,500

## Katameya

Home to some of Cairo's most prestigious compounds including Katameya Heights, Katameya Dunes, and The Address. Properties here tend to be larger and greener, with excellent sports facilities.

**Best for:** Families seeking a resort-like experience within Cairo.
**Average nightly rate:** EGP 2,200 – 5,000

## Madinaty

Developed by TMG Holding, Madinaty is a self-contained community with everything from schools to hospitals, parks, and an excellent golf course. The O West area adjacent to Madinaty is growing fast.

**Best for:** Long-stay families who want a complete, walkable community.
**Average nightly rate:** EGP 1,500 – 3,000

## Shorouk City

A quieter, greener alternative to the frenetic Fifth Settlement pace. Shorouk is loved by families who want villa-style accommodation with gardens.

**Best for:** Families with young children who want outdoor space.
**Average nightly rate:** EGP 2,000 – 4,500

## Our Recommendation

For most families visiting Cairo for a week or less, we recommend Fifth Settlement for the sheer range of dining, entertainment, and transport options. For stays of two weeks or more, Katameya or Madinaty offer a more relaxed pace that suits family life better.

Browse all New Cairo properties on BirdNest and use our filter to find exactly the right size, amenities, and price range for your family.
    `,
  },
  'marassi-vs-fouka-bay': {
    title: 'Marassi vs Fouka Bay: Which North Coast Resort is Right for You?',
    description: 'An honest comparison of two iconic Mediterranean resorts.',
    category: 'Comparison',
    readTime: '8 min',
    publishedAt: '2024-06-01',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    author: 'BirdNest Team',
    content: `
# Marassi vs Fouka Bay: An Honest Comparison

Every summer, Cairo families face the same delightful dilemma: Marassi or Fouka Bay? Both are world-class North Coast resorts, but they attract different types of guests. Here's our honest breakdown.

## Marassi

Developed by Emaar, Marassi is the gold standard of North Coast development. With a full marina, multiple beach clubs, international restaurants, and a golf course, it's essentially a self-contained town.

**Pros:**
- Most facilities of any North Coast resort
- Active marina with boat trips and water sports  
- Diverse dining from casual to fine dining
- Strong secondary rental market — good inventory

**Cons:**
- Can feel overcrowded in peak season (July–August)
- Premium prices reflect premium position
- Large size means lots of driving within the resort

**Best for:** Families who want maximum activities and don't mind crowds.

## Fouka Bay

The newer kid on the block, Fouka Bay by Tatweer Misr has quickly become the most talked-about resort on the North Coast. Its crystal-clear lagoons and minimalist architecture have made it Instagram famous.

**Pros:**
- Stunning architecture and crystal lagoons
- Less crowded than Marassi (for now)
- Unique lagoon experience you can't find elsewhere
- Strong community of young families and professionals

**Cons:**
- Fewer on-resort dining options (improving)
- No marina
- Slightly limited beach length vs Marassi

**Best for:** Young couples and families who prioritize aesthetics, beach time, and a more relaxed vibe.

## Our Verdict

If you're travelling with kids who want non-stop activities, Marassi wins. If you want to relax by a beautiful lagoon with a boutique resort feel, Fouka Bay is hard to beat.

BirdNest has properties in both. Browse North Coast properties and use our location filter to find your perfect match.
    `,
  },
  'el-gouna-guide': {
    title: 'The Ultimate El Gouna Travel Guide',
    description: 'Everything you need to know about the Red Sea town.',
    category: 'Destination Guide',
    readTime: '10 min',
    publishedAt: '2024-06-10',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
    author: 'BirdNest Team',
    content: `
# The Ultimate El Gouna Travel Guide

Often called "the Venice of the Red Sea," El Gouna is unlike anywhere else in Egypt. A private town built on a series of islands and lagoons near Hurghada, it's become one of the most desirable holiday destinations in the country.

## Getting There

El Gouna is 27km from Hurghada International Airport. Most visitors fly to Hurghada (HRG) and take a taxi or resort shuttle. The journey takes about 30 minutes.

## When to Go

El Gouna is a year-round destination. The summer months (June–August) attract Egyptian and Gulf families. October through May offers perfect weather for water sports, diving, and kite surfing.

## Neighbourhoods

**Abu Tig Marina** is the heart of El Gouna — lined with restaurants, cafes, boutiques, and overlooked by the iconic Sheraton. This is where you want to be for nightlife and dining.

**Downtown El Gouna (Kafr El Gouna)** is the traditional village-style quarter with the famous Friday Market and more local atmosphere.

**Residential islands** like Abu Tig, Kafr Malaab, and South Gouna offer private villas and apartments with direct lagoon access.

## What to Do

- **Kitesurfing**: El Gouna is one of the world's top kite destinations. Spot Kite Center is the best school.
- **Diving**: The Red Sea reefs around El Gouna are world-class. Multiple dive centers operate from the marina.
- **Golf**: The 18-hole Steigenberger Golf Course is one of Egypt's finest.
- **Boat trips**: Charter a felucca or speedboat for a day exploring the lagoons.
- **Nightlife**: The marina comes alive at sunset — Abu Tig Marina Bar, Hed Kandi, and Papas are perennial favorites.

## Where to Eat

- **Kiki's**: Best fresh fish on the marina
- **Jobo**: Great breakfast spot in Kafr El Gouna
- **Captain's Cabin**: Classic marina bar with live music
- **Moby Dick**: Seafood institution, been there forever

## Practical Tips

- Transportation within El Gouna is by tuk-tuk or buggy — embrace it
- The main beach clubs charge a cover that includes food/drink credit
- Book lagoon villas well in advance for peak season (July–August)
- The golf course is open to non-guests with advance booking

Browse BirdNest's El Gouna properties for verified listings from private villas with lagoon access to chic downtown apartments.
    `,
  },
  'birdnest-vs-airbnb-egypt': {
    title: 'BirdNest vs Airbnb in Egypt: Which is Better?',
    description: 'Why a local specialist outperforms global platforms for Egyptian vacation rentals.',
    category: 'Travel Tips',
    readTime: '5 min',
    publishedAt: '2024-06-20',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    author: 'BirdNest Team',
    content: `
# BirdNest vs Airbnb in Egypt: An Honest Comparison

We know what you're thinking: "I can just use Airbnb." And you can. But here's why thousands of guests specifically choose BirdNest for their Egypt holiday.

## Local Knowledge

Airbnb operates in 190 countries. They can't know every neighbourhood in Fifth Settlement or understand the difference between Marassi and Fouka Bay. BirdNest only operates in Egypt — it's all we do.

Our team has personally visited every property on our platform. We know which compound security is good, which areas have parking issues, and which listings' photos were taken in 2015.

## Verified Properties

Every BirdNest listing is physically inspected before going live. We check:
- Actual cleanliness and condition vs photos
- Working utilities (AC, hot water, WiFi speed)
- Safety (smoke detectors, fire exits)
- Accuracy of amenity listings

Airbnb relies on guest reviews to catch problems. We catch them before you arrive.

## Transparent Pricing

One of the biggest complaints about global platforms is hidden fees revealed at checkout. BirdNest shows all fees upfront:
- Nightly rate
- Estimated utilities
- Cleaning fee
- Any service charges

No surprises at booking confirmation.

## Egyptian Eligibility Requirements

Egypt has specific requirements around who can rent property — particularly for local properties requiring family or couple verification. BirdNest's team handles this seamlessly. On global platforms, you may encounter confusion or even denied check-ins.

## Support in Your Language

When something goes wrong at 2am at a North Coast chalet, you want to speak to someone who knows the area. Our support team is Egypt-based, Arabic and English speaking, and available 24/7.

## When Airbnb Might Still Win

- Very unusual destinations outside BirdNest's coverage areas
- If you have an Airbnb gift card
- If you specifically want a property type we don't list

For everything else — especially premium holiday properties across New Cairo, North Coast, El Gouna, and Sheikh Zayed — BirdNest is the better choice.
    `,
  },
}

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = POSTS[params.slug]
  if (!post) return {}
  return {
    title: `${post.title} – BirdNest Blog`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, images: [post.image] },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug]
  if (!post) notFound()

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ink/60" />
          <div className="absolute inset-0 flex items-end pb-8">
            <div className="container-site">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-orange bg-orange/20 backdrop-blur-sm px-2.5 py-0.5 rounded-pill">{post.category}</span>
                <span className="text-xs text-white/60">{post.readTime} read</span>
              </div>
              <h1 className="font-heading text-2xl md:text-4xl font-semibold text-white max-w-3xl">{post.title}</h1>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-cream py-3">
          <div className="container-site">
            <nav className="flex items-center gap-2 text-xs text-ink/50">
              <Link href="/" className="hover:text-orange">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-orange">Blog</Link>
              <span>/</span>
              <span className="text-ink">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="py-12 bg-white">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              <article className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-8 text-sm text-ink/50">
                  <span>By {post.author}</span>
                  <span>·</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-EG', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="prose prose-lg max-w-none text-ink/80 leading-relaxed">
                  {post.content.trim().split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} className="font-heading text-3xl font-semibold text-ink mt-8 mb-4">{line.slice(2)}</h1>
                    if (line.startsWith('## ')) return <h2 key={i} className="font-heading text-2xl font-semibold text-ink mt-8 mb-4">{line.slice(3)}</h2>
                    if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-ink">{line.slice(2, -2)}</p>
                    if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1">{line.slice(2)}</li>
                    if (line === '') return <br key={i} />
                    return <p key={i} className="mb-4">{line}</p>
                  })}
                </div>
              </article>

              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="bg-cream rounded-card p-5">
                  <h3 className="font-heading text-base font-semibold text-ink mb-3">Browse Properties</h3>
                  <p className="text-sm text-ink/60 mb-4">Ready to book your Egypt holiday?</p>
                  <Link href="/listings" className="block w-full bg-orange text-white text-sm font-semibold py-2.5 rounded-btn text-center hover:bg-orange-dk transition-colors">
                    View All Nests
                  </Link>
                </div>

                <div className="bg-white border border-gray-100 rounded-card p-5">
                  <h3 className="font-heading text-base font-semibold text-ink mb-3">More Articles</h3>
                  <ul className="space-y-3">
                    {Object.entries(POSTS).filter(([s]) => s !== params.slug).map(([slug, p]) => (
                      <li key={slug}>
                        <Link href={`/blog/${slug}`} className="text-sm text-ink/70 hover:text-orange transition-colors leading-snug block">{p.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton variant="fab" />
    </>
  )
}
