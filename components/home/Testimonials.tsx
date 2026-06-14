import StarRating from '@/components/shared/StarRating'

const testimonials = [
  {
    id: 1,
    name: 'Nadia El-Sayed',
    country: 'Egypt',
    rating: 5,
    text: 'BirdNest made our Sahel summer unforgettable. The chalet was even better than the photos. Transparent pricing meant no nasty surprises at checkout!',
    listing: 'Fouka Bay Chalet',
  },
  {
    id: 2,
    name: 'James & Karen T.',
    country: 'United Kingdom',
    rating: 5,
    text: 'As expats new to Cairo, we were nervous about finding good accommodation. BirdNest was incredible — professional, English-speaking support and a beautiful apartment.',
    listing: 'Fifth Settlement Penthouse',
  },
  {
    id: 3,
    name: 'Omar Al-Rashid',
    country: 'Saudi Arabia',
    rating: 5,
    text: 'Third year booking through BirdNest for El Gouna. The quality and consistency is unmatched. It is now our family tradition!',
    listing: 'El Gouna Lagoon Villa',
  },
  {
    id: 4,
    name: 'Sophie B.',
    country: 'France',
    rating: 4,
    text: 'Perfect for our remote work stint in Egypt. Fast WiFi, great workspace, and the community at BirdNest is lovely. Highly recommend the New Cairo options.',
    listing: 'Katameya Heights Apartment',
  },
  {
    id: 5,
    name: 'Ahmed & Rania M.',
    country: 'Egypt',
    rating: 5,
    text: 'We celebrate every anniversary at a BirdNest property. Always verified, always clean, always exactly as described. Customer service is exceptional.',
    listing: 'Sheikh Zayed Villa',
  },
  {
    id: 6,
    name: 'Priya S.',
    country: 'India',
    rating: 5,
    text: 'Came for a week, stayed for a month! The Marassi chalet was paradise. BirdNest handled everything smoothly including extending our stay last minute.',
    listing: 'Marassi Beachfront Chalet',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-site">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange mb-2 tracking-wide uppercase">Guest stories</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-ink">What Our Guests Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-cream rounded-card p-6 flex flex-col gap-4">
              <StarRating rating={t.rating} showValue />
              <p className="text-sm text-ink/80 leading-relaxed italic">"{t.text}"</p>
              <div className="mt-auto pt-4 border-t border-ink/10">
                <p className="font-semibold text-sm text-ink">{t.name}</p>
                <p className="text-xs text-ink/50">{t.country} · {t.listing}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
