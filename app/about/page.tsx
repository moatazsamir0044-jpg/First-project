import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About BirdNest – Egypt\'s Trusted Holiday Home Platform',
  description: 'BirdNest was founded to bring trust, transparency, and quality to Egypt\'s vacation rental market.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-ink text-white py-20 md:py-28">
          <div className="container-site max-w-4xl mx-auto text-center">
            <p className="text-orange font-semibold text-sm mb-4 tracking-wide uppercase">Our Story</p>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold mb-6">
              Building Trust in Egypt's<br />Vacation Rental Market
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              BirdNest was founded with one mission: to make finding and booking quality holiday homes in Egypt as easy and trustworthy as booking a hotel.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-site max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="font-heading text-2xl font-semibold text-ink mb-4">Why We Built BirdNest</h2>
              <p className="text-ink/70 leading-relaxed mb-6">
                Egypt has some of the world's most beautiful holiday destinations — from the Mediterranean shores of the North Coast to the lagoons of El Gouna and the modern developments of New Cairo. Yet booking a vacation rental here has always been fraught with uncertainty: misleading listings, hidden fees, and unreliable hosts.
              </p>
              <p className="text-ink/70 leading-relaxed mb-6">
                We built BirdNest to change that. Every property on our platform is physically inspected by our Egypt-based team before listing. Every price shown includes all fees. And our local support team is available 24/7 to ensure your stay is perfect.
              </p>
              <p className="text-ink/70 leading-relaxed">
                Whether you're a Cairo family escaping to the North Coast for summer, an expat looking for a serviced apartment in Fifth Settlement, or an international visitor exploring El Gouna — BirdNest is your home away from home.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-cream">
          <div className="container-site">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '500+', label: 'Verified Properties' },
                { value: '4', label: 'Destinations' },
                { value: '4.8/5', label: 'Average Rating' },
                { value: '10,000+', label: 'Happy Guests' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-6 bg-white rounded-card">
                  <div className="font-heading text-4xl font-semibold text-orange mb-2">{stat.value}</div>
                  <div className="text-sm text-ink/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-site">
            <h2 className="font-heading text-3xl font-semibold text-ink text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Trust First', desc: 'Every listing is verified. Every price is transparent. No hidden fees, ever.' },
                { title: 'Local Expertise', desc: 'Our team lives and breathes Egypt. We know every compound, every resort, every neighbourhood.' },
                { title: 'Guest Obsessed', desc: 'From search to stay, we\'re with you every step of the way — 24/7 in Arabic and English.' },
              ].map(v => (
                <div key={v.title} className="bg-cream rounded-card p-6 text-center">
                  <h3 className="font-heading text-xl font-semibold text-ink mb-3">{v.title}</h3>
                  <p className="text-ink/60 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner logos */}
        <section className="py-12 bg-cream border-t border-ink/5">
          <div className="container-site">
            <p className="text-center text-xs font-semibold text-ink/40 uppercase tracking-widest mb-8">Trusted by Egypt's Leading Developers</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Emaar', 'SODIC', 'Al-Futtaim', 'Palm Hills', 'Hyde Park', 'Mountain View'].map(p => (
                <div key={p} className="px-5 py-2.5 bg-white rounded-pill border border-gray-200 text-sm font-semibold text-ink/60">{p}</div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-orange text-white text-center">
          <div className="container-site">
            <h2 className="font-heading text-3xl font-semibold mb-4">Ready to Find Your Nest?</h2>
            <p className="text-white/80 mb-8 text-lg">Join thousands of guests who've discovered the BirdNest difference.</p>
            <Link href="/listings" className="inline-block bg-white text-orange font-semibold px-8 py-4 rounded-btn hover:bg-cream transition-colors">
              Browse Properties
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton variant="fab" />
    </>
  )
}
