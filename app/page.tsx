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
import TrustStrip from '@/components/home/TrustStrip'
import HomeSchema from '@/components/home/HomeSchema'

export default function HomePage() {
  return (
    <>
      <HomeSchema />
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
      <CookieConsent />
    </>
  )
}
