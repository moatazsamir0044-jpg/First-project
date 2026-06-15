'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', enquiryType: 'general', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
  }

  return (
    <>
      <Header />
      <main>
        <section className="bg-cream py-16">
          <div className="container-site max-w-xl mx-auto text-center">
            <h1 className="font-heading text-4xl font-semibold text-ink mb-4">Get in Touch</h1>
            <p className="text-ink/60">We'd love to hear from you. Our team responds within 2 hours.</p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Form */}
              <div>
                {sent ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-green"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h2 className="font-heading text-xl font-semibold text-ink mb-2">Message Sent!</h2>
                    <p className="text-ink/60 text-sm">We'll get back to you within 2 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">Full Name *</label>
                      <input type="text" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full border border-gray-200 rounded-btn px-4 py-3 text-sm outline-none focus:border-orange" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">Email *</label>
                      <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full border border-gray-200 rounded-btn px-4 py-3 text-sm outline-none focus:border-orange" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">Enquiry Type</label>
                      <select value={form.enquiryType} onChange={e => setForm(f => ({...f, enquiryType: e.target.value}))} className="w-full border border-gray-200 rounded-btn px-4 py-3 text-sm outline-none focus:border-orange bg-white">
                        <option value="general">General Enquiry</option>
                        <option value="booking">Booking Support</option>
                        <option value="list">List My Property</option>
                        <option value="press">Press & Media</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">Message *</label>
                      <textarea required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={5} className="w-full border border-gray-200 rounded-btn px-4 py-3 text-sm outline-none focus:border-orange resize-none" placeholder="How can we help?" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-orange text-white font-semibold py-3.5 rounded-btn hover:bg-orange-dk transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                      {loading ? (
                        <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</>
                      ) : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact info */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-ink mb-4">Other Ways to Reach Us</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-cream rounded-card">
                      <div className="w-10 h-10 bg-[#25D366]/10 rounded-full flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-ink mb-0.5">WhatsApp</p>
                        <p className="text-xs text-ink/60 mb-2">Fastest response — usually under 15 minutes</p>
                        <WhatsAppButton variant="inline" className="text-xs py-1.5 px-3">
                          +20 100 000 0000
                        </WhatsAppButton>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-cream rounded-card">
                      <div className="w-10 h-10 bg-orange/10 rounded-full flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#f4603d" strokeWidth="2" className="w-5 h-5">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-ink mb-0.5">Email</p>
                        <p className="text-xs text-ink/60 mb-1">We reply within 2 hours</p>
                        <a href="mailto:hello@birdnestlife.com" className="text-sm font-medium text-orange hover:underline">hello@birdnestlife.com</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-ink text-white rounded-card">
                  <h3 className="font-heading text-base font-semibold mb-2">List Your Property</h3>
                  <p className="text-white/60 text-sm mb-3">Own a property in Cairo, North Coast, El Gouna, or Sheikh Zayed? Join BirdNest and earn more.</p>
                  <a href="mailto:list@birdnestlife.com" className="text-sm font-semibold text-orange hover:underline">list@birdnestlife.com</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
