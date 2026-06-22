import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SignOutButton from '@/components/auth/SignOutButton'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, calculateNights } from '@/lib/formatters'

export const metadata: Metadata = {
  title: 'My account',
  description: 'Manage your BirdNest bookings and account.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const statusStyles: Record<string, string> = {
  confirmed: 'bg-green/10 text-green',
  pending: 'bg-orange/10 text-orange-dk',
  cancelled: 'bg-gray-200 text-ink/60',
}

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/account')
  }

  const user = session.user

  // Bookings linked to the account, plus any guest bookings made with the same email.
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { userId: user.id },
        ...(user.email ? [{ guestEmail: user.email }] : []),
      ],
    },
    include: { listing: { select: { title: true, slug: true, area: true, images: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <section className="bg-green text-white">
          <div className="container-site py-12 flex flex-wrap items-center justify-between gap-4 animate-fade-up">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center font-heading text-2xl">
                {(user.name || user.email || 'B').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl">
                  {user.name ? `Hello, ${user.name.split(' ')[0]}` : 'Welcome'}
                </h1>
                <p className="text-white/70 text-sm">{user.email}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </section>

        <section className="container-site py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl text-ink">Your bookings</h2>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange hover:text-orange-dk"
            >
              Find a nest <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-card bg-white border border-gray-100 p-12 text-center animate-fade-up">
              <Image
                src="/images/logos/logo-icon.png"
                alt=""
                width={72}
                height={72}
                className="h-16 w-16 mx-auto mb-4 opacity-80 animate-float"
                aria-hidden
              />
              <h3 className="font-heading text-xl text-ink mb-2">No bookings yet</h3>
              <p className="text-ink/60 mb-6">When you book a nest, it will appear here.</p>
              <Link
                href="/listings"
                className="inline-flex bg-orange text-white font-semibold rounded-btn px-6 py-3 hover:bg-orange-dk transition-colors"
              >
                Browse homes
              </Link>
            </div>
          ) : (
            <ul className="grid gap-4">
              {bookings.map((b, i) => (
                <li
                  key={b.id}
                  className="rounded-card bg-white border border-gray-100 overflow-hidden flex flex-col sm:flex-row animate-fade-up"
                  style={{ animationDelay: `${Math.min(i, 6) * 0.06}s` }}
                >
                  <div className="relative sm:w-48 h-40 sm:h-auto bg-gray-100 shrink-0">
                    {b.listing.images?.[0] && (
                      <Image
                        src={b.listing.images[0]}
                        alt={b.listing.title}
                        fill
                        sizes="192px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/listings/${b.listing.slug}`} className="font-heading text-lg text-ink hover:text-orange transition-colors">
                          {b.listing.title}
                        </Link>
                        <p className="flex items-center gap-1 text-sm text-ink/50 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" /> {b.listing.area}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-pill text-xs font-semibold capitalize ${statusStyles[b.status] || 'bg-gray-100 text-ink/60'}`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-ink/70">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-green" />
                        {formatDate(b.checkIn)} → {formatDate(b.checkOut)} ({calculateNights(b.checkIn, b.checkOut)} nights)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-green" /> {b.guests} guests
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs text-ink/50">Ref: <span className="font-mono">{b.reference}</span></span>
                      <span className="font-heading text-lg text-ink">{formatPrice(b.totalPrice)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
