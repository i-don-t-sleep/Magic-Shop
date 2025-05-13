import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { ReviewsResponse, ReviewWithDetails } from "@/types/reviews"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const db = await connectDB()

    // Query reviews with product, publisher, category, and user
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT 
        r.productID, r.userID, r.comment, r.score, r.createdAt, r.updatedAt,
        p.id as product_id, p.name, p.description, p.category_id, p.price, p.quantity, p.status, p.publisherID,
        pub.name as publisher_name,
        c.name as category_name,
        u.id as user_id, u.username
      FROM reviews r
      JOIN products p ON r.productID = p.id
      JOIN publishers pub ON p.publisherID = pub.id
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON r.userID = u.id
      WHERE p.name LIKE ?
      ORDER BY r.createdAt DESC
      LIMIT ? OFFSET ?
    `,
      [`%${search}%`, limit, offset]
    )

    // Get total count
    const [countResult] = await db.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) as total
      FROM reviews r
      JOIN products p ON r.productID = p.id
      WHERE p.name LIKE ?
    `,
      [`%${search}%`]
    )

    // Fetch first image per product
    const [imageRows] = await db.query<RowDataPacket[]>(
      `
      SELECT pi.productID, pi.id, pi.mimeType
      FROM productimages pi
      JOIN (
        SELECT MIN(id) AS id
        FROM productimages
        GROUP BY productID
      ) firstImages ON pi.id = firstImages.id
    `
    )

    const imageMap = new Map<number, { id: number; mimeType: string }>()
    imageRows.forEach((img) => {
      imageMap.set(img.productID, {
        id: img.id,
        mimeType: img.mimeType,
      })
    })

    const reviews = rows.map((row) => {
      const imageInfo = imageMap.get(row.product_id)

      return {
        review: {
          productID: row.productID,
          userID: row.userID,
          comment: row.comment,
          score: row.score,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
        product: {
          id: row.product_id,
          name: row.name,
          description: row.description,
          category_id: row.category_id,
          price: Number(row.price),
          quantity: row.quantity,
          status: row.status,
          publisherID: row.publisherID,
          publisher_name: row.publisher_name,
          category_name: row.category_name,
          thumbnailUrl: imageInfo ? `/api/blob/productimages/${imageInfo.id}` : null,
        },
        user: {
          id: row.user_id,
          username: row.username,
        },
      }
    })

    const response: ReviewsResponse = {
      reviews,
      totalCount: countResult[0].total,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}


// Add a new review
export async function POST(request: NextRequest) {
  try {
    const { productID, userID, comment, score } = await request.json()

    // Validate required fields
    if (!productID || !userID || !comment || score === undefined) {
      return NextResponse.json({ error: "Missing required fields: productID, userID, comment, score" }, { status: 400 })
    }

    // Validate score is between 1 and 5
    if (score < 1 || score > 5) {
      return NextResponse.json({ error: "Score must be between 1 and 5" }, { status: 400 })
    }

    const db = await connectDB()

    // Check if user has already reviewed this product
    const [existingReview] = await db.query<RowDataPacket[]>(
      "SELECT * FROM reviews WHERE productID = ? AND userID = ?",
      [productID, userID]
    )

    if (existingReview.length > 0) {
      return NextResponse.json(
        { error: "You have already reviewed this product. Please edit your existing review." },
        { status: 409 },
      )
    }

    // Insert the new review
    await db.query(
      "INSERT INTO reviews (productID, userID, comment, score) VALUES (?, ?, ?, ?)",
      [productID, userID, comment, score]
    )

    return NextResponse.json({ success: true, message: "Review added successfully" })
  } catch (error) {
    console.error("Error adding review:", error)
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 })
  }
}





