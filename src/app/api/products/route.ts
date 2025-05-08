import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { RowDataPacket } from "mysql2/promise"

export async function GET(req: NextRequest) {
  const db = await connectDB()
  const url = req.nextUrl

  // ====== รับค่าจาก query string ======
  const category = url.searchParams.get("category")
  const publisher = url.searchParams.get("publisher")
  const minPrice = url.searchParams.get("minPrice")
  const maxPrice = url.searchParams.get("maxPrice")
  const sort = url.searchParams.get("sort")
  const stockstatus = url.searchParams.get("status")
  const search = url.searchParams.get("search")?.trim()

  const limit = parseInt(url.searchParams.get("limit") || "2")
  const page = parseInt(url.searchParams.get("page") || "1")
  const offset = (page - 1) * limit

  // ====== WHERE clause ======
  const whereClauses: string[] = []
  const whereArgs: any[] = []

  if (stockstatus === "Available") {
    whereClauses.push(`p.status = 'Available'`)
  } else if (stockstatus === "Out of Stock") {
    whereClauses.push(`p.status = 'Out of Stock'`)
  }

  if (category) {
    whereClauses.push(`p.category = ?`)
    whereArgs.push(category)
  }

  if (publisher) {
    whereClauses.push(`pub.name = ?`)
    whereArgs.push(publisher)
  }

  if (minPrice) {
    whereClauses.push(`p.price >= ?`)
    whereArgs.push(Number(minPrice))
  }

  if (maxPrice) {
    whereClauses.push(`p.price <= ?`)
    whereArgs.push(Number(maxPrice))
  }

  if (search) {
    whereClauses.push(`p.name LIKE ?`)
    whereArgs.push(`%${search}%`)
  }

  const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""

  // ====== Query ข้อมูลสินค้า ======
  let sql = `
    SELECT
      p.id,
      p.name,
      p.price,
      p.quantity,
      pub.name AS publisherName,
      img.firstImgId
    FROM products AS p
    JOIN publishers AS pub ON pub.id = p.publisherID
    LEFT JOIN (
      SELECT productID, MIN(id) AS firstImgId
      FROM productimages
      GROUP BY productID
    ) AS img ON img.productID = p.id
    ${whereClause}
  `

  // ====== ORDER BY ======
  if (sort === "price-asc") {
    sql += ` ORDER BY p.price ASC`
  } else if (sort === "price-desc") {
    sql += ` ORDER BY p.price DESC`
  } else if (sort === "quantity-asc") {
    sql += ` ORDER BY p.quantity ASC`
  } else if (sort === "quantity-desc") {
    sql += ` ORDER BY p.quantity DESC`
  } else {
    sql += ` ORDER BY p.id`
  }

  sql += ` LIMIT ? OFFSET ?`
  const queryArgs = [...whereArgs, limit, offset]

  const [rows] = await db.query<RowDataPacket[]>(sql, queryArgs)

  const data = rows.map(r => ({
    name: r.name,
    price: `$${Number(r.price).toFixed(2)}`,
    quantity: r.quantity,
    imageUrl: r.firstImgId
      ? `/api/blob/productimages/${r.firstImgId}`
      : `/api/images/placeholder.png`,
    href: `${slugify(r.name)}&pid=${r.id}&pub=${slugify(r.publisherName)}`
  }))

  // ====== Query total count ======
  const countSql = `
    SELECT COUNT(*) as total
    FROM products AS p
    JOIN publishers AS pub ON pub.id = p.publisherID
    ${whereClause}
  `
  const [countRows] = await db.query<RowDataPacket[]>(countSql, whereArgs)
  const totalCount = countRows[0].total

  return NextResponse.json({ data, total: totalCount })
}

// helper: สร้าง slug จากชื่อสินค้า
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}
