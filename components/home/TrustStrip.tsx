'use client'
import { useLang } from '@/lib/language-context'

export default function TrustStrip() {
  const { isArabic } = useLang()
  const items = isArabic
    ? ['عقارات موثقة', 'بدون رسوم خفية', 'دعم 24/7', 'إلغاء مرن']
    : ['Verified Properties', 'No Hidden Fees', '24/7 Support', 'Flexible Cancellation']

  return (
    <div className="bg-[#237c58] text-white py-3">
      <div className="container-site flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium">
        {items.map(item => (
          <span key={item} className="flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
