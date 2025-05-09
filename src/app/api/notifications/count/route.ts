import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"

// Get notification counts
export async function GET(request: NextRequest) {
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

    // Connect to database
    const db = await connectDB()

    // Get total unread count
    const [totalResult] = await db.execute(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE user_id = ? AND is_read = FALSE 
         AND (expire_at IS NULL OR expire_at > NOW())`,
      [userId],
    )

    const totalUnread = (totalResult as any[])[0].count

    // Get counts by category
    const [categoryResults] = await db.execute(
      `SELECT category, COUNT(*) as count FROM notifications 
       WHERE user_id = ? AND is_read = FALSE 
         AND (expire_at IS NULL OR expire_at > NOW())
       GROUP BY category`,
      [userId],
    )

    // Format category counts
    const categoryCounts: Record<string, number> = {}
    for (const row of categoryResults as any[]) {
      categoryCounts[row.category] = row.count
    }

    return NextResponse.json({
      total: totalUnread,
      categories: categoryCounts,
    })
  } catch (error) {
    console.error("Error fetching notification counts:", error)
    return NextResponse.json({ error: "Failed to fetch notification counts" }, { status: 500 })
  }
}
