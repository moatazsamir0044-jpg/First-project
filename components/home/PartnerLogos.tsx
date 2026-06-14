export default function PartnerLogos() {
  const partners = ['Emaar', 'SODIC', 'Al-Futtaim', 'Booking.com', 'Airbnb', 'Expedia']
  const payments = ['Visa', 'Mastercard', 'Meeza', 'Fawry']

  return (
    <section className="py-12 bg-cream border-t border-ink/5">
      <div className="container-site">
        <p className="text-center text-xs font-semibold text-ink/40 uppercase tracking-widest mb-8">
          Trusted by Egypt's leading developers & listed on
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
          {partners.map(p => (
            <div
              key={p}
              className="px-5 py-2.5 bg-white rounded-pill border border-gray-200 text-sm font-semibold text-ink/60 hover:text-ink hover:border-gray-300 transition-colors"
            >
              {p}
            </div>
          ))}
        </div>

        <div className="border-t border-ink/10 pt-8 flex flex-col items-center gap-4">
          <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest">Secure Payment Methods</p>
          <div className="flex flex-wrap justify-center gap-3">
            {payments.map(p => (
              <div
                key={p}
                className="px-4 py-2 bg-white border border-gray-200 rounded text-sm font-bold text-ink/70"
              >
                {p}
              </div>
            ))}
            <div className="px-4 py-2 bg-green/10 border border-green/20 rounded text-xs font-semibold text-green flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M8 1L2 3.5V8C2 11.5 5 14.5 8 15.5C11 14.5 14 11.5 14 8V3.5L8 1Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              SSL Secured
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
