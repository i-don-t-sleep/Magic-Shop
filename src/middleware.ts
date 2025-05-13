// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const info = request.cookies.get('account-info')?.value
  let role: string | null = null

  // อ่าน role จาก cookie “account-info”
  if (info) {
    try {
      const account = JSON.parse(info)
      role = account.role
    } catch (e) {
      // ถ้า parse ไม่ได้ ก็ปล่อย role เป็น null
    }
  }

  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/LoginPage'

  // 1) ถ้าไม่มี token แล้วเข้าหน้าที่ไม่ใช่ LoginPage → บังคับไป LoginPage
  if (!token) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/LoginPage', request.url))
    }
    return NextResponse.next()
  }

  // 2) ถ้ามี token แล้วเข้าหน้า LoginPage → redirect ไป Dashboard ตาม role
  if (isLoginPage) {
    let dest = '/LoginPage'
    switch (role) {
      case 'Customer':
        dest = '/Customer/dashboard'
        break
      case 'Data Entry Admin':
        dest = '/Data-Entry-Admin/dashboard'
        break
      case 'Publisher':
        dest = '/Publisher/dashboard'
        break
      case 'Super Admin':
        dest = '/SuperAdmins/dashboard'
        break
    }
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // 3) Authorization: ถ้าเข้าระบบส่วนใด ให้ role ต้องตรงกับส่วนนั้น
  if (pathname.startsWith('/Customer') && role !== 'Customer') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
  if (pathname.startsWith('/Data-Entry-Admin') && role !== 'Data Entry Admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
  if (pathname.startsWith('/Publisher') && role !== 'Publisher') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
  if (pathname.startsWith('/SuperAdmins') && role !== 'Super Admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // ถ้าผ่านทุกเงื่อนไข → ให้เข้าต่อได้
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/Customer/:path*',
    '/Data-Entry-Admin/:path*',
    '/Publisher/:path*',
    '/SuperAdmins/:path*',
    '/LoginPage',
  ],
}
