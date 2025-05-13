import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader, Connection } from "mysql2/promise"

const locationRegex = /^[A-Za-z0-9]+(-[A-Za-z0-9]+){3}$/

// GET handler
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    // Validate pagination parameters
    const validPage = page > 0 ? page : 1
    const validLimit = limit > 0 && limit <= 100 ? limit : 10

    const offset = (validPage - 1) * validLimit

    const db = await connectDB()

    // Get total count
    const [countResult] = await db.query<RowDataPacket[]>(`
      SELECT COUNT(*) as total FROM warehouse
    `)
    const total = countResult[0]?.total

    // Get paginated warehouses with product information
    const [rows] = await db.query(
      `
      SELECT 
        w.id, 
        w.location, 
        w.capacity, 
        w.productID,
        p.name as productName,
        (SELECT COUNT(*) FROM productmovement WHERE warehouseID = w.id) as movementCount
      FROM warehouse w
      LEFT JOIN products p ON w.productID = p.id
      ORDER BY w.location
      LIMIT ? OFFSET ?
    `,
      [validLimit, offset],
    )

    return NextResponse.json({
      success: true,
      warehouses: rows,
      total,
      page: validPage,
      limit: validLimit,
      pages: Math.ceil(total / validLimit),
    })
  } catch (error: any) {
    console.error("Error fetching warehouses:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch warehouses" }, { status: 500 })
  }
}

// POST handler: Add new warehouse
export async function POST(req: NextRequest) {
  try {
    const { location, capacity } = await req.json()

    if (!location || !locationRegex.test(location.trim())) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing location (zone-rack-shelf-pallet)" },
        { status: 400 },
      )
    }
    const capNum = Number(capacity)
    if (isNaN(capNum) || capNum <= 0) {
      return NextResponse.json({ success: false, message: "Valid capacity is required" }, { status: 400 })
    }

    const db: Connection = await connectDB()
    // Check duplicate location
    const [exists] = await db.query<RowDataPacket[]>("SELECT 1 FROM warehouse WHERE location = ?", [location])
    if (exists.length) {
      return NextResponse.json({ success: false, message: "Warehouse location already exists" }, { status: 400 })
    }

    // Insert new warehouse (productID default NULL)
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO warehouse (location, productID, capacity) VALUES (?, NULL, ?)`,
      [location, capNum],
    )

    return NextResponse.json(
      {
        success: true,
        warehouse: {
          id: result.insertId, // คืน id ใหม่
          location,
          capacity: capNum,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error adding warehouse:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// PUT handler: Update warehouse by id
export async function PUT(req: NextRequest) {
  try {
    const { id, location, capacity } = await req.json()
    if (!id) {
      return NextResponse.json({ success: false, message: "Warehouse ID is required" }, { status: 400 })
    }
    if (!location || !locationRegex.test(location.trim())) {
      return NextResponse.json({ success: false, message: "Invalid or missing location" }, { status: 400 })
    }
    const capNum = Number(capacity)
    if (isNaN(capNum) || capNum <= 0) {
      return NextResponse.json({ success: false, message: "Valid capacity is required" }, { status: 400 })
    }

    const db: Connection = await connectDB()
    // ตรวจว่ามีรหัสนี้อยู่จริง
    const [existing] = await db.query<RowDataPacket[]>("SELECT location, capacity FROM warehouse WHERE id = ?", [id])
    if (!existing.length) {
      return NextResponse.json({ success: false, message: "Warehouse not found" }, { status: 404 })
    }

    // ถ้ามีการเปลี่ยน location ให้เช็คไม่ซ้ำ
    if (location !== existing[0].location) {
      const [dup] = await db.query<RowDataPacket[]>("SELECT 1 FROM warehouse WHERE location = ? AND id != ?", [
        location,
        id,
      ])
      if (dup.length) {
        return NextResponse.json({ success: false, message: "Location already in use" }, { status: 400 })
      }
    }

    // ถ้าลด capacity ให้เช็ค usage
    if (capNum < existing[0].capacity) {
      const [usageRows] = await db.query<RowDataPacket[]>(
        `SELECT SUM(quantity) AS total 
           FROM productmovement
          WHERE warehouseID = ? AND movementType = 'IN'`,
        [id],
      )
      const used = usageRows[0].total ?? 0
      if (used > capNum) {
        return NextResponse.json(
          { success: false, message: `Cannot reduce capacity below current usage (${used})` },
          { status: 400 },
        )
      }
    }

    // Update record
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE warehouse
         SET location = ?, capacity = ?
       WHERE id = ?`,
      [location, capNum, id],
    )
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Warehouse not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      warehouse: { id, location, capacity: capNum },
    })
  } catch (error: any) {
    console.error("Error updating warehouse:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE handler: by id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ success: false, message: "Warehouse ID is required" }, { status: 400 })
    }

    const db: Connection = await connectDB()
    // เช็ค movement usages
    const [movementRows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS count 
         FROM productmovement 
        WHERE warehouseID = ?`,
      [id],
    )
    const count = movementRows[0].count as number
    if (count > 0) {
      return NextResponse.json(
        { success: false, message: `Cannot delete: used by ${count} movements` },
        { status: 400 },
      )
    }

    // ลบ warehouse
    const [result] = await db.query<ResultSetHeader>(`DELETE FROM warehouse WHERE id = ?`, [id])
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Warehouse not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting warehouse:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
