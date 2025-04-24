import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')

  return NextResponse.redirect(new URL('/LoginPage', request.url))
}
