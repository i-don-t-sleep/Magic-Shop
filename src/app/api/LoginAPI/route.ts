import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2"
import { NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (typeof username !== "string" || typeof password !== "string") {
    return Response.json({ success: false, message: "Invalid input" }, { status: 400 })
  }

  try {
    const db = await connectDB()
    const [rows] = await db.query<RowDataPacket[]>("SELECT id, password, role FROM users WHERE username = ?", [username])

    if (rows.length === 0) {
      return Response.json({ success: false, field: "error", message: "Invalid username or password" }, { status: 401 })
    }

    const user = rows[0]
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return Response.json({ success: false, field: "error", message: "Invalid username or password" }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set("auth_token", "valid", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      username: username,
      role: user.role,
    })

    response.headers.set(
      "Set-Cookie",
      `account-info=${encodeURIComponent(
        JSON.stringify({
          username: username,
          role: user.role,
          id: user.id,
        }),
      )}; Path=/; Max-Age=86400; SameSite=Strict`,
    )

    await db.execute<ResultSetHeader>("UPDATE users SET	sessionState = ? WHERE username = ?", ["Online", username])

    return response
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: "Database error: " + error.message,
      },
      { status: 500 },
    )
  }
}
