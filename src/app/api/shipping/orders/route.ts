import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

// GET handler to fetch orders available for shipping
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get("status") || "Processing"

    const db = await connectDB()

    // Get orders that are in the specified status (default: Processing)
    // and don't already have a shipping record
 const [rows] = await db.query<RowDataPacket[]>(
  `SELECT 
    o.id,
    o.userID,
    o.totalPrice,
    o.orderStatus,
    o.createdAt,
    o.updatedAt,
    o.notes,
    u.name AS userName,
    p.name AS productName,
    pi.name AS productImage
  FROM \`order\` o
  LEFT JOIN users u ON o.userID = u.id
  LEFT JOIN orderitems oi ON o.id = oi.orderID
  LEFT JOIN products p ON oi.productID = p.id
  LEFT JOIN productimages pi ON p.id = pi.productID
  LEFT JOIN shipping s ON o.id = s.orderID
  WHERE o.orderStatus = ? AND s.parcel_number IS NULL
  GROUP BY o.id
  ORDER BY o.createdAt DESC`,
  [status]
)



    return NextResponse.json({
      success: true,
      orders: rows,
    })
  } catch (error: any) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
