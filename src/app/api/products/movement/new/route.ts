import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Extract product data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const category = formData.get("category") as string
    const publisherName = formData.get("publisherName") as string
    const warehouseLocation = formData.get("warehouseLocation") as string
    const reason = formData.get("reason") as string

    // Validate required fields
    if (!name || isNaN(price) || isNaN(quantity) || !category || !publisherName || !reason) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing or invalid required fields`,
          debug: { name, price, quantity, category, publisherName, reason },
        },
        { status: 400 }
      )
    }

    const status = quantity > 0 ? "Available" : "Out of Stock"

    const db = await connectDB()
    await db.beginTransaction()

    try {
      // Get category ID
      const [catRows] = await db.query<RowDataPacket[]>(
        `SELECT id FROM categories WHERE name = ?`,
        [category]
      )
      if (catRows.length === 0) {
        await db.rollback()
        return NextResponse.json({ success: false, message: `Category '${category}' not found` }, { status: 400 })
      }
      const categoryId = catRows[0].id as number

      // Get publisher ID
      const [pubRows] = await db.query<RowDataPacket[]>(
        `SELECT id FROM publishers WHERE name = ?`,
        [publisherName]
      )
      if (pubRows.length === 0) {
        await db.rollback()
        return NextResponse.json({ success: false, message: `Publisher '${publisherName}' not found` }, { status: 400 })
      }
      const publisherId = pubRows[0].id as number

      // Insert product (initial quantity = 0)
      const [productResult] = await db.execute<ResultSetHeader>(
        `INSERT INTO products 
          (name, description, price, quantity, category_id, status, publisherID) 
         VALUES (?, ?, ?, 0, ?, ?, ?)`,
        [name, description, price, categoryId, status, publisherId],
      )
      const productId = productResult.insertId

      // Handle images
      const images: { file: File; description: string }[] = []

      for (const [key, value] of formData.entries()) {
        const match = key.match(/^image(\d+)$/)
        if (match && value instanceof File && value.size > 0) {
          const index = match[1]
          const desc = formData.get(`imageDescription${index}`) as string || ""
          images.push({ file: value, description: desc })
        }
      }

      for (const { file, description } of images) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const mimeType = file.type.split("/")[1] || "jpeg"
        await db.execute(
          `INSERT INTO productimages (productID, name, description, img, mimeType)
           VALUES (?, ?, ?, ?, ?)`,
          [productId, file.name, description, buffer, mimeType]
        )
      }

      // Handle warehouse assignment
      let warehouseId: string | null = null
      if (warehouseLocation) {
        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT productID FROM warehouse WHERE location = ?",
          [warehouseLocation],
        )
        if (rows.length && rows[0].productID && rows[0].productID !== productId) {
          await db.rollback()
          return NextResponse.json(
            { success: false, message: "This warehouse location is already assigned" },
            { status: 400 }
          )
        }
        warehouseId = warehouseLocation
      }

      // Record initial movement
      await db.execute(
        `INSERT INTO productmovement 
          (productID, warehouseLoc, movementType, quantity, reason)
         VALUES (?, ?, 'IN', ?, ?)`,
        [productId, warehouseId, quantity, reason]
      )

      // Update quantity in products
      await db.execute(
        `UPDATE products SET quantity = ?, status = ? WHERE id = ?`,
        [quantity, status, productId]
      )

      await db.commit()
      return NextResponse.json({ success: true, message: "Product added successfully", productId })
    } catch (err) {
      await db.rollback()
      throw err
    }
  } catch (error: any) {
    console.error("Error adding product:", error)
    return NextResponse.json(
      { success: false, message: `Error adding product: ${error.message}` },
      { status: 500 }
    )
  }
}
