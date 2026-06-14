import Link from 'next/link'
import { CheckCircle, MessageCircle, Calendar, Download } from 'lucide-react'

interface BookingConfirmedProps {
  reference: string
  guestName: string
  propertyTitle: string
  checkIn: string
  checkOut: string
  totalPrice: number
}

export default function BookingConfirmed({
  reference,
  guestName,
  propertyTitle,
  checkIn,
  checkOut,
  totalPrice,
}: BookingConfirmedProps) {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-EG', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="text-center space-y-6 py-8">
      {/* Success icon with animation */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center animate-bounce">
          <CheckCircle className="w-10 h-10 text-green" />
        </div>
      </div>

      <div>
        <h1 className="font-heading text-3xl font-semibold text-ink mb-2">Booking Confirmed!</h1>
        <p className="text-ink/60">We're so excited to host you, {guestName.split(' ')[0]}!</p>
      </div>

      {/* Booking reference */}
      <div className="inline-flex items-center gap-3 bg-cream px-6 py-3 rounded-card">
        <span className="text-sm text-ink/60">Booking Reference:</span>
        <span className="font-heading text-lg font-semibold text-orange">{reference}</span>
      </div>

      {/* Stay summary */}
      <div className="bg-white border border-gray-100 rounded-card p-6 text-left space-y-3 max-w-md mx-auto">
        <h3 className="font-semibold text-ink">{propertyTitle}</h3>
        <div className="flex justify-between text-sm">
          <span className="text-ink/50 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Check-in</span>
          <span className="font-medium">{fmt(checkIn)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink/50 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Check-out</span>
          <span className="font-medium">{fmt(checkOut)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
          <span>Total Paid</span>
          <span className="text-green">
            {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(totalPrice)}
          </span>
        </div>
      </div>

      {/* What's next */}
      <div className="bg-sky/30 rounded-card p-5 text-left max-w-md mx-auto">
        <p className="font-semibold text-sm text-ink mb-3">What happens next?</p>
        <ul className="space-y-2 text-sm text-ink/70">
          <li className="flex gap-2"><span className="text-green font-bold">1.</span> Confirmation email sent to your inbox</li>
          <li className="flex gap-2"><span className="text-green font-bold">2.</span> Our team will WhatsApp you within 2 hours</li>
          <li className="flex gap-2"><span className="text-green font-bold">3.</span> Digital check-in guide 24h before arrival</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={`https://wa.me/201000000000?text=${encodeURIComponent(`Hi BirdNest! My booking ref is ${reference}`)}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-btn font-semibold hover:bg-[#1ebe57] transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
        </a>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 border border-gray-200 text-ink px-6 py-3 rounded-btn font-semibold hover:bg-gray-50 transition-colors"
        >
          Browse More Nests
        </Link>
      </div>
    </div>
  )
}
