import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

// GET handler for fetching products (existing code)
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

  const limit = Number.parseInt(url.searchParams.get("limit") || "6")
  const page = Number.parseInt(url.searchParams.get("page") || "1")
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

  const data = rows.map((r) => ({
    name: r.name,
    price: `$${Number(r.price).toFixed(2)}`,
    quantity: r.quantity,
    imageUrl: r.firstImgId ? `/api/blob/productimages/${r.firstImgId}` : `/api/images/placeholder.png`,
    href: `${slugify(r.name)}&pid=${r.id}&pub=${slugify(r.publisherName)}`,
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




// POST handler for creating a new product
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Extract product data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const category = formData.get("category") as string
    const publisherId = Number.parseInt(formData.get("publisherId") as string)
    const warehouseLocation = formData.get("warehouseLocation") as string

    // Validate required fields
    if (!name || !price || isNaN(price) || !quantity || isNaN(quantity) || !publisherId || isNaN(publisherId)) {
      return NextResponse.json({ success: false, message: "Missing or invalid required fields" }, { status: 400 })
    }

    // Determine status based on quantity
    const status = quantity > 0 ? "Available" : "Out of Stock"

    const db = await connectDB()

    // Start transaction
    await db.beginTransaction()

    try {
      // Insert product
      const [productResult] = await db.execute<ResultSetHeader>(
        `INSERT INTO products (name, description, price, quantity, category, status, publisherID) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, description, price, quantity, category, status, publisherId],
      )

      const productId = (productResult as any)[0]?.insertId || productResult.insertId

      // Handle image uploads
      const images = formData.getAll("images") as File[]

      if (images && images.length > 0) {
        for (const image of images) {
          if (image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer())
            const imageName = image.name
            const mimeType = image.type.split("/")[1] // Extract image type (png, jpeg, etc.)

            await db.execute(
              `INSERT INTO productimages (productID, name, description, img, mimeType) 
               VALUES (?, ?, ?, ?, ?)`,
              [productId, imageName, "", buffer, mimeType],
            )
          }
        }
      }

      // Handle warehouse location if provided
      if (warehouseLocation) {
        // Insert into warehouse table
        await db.execute(
          `INSERT INTO warehouse (location, productID, capacity) 
           VALUES (?, ?, ?)`,
          [warehouseLocation, productId, quantity],
        )

        // Record product movement (IN)
        if (quantity > 0) {
          await db.execute(
            `INSERT INTO productmovement (productID, warehouseID, movementType, quantity, reason) 
             VALUES (?, ?, 'IN', ?, ?)`,
            [productId, warehouseLocation, quantity, "Initial stock"],
          )
        }
      }

      // Commit transaction
      await db.commit()

      return NextResponse.json({
        success: true,
        message: "Product added successfully",
        productId,
      })
    } catch (error) {
      // Rollback on error
      await db.rollback()
      throw error
    }
  } catch (error: any) {
    console.error("Error adding product:", error)
    return NextResponse.json({ success: false, message: `Error adding product: ${error.message}` }, { status: 500 })
  }
}

// Helper function: slugify
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
