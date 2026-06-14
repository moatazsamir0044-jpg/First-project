import SearchWidget from './SearchWidget'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative bg-cream overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-orange" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-green" />
      </div>

      <div className="container-site relative z-10 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-3xl mx-auto text-center mb-10">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-pill shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            <span className="text-sm font-medium text-ink">500+ verified properties across Egypt</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-ink leading-tight mb-5">
            Your Home Away From{' '}
            <span className="text-orange">Home</span> in Egypt
          </h1>
          <p className="text-lg md:text-xl text-ink/60 leading-relaxed max-w-2xl mx-auto">
            Discover fully-furnished apartments and chalets in New Cairo, North Coast, El Gouna & Sheikh Zayed.
            No surprises. No hidden fees. Just your perfect nest.
          </p>
        </div>

        {/* Search Widget */}
        <div className="max-w-4xl mx-auto">
          <SearchWidget />
        </div>

        {/* Stats row */}
        <div className="mt-10 flex flex-wrap justify-center gap-8 md:gap-12">
          {[
            { value: '500+', label: 'Properties' },
            { value: '4', label: 'Destinations' },
            { value: '4.8★', label: 'Avg Rating' },
            { value: '24/7', label: 'Support' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-2xl font-semibold text-ink">{stat.value}</div>
              <div className="text-sm text-ink/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
