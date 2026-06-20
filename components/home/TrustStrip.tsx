'use client'
import { useLang } from '@/lib/language-context'
import { CANCELLATION_POLICY, ELIGIBILITY_POLICY } from '@/lib/policies'

const PAYMENT_COPY = {
  en: {
    heading: 'Secure Payment',
    body: 'Pay online via card. Funds are held securely and released to the host only after check-in.',
  },
  ar: {
    heading: 'دفع آمن',
    body: 'ادفع عبر البطاقة. تُحفظ الأموال بأمان وتُحوَّل للمضيف بعد تسجيل الوصول فقط.',
  },
}

export default function TrustStrip() {
  const { isArabic } = useLang()

  const columns = isArabic
    ? [
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          ),
          heading: 'سياسة الإلغاء',
          body: 'استرداد كامل عند الإلغاء خلال 48 ساعة من الحجز إذا كان تسجيل الوصول بعد 14 يوماً على الأقل. 50% استرداد عند الإلغاء قبل 7 أيام. لا استرداد خلال 7 أيام من الوصول.',
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
          heading: 'الأهلية',
          body: 'وفقاً للقانون المصري، يجب على الرعايا العرب والمصريين تقديم عقد زواج رسمي عند الإقامة كزوجين. حاملو جوازات سفر غير عربية مرحب بهم دون هذا الشرط.',
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          heading: PAYMENT_COPY.ar.heading,
          body: PAYMENT_COPY.ar.body,
        },
      ]
    : [
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          ),
          heading: 'Cancellation Policy',
          body: CANCELLATION_POLICY.flexible.description,
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
          heading: 'Eligibility',
          body: ELIGIBILITY_POLICY.general,
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          heading: PAYMENT_COPY.en.heading,
          body: PAYMENT_COPY.en.body,
        },
      ]

  return (
    <section className="bg-[var(--color-ground)] py-16 md:py-20">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col items-start gap-4">
              <span className="p-3 rounded-card bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">
                {col.icon}
              </span>
              <h3
                className="text-lg font-semibold text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {col.heading}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {col.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
