import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"

// Get a specific notification
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

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

    // Get notification
    const [notifications] = await db.execute("SELECT * FROM notifications WHERE id = ? AND user_id = ?", [id, userId])

    if ((notifications as any[]).length === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json((notifications as any[])[0])
  } catch (error) {
    console.error("Error fetching notification:", error)
    return NextResponse.json({ error: "Failed to fetch notification" }, { status: 500 })
  }
}

// Update a notification (mark as read)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { is_read } = body

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

    // Check if notification exists and belongs to user
    const [notifications] = await db.execute("SELECT * FROM notifications WHERE id = ? AND user_id = ?", [id, userId])

    if ((notifications as any[]).length === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    // Update notification
    await db.execute("UPDATE notifications SET is_read = ? WHERE id = ?", [is_read, id])

    // Get updated notification
    const [updatedNotifications] = await db.execute("SELECT * FROM notifications WHERE id = ?", [id])

    return NextResponse.json({
      message: "Notification updated successfully",
      notification: (updatedNotifications as any[])[0],
    })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}

// Delete a notification
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

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

    // Check if notification exists and belongs to user
    const [notifications] = await db.execute("SELECT * FROM notifications WHERE id = ? AND user_id = ?", [id, userId])

    if ((notifications as any[]).length === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    // Delete notification
    await db.execute("DELETE FROM notifications WHERE id = ?", [id])

    return NextResponse.json({
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
  }
}
