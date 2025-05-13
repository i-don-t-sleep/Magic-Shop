import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""

    const db = await connectDB()

    const query = `
      SELECT 
        p.id, p.name, p.price, p.quantity, p.status,
        pub.name as publisher_name
      FROM products p
      JOIN publishers pub ON p.publisherID = pub.id
      WHERE p.name LIKE ?
      ORDER BY p.name
      LIMIT 100
    `

    const [rows] = await db.query<RowDataPacket[]>(query, [`%${search}%`])

    return NextResponse.json({ products: rows })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
