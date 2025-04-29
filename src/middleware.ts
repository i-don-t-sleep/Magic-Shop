// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const isLoginPage = request.nextUrl.pathname === '/LoginPage'

  if (request.nextUrl.pathname.startsWith('/SuperAdmins') && !token) {
    return NextResponse.redirect(new URL('/LoginPage', request.url))
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/SuperAdmins/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/SuperAdmins/:path*', '/LoginPage'],
}
