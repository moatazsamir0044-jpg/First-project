import Link from 'next/link'
import Image from 'next/image'
import { destinations } from '@/lib/mock-data'

export default function DestinationCards() {
  return (
    <section className="py-16 md:py-20 bg-cream">
      <div className="container-site">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange mb-2 tracking-wide uppercase">Where to?</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-ink">
            Choose Your Destination
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map(dest => (
            <Link
              key={dest.id}
              href={`/listings?area=${dest.slug}`}
              className="group relative rounded-card overflow-hidden block aspect-[3/4] shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="font-heading text-xl font-semibold mb-1">{dest.name}</h3>
                <p className="text-sm text-white/70">{dest.propertyCount} properties</p>
                <p className="text-xs text-white/50 mt-1">{dest.description}</p>
              </div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-pill">
                Explore →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
