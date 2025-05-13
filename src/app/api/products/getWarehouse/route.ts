import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"
import { Warehouse } from "lucide-react"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const productId = Number.parseInt(url.searchParams.get("productID") || "")

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing productID" },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT location, capacity FROM warehouse WHERE productID = ?`,
      [productId]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "No warehouse found for this product" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      Warehouse: [rows[0]], // ส่ง location + capacity
    })
  } catch (error: any) {
    console.error("Error fetching warehouse by productID:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch warehouse" },
      { status: 500 }
    )
  }
}
