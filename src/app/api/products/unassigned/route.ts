import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()

    // Get products that don't have a warehouse assigned
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.name,
        (
          SELECT w.id 
          FROM warehouse w 
          WHERE w.productID = p.id 
          LIMIT 1
        ) as warehouseID,
        (
          SELECT w.location 
          FROM warehouse w 
          WHERE w.productID = p.id 
          LIMIT 1
        ) as warehouseName
      FROM products p
      WHERE NOT EXISTS (
        SELECT 1 
        FROM warehouse w 
        WHERE w.productID = p.id
      )
      ORDER BY p.name
    `)

    return NextResponse.json({
      success: true,
      products: rows,
    })
  } catch (error) {
    console.error("Error fetching unassigned products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch unassigned products" }, { status: 500 })
  }
}
