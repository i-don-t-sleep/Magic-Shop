import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 })
    }

    const db = await connectDB()

    // Query the warehouse table to get the location for this product
    const [rows] = await db.query<RowDataPacket[]>("SELECT location FROM warehouse WHERE productID = ?", [productId])

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No warehouse location found for this product",
        location: null,
      })
    }

    return NextResponse.json({
      success: true,
      location: rows[0].location,
    })
  } catch (error: any) {
    console.error("Error fetching warehouse location:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error fetching warehouse location: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
