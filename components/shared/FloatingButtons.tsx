'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+201000000000'

interface Message { role: 'user' | 'assistant'; content: string }
interface ListingResult { id: string; slug: string; title: string; area: string; pricePerNight: number; bedrooms: number; rating: number }
interface BlogPost { slug: string; title: string; category: string }

export default function FloatingButtons() {
  const pathname = usePathname()
  const isBlog = pathname?.startsWith('/blog')

  const WELCOME_MSG = isBlog
    ? "Hi! I'm Nesty 🐦 What brings you to Egypt? Tell me about your trip and I'll recommend the perfect reads for you!"
    : "Hi! I'm Nesty 🐦 Tell me what you're looking for and I'll find the perfect nest for you!"

  const [chatOpen, setChatOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME_MSG }
  ])
  const [blogResults, setBlogResults] = useState<BlogPost[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ListingResult[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  // Show notification bubble after 3 seconds if chat hasn't been opened
  useEffect(() => {
    const t = setTimeout(() => {
      if (!chatOpen) setShowNotif(true)
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const openChat = () => {
    setChatOpen(true)
    setShowNotif(false)
  }

  // Reset messages when switching between blog and non-blog pages
  useEffect(() => {
    setMessages([{ role: 'assistant', content: WELCOME_MSG }])
    setResults([])
    setBlogResults([])
  }, [isBlog])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const endpoint = isBlog ? '/api/chat/blog' : '/api/chat/listings'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, conversationHistory: history }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      if (isBlog && data.recommendedPosts?.length > 0) setBlogResults(data.recommendedPosts)
      if (!isBlog && data.matchingListings?.length > 0) setResults(data.matchingListings)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again!" }])
    } finally {
      setLoading(false)
    }
  }

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent('Hello! I am interested in booking a property on BirdNest.')}`

  return (
    <>
      {/* Chat panel */}
      {chatOpen && (
        <div className="fixed bottom-32 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-[20px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          <div className="bg-[#f4603d] text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">🐦</div>
              <div>
                <p className="font-semibold text-sm">Nesty</p>
                <p className="text-xs text-white/70">BirdNest AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] rounded-[14px] px-3 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#f4603d] text-white' : 'bg-gray-100 text-[#292a2b]'}`}>
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
            {results.length > 0 && (
              <div className="space-y-2 mt-1">
                <p className="text-xs font-semibold text-[#292a2b]/40 uppercase tracking-wider">Matching Nests</p>
                {results.slice(0, 3).map(l => (
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
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={isBlog ? "e.g. I'm visiting El Gouna for a week…" : "e.g. 2-bed in New Cairo with pool…"}
              className="flex-1 text-sm border border-gray-200 rounded-[10px] px-3 py-2.5 outline-none focus:border-[#f4603d]"
            />
            <button onClick={send} disabled={loading || !input.trim()} className="bg-[#f4603d] hover:bg-[#dd4f2e] disabled:opacity-40 text-white rounded-[10px] px-3 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Stacked floating buttons */}
      <div className="fixed bottom-6 right-4 md:right-6 z-50 flex flex-col items-center gap-3">
        {/* Nesty AI button */}
        <div className="relative">
          {/* Notification pop-up */}
          {showNotif && !chatOpen && (
            <div className="absolute bottom-16 right-0 bg-white rounded-[14px] shadow-xl border border-gray-100 p-3 w-52 animate-bounce-in">
              <button onClick={() => setShowNotif(false)} className="absolute top-1.5 right-2 text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
              <p className="text-xs font-semibold text-[#292a2b] mb-0.5">🐦 Meet Nesty!</p>
              <p className="text-xs text-[#292a2b]/60 leading-relaxed">Tell me what you want and I'll find your perfect nest.</p>
              {/* Arrow pointing down */}
              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
            </div>
          )}

          <button
            onClick={openChat}
            className="w-14 h-14 bg-[#f4603d] hover:bg-[#dd4f2e] text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
            aria-label="Chat with Nesty AI"
          >
            {chatOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            )}
            {/* Unread dot */}
            {!chatOpen && showNotif && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#237c58] rounded-full border-2 border-white" />
            )}
          </button>
        </div>

        {/* WhatsApp button */}
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
