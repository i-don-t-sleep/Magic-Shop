import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { RowDataPacket } from "mysql2/promise"

export async function GET(req: NextRequest) {
  const db = await connectDB()
  const url = req.nextUrl

  // ====== รับค่าจาก query string ======
  const category  = url.searchParams.get("category")  // eg: 'Dice'
  const publisher = url.searchParams.get("publisher") // eg: 'wangshu-corporation'
  const minPrice  = url.searchParams.get("minPrice")  // eg: '100'
  const maxPrice  = url.searchParams.get("maxPrice")  // eg: '300'
  const sort      = url.searchParams.get("sort")      // eg: 'price-asc', 'quantity-desc'

  // ====== สร้าง SQL แบบ dynamic พร้อม args ======
  let sql = `
    SELECT
      p.id,
      p.name,
      p.price,
      p.quantity,
      pub.name AS publisherName,
      img.firstImgId
    FROM products AS p
    JOIN publishers AS pub
      ON pub.id = p.publisherID
    LEFT JOIN (
      SELECT productID, MIN(id) AS firstImgId
      FROM productimages
      GROUP BY productID
    ) AS img
      ON img.productID = p.id
  ` //WHERE p.status = 'Available'
  const args: any[] = []

  if (category) {
    sql += ` AND p.category = ?`
    args.push(category)
  }
  if (publisher) {
    sql += ` AND pub.name = ?`
    args.push(publisher)
  }
  if (minPrice) {
    sql += ` AND p.price >= ?`
    args.push(Number(minPrice))
  }
  if (maxPrice) {
    sql += ` AND p.price <= ?`
    args.push(Number(maxPrice))
  }

  // ====== รองรับการ sort ======
  if (sort === "price-asc") {
    sql += ` ORDER BY p.price ASC`
  } else if (sort === "price-desc") {
    sql += ` ORDER BY p.price DESC`
  } else if (sort === "quantity-asc") {
    sql += ` ORDER BY p.quantity ASC`
  } else if (sort === "quantity-desc") {
    sql += ` ORDER BY p.quantity DESC`
  } else {
    sql += ` ORDER BY p.id` // default
  }

  // ====== รัน query ======
  const [rows] = await db.query<RowDataPacket[]>(sql, args)

  // ====== map ออกไปยัง frontend ======
  const data = rows.map(r => ({
    name     : r.name,
    price    : `$${Number(r.price).toFixed(2)}`,
    quantity : r.quantity,
    imageUrl : r.firstImgId
      ? `/api/blob/productimages/${r.firstImgId}`
      : `/api/images/placeholder.png`,
    href     : `${slugify(r.name)}&pid=${r.id}&pub=${slugify(r.publisherName)}`
  }))

  return NextResponse.json(data)
}

// helper: สร้าง slug จากชื่อสินค้า
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}
