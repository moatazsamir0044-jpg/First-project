'use client'
import SearchWidget from './SearchWidget'
import { useLang } from '@/lib/language-context'

export default function Hero() {
  const { isArabic } = useLang()

  const stats = isArabic
    ? [
        { value: '+500', label: 'عقار' },
        { value: '4', label: 'وجهات' },
        { value: '★4.8', label: 'متوسط التقييم' },
        { value: '24/7', label: 'دعم' },
      ]
    : [
        { value: '500+', label: 'Properties' },
        { value: '4', label: 'Destinations' },
        { value: '4.8★', label: 'Avg Rating' },
        { value: '24/7', label: 'Support' },
      ]

  return (
    <section className="relative bg-[#efe8e1] overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#f4603d]" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#237c58]" />
      </div>

      <div className="container-site relative z-10 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#237c58] animate-pulse" />
            <span className="text-sm font-medium text-[#292a2b]">
              {isArabic ? '+500 عقار موثق في جميع أنحاء مصر' : '500+ verified properties across Egypt'}
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-[#292a2b] leading-tight mb-5">
            {isArabic ? (
              <>منزلك بعيداً عن <span className="text-[#f4603d]">المنزل</span> في مصر</>
            ) : (
              <>Your Home Away From <span className="text-[#f4603d]">Home</span> in Egypt</>
            )}
          </h1>
          <p className="text-lg md:text-xl text-[#292a2b]/60 leading-relaxed max-w-2xl mx-auto">
            {isArabic
              ? 'اكتشف شققاً مفروشة بالكامل وشاليهات في القاهرة الجديدة، الساحل الشمالي، الجونة والشيخ زايد. بدون مفاجآت. بدون رسوم خفية.'
              : 'Discover fully-furnished apartments and chalets in New Cairo, North Coast, El Gouna & Sheikh Zayed. No surprises. No hidden fees. Just your perfect nest.'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SearchWidget />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-8 md:gap-12">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-2xl font-semibold text-[#292a2b]">{stat.value}</div>
              <div className="text-sm text-[#292a2b]/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
