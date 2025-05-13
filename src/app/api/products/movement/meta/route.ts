import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()

    /* ---------- 2) ดึงค่า ENUM ของ category ---------- */
    const [catRows] = await db.query<RowDataPacket[]>(
      `SELECT name FROM categories ORDER BY sort_order`,
    )
    const categoryEnum = catRows.map((r) => r.name as string)
    const [pubRows] = await db.query<RowDataPacket[]>(`SELECT name FROM publishers`)
    const publishers = pubRows.map((r) => r.name as string)

    // Fetch available warehouses (where productID is null)
    const [warehouseRows] = await db.query<RowDataPacket[]>(
      `SELECT location, capacity FROM warehouse WHERE productID IS NULL`,
    )

    const availableWarehouses = warehouseRows.map((row) => ({
      location: row.location,
      capacity: row.capacity,
    }))

    return NextResponse.json({
      success: true,
      categoryEnum,
      publishers,
      availableWarehouses,
    })
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch metadata" }, { status: 500 })
  }
}
