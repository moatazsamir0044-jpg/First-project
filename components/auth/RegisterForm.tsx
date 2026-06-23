'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'

const rules = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'A number', test: (p: string) => /[0-9]/.test(p) },
]

export default function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showRequirements, setShowRequirements] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allValid = rules.every((r) => r.test(password)) && name.trim().length >= 2 && /\S+@\S+\.\S+/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!allValid) {
      setError('Please complete all fields and meet the password requirements.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Could not create your account. Please try again.')
        setLoading(false)
        return
      }
      // Auto sign-in after successful registration.
      const signInRes = await signIn('credentials', { email, password, redirect: false })
      setLoading(false)
      if (signInRes?.error) {
        router.push('/auth/signin')
        return
      }
      router.push('/account')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div role="alert" className="animate-pop rounded-btn bg-orange/10 text-orange-dk text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">Full name</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-btn border border-gray-200 px-4 py-3 text-ink focus:border-orange focus:ring-2 focus:ring-orange/20 focus:outline-none transition"
          placeholder="Layla Hassan"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-btn border border-gray-200 px-4 py-3 text-ink focus:border-orange focus:ring-2 focus:ring-orange/20 focus:outline-none transition"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPw ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowRequirements(true)}
            onBlur={() => setShowRequirements(false)}
            className="w-full rounded-btn border border-gray-200 px-4 py-3 pr-11 text-ink focus:border-orange focus:ring-2 focus:ring-orange/20 focus:outline-none transition"
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>

          {showRequirements && (
            <div className="absolute z-20 left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
              <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-2.5">Password requirements</p>
              <ul className="space-y-2">
                {rules.map((r) => {
                  const ok = r.test(password)
                  return (
                    <li key={r.label} className={`flex items-center gap-2 text-sm transition-colors ${ok ? 'text-green' : 'text-ink/50'}`}>
                      <span className={`flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 transition-colors ${ok ? 'bg-green text-white' : 'bg-gray-100'}`}>
                        {ok && <Check className="w-3 h-3" />}
                      </span>
                      {r.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange text-white font-semibold rounded-btn py-3 hover:bg-orange-dk transition-colors disabled:opacity-60 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-xs text-ink/50 text-center">
        By creating an account you agree to our{' '}
        <a href="/terms" className="text-green underline">Terms</a>.
      </p>
    </form>
  )
}
