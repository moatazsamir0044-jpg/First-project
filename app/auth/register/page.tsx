import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import AuthShell from '@/components/auth/AuthShell'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Create your account',
  description: 'Create a free BirdNest account to book verified holiday homes across Egypt.',
  robots: { index: false, follow: false },
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join BirdNest and book verified homes in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-semibold text-green hover:text-green-dk">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64 animate-pulse rounded-card bg-gray-100" />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  )
}
