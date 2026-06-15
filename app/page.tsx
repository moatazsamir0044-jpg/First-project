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
import TrustStrip from '@/components/home/TrustStrip'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStrip />
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
