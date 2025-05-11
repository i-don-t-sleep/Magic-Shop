import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"

// Mark all notifications as read
export async function POST(request: NextRequest) {
  try {
    // Get user ID from cookie or session
    const cookieStore = await cookies()
    const accountInfo = cookieStore.get("account-info")

    if (!accountInfo?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = JSON.parse(accountInfo.value)
    const userId = userData.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters for optional category filter
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || null

    // Connect to database
    const db = await connectDB()

    // Build query with optional category filter
    let query = "UPDATE notifications SET is_read = TRUE WHERE user_id = ?"
    const queryParams: any[] = [userId]

    if (category) {
      query += " AND category = ?"
      queryParams.push(category)
    }

    // Mark notifications as read
    await db.execute(query, queryParams)

    return NextResponse.json({
      message: "All notifications marked as read",
    })
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 })
  }
}
