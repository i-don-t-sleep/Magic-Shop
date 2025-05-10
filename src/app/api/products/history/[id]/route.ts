import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
  }

  const productId = Number(id)

  try {
    const db = await connectDB()

    // Query to get product movements
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
        pm.productID,
        pm.warehouseID,
        pm.movementType,
        pm.quantity,
        pm.reason,
        pm.movedAt,
        CONCAT(a.firstName, ' ', a.lastName) AS adminName,
        a.role AS adminType
      FROM 
        productmovement pm
      LEFT JOIN 
        admins a ON pm.adminID = a.id
      WHERE 
        pm.productID = ?
      ORDER BY 
        pm.movedAt DESC`,
      [productId],
    )

    if (!Array.isArray(rows)) {
      return NextResponse.json({ success: false, message: "Failed to fetch movement history" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      movements: rows,
    })
  } catch (error: any) {
    console.error("Error fetching product movement history:", error)
    return NextResponse.json({ success: false, message: `Error: ${error.message}` }, { status: 500 })
  }
}
