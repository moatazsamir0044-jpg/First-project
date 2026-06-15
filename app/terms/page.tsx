import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CANCELLATION_POLICY, ELIGIBILITY_POLICY, VISITS_POLICY, PETS_POLICY, CONTACT_INFO } from '@/lib/policies'

export const metadata: Metadata = {
  title: 'Terms & Policies | BirdNest',
  description: 'BirdNest cancellation, eligibility, pets, visits and payment policies.',
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="bg-[#efe8e1] py-16">
          <div className="container-site max-w-3xl text-center">
            <p className="text-[#f4603d] font-semibold uppercase tracking-widest text-sm mb-3">Legal</p>
            <h1 className="font-heading text-4xl md:text-5xl text-[#292a2b] mb-4">Terms &amp; Policies</h1>
            <p className="text-[#292a2b]/60">Last updated: January 2025</p>
          </div>
        </div>

        <div className="container-site max-w-3xl py-16 space-y-12">
          <section>
            <h2 className="font-heading text-2xl text-[#292a2b] mb-6">Cancellation &amp; Refund Policy</h2>
            {Object.entries(CANCELLATION_POLICY).map(([key, policy]) => (
              <div key={key} className="mb-6 p-6 rounded-[16px] border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${policy.color === 'green' ? 'bg-[#237c58]' : policy.color === 'orange' ? 'bg-[#f4603d]' : 'bg-red-500'}`}>
                    {policy.label}
                  </span>
                </div>
                <ul className="space-y-2">
                  {policy.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#292a2b]/70 text-sm">
                      <span className="text-[#237c58] mt-0.5">✓</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#292a2b] mb-4">Eligibility Policy</h2>
            <div className="p-6 rounded-[16px] bg-[#efe8e1] border border-[#f4603d]/20 mb-4">
              <p className="text-[#292a2b]/80 leading-relaxed">{ELIGIBILITY_POLICY.general}</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-[12px] bg-orange-50 border border-orange-100">
                <h3 className="font-semibold text-[#292a2b] mb-2">Arab Nationals</h3>
                <p className="text-sm text-[#292a2b]/70">{ELIGIBILITY_POLICY.arabNational}</p>
              </div>
              <div className="p-4 rounded-[12px] bg-green-50 border border-green-100">
                <h3 className="font-semibold text-[#292a2b] mb-2">Non-Arab Nationals</h3>
                <p className="text-sm text-[#292a2b]/70">{ELIGIBILITY_POLICY.nonArab}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#292a2b] mb-4">Visits Policy</h2>
            <p className="text-[#292a2b]/70 leading-relaxed">{VISITS_POLICY}</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#292a2b] mb-4">Pets Policy</h2>
            <p className="text-[#292a2b]/70 leading-relaxed">{PETS_POLICY}</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#292a2b] mb-4">Payment</h2>
            <p className="text-[#292a2b]/70 leading-relaxed">Visa and Mastercard accepted. All fees including reservation charges, cleaning fees, service fees, and applicable taxes are displayed during booking. No hidden fees.</p>
          </section>

          <section className="bg-[#efe8e1] rounded-[16px] p-8">
            <h2 className="font-heading text-2xl text-[#292a2b] mb-4">Contact Us</h2>
            <ul className="space-y-2 text-[#292a2b]/70">
              <li>Address: {CONTACT_INFO.address}</li>
              <li>Email: <a href={`mailto:${CONTACT_INFO.email}`} className="text-[#f4603d] hover:underline">{CONTACT_INFO.email}</a></li>
              <li>Phone: <a href={`tel:${CONTACT_INFO.phone}`} className="text-[#f4603d] hover:underline">{CONTACT_INFO.phone}</a></li>
              <li>WhatsApp: <a href={CONTACT_INFO.whatsappUrl} className="text-[#237c58] hover:underline">{CONTACT_INFO.whatsapp}</a></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
