import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(req: NextRequest) {
  try {
    /* ---------- 1) เชื่อมต่อฐานข้อมูล ---------- */
    const db = await connectDB()

    /* ---------- 2) ดึงค่า ENUM ของ category ---------- */
    const [catRows] = await db.query<RowDataPacket[]>(
      `SELECT name FROM categories ORDER BY sort_order`,
    )
    const categoryEnum = catRows.map((r) => r.name as string)

    /* ---------- 3) ดึงค่า ENUM ของ status ---------- */
    const [statRows] = await db.query<RowDataPacket[]>(
      `SHOW COLUMNS FROM products LIKE 'status'`,
    )

    let statusEnum: string[] = []
    if (statRows.length) {
      const enumStr = statRows[0].Type as string
      const m = enumStr.match(/^enum\((.*)\)$/)
      if (m) {
        statusEnum = m[1]
          .split(",")
          .map((v) => v.replace(/'/g, "").trim())
      }
    }

    /* ---------- 4) รายชื่อ publisher ---------- */
    const [pubRows] = await db.query<RowDataPacket[]>(`SELECT name FROM publishers`)
    const publishers = pubRows.map((r) => r.name as string)

    /* ---------- 5) maxPrice / maxQuantity ---------- */
    const [statsRows] = await db.query<RowDataPacket[]>(`
      SELECT
        MIN(CAST(REPLACE(price,'$','') AS DECIMAL(10,2))) AS minPrice,
        MAX(CAST(REPLACE(price,'$','') AS DECIMAL(10,2))) AS maxPrice,
        MIN(quantity) AS minQuantity,
        MAX(quantity) AS maxQuantity
      FROM products
    `)

    const {minPrice = 100, maxPrice = 1000, minQuantity = 100, maxQuantity = 1000} = statsRows[0] ?? {}
    const { } = statsRows[0] ?? {}

    /* ---------- 6) ส่งผลลัพธ์ ---------- */
    return NextResponse.json({
      success: true,
      categoryEnum,
      statusEnum,
      publishers,
      maxPrice: Number(maxPrice).toFixed(2),
      maxQuantity: Math.ceil(Number(maxQuantity)),
      minPrice: Number(minPrice).toFixed(2),
      minQuantity: Math.ceil(Number(minQuantity)),
    })
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch metadata" },
      { status: 500 },
    )
  }
}
