// src/app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/db"
import { ResultSetHeader } from "mysql2/promise"

export async function POST(request: NextRequest) {
  const raw = request.cookies.get("account-info")?.value
  let username: string | undefined
  if (raw) {
    try { username = JSON.parse(decodeURIComponent(raw)).username }
    catch {/* cookie เพี้ยนก็ข้ามไป */}
  }

  /* 2) (optional) อัปเดต sessionState = 'Offline' */
  if (username) {
    try {
      const db = await connectDB()
      await db.execute<ResultSetHeader>(
        "UPDATE users SET sessionState = ? WHERE username = ?",
        ["Offline", username]
      )
    } catch (e) { console.error("Logout update failed", e) }
  }

  const redirectRes = NextResponse.redirect(
    new URL("/LoginPage", request.url),   // ← ไปยังหน้าล็อกอิน
    302                                   // (ค่า default)
  )

  redirectRes.headers.append(
    "Set-Cookie",
    "account-info=; Path=/; Max-Age=0; SameSite=Lax"
  )
  redirectRes.headers.append(
    "Set-Cookie",
    "session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
  )
  
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')

  return redirectRes
}

/*
export async function GET(request: Request) {
  const db = await connectDB()
  await db.execute<ResultSetHeader>(
    "UPDATE users SET	sessionState = ? WHERE username = ?",
    ["Offline", request.username]
  )

  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  return   NextResponse.redirect(new URL('/LoginPage', request.url))
}
  */
