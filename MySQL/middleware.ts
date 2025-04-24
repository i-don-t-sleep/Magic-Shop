// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const isLoginPage = request.nextUrl.pathname === '/LoginPage'

  if (request.nextUrl.pathname.startsWith('/magic-shop') && !token) {
    return NextResponse.redirect(new URL('/LoginPage', request.url))
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/magic-shop/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/magic-shop/:path*', '/LoginPage'],
}
