import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'

declare module 'next-auth' {
  interface Session {
    user: { id: string; role: string } & DefaultSession['user']
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Trust the deployment host header (required behind Vercel/other proxies).
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        })

        // Reject if no user, or the account was created via OAuth (no password set).
        if (!user || !user.passwordHash) return null

        const valid = await verifyPassword(password, user.passwordHash)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string
      session.user.role = (token.role as string) ?? 'user'
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})
