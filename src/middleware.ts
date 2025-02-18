import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (session) {
    if (path === '/login' || path === '/register') {
      return NextResponse.redirect(
        new URL('/', req.url)
      )
    }

    if (path === '/' ) {
      return NextResponse.redirect(
        new URL('/tournaments', req.url)
      )
    }

  } else {
    if (path !== '/login' && path !== '/api-doc-odds') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [    '/((?!api|_next/static|_next/image|favicon.ico).*)',],
}
