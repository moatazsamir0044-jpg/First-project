export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Search & Discover',
      description: 'Browse our curated collection of verified properties across Egypt. Filter by location, dates, guests, and budget.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
          <circle cx="24" cy="24" r="22" fill="#f4603d" fillOpacity="0.1"/>
          <circle cx="21" cy="21" r="8" stroke="#f4603d" strokeWidth="2.5"/>
          <path d="M27 27L33 33" stroke="#f4603d" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Book Securely',
      description: 'Reserve your nest in minutes. Pay securely via card or bank transfer. No hidden fees, ever.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
          <circle cx="24" cy="24" r="22" fill="#237c58" fillOpacity="0.1"/>
          <rect x="13" y="16" width="22" height="17" rx="3" stroke="#237c58" strokeWidth="2.5"/>
          <path d="M13 22H35" stroke="#237c58" strokeWidth="2.5"/>
          <path d="M18 28H20" stroke="#237c58" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M23 28H27" stroke="#237c58" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Check In Smoothly',
      description: 'Receive your digital keys and welcome guide. Our hosts ensure a seamless, hotel-quality check-in.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
          <circle cx="24" cy="24" r="22" fill="#f4603d" fillOpacity="0.1"/>
          <path d="M20 24L23 27L29 21" stroke="#f4603d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="13" y="13" width="22" height="22" rx="4" stroke="#f4603d" strokeWidth="2.5"/>
        </svg>
      ),
    },
    {
      number: '04',
      title: '24/7 Local Support',
      description: 'Our Egypt-based team is available around the clock via WhatsApp, phone, or email for anything you need.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
          <circle cx="24" cy="24" r="22" fill="#237c58" fillOpacity="0.1"/>
          <path d="M33 29.5C33 30.2 32.8 30.9 32.5 31.5C32.1 32.3 31.6 33 30.8 33.5C30 34 29.1 34.3 28.1 34.3C26.7 34.3 25.2 33.9 23.7 33.2C22.2 32.5 20.7 31.5 19.3 30.2C17.9 28.9 16.8 27.4 16 25.8C15.2 24.3 14.8 22.8 14.8 21.4C14.8 20.4 15 19.5 15.5 18.7C16 17.9 16.6 17.4 17.4 17.1C18 16.8 18.7 16.7 19.4 16.7C19.7 16.7 20 16.7 20.3 16.8C20.6 16.9 20.9 17 21.1 17.3L23.5 20.7C23.7 21 23.9 21.2 24 21.5C24.1 21.8 24.2 22 24.2 22.2C24.2 22.5 24.1 22.8 24 23C23.8 23.3 23.6 23.5 23.4 23.8L22.7 24.5C22.6 24.6 22.6 24.7 22.6 24.8C22.6 24.9 22.6 24.9 22.7 25C22.9 25.4 23.2 25.8 23.6 26.3C24 26.8 24.4 27.2 24.9 27.7C25.4 28.1 25.8 28.5 26.2 28.8C26.7 29.1 27.1 29.3 27.2 29.4C27.3 29.5 27.4 29.5 27.5 29.5C27.7 29.5 27.8 29.4 27.9 29.3L28.6 28.6C28.9 28.3 29.1 28.1 29.4 27.9C29.7 27.7 29.9 27.7 30.2 27.7C30.5 27.7 30.7 27.7 31 27.9L34.5 30.3C34.8 30.5 35 30.7 35 31C35 31.1 35 31.3 33 29.5Z" stroke="#237c58" strokeWidth="2"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-orange mb-2 tracking-wide uppercase">Simple process</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-ink">How BirdNest Works</h2>
          <p className="mt-3 text-ink/60 max-w-xl mx-auto">
            From search to stay, we've made every step effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(50%+2rem)] right-0 h-px bg-gray-200 z-0" />
              )}
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-orange/40 tracking-widest mb-2">{step.number}</div>
                <h3 className="font-heading text-lg font-semibold text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
