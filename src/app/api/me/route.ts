// /app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("account-info")
  if (!cookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const user = JSON.parse(cookie.value)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: "Invalid cookie format" }, { status: 400 })
  }
}
