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
    const publisherId = Number.parseInt(formData.get("publisherId") as string)
    const warehouseLocation = formData.get("warehouseLocation") as string
    const reason = formData.get("reason") as string

    // Get admin info from session (in a real app, this would come from auth)
    const adminId = 1 // This would be the actual admin ID from session
    const adminType = "SuperAdmin" // This would be determined from session

    // Validate required fields
    if (
      !name ||
      !price ||
      isNaN(price) ||
      !quantity ||
      isNaN(quantity) ||
      !publisherId ||
      isNaN(publisherId) ||
      !reason
    ) {
      return NextResponse.json({ success: false, message: "Missing or invalid required fields" }, { status: 400 })
    }

    // Determine status based on quantity
    const status = quantity > 0 ? "Available" : "Out of Stock"

    const db = await connectDB()

    // Start transaction
    await db.beginTransaction()

    try {
      // Insert product with initial quantity of 0 (will be updated by movement)
      const [productResult] = await db.execute<ResultSetHeader>(
        `INSERT INTO products (name, description, price, quantity, category, status, publisherID) 
         VALUES (?, ?, ?, 0, ?, ?, ?)`,
        [name, description, price, category, "Out of Stock", publisherId],
      )

      const productId = (productResult as any)[0]?.insertId || productResult.insertId

      // Handle image uploads with descriptions
      const images = formData.getAll("images") as File[]
      const imageDescriptions: { [key: string]: string } = {}

      // Parse image descriptions
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("imageDescriptions[") && key.endsWith("]")) {
          const index = key.match(/\[(\d+)\]/)?.[1]
          if (index) {
            imageDescriptions[index] = value as string
          }
        }
      }

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i]
          if (image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer())
            const imageName = image.name
            const mimeType = image.type.split("/")[1] // Extract image type (png, jpeg, etc.)
            const description = imageDescriptions[i.toString()] || ""

            await db.execute(
              `INSERT INTO productimages (productID, name, description, img, mimeType) 
               VALUES (?, ?, ?, ?, ?)`,
              [productId, imageName, description, buffer, mimeType],
            )
          }
        }
      }

      // Handle warehouse location
      let warehouseId = null
      if (warehouseLocation) {
        // Check if the warehouse location is already in use
        const [existingWarehouse] = await db.query<RowDataPacket[]>(
          "SELECT productID FROM warehouse WHERE location = ?",
          [warehouseLocation],
        )

        if (Array.isArray(existingWarehouse) && existingWarehouse.length > 0) {
          // If the warehouse is already assigned to another product
          if (existingWarehouse[0].productID !== null && existingWarehouse[0].productID !== productId) {
            await db.rollback()
            return NextResponse.json(
              {
                success: false,
                message: "This warehouse location is already assigned to another product",
              },
              { status: 400 },
            )
          }
        }

        // Insert into warehouse table
        await db.execute(
          `INSERT INTO warehouse (location, productID, capacity) 
           VALUES (?, ?, ?)`,
          [warehouseLocation, productId, quantity],
        )
        warehouseId = warehouseLocation
      }

      // Get the structure of the productmovement table
      const [tableInfo] = await db.query("DESCRIBE productmovement")
      const columns = Array.isArray(tableInfo) ? (tableInfo as RowDataPacket[]) : []

      // Find the warehouse column name
      let warehouseColumnName = null
      const possibleNames = ["warehouseID", "warehouseLocation", "warehouse_id", "warehouse", "location"]

      for (const name of possibleNames) {
        if (columns.some((col) => col.Field === name)) {
          warehouseColumnName = name
          break
        }
      }

      if (!warehouseColumnName) {
        // If no matching column found, try to create one
        try {
          await db.execute("ALTER TABLE productmovement ADD COLUMN warehouseID VARCHAR(255)")
          warehouseColumnName = "warehouseID"
        } catch (error) {
          console.error("Failed to add warehouseID column:", error)
          await db.rollback()
          return NextResponse.json(
            {
              success: false,
              message: "Database schema issue: Could not find or create warehouse column",
            },
            { status: 500 },
          )
        }
      }

      // Record product movement (IN)
      const movementSQL = `INSERT INTO productmovement (productID, ${warehouseColumnName}, movementType, quantity, reason) 
                         VALUES (?, ?, 'IN', ?, ?)`

      await db.execute(movementSQL, [productId, warehouseId, quantity, reason])

      // Update product quantity and status after movement is recorded
      await db.execute(`UPDATE products SET quantity = ?, status = ? WHERE id = ?`, [quantity, status, productId])

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
