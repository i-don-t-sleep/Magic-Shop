import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"

// Get all notifications for the current user
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const category = searchParams.get("category") || null
    const isRead = searchParams.get("isRead") !== null ? searchParams.get("isRead") === "true" : null

    // Connect to database
    const db = await connectDB()

    // Build query with filters
    let query = `
      SELECT * FROM notifications 
      WHERE user_id = ? 
        AND (expire_at IS NULL OR expire_at > NOW())
    `
    const queryParams: any[] = [userId]
    
    if (category) {
      query += " AND category = ?"
      queryParams.push(category)
    }

    if (isRead !== null) {
      query += " AND is_read = ?"
      queryParams.push(isRead)
    }

    // Add sorting and pagination
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    queryParams.push(limit, offset)

    // Execute query
    const [notifications] = await db.execute(query, queryParams)
    // Get total count for pagination
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM notifications 
       WHERE user_id = ? 
         AND (expire_at IS NULL OR expire_at > NOW())
         ${category ? " AND category = ?" : ""}
         ${isRead !== null ? " AND is_read = ?" : ""}`,
      queryParams.slice(0, -2), // Remove limit and offset
    )

    const total = (countResult as any)[0].total

    return NextResponse.json({
      notifications,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

// Create a new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, category, type, title, message, link_url, expire_at = null } = body

    // Validate required fields
    if (!user_id || !category || !type || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate category and type
    const validCategories = ["system", "order", "review", "stock"]
    const validTypes = [
      "system_announcement",
      "maintenance",
      "order_placed",
      "order_shipped",
      "order_cancelled",
      "order_delivered",
      "new_review",
      "review_reported",
      "stock_low",
      "stock_out",
    ]

    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    // Connect to database
    const db = await connectDB()

    // Insert notification
    const [result] = await db.execute(
      `INSERT INTO notifications 
       (user_id, category, type, title, message, link_url, expire_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, category, type, title, message, link_url, expire_at],
    )

    const insertId = (result as any).insertId

    // Get the created notification
    const [notifications] = await db.execute("SELECT * FROM notifications WHERE id = ?", [insertId])

    return NextResponse.json(
      {
        message: "Notification created successfully",
        notification: (notifications as any[])[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
