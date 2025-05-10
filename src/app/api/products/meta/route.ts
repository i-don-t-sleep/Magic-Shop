import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(req: NextRequest) {
  try {
    /* ---------- 1) เชื่อมต่อฐานข้อมูล ---------- */
    const db = await connectDB()

    /* ---------- 2) ดึงค่า ENUM ของ category ---------- */
    const [catRows] = await db.query<RowDataPacket[]>(
      `SHOW COLUMNS FROM products LIKE 'category'`,
    )

    let categoryEnum: string[] = []
    if (catRows.length) {
      // รูปแบบที่ MySQL ส่งกลับ:  enum('A','B','C')
      const enumStr = catRows[0].Type as string
      const m = enumStr.match(/^enum\((.*)\)$/)
      if (m) {
        categoryEnum = m[1]
          .split(",")
          .map((v) => v.replace(/'/g, "").trim())
      }
    }

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
        MAX(CAST(REPLACE(price,'$','') AS DECIMAL(10,2))) AS maxPrice,
        MAX(quantity) AS maxQuantity
      FROM products
    `)

    const { maxPrice = 1000, maxQuantity = 100 } = statsRows[0] ?? {}

    /* ---------- 6) ส่งผลลัพธ์ ---------- */
    return NextResponse.json({
      success: true,
      categoryEnum,
      statusEnum,
      publishers,
      maxPrice: Math.ceil(Number(maxPrice)),
      maxQuantity: Math.ceil(Number(maxQuantity)),
    })
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch metadata" },
      { status: 500 },
    )
  }
}
