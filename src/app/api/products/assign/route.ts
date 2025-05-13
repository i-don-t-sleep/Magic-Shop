import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function POST(req: NextRequest) {
  try {
    const { productId, warehouseId } = await req.json()

    if (!productId || !warehouseId) {
      return NextResponse.json(
        { success: false, message: "Product ID and warehouse location are required|"},
        { status: 400 },
      )
    }

    const db = await connectDB()

    // ตรวจสอบ warehouse
    const [warehouseRows] = await db.query<RowDataPacket[]>(
      "SELECT location, productID FROM warehouse WHERE id = ?",
      [warehouseId],
    )

    if (warehouseRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Warehouse not found" },
        { status: 404 },
      )
    }

    const warehouse = warehouseRows[0]

    if (warehouse.productID) {
      return NextResponse.json(
        { success: false, message: "Warehouse already contains a product" },
        { status: 400 },
      )
    }

    const [usedCheck] = await db.query<RowDataPacket[]>(
      "SELECT location FROM warehouse WHERE productID = ?",
      [productId],
    )

    if (usedCheck.length > 0) {
      return NextResponse.json(
        { success: false, message: `Product already assigned to warehouse ${usedCheck[0].location}` },
        { status: 400 },
      )
    }

    // ผูก product เข้ากับ warehouse
    await db.query(
      "UPDATE warehouse SET productID = ? WHERE id = ?",
      [productId, warehouseId],
    )

    return NextResponse.json(
      { success: true, message: "Product assigned to warehouse successfully" },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error assigning product to warehouse:", error)
    return NextResponse.json(
      { success: false, message: "Failed to assign product to warehouse" },
      { status: 500 },
    )
  }
}
