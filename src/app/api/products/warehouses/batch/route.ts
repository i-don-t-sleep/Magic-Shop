import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { warehouses } = await request.json()

    if (!Array.isArray(warehouses) || warehouses.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid input: warehouses must be a non-empty array" },
        { status: 400 },
      )
    }

    for (const warehouse of warehouses) {
      if (!warehouse.location || typeof warehouse.location !== "string") {
        return NextResponse.json(
          { success: false, error: "Each warehouse must have a valid location string" },
          { status: 400 },
        )
      }

      if (!warehouse.capacity || typeof warehouse.capacity !== "number" || warehouse.capacity <= 0) {
        return NextResponse.json(
          { success: false, error: "Each warehouse must have a valid capacity number greater than 0" },
          { status: 400 },
        )
      }

      const locationRegex = /^[A-Za-z0-9]+(-[A-Za-z0-9]+){3}$/
      if (!locationRegex.test(warehouse.location)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid location format: ${warehouse.location}. Must be in format zone-rack-shelf-pallet (e.g. A-01-02-03)`,
          },
          { status: 400 },
        )
      }
    }

    const locations = warehouses.map((w) => w.location)
    const uniqueLocations = new Set(locations)
    if (uniqueLocations.size !== locations.length) {
      return NextResponse.json(
        { success: false, error: "Duplicate warehouse locations found in the batch" },
        { status: 400 },
      )
    }

    const db = await connectDB()

    // Check for existing locations
    const [existingRows] = await db.query(
      `SELECT location FROM warehouse WHERE location IN (${locations.map(() => "?").join(", ")})`,
      locations,
    )
    const existingLocations = (existingRows as any[]).map((row) => row.location)

    if (existingLocations.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `The following locations already exist: ${existingLocations.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Begin transaction
    await db.beginTransaction()

    try {
      const insertValues = warehouses.map((w) => [w.location, w.capacity])
      await db.query(`INSERT INTO warehouse (location, capacity) VALUES ?`, [insertValues])

      await db.commit()

      return NextResponse.json({
        success: true,
        message: `Successfully created ${warehouses.length} warehouses`,
        warehouses,
      })
    } catch (err) {
      await db.rollback()
      throw err
    }
  } catch (error: any) {
    console.error("Error creating batch warehouses:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to create warehouses" }, { status: 500 })
  }
}
