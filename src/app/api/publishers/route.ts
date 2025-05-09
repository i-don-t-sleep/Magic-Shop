import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

// GET handler for fetching publishers
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()

    // Fetch publishers with more details based on the schema
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.servicesFee,
        p.publisherWeb
      FROM publishers p
      ORDER BY p.name
    `)

    return NextResponse.json({
      success: true,
      publishers: rows,
    })
  } catch (error: any) {
    console.error("Error fetching publishers:", error)
    return NextResponse.json(
      { success: false, message: `Error fetching publishers: ${error.message}` },
      { status: 500 },
    )
  }
}

// POST handler for creating a new publisher
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Extract publisher data
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const servicesFee = Number.parseFloat(formData.get("servicesFee") as string) || 30.0
    const publisherWeb = formData.get("publisherWeb") as string
    const logoFile = formData.get("logo") as File | null

    // Validate required fields
    if (!username || !password || !name) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: username, password, and name" },
        { status: 400 },
      )
    }

    const db = await connectDB()

    // Start transaction
    await db.beginTransaction()

    try {
      // Check if username or name already exists
      const [existingPublishers] = await db.query<RowDataPacket[]>(
        "SELECT id FROM publishers WHERE username = ? OR name = ?",
        [username, name],
      )

      if (existingPublishers.length > 0) {
        await db.rollback()
        return NextResponse.json(
          { success: false, message: "Username or publisher name already exists" },
          { status: 409 },
        )
      }

      // Process logo if provided
      let logoBuffer: Buffer | null = null
      let mimeType: string | null = null

      if (logoFile && logoFile.size > 0) {
        logoBuffer = Buffer.from(await logoFile.arrayBuffer())
        mimeType = logoFile.type.split("/")[1] // Extract image type (png, jpeg, etc.)
      }

      // Create contact info first
      const [contactResult] = await db.execute("INSERT INTO contactinfo (notes) VALUES (?)", ["Publisher contact info"])
      const contactId = (contactResult as any)[0].insertId || contactResult.insertId

      // Insert publisher
      const [publisherResult] = await db.execute(
        `INSERT INTO publishers 
         (username, password, name, contactID, servicesFee, description, logo_img, mimeType, publisherWeb) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          username,
          password, // Note: In production, this should be hashed
          name,
          contactId,
          servicesFee,
          description || null,
          logoBuffer,
          mimeType,
          publisherWeb || null,
        ],
      )
      const publisherId = (publisherResult as any)[0].insertId || publisherResult.insertId

      // Commit transaction
      await db.commit()

      return NextResponse.json({
        success: true,
        message: "Publisher added successfully",
        publisherId: publisherId,
      })
    } catch (error) {
      // Rollback on error
      await db.rollback()
      throw error
    }
  } catch (error: any) {
    console.error("Error adding publisher:", error)
    return NextResponse.json({ success: false, message: `Error adding publisher: ${error.message}` }, { status: 500 })
  }
}
