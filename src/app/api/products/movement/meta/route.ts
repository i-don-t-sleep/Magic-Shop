import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()

    const [catRows] = await db.query<RowDataPacket[]>(
      `SHOW COLUMNS FROM products LIKE 'category'`,
    )

    let categoryEnum: string[] = []
    if (catRows.length) {
      const enumStr = catRows[0].Type as string
      const m = enumStr.match(/^enum\((.*)\)$/)
      if (m) {
        categoryEnum = m[1]
          .split(",")
          .map((v) => v.replace(/'/g, "").trim())
      }
    }

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

    const [pubRows] = await db.query<RowDataPacket[]>(`SELECT name FROM publishers`)
    const publishers = pubRows.map((r) => r.name as string)


    return NextResponse.json({
      success: true,
      categoryEnum,
      statusEnum,
      publishers,
    })
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch metadata" },
      { status: 500 },
    )
  }
}
