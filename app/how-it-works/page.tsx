import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How BirdNest Works – Book with Confidence',
  description: 'Learn how BirdNest makes booking holiday homes in Egypt simple, safe, and transparent.',
}

const FAQS = [
  {
    q: 'Is my payment secure?',
    a: 'Yes. All payments are processed via SSL-encrypted channels. We use Stripe for card payments and partner with major Egyptian banks for local transfers. We never store your card details.',
  },
  {
    q: 'What documents do I need at check-in?',
    a: 'Most properties require a valid national ID or passport. For family or couple eligibility, you may need to present marriage certificate or family ID (عائلة) upon request.',
  },
  {
    q: 'Can I cancel my booking?',
    a: 'It depends on the property\'s cancellation policy. Flexible properties allow free cancellation up to 48 hours before check-in. Moderate policies allow partial refunds. Non-refundable properties do not offer cancellations.',
  },
  {
    q: 'How is BirdNest different from Airbnb?',
    a: 'BirdNest is built specifically for Egypt. Our team physically verifies every property, we understand local regulations, and our support team is Egypt-based and available 24/7 in Arabic and English.',
  },
  {
    q: 'Can I list my own property on BirdNest?',
    a: 'Yes! We welcome quality properties across Egypt. Contact us via the "List Your Property" form and our team will get in touch within 48 hours.',
  },
  {
    q: 'Is there a minimum stay requirement?',
    a: 'This varies by property. Most properties require a minimum 2-night stay. Summer season properties on the North Coast typically require a weekly minimum.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-cream py-16 md:py-24">
          <div className="container-site text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-ink mb-4">
              Booking Made <span className="text-orange">Simple</span>
            </h1>
            <p className="text-lg text-ink/60 mb-8">
              From search to stay, BirdNest makes every step effortless. Here's exactly how it works.
            </p>
            <Link href="/listings" className="inline-block bg-orange text-white font-semibold px-8 py-4 rounded-btn hover:bg-orange-dk transition-colors">
              Start Browsing
            </Link>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-site">
            <div className="space-y-16">
              {[
                {
                  step: '01',
                  title: 'Search & Discover',
                  description: 'Use our powerful search to filter properties by location, dates, budget, number of guests, and amenities. Every listing includes real photos, honest descriptions, and full pricing transparency.',
                  highlight: 'No surprise fees — ever.',
                },
                {
                  step: '02',
                  title: 'Book Securely',
                  description: 'Select your dates, enter your details, and pay securely online via card or bank transfer. You\'ll receive instant confirmation and a booking reference number.',
                  highlight: 'Free cancellation on Flexible properties up to 48h before check-in.',
                },
                {
                  step: '03',
                  title: 'Verify Eligibility',
                  description: 'Egyptian law requires property hosts to verify guest eligibility. This is quick and simple — just confirm your group type (family, couple, etc.) and have ID ready at check-in.',
                  highlight: 'Our team handles all the paperwork.',
                },
                {
                  step: '04',
                  title: 'Check In & Enjoy',
                  description: '24 hours before arrival, we\'ll send your digital check-in guide with access codes, parking instructions, emergency contacts, and local recommendations curated by our team.',
                  highlight: 'Our Cairo team is available 24/7 via WhatsApp.',
                },
              ].map((item, i) => (
                <div key={item.step} className={`flex flex-col md:flex-row gap-10 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <div className="text-7xl font-heading font-semibold text-orange/20 mb-3">{item.step}</div>
                    <h2 className="font-heading text-2xl font-semibold text-ink mb-3">{item.title}</h2>
                    <p className="text-ink/60 leading-relaxed mb-4">{item.description}</p>
                    <p className="text-sm font-semibold text-green">{item.highlight}</p>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-48 h-48 rounded-full bg-cream flex items-center justify-center">
                      <span className="font-heading text-6xl font-semibold text-orange/40">{item.step}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-cream">
          <div className="container-site max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-semibold text-ink text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <details key={i} className="group bg-white rounded-card p-5 cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-ink list-none">
                    {faq.q}
                    <span className="text-orange group-open:rotate-45 transition-transform duration-200 shrink-0 ml-4">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-ink/70 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-ink/60 mb-4">Still have questions?</p>
              <WhatsAppButton variant="inline" message="Hi BirdNest! I have a question about how bookings work.">
                Chat with Us on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton variant="fab" />
    </>
  )
}
