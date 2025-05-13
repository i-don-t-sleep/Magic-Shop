import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function POST(req: NextRequest) {
  // 1) Authentication: ตรวจว่ามี auth_token ใน cookies
  const token = req.cookies.get("auth_token")?.value
  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized: no auth token" }, { status: 401 })
  }

  // 2) Authorization: อ่าน role จาก account-info cookie
  const info = req.cookies.get("account-info")?.value
  if (!info) {
    return NextResponse.json({ success: false, error: "Unauthorized: no account info" }, { status: 401 })
  }

  let role: string
  try {
    const account = JSON.parse(info)
    role = account.role
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized: invalid account info" }, { status: 401 })
  }

  // 3) ตรวจสิทธิ์: ให้ Super Admin หรือ Data Entry Admin เท่านั้น
  if (role !== "Super Admin" && role !== "Data Entry Admin") {
    return NextResponse.json({ success: false, error: "Forbidden: you do not have permission" }, { status: 403 })
  }

  try {
    const { location, capacity } = await req.json()

    // 4) Validate input
    if (!location) {
      return NextResponse.json({ success: false, error: "Warehouse location is required" }, { status: 400 })
    }
    if (!capacity || isNaN(Number(capacity)) || Number(capacity) <= 0) {
      return NextResponse.json({ success: false, error: "Valid capacity is required" }, { status: 400 })
    }

    const db = await connectDB()

    // 5) Check duplicate
    const [existingRows] = await db.query("SELECT 1 FROM warehouse WHERE location = ?", [location])
    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return NextResponse.json({ success: false, error: "Warehouse location already exists" }, { status: 400 })
    }

    // 6) Insert new warehouse
    const [result] = await db.query("INSERT INTO warehouse (location, capacity, productID) VALUES (?, ?, NULL)", [
      location,
      Number(capacity),
    ])

    return NextResponse.json({
      success: true,
      warehouse: { location, capacity: Number(capacity) },
    })
  } catch (error) {
    console.error("Error adding warehouse:", error)
    return NextResponse.json({ success: false, error: "Failed to add warehouse" }, { status: 500 })
  }
}

// GET handler: List all warehouses
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()
    const [rows] = await db.query(`
      SELECT 
        id, 
        location, 
        capacity, 
        productID
      FROM warehouse
      ORDER BY location
    `)

    return NextResponse.json({
      success: true,
      warehouses: rows,
    })
  } catch (error: any) {
    console.error("Error fetching warehouses:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch warehouses" }, { status: 500 })
  }
}
