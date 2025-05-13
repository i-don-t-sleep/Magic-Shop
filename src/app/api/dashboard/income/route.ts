import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const db = await connectDB()

    // Get time range from query params
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month"

    let groupBy, dateFormat, limit

    // Set SQL parameters based on period
    switch (period) {
      case "week":
        groupBy = "DATE(createdAt)"
        dateFormat = "%Y-%m-%d"
        limit = 7
        break
      case "month":
        groupBy = "DATE(createdAt)"
        dateFormat = "%Y-%m-%d"
        limit = 30
        break
      case "year":
        groupBy = "MONTH(createdAt)"
        dateFormat = "%m"
        limit = 12
        break
      default:
        groupBy = "DATE(createdAt)"
        dateFormat = "%Y-%m-%d"
        limit = 30
    }

    // Get income data grouped by time period
    const [incomeData] = await db.query(
      `SELECT 
         DATE_FORMAT(createdAt, ?) as period,
         SUM(totalPrice) as income
       FROM order
       WHERE orderStatus NOT IN ('Cancelled', 'Refunded')
       GROUP BY ${groupBy}
       ORDER BY createdAt DESC
       LIMIT ?`,
      [dateFormat, limit],
    )

    // Format the response
    const formattedData = Array.isArray(incomeData)
      ? incomeData.map((item) => ({
          period: item.period,
          income: Number.parseFloat(item.income || 0),
        }))
      : []

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching income data:", error)
    return NextResponse.json({ error: "Failed to fetch income data" }, { status: 500 })
  }
}
