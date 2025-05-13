import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

// GET handler to fetch product details for editing
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const productSlug = params.slug

    if (!productSlug) {
      return NextResponse.json({ success: false, message: "Invalid product slug" }, { status: 400 })
    }

    const db = await connectDB()

    // Fetch product details
    const productId = Number.parseInt(productSlug, 10)

    if (isNaN(productId)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
    }

    const [productRows] = await db.query<RowDataPacket[]>(
      `SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.quantity,
        p.status,
        c.name AS category,
        pub.name AS publisherName,
        pub.id AS publisherId
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN publishers pub ON p.publisherID = pub.id
      WHERE p.id = ?`,
      [productId],
    )

    if (!productRows.length) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    const product = productRows[0]

    // Fetch product images
    const [imageRows] = await db.query<RowDataPacket[]>(
      `SELECT 
        id,
        name,
        description
      FROM productimages
      WHERE productID = ?
      ORDER BY id`,
      [product.id],
    )

    // Fetch warehouse information
    const [warehouseRows] = await db.query<RowDataPacket[]>(
      `SELECT 
        id,
        location,
        capacity
      FROM warehouse
      WHERE productID = ?`,
      [product.id],
    )

    const warehouse = warehouseRows.length > 0 ? warehouseRows[0] : null

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        images: imageRows,
        warehouse,
      },
    })
  } catch (error: any) {
    console.error("Error fetching product details:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// PUT handler to update product details
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const productSlug = params.slug
    const productId = Number.parseInt(productSlug, 10)

    if (!productSlug || isNaN(productId)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
    }

    const formData = await req.formData()

    // Extract product data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const publisherName = formData.get("publisherName") as string
    const warehouseLocation = (formData.get("warehouseLocation") as string) || null

    // Validate required fields
    if (!name || isNaN(price) || !category || !publisherName) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid required fields",
        },
        { status: 400 },
      )
    }

    const db = await connectDB()
    await db.beginTransaction()

    try {
      // Get category ID
      const [catRows] = await db.query<RowDataPacket[]>(`SELECT id FROM categories WHERE name = ?`, [category])

      if (catRows.length === 0) {
        await db.rollback()
        return NextResponse.json(
          {
            success: false,
            message: `Category '${category}' not found`,
          },
          { status: 400 },
        )
      }

      const categoryId = catRows[0].id as number

      // Get publisher ID
      const [pubRows] = await db.query<RowDataPacket[]>(`SELECT id FROM publishers WHERE name = ?`, [publisherName])

      if (pubRows.length === 0) {
        await db.rollback()
        return NextResponse.json(
          {
            success: false,
            message: `Publisher '${publisherName}' not found`,
          },
          { status: 400 },
        )
      }

      const publisherId = pubRows[0].id as number

      // Update product
      await db.execute(
        `UPDATE products 
         SET name = ?, description = ?, price = ?, category_id = ?, publisherID = ?
         WHERE id = ?`,
        [name, description, price, categoryId, publisherId, productId],
      )

      // Handle warehouse assignment
      if (warehouseLocation) {
        // Check if the warehouse exists
        const [warehouseRows] = await db.query<RowDataPacket[]>(
          "SELECT id, productID FROM warehouse WHERE location = ?",
          [warehouseLocation],
        )

        if (warehouseRows.length > 0) {
          const existingWarehouse = warehouseRows[0]

          // If warehouse is assigned to another product
          if (existingWarehouse.productID !== null && existingWarehouse.productID !== productId) {
            await db.rollback()
            return NextResponse.json(
              {
                success: false,
                message: "This warehouse location is already assigned to another product",
              },
              { status: 400 },
            )
          }

          // Update existing warehouse assignment
          await db.execute("UPDATE warehouse SET productID = ? WHERE location = ?", [productId, warehouseLocation])
        } else {
          // Create new warehouse assignment
          await db.execute("INSERT INTO warehouse (location, productID, capacity) VALUES (?, ?, ?)", [
            warehouseLocation,
            productId,
            formData.get("warehouseCapacity") || 100,
          ])
        }
      } else {
        // Remove warehouse assignment if it exists
        await db.execute("UPDATE warehouse SET productID = NULL WHERE productID = ?", [productId])
      }

      // Handle image deletions
      const imagesToDelete = formData.get("deleteImages") as string
      if (imagesToDelete) {
        const imageIds = JSON.parse(imagesToDelete) as number[]
        if (imageIds.length > 0) {
          await db.execute(`DELETE FROM productimages WHERE id IN (?) AND productID = ?`, [imageIds, productId])
        }
      }

      // Handle new images
      const newImages: { file: File; description: string }[] = []
      for (const [key, value] of formData.entries()) {
        const match = key.match(/^newImage(\d+)$/)
        if (match && value instanceof File && value.size > 0) {
          const index = match[1]
          const desc = (formData.get(`newImageDescription${index}`) as string) || ""
          newImages.push({ file: value, description: desc })
        }
      }

      for (const { file, description } of newImages) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const mimeType = file.type.split("/")[1] || "jpeg"
        await db.execute(
          `INSERT INTO productimages (productID, name, description, img, mimeType)
           VALUES (?, ?, ?, ?, ?)`,
          [productId, file.name, description, buffer, mimeType],
        )
      }

      // Update existing image descriptions
      for (const [key, value] of formData.entries()) {
        const match = key.match(/^imageDescription(\d+)$/)
        if (match) {
          const imageId = Number.parseInt(match[1])
          if (!isNaN(imageId)) {
            await db.execute(`UPDATE productimages SET description = ? WHERE id = ? AND productID = ?`, [
              value,
              imageId,
              productId,
            ])
          }
        }
      }

      await db.commit()
      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
        productId,
      })
    } catch (error) {
      await db.rollback()
      throw error
    }
  } catch (error: any) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error updating product: ${error.message}`,
      },
      { status: 500 },
    )
  }
}



// DELETE handler to remove a product
export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  const productSlug = params.slug
  const productId = Number.parseInt(productSlug, 10)

  if (!productSlug || isNaN(productId)) {
    return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
  }

  try {
    const db = await connectDB()

    await db.beginTransaction()

    try {
      // ตรวจสอบว่าผลิตภัณฑ์มีอยู่จริง
      const [productRows] = await db.query<RowDataPacket[]>(
        `SELECT id FROM products WHERE id = ?`,
        [productId],
      )

      if (productRows.length === 0) {
        await db.rollback()
        return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
      }

      // ลบสินค้า (จะลบ image, warehouse ตาม foreign key cascade)
      await db.execute(`DELETE FROM products WHERE id = ?`, [productId])

      await db.commit()
      return NextResponse.json({
        success: true,
        message: "Product deleted successfully",
      })
    } catch (error) {
      await db.rollback()
      throw error
    }
  } catch (error: any) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { success: false, message: `Error deleting product: ${error.message}` },
      { status: 500 }
    )
  }
}
