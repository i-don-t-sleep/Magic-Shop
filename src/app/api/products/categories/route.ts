import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

// Module-scope cache
let categoriesCache: { id: number; name: string }[] | null = null

// Helper: Load categories from DB
async function loadCategoriesFromDB(): Promise<{ id: number; name: string }[]> {
  const db = await connectDB()
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, name
     FROM categories
     ORDER BY sort_order, id`
  )
  return rows.map(r => ({ id: r.id as number, name: r.name as string }))
}

// GET handler: Return categories
export async function GET(req: NextRequest) {
  try {
    if (!categoriesCache) {
      categoriesCache = await loadCategoriesFromDB()
    }
    const names = categoriesCache.map(c => c.name)
    return NextResponse.json({ success: true, categories: names })
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST handler: Sync categories list (add, delete, reorder)
export async function POST(req: NextRequest) {
  try {
    const { categories: newList } = await req.json()
    if (!Array.isArray(newList) || newList.length === 0) {
      return NextResponse.json({ success: false, message: "Categories array is required" }, { status: 400 })
    }
    // Normalize and dedupe
    const input = Array.from(new Set(newList.map((n: any) => String(n).trim()).filter(n => n)))
    if (input.length === 0) {
      return NextResponse.json({ success: false, message: "No valid category names provided" }, { status: 400 })
    }
    if (!categoriesCache) categoriesCache = await loadCategoriesFromDB()

    const db = await connectDB()
    await db.beginTransaction()
    try {
      const existing = categoriesCache.map(c => c.name)
      // Find 'Other' id for reassignment
      const otherCat = categoriesCache.find(c => c.name === "Other")
      if (!otherCat) throw new Error("Other category not found")

      // 1) Handle deletions: categories removed from new list
      for (const name of existing) {
        if (!input.includes(name)) {
          const cat = categoriesCache.find(c => c.name === name)
          if (!cat) continue
          // Reassign products to Other
          await db.query(
            `UPDATE products SET category_id = ? WHERE category_id = ?`,
            [otherCat.id, cat.id]
          )
          // Delete category
          await db.query(`DELETE FROM categories WHERE id = ?`, [cat.id])
        }
      }
      // 2) Handle additions: categories new in input
      for (const name of input) {
        if (!existing.includes(name)) {
          await db.query(`INSERT INTO categories (name, sort_order) VALUES (?, ?)`, [name, 0])
        }
      }
      // 3) Reorder according to input
      for (let i = 0; i < input.length; i++) {
        await db.query(`UPDATE categories SET sort_order = ? WHERE name = ?`, [i, input[i]])
      }
      await db.commit()

      // Refresh cache
      categoriesCache = await loadCategoriesFromDB()
      return NextResponse.json({
        success: true,
        message: "Categories synchronized successfully",
        categories: categoriesCache.map(c => c.name)
      })
    } catch (err) {
      await db.rollback()
      throw err
    }
  } catch (error: any) {
    console.error("Error syncing categories:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
