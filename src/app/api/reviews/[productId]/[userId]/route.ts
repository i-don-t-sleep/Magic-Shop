import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

// Update an existing review
export async function PUT(request: NextRequest, { params }: { params: { productId: string; userId: string } }) {
  try {
    const { comment, score } = await request.json()
    const productId = Number.parseInt(params.productId)
    const userId = Number.parseInt(params.userId)

    if (!comment || score === undefined) {
      return NextResponse.json({ error: "Missing required fields: comment, score" }, { status: 400 })
    }

    if (score < 1 || score > 5) {
      return NextResponse.json({ error: "Score must be between 1 and 5" }, { status: 400 })
    }

    const db = await connectDB()

    const [existingReview] = await db.query<RowDataPacket[]>(
      "SELECT * FROM reviews WHERE productID = ? AND userID = ?",
      [productId, userId],
    )

    if (existingReview.length === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    await db.query(
      "UPDATE reviews SET comment = ?, score = ?, updatedAt = CURRENT_TIMESTAMP WHERE productID = ? AND userID = ?",
      [comment, score, productId, userId],
    )

    return NextResponse.json({ success: true, message: "Review updated successfully" })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

// Delete a review
export async function DELETE(request: NextRequest, { params }: { params: { productId: string; userId: string } }) {
  try {
    const productId = Number.parseInt(params.productId)
    const userId = Number.parseInt(params.userId)

    const db = await connectDB()

    const [existingReview] = await db.query<RowDataPacket[]>(
      "SELECT * FROM reviews WHERE productID = ? AND userID = ?",
      [productId, userId],
    )

    if (existingReview.length === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    await db.query("DELETE FROM reviews WHERE productID = ? AND userID = ?", [productId, userId])

    return NextResponse.json({ success: true, message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}