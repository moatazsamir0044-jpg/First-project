import StarRating from '@/components/shared/StarRating'

const testimonials = [
  {
    id: 1,
    name: 'Nadia El-Sayed',
    country: 'Egypt',
    rating: 5,
    text: 'BirdNest made our Sahel summer unforgettable. The chalet was even better than the photos. Transparent pricing meant no nasty surprises at checkout!',
    listing: 'Fouka Bay Chalet',
    initials: 'NE',
    color: 'bg-orange/20 text-orange',
    date: 'July 2025',
  },
  {
    id: 2,
    name: 'James & Karen T.',
    country: 'United Kingdom',
    rating: 5,
    text: 'As expats new to Cairo, we were nervous about finding good accommodation. BirdNest was incredible — professional, English-speaking support and a beautiful apartment.',
    listing: 'Fifth Settlement Penthouse',
    initials: 'JK',
    color: 'bg-sky/40 text-[#292a2b]',
    date: 'March 2025',
  },
  {
    id: 3,
    name: 'Omar Al-Rashid',
    country: 'Saudi Arabia',
    rating: 5,
    text: 'Third year booking through BirdNest for El Gouna. The quality and consistency is unmatched. It is now our family tradition!',
    listing: 'El Gouna Lagoon Villa',
    initials: 'OA',
    color: 'bg-[#237c58]/15 text-[#237c58]',
    date: 'August 2025',
  },
  {
    id: 4,
    name: 'Sophie B.',
    country: 'France',
    rating: 4,
    text: 'Perfect for our remote work stint in Egypt. Fast WiFi, great workspace, and the community at BirdNest is lovely. Highly recommend the New Cairo options.',
    listing: 'Katameya Heights Apartment',
    initials: 'SB',
    color: 'bg-orange/10 text-orange',
    date: 'May 2025',
  },
  {
    id: 5,
    name: 'Ahmed & Rania M.',
    country: 'Egypt',
    rating: 5,
    text: 'We celebrate every anniversary at a BirdNest property. Always verified, always clean, always exactly as described. Customer service is exceptional.',
    listing: 'Sheikh Zayed Villa',
    initials: 'AR',
    color: 'bg-[#237c58]/15 text-[#237c58]',
    date: 'June 2025',
  },
  {
    id: 6,
    name: 'Priya S.',
    country: 'India',
    rating: 5,
    text: 'Came for a week, stayed for a month! The Marassi chalet was paradise. BirdNest handled everything smoothly including extending our stay last minute.',
    listing: 'Marassi Beachfront Chalet',
    initials: 'PS',
    color: 'bg-sky/40 text-[#292a2b]',
    date: 'September 2025',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-site">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-orange mb-2 tracking-wide uppercase">Guest stories</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-ink">What Our Guests Say</h2>
          {/* Aggregate rating bar */}
          <div className="mt-4 inline-flex items-center gap-3 bg-cream px-5 py-2.5 rounded-full">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-ink">4.8 / 5</span>
            <span className="text-sm text-ink/50">from 10,000+ guests</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-cream rounded-card p-6 flex flex-col gap-4">
              {/* Stars */}
              <StarRating rating={t.rating} showValue />

              {/* Quote */}
              <p className="text-sm text-ink/80 leading-relaxed italic flex-1">"{t.text}"</p>

              {/* Author */}
              <div className="mt-auto pt-4 border-t border-ink/10 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm text-ink">{t.name}</p>
                  <p className="text-xs text-ink/50">{t.country} · {t.listing} · {t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
