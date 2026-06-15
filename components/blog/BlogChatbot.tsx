'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'nesty'
  content: string
  posts?: any[]
}

export default function BlogChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [greeted, setGreeted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!greeted) {
      const timer = setTimeout(() => {
        setOpen(true)
        setMessages([{ role: 'nesty', content: "Hi! I'm Nesty 🐦 What brings you to Egypt? Tell me about your trip and I'll recommend the perfect reads for you!" }])
        setGreeted(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [greeted])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role === 'nesty' ? 'assistant' : 'user', content: m.content }))
      const res = await fetch('/api/chat/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, conversationHistory: history }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'nesty', content: data.message, posts: data.recommendedPosts }])
    } catch {
      setMessages(prev => [...prev, { role: 'nesty', content: "Sorry, I'm having trouble right now. Please try again!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[380px] max-h-[520px] bg-white rounded-[16px] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-[#237c58] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="white" className="w-5 h-5"><path d="M16 8C12 8 9 11 9 14.5C9 17.5 11 19.5 13 21L16 24L19 21C21 19.5 23 17.5 23 14.5C23 11 20 8 16 8Z"/></svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Nesty</p>
                <p className="text-white/70 text-xs">Your Egypt travel guide</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white p-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-[#237c58] text-white rounded-[16px] rounded-tr-[4px]' : 'bg-[#efe8e1] text-[#292a2b] rounded-[16px] rounded-tl-[4px]'} px-4 py-2.5 text-sm leading-relaxed`}>
                  {msg.content}
                  {msg.posts && msg.posts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.posts.map((post: any) => (
                        <div key={post.slug} className="bg-white rounded-[12px] p-3 border border-gray-100">
                          <span className="inline-block bg-[#f4603d] text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5">{post.category}</span>
                          <p className="font-semibold text-xs text-[#292a2b] leading-tight mb-1">{post.title}</p>
                          <p className="text-xs text-[#292a2b]/50 mb-2 line-clamp-2">{post.excerpt}</p>
                          <Link href={`/blog/${post.slug}`} className="block text-center bg-[#237c58] text-white text-xs font-semibold py-1.5 rounded-[8px] hover:bg-[#1b6044] transition-colors">
                            Read Article
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#efe8e1] rounded-[16px] rounded-tl-[4px] px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 bg-[#292a2b]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#292a2b]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#292a2b]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Tell me about your trip..."
              className="flex-1 text-sm px-4 py-2.5 border border-gray-200 rounded-full outline-none focus:border-[#237c58] transition-colors"
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} className="w-10 h-10 bg-[#237c58] hover:bg-[#1b6044] disabled:opacity-40 rounded-full flex items-center justify-center transition-colors shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => { setOpen(!open); if (!greeted) { setMessages([{ role: 'nesty', content: "Hi! I'm Nesty 🐦 What brings you to Egypt? Tell me about your trip and I'll recommend the perfect reads for you!" }]); setGreeted(true) } }}
        className="w-14 h-14 bg-[#237c58] hover:bg-[#1b6044] rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        )}
      </button>
    </div>
  )
}
