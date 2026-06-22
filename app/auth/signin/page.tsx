import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import AuthShell from '@/components/auth/AuthShell'
import SignInForm from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your BirdNest account to manage bookings and saved homes.',
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your bookings and saved nests."
      footer={
        <>
          New to BirdNest?{' '}
          <Link href="/auth/register" className="font-semibold text-green hover:text-green-dk">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64 animate-pulse rounded-card bg-gray-100" />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  )
}
