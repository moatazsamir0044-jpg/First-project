'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import MashrabiyaPattern from '@/components/shared/MashrabiyaPattern'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+201000000000'
const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent('Hello! I am interested in booking a property on BirdNest.')}`

interface Message { role: 'user' | 'assistant'; content: string }
interface ListingResult { id: string; slug: string; title: string; area: string; pricePerNight: number; bedrooms: number; rating: number }
interface BlogPost { slug: string; title: string; category: string }

// ─── Shared chat UI ───────────────────────────────────────────────────────────
function ChatPanel({
  open, onClose, color, title, subtitle, messages, loading, input, setInput, onSend, listingResults, blogResults, placeholder,
}: {
  open: boolean; onClose: () => void; color: 'orange' | 'green'
  title: string; subtitle: string
  messages: Message[]; loading: boolean
  input: string; setInput: (v: string) => void; onSend: () => void
  listingResults: ListingResult[]; blogResults: BlogPost[]
  placeholder: string
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  if (!open) return null

  const bg = color === 'orange' ? 'bg-[#f4603d]' : 'bg-[#237c58]'
  const border = color === 'orange' ? 'focus:border-[#f4603d]' : 'focus:border-[#237c58]'
  const msgBg = color === 'orange' ? 'bg-[#f4603d]' : 'bg-[#237c58]'
  const sendBg = color === 'orange' ? 'bg-[#f4603d] hover:bg-[#dd4f2e]' : 'bg-[#237c58] hover:bg-[#1b6044]'

  return (
    <div className="fixed bottom-32 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-[20px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '480px' }}>
      <div className={`${bg} text-white px-4 py-3 flex items-center justify-between shrink-0 relative overflow-hidden`}>
        <MashrabiyaPattern opacity={0.12} tileSize={36} />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">🐦</div>
          <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-white/70">{subtitle}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[82%] rounded-[14px] px-3 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? `${msgBg} text-white` : 'bg-gray-100 text-[#292a2b]'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-[14px] px-3 py-2.5 text-sm text-[#292a2b]">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>·</span>
              </span>
            </div>
          </div>
        )}
        {listingResults.length > 0 && (
          <div className="space-y-2 mt-1">
            <p className="text-xs font-semibold text-[#292a2b]/40 uppercase tracking-wider">Matching Nests</p>
            {listingResults.slice(0, 3).map(l => (
              <a key={l.id} href={`/listings/${l.slug}`} className="block bg-[#efe8e1] rounded-[12px] p-3 hover:bg-[#e5d8cf] transition-colors">
                <p className="font-semibold text-sm text-[#292a2b]">{l.title}</p>
                <p className="text-xs text-[#292a2b]/60 mt-0.5">{l.area} · {l.bedrooms} bed · EGP {l.pricePerNight.toLocaleString()}/night · ★{l.rating}</p>
              </a>
            ))}
          </div>
        )}
        {blogResults.length > 0 && (
          <div className="space-y-2 mt-1">
            <p className="text-xs font-semibold text-[#292a2b]/40 uppercase tracking-wider">Recommended Reads</p>
            {blogResults.slice(0, 3).map(p => (
              <a key={p.slug} href={`/blog/${p.slug}`} className="block bg-[#efe8e1] rounded-[12px] p-3 hover:bg-[#e5d8cf] transition-colors">
                <p className="text-xs font-bold tracking-wider uppercase text-[#237c58] mb-0.5">{p.category}</p>
                <p className="font-semibold text-sm text-[#292a2b]">{p.title}</p>
              </a>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-100 p-3 flex gap-2 shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          placeholder={placeholder}
          className={`flex-1 text-sm border border-gray-200 rounded-[10px] px-3 py-2.5 outline-none ${border}`}
        />
        <button onClick={onSend} disabled={loading || !input.trim()} className={`${sendBg} disabled:opacity-40 text-white rounded-[10px] px-3 transition-colors`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>
        </button>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function FloatingButtons() {
  const pathname = usePathname()
  const isBlog = pathname?.startsWith('/blog')
  const isListings = pathname === '/' || pathname?.startsWith('/listings') || pathname?.startsWith('/book')

  // ── Listings chatbot state (persists for full visit) ──
  const [listingsOpen, setListingsOpen] = useState(false)
  const [listingsMessages, setListingsMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Nesty 🐦 Tell me what you're looking for and I'll find the perfect nest for you!" }
  ])
  const [listingsInput, setListingsInput] = useState('')
  const [listingsLoading, setListingsLoading] = useState(false)
  const [listingsResults, setListingsResults] = useState<ListingResult[]>([])
  const [listingsNotif, setListingsNotif] = useState(false)

  // ── Blog chatbot state (persists for full visit) ──
  const [blogOpen, setBlogOpen] = useState(false)
  const [blogMessages, setBlogMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Nesty 🐦 What brings you to Egypt? Tell me about your trip and I'll recommend the perfect reads for you!" }
  ])
  const [blogInput, setBlogInput] = useState('')
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogResults, setBlogResults] = useState<BlogPost[]>([])
  const [blogNotif, setBlogNotif] = useState(false)

  // Show notification once per section visit
  useEffect(() => {
    if (isBlog && blogMessages.length === 1) {
      const t = setTimeout(() => setBlogNotif(true), 3000)
      return () => clearTimeout(t)
    }
  }, [isBlog])

  useEffect(() => {
    if (isListings && listingsMessages.length === 1) {
      const t = setTimeout(() => setListingsNotif(true), 3000)
      return () => clearTimeout(t)
    }
  }, [isListings])

  // ── Listings send ──
  const sendListings = async () => {
    if (!listingsInput.trim() || listingsLoading) return
    const msg = listingsInput.trim()
    setListingsInput('')
    setListingsMessages(prev => [...prev, { role: 'user', content: msg }])
    setListingsLoading(true)
    try {
      const res = await fetch('/api/chat/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, conversationHistory: listingsMessages.map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      setListingsMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      if (data.matchingListings?.length > 0) setListingsResults(data.matchingListings)
    } catch {
      setListingsMessages(prev => [...prev, { role: 'assistant', content: "Sorry, connection issue. Please try again!" }])
    } finally {
      setListingsLoading(false)
    }
  }

  // ── Blog send ──
  const sendBlog = async () => {
    if (!blogInput.trim() || blogLoading) return
    const msg = blogInput.trim()
    setBlogInput('')
    setBlogMessages(prev => [...prev, { role: 'user', content: msg }])
    setBlogLoading(true)
    try {
      const res = await fetch('/api/chat/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, conversationHistory: blogMessages.map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      setBlogMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      if (data.recommendedPosts?.length > 0) setBlogResults(data.recommendedPosts)
    } catch {
      setBlogMessages(prev => [...prev, { role: 'assistant', content: "Sorry, connection issue. Please try again!" }])
    } finally {
      setBlogLoading(false)
    }
  }

  // Which chatbot panel is open (only one at a time)
  const activeChatOpen = isBlog ? blogOpen : isListings ? listingsOpen : false

  return (
    <>
      {/* Blog chatbot panel */}
      {isBlog && (
        <ChatPanel
          open={blogOpen} onClose={() => setBlogOpen(false)}
          color="green" title="Nesty — Travel Guide" subtitle="Your Egypt blog assistant"
          messages={blogMessages} loading={blogLoading}
          input={blogInput} setInput={setBlogInput} onSend={sendBlog}
          listingResults={[]} blogResults={blogResults}
          placeholder="e.g. I'm visiting El Gouna for a week…"
        />
      )}

      {/* Listings chatbot panel */}
      {isListings && (
        <ChatPanel
          open={listingsOpen} onClose={() => setListingsOpen(false)}
          color="orange" title="Nesty — Nest Finder" subtitle="BirdNest AI Assistant"
          messages={listingsMessages} loading={listingsLoading}
          input={listingsInput} setInput={setListingsInput} onSend={sendListings}
          listingResults={listingsResults} blogResults={[]}
          placeholder="e.g. 2-bed in New Cairo with pool…"
        />
      )}

      {/* Stacked floating buttons */}
      <div className="fixed bottom-6 right-4 md:right-6 z-50 flex flex-col items-center gap-3">

        {/* Blog Nesty button — only on blog pages */}
        {isBlog && (
          <div className="relative">
            {blogNotif && !blogOpen && (
              <div className="absolute bottom-16 right-0 bg-white rounded-[14px] shadow-xl border border-gray-100 p-3 w-52">
                <button onClick={() => setBlogNotif(false)} className="absolute top-1.5 right-2 text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
                <p className="text-xs font-semibold text-[#292a2b] mb-0.5">🐦 Nesty Travel Guide</p>
                <p className="text-xs text-[#292a2b]/60 leading-relaxed">Tell me about your Egypt trip and I'll suggest the best reads!</p>
                <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
              </div>
            )}
            <button
              onClick={() => { setBlogOpen(o => !o); setBlogNotif(false) }}
              className="w-14 h-14 bg-[#237c58] hover:bg-[#1b6044] text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
              aria-label="Chat with Nesty Travel Guide"
            >
              {blogOpen
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                : <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              }
              {!blogOpen && blogNotif && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f4603d] rounded-full border-2 border-white" />}
            </button>
          </div>
        )}

        {/* Listings Nesty button — only on listings/property/booking pages */}
        {isListings && (
          <div className="relative">
            {listingsNotif && !listingsOpen && (
              <div className="absolute bottom-16 right-0 bg-white rounded-[14px] shadow-xl border border-gray-100 p-3 w-52">
                <button onClick={() => setListingsNotif(false)} className="absolute top-1.5 right-2 text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
                <p className="text-xs font-semibold text-[#292a2b] mb-0.5">🐦 Meet Nesty!</p>
                <p className="text-xs text-[#292a2b]/60 leading-relaxed">Tell me what you want and I'll find your perfect nest.</p>
                <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
              </div>
            )}
            <button
              onClick={() => { setListingsOpen(o => !o); setListingsNotif(false) }}
              className="w-14 h-14 bg-[#f4603d] hover:bg-[#dd4f2e] text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
              aria-label="Chat with Nesty"
            >
              {listingsOpen
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                : <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              }
              {!listingsOpen && listingsNotif && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#237c58] rounded-full border-2 border-white" />}
            </button>
          </div>
        )}

        {/* WhatsApp — always visible */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </>
  )
}
