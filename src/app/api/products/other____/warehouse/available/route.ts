import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB()

    // Get all warehouse locations that are not assigned to any product (productID is null)
    const [rows] = await db.query<RowDataPacket[]>("SELECT location FROM warehouse WHERE productID IS NULL")

    // If no available warehouse locations, return empty array
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No available warehouse locations found",
        locations: [],
      })
    }

    // Extract locations from result
    const locations = rows.map((row) => row.location)

    return NextResponse.json({
      success: true,
      locations,
    })
  } catch (error: any) {
    console.error("Error fetching available warehouse locations:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error fetching available warehouse locations: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
