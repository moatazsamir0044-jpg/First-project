import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieConsent from '@/components/layout/CookieConsent'
import Hero from '@/components/home/Hero'
import FeaturedListings from '@/components/home/FeaturedListings'
import DestinationCards from '@/components/home/DestinationCards'
import HowItWorks from '@/components/home/HowItWorks'
import WhyBirdNest from '@/components/home/WhyBirdNest'
import Testimonials from '@/components/home/Testimonials'
import AppDownload from '@/components/home/AppDownload'
import PartnerLogos from '@/components/home/PartnerLogos'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Trust strip */}
        <div className="bg-green text-white py-3">
          <div className="container-site flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Verified Properties
            </span>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              No Hidden Fees
            </span>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              24/7 Support
            </span>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Flexible Cancellation
            </span>
          </div>
        </div>
        <FeaturedListings />
        <DestinationCards />
        <HowItWorks />
        <WhyBirdNest />
        <Testimonials />
        <AppDownload />
        <PartnerLogos />
      </main>
      <Footer />
      <WhatsAppButton variant="fab" />
      <CookieConsent />
    </>
  )
}
