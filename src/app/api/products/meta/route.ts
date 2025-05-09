

import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

// Function ดึง enum values ของ column ใน MySQL
async function getEnumValues(db: any, table: string, column: string): Promise<string[]> {
  const [rows] = await db.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [column])
  if (!Array.isArray(rows) || rows.length === 0) return []

  const row = rows[0]
  const type = row.Type // e.g. "enum('Available','Out of Stock')"
  const enumValues = type
    .replace(/^enum\(/, "")
    .replace(/\)$/, "")
    .split(",")
    .map((val: string) => val.trim().replace(/^'/, "").replace(/'$/, ""))

  return enumValues
}

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()

    const [categoryEnum, statusEnum, [publishers]] = await Promise.all([
      getEnumValues(db, "products", "category"),
      getEnumValues(db, "products", "status"),
      db.query("SELECT name FROM publishers ORDER BY name ASC"),
    ])

    return NextResponse.json({
      success: true,
      categoryEnum,
      statusEnum,
      publishers: (publishers as any[]).map((p) => p.name),
    })
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
  }
}
