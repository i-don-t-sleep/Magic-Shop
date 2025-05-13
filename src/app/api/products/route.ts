import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

/* ---------- slugify util ---------- */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function GET(req: NextRequest) {
  try {
    /* ---------- query-string ---------- */
    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get("page") ?? "1")
    const limit = Number.parseInt(url.searchParams.get("limit") ?? "10")
    const search = url.searchParams.get("search") ?? ""
    const categories = url.searchParams.getAll("category")
    const publishers = url.searchParams.getAll("publisher")
    const minPrice = url.searchParams.get("minPrice") ?? ""
    const maxPrice = url.searchParams.get("maxPrice") ?? ""
    const minQuantity = url.searchParams.get("minQuantity") ?? ""
    const maxQuantity = url.searchParams.get("maxQuantity") ?? ""
    const statuses = url.searchParams.getAll("status")
    const sort = url.searchParams.get("sort") ?? "id-desc"

    const offset = (page - 1) * limit

    /* ---------- WHERE clause ---------- */
    const conditions: string[] = []
    const params: (string | number)[] = []

    if (search) {
      conditions.push("(p.name LIKE ? OR p.description LIKE ?)")
      params.push(`%${search}%`, `%${search}%`)
    }

    if (categories.length > 0) {
      conditions.push(`cat.name IN (${categories.map(() => "?").join(",")})`)
      params.push(...categories)
    }

    if (publishers.length > 0) {
      conditions.push(`pub.name IN (${publishers.map(() => "?").join(",")})`)
      params.push(...publishers)
    }

    if (minPrice) {
      conditions.push("p.price >= ?")
      params.push(minPrice)
    }

    if (maxPrice) {
      conditions.push("p.price <= ?")
      params.push(maxPrice)
    }

    if (minQuantity) {
      conditions.push("p.quantity >= ?")
      params.push(minQuantity)
    }

    if (maxQuantity) {
      conditions.push("p.quantity <= ?")
      params.push(maxQuantity)
    }

    if (statuses.length > 0) {
      conditions.push(`p.status IN (${statuses.map(() => "?").join(",")})`)
      params.push(...statuses)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    /* ---------- ORDER BY ---------- */
    const orderByClause = (
      {
        "price-asc": "ORDER BY p.price ASC",
        "price-desc": "ORDER BY p.price DESC",
        "quantity-asc": "ORDER BY p.quantity ASC",
        "quantity-desc": "ORDER BY p.quantity DESC",
        "id-asc": "ORDER BY p.id ASC",
        "id-desc": "ORDER BY p.id DESC",
      } as const
    )[sort] ?? "ORDER BY p.price ASC"

    /* ---------- DB ---------- */
    const db = await connectDB()

    /* ---------- count ---------- */
    const [countRows] = await db.query<RowDataPacket[]>(
      `
        SELECT COUNT(*) AS total
        FROM products p
        LEFT JOIN categories cat ON p.category_id = cat.id
        LEFT JOIN publishers pub ON p.publisherID = pub.id
        ${whereClause}
      `,
      params,
    )
    const total = countRows[0].total as number

    /* ---------- data ---------- */
    const [rows] = await db.query<RowDataPacket[]>(
      `
        SELECT
          p.id,
          p.name,
          p.price,
          p.quantity,
          cat.name AS category,
          p.status,
          pub.name AS publisherName,
          (
            SELECT CONCAT('/api/blob/productimages/', pi.id)
            FROM productimages pi
            WHERE pi.productID = p.id
            ORDER BY pi.id ASC
            LIMIT 1
          ) AS primaryImage
        FROM products p
        LEFT JOIN categories cat ON p.category_id = cat.id
        LEFT JOIN publishers pub ON p.publisherID = pub.id
        ${whereClause}
        ${orderByClause}
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset],
    )

    /* ---------- post-process href ---------- */
    const data = rows.map((r: any) => ({
      ...r,
      href: `${slugify(r.name)}&pid=${r.id}&pub=${slugify(r.publisherName)}`,
    }))

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error("Error fetching products:", err)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}
