import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"

// Clear all read notifications for the current user
export async function DELETE(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || null

    // Connect to database
    const db = await connectDB()

    // Build query with filters
    let query = "DELETE FROM notifications WHERE user_id = ? AND is_read = TRUE"
    const queryParams: any[] = [userId]

    if (category) {
      query += " AND category = ?"
      queryParams.push(category)
    }

    // Execute query
    const [result] = await db.execute(query, queryParams)
    const deletedCount = (result as any).affectedRows || 0

    return NextResponse.json({
      message: "Read notifications cleared successfully",
      deletedCount,
    })
  } catch (error) {
    console.error("Error clearing read notifications:", error)
    return NextResponse.json({ error: "Failed to clear read notifications" }, { status: 500 })
  }
}
