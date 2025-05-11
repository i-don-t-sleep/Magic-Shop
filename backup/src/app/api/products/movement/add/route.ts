import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Extract movement data
    const productId = Number.parseInt(formData.get("existingProductId") as string)
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const warehouseLocation = formData.get("warehouseLocation") as string
    const reason = formData.get("reason") as string
    const movementType = (formData.get("movementType") as string) || "IN"

    // Get admin info from session (in a real app, this would come from auth)
    const adminId = 1 // This would be the actual admin ID from session
    const adminType = "SuperAdmin" // This would be determined from session

    // Validate required fields
    if (!productId || isNaN(productId) || !quantity || isNaN(quantity) || quantity <= 0 || !reason) {
      return NextResponse.json({ success: false, message: "Missing or invalid required fields" }, { status: 400 })
    }

    const db = await connectDB()

    // Start transaction
    await db.beginTransaction()

    try {
      // Get current product data
      const [productRows] = await db.query<RowDataPacket[]>("SELECT quantity FROM products WHERE id = ?", [productId])

      if (!Array.isArray(productRows) || productRows.length === 0) {
        await db.rollback()
        return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
      }

      const currentQuantity = (productRows[0] as any).quantity

      // Calculate new quantity based on movement type
      let newQuantity: number
      if (movementType === "IN") {
        newQuantity = currentQuantity + quantity
      } else {
        // For OUT movement, ensure we don't go below 0
        if (currentQuantity < quantity) {
          await db.rollback()
          return NextResponse.json(
            {
              success: false,
              message: `Cannot remove ${quantity} units. Only ${currentQuantity} units available.`,
            },
            { status: 400 },
          )
        }
        newQuantity = currentQuantity - quantity
      }

      // Handle warehouse location if provided
      let warehouseId = null
      if (warehouseLocation) {
        // Check if the warehouse location is already in use by another product
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

        // Check if warehouse record exists for this product
        const [warehouseRows] = await db.query<RowDataPacket[]>("SELECT location FROM warehouse WHERE productID = ?", [
          productId,
        ])

        if (Array.isArray(warehouseRows) && warehouseRows.length > 0) {
          // Update existing warehouse record
          await db.execute("UPDATE warehouse SET location = ?, capacity = ? WHERE productID = ?", [
            warehouseLocation,
            newQuantity,
            productId,
          ])
        } else {
          // Insert new warehouse record
          await db.execute("INSERT INTO warehouse (location, productID, capacity) VALUES (?, ?, ?)", [
            warehouseLocation,
            productId,
            newQuantity,
          ])
        }
        warehouseId = warehouseLocation
      } else {
        // Check if there's an existing warehouse location
        const [warehouseRows] = await db.query<RowDataPacket[]>("SELECT location FROM warehouse WHERE productID = ?", [
          productId,
        ])

        if (Array.isArray(warehouseRows) && warehouseRows.length > 0) {
          warehouseId = (warehouseRows[0] as any).location

          // Update capacity in existing warehouse
          await db.execute("UPDATE warehouse SET capacity = ? WHERE productID = ?", [newQuantity, productId])
        }
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

      // Record product movement
      const movementSQL = `INSERT INTO productmovement (productID, ${warehouseColumnName}, movementType, quantity, reason) 
                         VALUES (?, ?, ?, ?, ?)`

      await db.execute(movementSQL, [productId, warehouseId, movementType, quantity, reason])

      // Update product quantity and status
      const status = newQuantity > 0 ? "Available" : "Out of Stock"
      await db.execute("UPDATE products SET quantity = ?, status = ? WHERE id = ?", [newQuantity, status, productId])

      // Commit transaction
      await db.commit()

      return NextResponse.json({
        success: true,
        message: `Stock ${movementType === "IN" ? "added to" : "removed from"} product successfully`,
        productId,
      })
    } catch (error) {
      // Rollback on error
      await db.rollback()
      throw error
    }
  } catch (error: any) {
    console.error("Error processing stock movement:", error)
    return NextResponse.json({ success: false, message: `Error: ${error.message}` }, { status: 500 })
  }
}
