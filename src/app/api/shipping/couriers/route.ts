import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

// GET handler to fetch all couriers
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()

    const [rows] = await db.query<RowDataPacket[]>("SELECT id, name, api_key FROM couriers ORDER BY name")

    return NextResponse.json({
      success: true,
      couriers: rows,
    })
  } catch (error: any) {
    console.error("Error fetching couriers:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST handler to create a new courier
export async function POST(req: NextRequest) {
  try {
    const { name, api_key, defaultFee } = await req.json()

    // Validate required fields
    if (!name) {
      return NextResponse.json({ success: false, message: "Courier name is required" }, { status: 400 })
    }

    if (!api_key) {
      return NextResponse.json({ success: false, message: "API key is required" }, { status: 400 })
    }

    const fee = defaultFee || 0

    const db = await connectDB()

    // Check if courier with same name already exists
    const [existing] = await db.query<RowDataPacket[]>("SELECT 1 FROM couriers WHERE name = ?", [name])

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Courier with this name already exists" }, { status: 400 })
    }

    // Insert new courier
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO couriers (name, api_key, defaultFee) VALUES (?, ?, ?)",
      [name, api_key, fee],
    )

    return NextResponse.json(
      {
        success: true,
        courier: {
          id: result.insertId,
          name,
          api_key,
          defaultFee: fee,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating courier:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
