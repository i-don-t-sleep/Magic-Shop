import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

// — GET handler remains unchanged —
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
         p.id,
         p.name,
         p.description,
         p.servicesFee,
         p.publisherWeb
       FROM publishers p
       ORDER BY p.name`
    )
    return NextResponse.json({ success: true, publishers: rows })
  } catch (error: any) {
    console.error("Error fetching publishers:", error)
    return NextResponse.json(
      { success: false, message: `Error fetching publishers: ${error.message}` },
      { status: 500 }
    )
  }
}

// — POST handler now parses JSON, inserts, and returns the new publisher —
export async function POST(req: NextRequest) {
  try {
    // 1. Parse JSON body
    const { name, description = null, publisherWeb = null, servicesFee = 0 } = await req.json()

    // 2. Basic validation
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Missing required field: name" },
        { status: 400 }
      )
    }

    const db = await connectDB()
    await db.beginTransaction()

    try {
      // 3. Create a contactinfo record to satisfy the foreign key
      const [contactResult] = await db.execute(
        "INSERT INTO contactinfo (notes) VALUES (?)",
        ["Publisher contact info"]
      )
      const contactId = (contactResult as any).insertId

      // 4. Insert into publishers
      const [insertResult] = await db.execute(
        `INSERT INTO publishers
           (name, description, publisherWeb, servicesFee, contactID)
         VALUES (?, ?, ?, ?, ?)`,
        [name, description, publisherWeb, servicesFee, contactId]
      )
      const publisherId = (insertResult as any).insertId

      // 5. Commit transaction
      await db.commit()

      // 6. Retrieve and return the newly created publisher
      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT id, name, description, servicesFee, publisherWeb
         FROM publishers
         WHERE id = ?`,
        [publisherId]
      )
      const publisher = rows[0]

      return NextResponse.json({ success: true, publisher }, { status: 201 })
    } catch (err: any) {
      await db.rollback()
      throw err
    }
  } catch (error: any) {
    console.error("Error adding publisher:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Error adding publisher" },
      { status: 500 }
    )
  }
}
