import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()

    // Query to get all products with publisher information
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
        p.id, 
        p.name, 
        pub.name AS publisherName
      FROM 
        products p
      JOIN 
        publishers pub ON p.publisherID = pub.id
      ORDER BY 
        p.name ASC`,
    )

    if (!Array.isArray(rows)) {
      return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      products: rows.map((row) => ({
        id: row.id,
        name: row.name,
        publisherName: row.publisherName,
      })),
    })
  } catch (error: any) {
    console.error("Error fetching products list:", error)
    return NextResponse.json({ success: false, message: `Error: ${error.message}` }, { status: 500 })
  }
}
