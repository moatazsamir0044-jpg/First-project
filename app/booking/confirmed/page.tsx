import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function BookingConfirmedPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green" />
          </div>
          <h1 className="font-heading text-3xl font-semibold text-ink mb-3">Booking Confirmed!</h1>
          <p className="text-ink/60 mb-8">
            Your booking has been confirmed. Check your email and WhatsApp for details.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/listings" className="bg-orange text-white font-semibold px-6 py-3 rounded-btn hover:bg-orange-dk transition-colors">
              Browse More Nests
            </Link>
            <Link href="/" className="border border-gray-200 text-ink font-semibold px-6 py-3 rounded-btn hover:bg-gray-50 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
