// src/app/api/logout/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/db"
import type { ResultSetHeader } from "mysql2/promise"

export async function POST(request: NextRequest) {
  const raw = request.cookies.get("account-info")?.value
  let username: string | undefined
  if (raw) {
    try {
      username = JSON.parse(decodeURIComponent(raw)).username
    } catch {
      /* cookie เพี้ยนก็ข้ามไป */
    }
  }

  /* 2) (optional) อัปเดต sessionState = 'Offline' */
  if (username) {
    try {
      const db = await connectDB()
      await db.execute<ResultSetHeader>("UPDATE users SET sessionState = ? WHERE username = ?", ["Offline", username])
    } catch (e) {
      console.error("Logout update failed", e)
    }
  }

  const redirectRes = NextResponse.redirect(
    new URL("/LoginPage", request.url), // ← ไปยังหน้าล็อกอิน
    302, // (ค่า default)
  )

  const cookiesToClear = ["auth_token", "account-info", "session", "product-filters", "product-cards-per-row"]

  // Clear via response headers
  cookiesToClear.forEach((cookieName) => {
    redirectRes.headers.append("Set-Cookie", `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax`)
  })

  // Clear server-side cookies
  const cookieStore = await cookies()
  cookiesToClear.forEach((cookieName) => {
    cookieStore.delete(cookieName)
  })

  return redirectRes
}
