import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2"

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("account-info")
  if (!cookie) {
    return Response.json({ success: false, message: "Missing cookie" }, { status: 400 })
  }

  let username: string | undefined
  try {
    const parsed = JSON.parse(cookie.value)
    username = parsed.username
  } catch {
    return Response.json({ success: false, message: "Invalid cookie format" }, { status: 400 })
  }

  if (!username) {
    return Response.json({ success: false, message: "Missing username in cookie" }, { status: 400 })
  }

  const db = await connectDB()
  const [rows] = await db.query<RowDataPacket[]>("SELECT profilePicture FROM Admins WHERE Username = ?", [username])

  if (rows.length === 0) {
    return Response.json({ success: false, message: "User not found" }, { status: 404 })
  }

  return Response.json({ success: true, profilePicture: rows[0].profilePicture })
}
