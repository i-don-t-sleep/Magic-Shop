import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { ResultSetHeader } from "mysql2/promise"

// DELETE handler for deleting a product
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const url = new URL(req.url)
  const id = url.pathname.split("/").pop()

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
  }
  
  const productId = Number(id)

  try {
    const db = await connectDB()

    // Start transaction
    await db.beginTransaction()

    try {
      const [result] = await db.execute<ResultSetHeader>("DELETE FROM products WHERE id = ?", [productId])

      if (result.affectedRows === 0) {
        await db.rollback()
        return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
      }

      // Commit transaction
      await db.commit()

      return NextResponse.json({ success: true, message: "Product deleted successfully" })
    } catch (error) {
      // Rollback on error
      await db.rollback()
      throw error
    }
  } catch (error: any) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ success: false, message: `Error deleting product: ${error.message}` }, { status: 500 })
  }
}

// GET handler for fetching a single product by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
  }

  const productId = Number(id)

  try {
    const db = await connectDB()

    // Query to get product details
    const [rows] = await db.query(
      `SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.quantity,
        p.category,
        p.status,
        p.publisherID,
        pub.name AS publisherName,
        w.location AS warehouseLocation
      FROM products p
      JOIN publishers pub ON p.publisherID = pub.id
      LEFT JOIN warehouse w ON p.id = w.productID
      WHERE p.id = ?`,
      [productId],
    )

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    const product = rows[0]

    // Query to get product images
    const [imageRows] = await db.query(`SELECT id, name, description FROM productimages WHERE productID = ?`, [
      productId,
    ])

    const images = Array.isArray(imageRows) ? imageRows : []

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        images: images.map((img: any) => ({
          id: img.id,
          name: img.name,
          description: img.description,
          url: `/api/blob/productimages/${img.id}`,
        })),
      },
    })
  } catch (error: any) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ success: false, message: `Error fetching product: ${error.message}` }, { status: 500 })
  }
}

// PUT handler for updating a product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
  }

  const productId = Number(id)

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
    const imagesToDelete = formData.getAll("deleteImages") as string[]

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
      // Update product
      await db.execute(
        `UPDATE products 
         SET name = ?, description = ?, price = ?, quantity = ?, category = ?, status = ?, publisherID = ? 
         WHERE id = ?`,
        [name, description, price, quantity, category, status, publisherId, productId],
      )

      // Handle image deletions
      if (imagesToDelete.length > 0) {
        for (const imageId of imagesToDelete) {
          await db.execute("DELETE FROM productimages WHERE id = ? AND productID = ?", [imageId, productId])
        }
      }

      // Handle new image uploads
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

      // Handle warehouse location
      if (warehouseLocation) {
        // Check if warehouse record exists
        const [warehouseRows] = await db.query("SELECT location FROM warehouse WHERE productID = ?", [productId])

        if (Array.isArray(warehouseRows) && warehouseRows.length > 0) {
          // Update existing warehouse record
          await db.execute("UPDATE warehouse SET location = ?, capacity = ? WHERE productID = ?", [
            warehouseLocation,
            quantity,
            productId,
          ])
        } else {
          // Insert new warehouse record
          await db.execute("INSERT INTO warehouse (location, productID, capacity) VALUES (?, ?, ?)", [
            warehouseLocation,
            productId,
            quantity,
          ])
        }
      } else {
        // Remove warehouse record if exists
        await db.execute("DELETE FROM warehouse WHERE productID = ?", [productId])
      }

      // Commit transaction
      await db.commit()

      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
        productId,
      })
    } catch (error) {
      // Rollback on error
      await db.rollback()
      throw error
    }
  } catch (error: any) {
    console.error("Error updating product:", error)
    return NextResponse.json({ success: false, message: `Error updating product: ${error.message}` }, { status: 500 })
  }
}
