import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAdmin =
    (session?.role === 'ADMIN') || (session?.role === 'SUPER_ADMIN')

  if (session) {
    if (path === '/login' || path === '/register') {
      return NextResponse.redirect(
        new URL(isAdmin ? '/dashboard' : '/', req.url)
      )
    }

    if (!isAdmin && path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  } else {
    if (
      (path !== '/login' && path !== '/register') ||
      path.startsWith('/dashboard')
    ) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
