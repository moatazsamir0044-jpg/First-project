import Link from 'next/link'
import Image from 'next/image'
import MashrabiyaPattern from '@/components/shared/MashrabiyaPattern'

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-cream">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-green text-white p-12">
        <div className="absolute inset-0 opacity-[0.12]">
          <MashrabiyaPattern />
        </div>
        <Link href="/" className="relative z-10 inline-flex">
          <Image
            src="/images/logos/logo-cream.png"
            alt="BirdNest"
            width={200}
            height={64}
            className="h-14 w-auto"
            priority
          />
        </Link>

        <div className="relative z-10 max-w-md animate-fade-up">
          <Image
            src="/images/logos/logo-icon.png"
            alt=""
            width={96}
            height={96}
            className="h-20 w-20 mb-8 animate-float"
            aria-hidden
          />
          <h2 className="font-heading text-4xl leading-tight mb-4">
            Your nest in Egypt, just a tap away.
          </h2>
          <p className="text-white/80 text-lg">
            Book verified, fully-furnished homes across Cairo, the North Coast, and El Gouna —
            with transparent pricing and no surprise fees.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-sm text-white/70">
          <span>500+ properties</span>
          <span aria-hidden>•</span>
          <span>4.8★ average rating</span>
          <span aria-hidden>•</span>
          <span>Secure payments</span>
        </div>
      </aside>

      {/* Form panel */}
      <section className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md mx-auto animate-fade-up">
          <Link href="/" className="lg:hidden inline-flex mb-8">
            <Image
              src="/images/logos/logo-dark.png"
              alt="BirdNest"
              width={170}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>

          <h1 className="font-heading text-3xl font-semibold text-ink mb-2">{title}</h1>
          <p className="text-ink/60 mb-8">{subtitle}</p>

          {children}

          <div className="mt-8 text-center text-sm text-ink/60">{footer}</div>
        </div>
      </section>
    </main>
  )
}
