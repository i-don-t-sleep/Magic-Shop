// app/api/categories/route.ts  (หรือ pages/api/categories.ts)
import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

// Module-scope cache
let categoriesCache: string[] | null = null

// Helper: โหลดจาก DB เฉพาะแรกครั้งเดียว
async function loadCategoriesFromDB(): Promise<string[]> {
  const db = await connectDB()
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT COLUMN_TYPE
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_NAME = 'products'
       AND COLUMN_NAME = 'category'`
  )
  if (!rows.length) throw new Error("Cannot retrieve category metadata")
  const enumString = rows[0].COLUMN_TYPE as string
  const matches = enumString.match(/'([^']+)'/g)
  if (!matches) throw new Error("Cannot parse ENUM values")
  return matches.map(m => m.replace(/'/g, ""))
}

// GET handler: คืนค่าแล้วเก็บ cache
export async function GET(req: NextRequest) {
  try {
    if (!categoriesCache) {
      categoriesCache = await loadCategoriesFromDB()
    }
    return NextResponse.json({ success: true, categories: categoriesCache })
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    )
  }
}

// POST handler: เพิ่มค่าใหม่ แล้วอัปเดต cache
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 })
    }

    // โหลด cache ถ้ายังไม่มี
    if (!categoriesCache) {
      categoriesCache = await loadCategoriesFromDB()
    }

    // ตรวจซ้ำ
    if (categoriesCache.includes(name)) {
      return NextResponse.json({ success: false, message: "Category already exists" }, { status: 409 })
    }

    // เพิ่มแล้วอัปเดต ENUM ใน DB
    const updated = [...categoriesCache, name]
    const enumDef = updated.map(c => `'${c.replace(/'/g, "''")}'`).join(", ")
    const db = await connectDB()
    await db.query(`
      ALTER TABLE products
      MODIFY COLUMN category ENUM(${enumDef}) NOT NULL
    `)

    // อัปเดต cache
    categoriesCache = updated

    return NextResponse.json({
      success: true,
      message: "Category added successfully",
      category: name,
    })
  } catch (error: any) {
    console.error("Error adding category:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    )
  }
}
