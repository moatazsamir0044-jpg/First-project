import Link from 'next/link'
import Image from 'next/image'
import MashrabiyaPattern from '@/components/shared/MashrabiyaPattern'

export default function Footer() {
  return (
    <>
      {/* Lattice divider above footer */}
      <MashrabiyaPattern
        variant="divider"
        tileSize={40}
        opacity={0.22}
        className="bg-[var(--color-ground)]"
      />

      <footer className="bg-[var(--color-night)] text-white">
        <div className="container-site py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 mb-8 md:mb-12">
            <div className="md:col-span-1">
              <Image
                src="/images/logos/logo-cream.png"
                alt="BirdNest"
                width={140}
                height={36}
                className="h-9 w-auto mb-4"
              />
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Egypt&apos;s most trusted curated apartment rental platform. Verified nests in Cairo, Sahel, El Gouna &amp; Sheikh Zayed.
              </p>
            </div>

            <div>
              <h4
                className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Explore
              </h4>
              <ul className="space-y-3">
                {[
                  { href: '/listings', label: 'All Nests' },
                  { href: '/listings?location=New+Cairo', label: 'New Cairo' },
                  { href: '/listings?location=North+Coast', label: 'North Coast' },
                  { href: '/listings?location=El+Gouna', label: 'El Gouna' },
                  { href: '/listings?location=Sheikh+Zayed', label: 'Sheikh Zayed' },
                ].map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-night)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { href: '/about', label: 'About BirdNest' },
                  { href: '/how-it-works', label: 'How It Works' },
                  { href: '/blog', label: 'Blog' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/terms', label: 'Terms & Policies' },
                ].map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-night)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Contact
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://wa.me/201000005030"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-night)]"
                  >
                    +20 100 000 5030
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@birdnestlife.com"
                    className="text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-night)]"
                  >
                    info@birdnestlife.com
                  </a>
                </li>
                <li className="text-sm text-white/60">District 5, New Cairo, Egypt</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">© 2025 BirdNest. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm text-white/40">
              <Link
                href="/terms"
                className="hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-night)]"
              >
                Terms &amp; Policies
              </Link>
              <span>·</span>
              <Link
                href="/contact"
                className="hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-night)]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
