'use client'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 hover:text-orange transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  )
}
