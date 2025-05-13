import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

// GET handler to fetch all addresses with contact info
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
  a.id,
  a.contactInfoId,
  a.addressLine1,
  a.addressLine2,
  a.city,
  a.country,
  a.postalCode
FROM address a
ORDER BY a.city, a.addressLine1
`,
    )

    return NextResponse.json({
      success: true,
      addresses: rows,
    })
  } catch (error: any) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST handler to create a new address
export async function POST(req: NextRequest) {
  try {
    const {
      contactInfoId,
      addressLine1,
      addressLine2,
      city,
      country,
      postalCode,
      contactName,
      contactEmail,
      contactPhone,
    } = await req.json()

    // Validate required fields
    if (!addressLine1) {
      return NextResponse.json({ success: false, message: "Address line 1 is required" }, { status: 400 })
    }

    if (!city) {
      return NextResponse.json({ success: false, message: "City is required" }, { status: 400 })
    }

    const db = await connectDB()

    let finalContactInfoId = contactInfoId

    // If contact info is provided but no contactInfoId, create a new contact info record
    if (!contactInfoId && (contactName || contactEmail || contactPhone)) {
      const [contactResult] = await db.query<ResultSetHeader>(
        "INSERT INTO contactinfo (name, email, phone) VALUES (?, ?, ?)",
        [contactName || null, contactEmail || null, contactPhone || null],
      )

      finalContactInfoId = contactResult.insertId
    }

    // Insert new address
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO address (
        contactInfoId, 
        addressLine1, 
        addressLine2, 
        city, 
        country, 
        postalCode
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [finalContactInfoId || null, addressLine1, addressLine2 || null, city, country || "Thailand", postalCode || null],
    )

    return NextResponse.json(
      {
        success: true,
        address: {
          id: result.insertId,
          contactInfoId: finalContactInfoId,
          addressLine1,
          addressLine2: addressLine2 || null,
          city,
          country: country || "Thailand",
          postalCode: postalCode || null,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating address:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
