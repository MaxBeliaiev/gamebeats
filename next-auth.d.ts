import type { User } from 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth/jwt' {

  interface JWT {
    id: string
    role: UserRole
  }
}

declare module 'next-auth' {
  import { User } from 'next-auth'

  export type SessionUser =  User & {
    id: string
    token: string
    role: UserRole
    surname: string
  }
  interface Session {
    user: SessionUser
  }
}