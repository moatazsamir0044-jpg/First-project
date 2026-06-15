'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Listing {
  id: string
  slug: string
  title: string
  area: string
  pricePerNight: number
  bedrooms: number
  rating: number
  images: string[]
}

export default function ListingsChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Nesty 🐦 Tell me what you're looking for and I'll find the perfect nest for you!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Listing[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, conversationHistory: history }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      if (data.matchingListings?.length > 0) setResults(data.matchingListings)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#f4603d] hover:bg-[#dd4f2e] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all hover:scale-105"
        aria-label="Chat with Nesty"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V8h10v4z"/>
        </svg>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-[20px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '520px' }}>
          {/* Header */}
          <div className="bg-[#f4603d] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">🐦</div>
              <div>
                <p className="font-semibold text-sm">Nesty</p>
                <p className="text-xs text-white/70">BirdNest AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-xl">×</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-[14px] px-3 py-2 text-sm ${m.role === 'user' ? 'bg-[#f4603d] text-white' : 'bg-gray-100 text-[#292a2b]'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-[14px] px-3 py-2 text-sm text-[#292a2b]">
                  <span className="animate-pulse">Nesty is thinking...</span>
                </div>
              </div>
            )}
            {results.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#292a2b]/50 uppercase tracking-wider">Matching Nests</p>
                {results.slice(0, 3).map(l => (
                  <Link key={l.id} href={`/listings/${l.slug}`} className="block bg-[#efe8e1] rounded-[12px] p-3 hover:bg-[#e5d8cf] transition-colors">
                    <p className="font-semibold text-sm text-[#292a2b]">{l.title}</p>
                    <p className="text-xs text-[#292a2b]/60">{l.area} · {l.bedrooms} bed · EGP {l.pricePerNight.toLocaleString()}/night · ★{l.rating}</p>
                  </Link>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="e.g. 2-bed in New Cairo with pool..."
              className="flex-1 text-sm border border-gray-200 rounded-[10px] px-3 py-2 outline-none focus:border-[#f4603d]"
            />
            <button onClick={send} disabled={loading || !input.trim()} className="bg-[#f4603d] hover:bg-[#dd4f2e] disabled:opacity-40 text-white rounded-[10px] px-3 py-2 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
