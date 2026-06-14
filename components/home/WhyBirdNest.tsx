export default function WhyBirdNest() {
  const features = [
    {
      title: 'Verified Properties',
      description: 'Every listing is physically inspected and digitally verified by our Egypt-based team before it goes live.',
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <path d="M20 4L34 10V20C34 28 27 35.5 20 38C13 35.5 6 28 6 20V10L20 4Z" fill="#237c58" fillOpacity="0.15" stroke="#237c58" strokeWidth="2"/>
          <path d="M14 20L18 24L26 16" stroke="#237c58" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: 'Transparent Pricing',
      description: 'What you see is what you pay. All fees including utilities and cleaning are shown upfront.',
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <circle cx="20" cy="20" r="16" fill="#f4603d" fillOpacity="0.1" stroke="#f4603d" strokeWidth="2"/>
          <path d="M20 12V14M20 26V28M15 17C15 17 15 15 20 15C25 15 25 17 25 17C25 19 20 20 20 20C20 20 25 21 25 23C25 23 25 25 20 25C15 25 15 23 15 23" stroke="#f4603d" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'Flexible Bookings',
      description: 'Short stay or long term? Weekend or full season? We have flexible options for every traveller.',
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="6" y="10" width="28" height="24" rx="4" fill="#c9e1ea" stroke="#292a2b" strokeWidth="2" fillOpacity="0.4"/>
          <path d="M6 16H34" stroke="#292a2b" strokeWidth="2"/>
          <path d="M14 8V12M26 8V12" stroke="#292a2b" strokeWidth="2" strokeLinecap="round"/>
          <path d="M13 22H17M19 22H23M25 22H27" stroke="#237c58" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'Local Expert Support',
      description: 'Our Cairo-based team speaks your language — Arabic, English, and French — and is reachable 24/7.',
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <circle cx="20" cy="20" r="16" fill="#237c58" fillOpacity="0.1"/>
          <circle cx="20" cy="16" r="5" stroke="#237c58" strokeWidth="2"/>
          <path d="M10 32C10 27 14.5 24 20 24C25.5 24 30 27 30 32" stroke="#237c58" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-sky/30">
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-orange mb-2 tracking-wide uppercase">Why choose us</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-ink">The BirdNest Difference</h2>
          <p className="mt-3 text-ink/60 max-w-xl mx-auto">
            Built for Egypt, trusted by thousands of guests every season.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(feature => (
            <div key={feature.title} className="bg-white rounded-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-heading text-lg font-semibold text-ink mb-2">{feature.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
