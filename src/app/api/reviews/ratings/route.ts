import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const db = await connectDB()

    // Query to get rating distribution for a product
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT 
        score,
        COUNT(*) as count
      FROM reviews
      WHERE productID = ?
      GROUP BY score
      ORDER BY score DESC
    `,
      [productId]
    )

    // Transform to distribution array [5-star%, 4-star%, 3-star%, 2-star%, 1-star%]
    const distribution = [0, 0, 0, 0, 0]
    let total = 0

    rows.forEach((row) => {
      total += row.count as number
    })

    if (total > 0) {
      rows.forEach((row) => {
        const score = row.score as number
        const percentage = Math.round((row.count as number / total) * 100)
        distribution[5 - score] = percentage
      })
    }

    // Query to get average rating
    const [avgResult] = await db.query<RowDataPacket[]>(
      `SELECT AVG(score) as average FROM reviews WHERE productID = ?`,
      [productId]
    )
    const averageRating = Number(avgResult[0]?.average) || 0

    // Query to get total review count
    const [countResult] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM reviews WHERE productID = ?`,
      [productId]
    )
    const reviewCount = countResult[0]?.total || 0

    return NextResponse.json({
      distribution,
      averageRating,
      reviewCount,
    })
  } catch (error) {
    console.error("Error fetching rating distribution:", error)
    return NextResponse.json({ error: "Failed to fetch rating distribution" }, { status: 500 })
  }
}
