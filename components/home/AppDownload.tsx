export default function AppDownload() {
  return (
    <section className="py-16 md:py-20 bg-ink text-white overflow-hidden">
      <div className="container-site">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm font-semibold text-orange mb-3 tracking-wide uppercase">Coming soon</p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4">
              BirdNest in Your Pocket
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-lg">
              Browse, book, and manage your stay from anywhere. The BirdNest app is coming soon to iOS and Android.
            </p>

            {/* Store badges */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-btn transition-colors"
                aria-label="Download on App Store"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div className="text-[10px] text-white/50 leading-none">Download on the</div>
                  <div className="text-sm font-semibold leading-snug">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-btn transition-colors"
                aria-label="Get it on Google Play"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path d="M3.18 23.76c.42.23.9.24 1.34.04l12.09-6.97-2.65-2.65-10.78 9.58zm16.31-9.7L16.9 12.5l2.59-2.59L6.55.23C6.11.01 5.63.02 5.21.25l10.74 9.96 3.54 3.85zM1.47 1.06C1.18 1.41 1 1.87 1 2.42V21.6c0 .55.18 1.01.48 1.36l.07.07L12.12 12 1.55.99l-.08.07zm18.91 9.71l-2.37-2.37-3.56 3.56 3.56 3.56 2.39-2.39c.67-.67.67-1.74-.02-2.36z"/>
                </svg>
                <div>
                  <div className="text-[10px] text-white/50 leading-none">Get it on</div>
                  <div className="text-sm font-semibold leading-snug">Google Play</div>
                </div>
              </a>
            </div>

            {/* Notify me */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-btn px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-orange"
              />
              <button className="bg-orange text-white font-semibold px-5 py-2.5 rounded-btn hover:bg-orange-dk transition-colors text-sm">
                Notify Me
              </button>
            </div>
          </div>

          {/* Phone mockup — decorative, hidden on mobile */}
          <div className="relative shrink-0 hidden lg:block">
            <div className="w-48 h-96 bg-white/10 rounded-[2.5rem] border-2 border-white/20 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-4 w-20 h-1.5 bg-white/20 rounded-full" />
              <div className="absolute bottom-4 w-12 h-1 bg-white/20 rounded-full" />
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 6C12 6 9 9 9 12.5C9 15.5 11 17.5 13 19L16 22L19 19C21 17.5 23 15.5 23 12.5C23 9 20 6 16 6Z" fill="white"/>
                    <circle cx="16" cy="11" r="2.5" fill="#f4603d"/>
                  </svg>
                </div>
                <p className="text-white font-heading text-sm font-semibold">BirdNest</p>
                <p className="text-white/40 text-xs mt-1">App coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
