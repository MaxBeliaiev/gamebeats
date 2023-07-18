import { getServerSession, NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/db'
import { randomBytes, randomUUID } from 'crypto'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 0.5 * 24 * 60 * 60, // 30 days
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString('hex')
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        const { email, password } = credentials
        if (!email || !password) {
          throw new Error('Missing username or password')
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user || !(await compare(password, user?.password))) {
          throw new Error('Invalid username or password')
        }

        return user
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = user.id
      }

      if (user) {
        // @ts-ignore
        token.role = user.role
      }

      return token
    },
    session({ session, token }) {
      // @ts-ignore
      session.user.token = token
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const getAuthSession = () => getServerSession(authOptions)
