import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

// GET handler to fetch a specific shipping record by parcel number
export async function GET(req: NextRequest, { params }: { params: { parcel_number: string } }) {
  try {
    const parcelNumber = params.parcel_number

    if (!parcelNumber) {
      return NextResponse.json({ success: false, message: "Parcel number is required" }, { status: 400 })
    }

    const db = await connectDB()

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
        s.parcel_number, 
        s.orderID, 
        s.shippingFee, 
        s.actualDeliveryDate,
        s.sourceAddressID, 
        s.currentAddressID, 
        s.destinationAddressID, 
        s.courierID,
        s.createdAt, 
        s.updatedAt,
        o.totalPrice as orderTotalPrice,
        o.orderStatus,
        u.name as userName,
        p.name as productName,
        p.image as productImage,
        sa.addressLine1 as sourceAddressLine1,
        sa.city as sourceCity,
        sa.country as sourceCountry,
        ca.addressLine1 as currentAddressLine1,
        ca.city as currentCity,
        ca.country as currentCountry,
        da.addressLine1 as destinationAddressLine1,
        da.city as destinationCity,
        da.country as destinationCountry,
        c.name as courierName
      FROM shipping s
      LEFT JOIN \`order\` o ON s.orderID = o.id
      LEFT JOIN users u ON o.userID = u.id
      LEFT JOIN orderitems oi ON o.id = oi.orderID
      LEFT JOIN products p ON oi.productID = p.id
      LEFT JOIN address sa ON s.sourceAddressID = sa.id
      LEFT JOIN address ca ON s.currentAddressID = ca.id
      LEFT JOIN address da ON s.destinationAddressID = da.id
      LEFT JOIN couriers c ON s.courierID = c.id
      WHERE s.parcel_number = ?`,
      [parcelNumber],
    )

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Shipping record not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      shipping: rows[0],
    })
  } catch (error: any) {
    console.error("Error fetching shipping record:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
