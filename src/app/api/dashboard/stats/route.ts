import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const db = await connectDB()

    // Get time range from query params (default to 30 days)
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Calculate date for filtering
    const date = new Date()
    date.setDate(date.getDate() - days)
    const dateStr = date.toISOString().split("T")[0]

    // Get completed orders count
    const [ordersResult] = await db.query(
      `SELECT COUNT(*) as count 
       FROM \`order\` 
       WHERE orderStatus IN ('Delivered', 'Shipped') 
       AND createdAt >= ?`,
      [dateStr],
    )
    const ordersCompleted = ordersResult[0]?.count || 0

    // Get new users count
    const [usersResult] = await db.query(
      `SELECT COUNT(*) as count 
       FROM users 
       WHERE joinDate >= ?`,
      [dateStr],
    )
    const newUsers = usersResult[0]?.count || 0

    // Get total revenue
    const [revenueResult] = await db.query(
      `SELECT SUM(totalPrice) as total 
       FROM \`order\` 
       WHERE orderStatus NOT IN ('Cancelled', 'Refunded') 
       AND createdAt >= ?`,
      [dateStr],
    )
    const totalRevenue = revenueResult[0]?.total || 0

    return NextResponse.json({
      ordersCompleted,
      newUsers,
      totalRevenue,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
