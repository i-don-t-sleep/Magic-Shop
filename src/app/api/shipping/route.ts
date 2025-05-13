import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const parcelNumber = url.searchParams.get("parcel_number")
    const orderID = url.searchParams.get("order_id")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    const validPage = page > 0 ? page : 1
    const validLimit = limit > 0 && limit <= 100 ? limit : 10
    const offset = (validPage - 1) * validLimit

    const db = await connectDB()

    const baseQuery = `
  SELECT 
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
    o.totalPrice AS orderTotalPrice,
    o.orderStatus,
    u.username AS userName,
    p.name AS productName,
    pi.id AS productImage,
    sa.addressLine1 AS sourceAddressLine1,
    sa.city AS sourceCity,
    sa.country AS sourceCountry,
    ca.addressLine1 AS currentAddressLine1,
    ca.city AS currentCity,
    ca.country AS currentCountry,
    da.addressLine1 AS destinationAddressLine1,
    da.city AS destinationCity,
    da.country AS destinationCountry,
    c.name AS courierName
  FROM shipping s
  LEFT JOIN \`order\` o ON s.orderID = o.id
  LEFT JOIN users u ON o.userID = u.id
  LEFT JOIN orderitems oi ON o.id = oi.orderID
  LEFT JOIN products p ON oi.productID = p.id
  LEFT JOIN productimages pi ON p.id = pi.productID
  LEFT JOIN address sa ON s.sourceAddressID = sa.id
  LEFT JOIN address ca ON s.currentAddressID = ca.id
  LEFT JOIN address da ON s.destinationAddressID = da.id
  LEFT JOIN couriers c ON s.courierID = c.id
  WHERE 1=1
`


    const queryParams: any[] = []
    let filterQuery = ""

    if (parcelNumber) {
      filterQuery += " AND s.parcel_number = ?"
      queryParams.push(parcelNumber)
    }

    if (orderID) {
      filterQuery += " AND s.orderID = ?"
      queryParams.push(orderID)
    }

    const countQuery = `
  SELECT COUNT(*) as total FROM (
    ${baseQuery.replace(/LEFT JOIN order o/g, "LEFT JOIN \\`order\\` o")} 
    ${filterQuery}
  ) AS countTable
`


    const fullQuery = `
      ${baseQuery}
      ${filterQuery}
      ORDER BY s.createdAt DESC
      LIMIT ? OFFSET ?
    `

    queryParams.push(validLimit, offset)

    const [countResult] = await db.query<RowDataPacket[]>(countQuery, queryParams.slice(0, -2))
    const total = countResult[0]?.total || 0

    const [rows] = await db.query<RowDataPacket[]>(fullQuery, queryParams)

    return NextResponse.json({
      success: true,
      shipping: rows,
      total,
      page: validPage,
      limit: validLimit,
      pages: Math.ceil(total / validLimit),
    })
  } catch (error: any) {
    console.error("Error fetching shipping records:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST handler to create a new shipping record
export async function POST(req: NextRequest) {
  try {
    const { parcel_number, orderID, shippingFee, sourceAddressID, currentAddressID, destinationAddressID, courierID } =
      await req.json()

    // Validate required fields
    if (!parcel_number) {
      return NextResponse.json({ success: false, message: "Parcel number is required" }, { status: 400 })
    }

    if (!currentAddressID) {
      return NextResponse.json({ success: false, message: "Current address is required" }, { status: 400 })
    }

    const db = await connectDB()

    // Check if parcel number already exists
    const [existing] = await db.query<RowDataPacket[]>("SELECT 1 FROM shipping WHERE parcel_number = ?", [
      parcel_number,
    ])

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Parcel number already exists" }, { status: 400 })
    }

    // Insert new shipping record
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO shipping (
        parcel_number, 
        orderID, 
        shippingFee, 
        sourceAddressID, 
        currentAddressID, 
        destinationAddressID, 
        courierID,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        parcel_number,
        orderID || null,
        shippingFee || 0,
        sourceAddressID || null,
        currentAddressID,
        destinationAddressID || null,
        courierID || null,
      ],
    )

    // If order is provided, update order status to "Shipped"
    if (orderID) {
      await db.query("UPDATE `order` SET orderStatus = 'Shipped', updatedAt = NOW() WHERE id = ?", [orderID])
    }

    return NextResponse.json(
      {
        success: true,
        message: "Shipping record created successfully",
        parcel_number,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating shipping record:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// PUT handler to update an existing shipping record
export async function PUT(req: NextRequest) {
  try {
    const {
      parcel_number,
      orderID,
      shippingFee,
      actualDeliveryDate,
      sourceAddressID,
      currentAddressID,
      destinationAddressID,
      courierID,
    } = await req.json()

    // Validate required fields
    if (!parcel_number) {
      return NextResponse.json({ success: false, message: "Parcel number is required" }, { status: 400 })
    }

    if (!currentAddressID) {
      return NextResponse.json({ success: false, message: "Current address is required" }, { status: 400 })
    }

    const db = await connectDB()

    // Check if shipping record exists
    const [existing] = await db.query<RowDataPacket[]>(
      "SELECT orderID, actualDeliveryDate FROM shipping WHERE parcel_number = ?",
      [parcel_number],
    )

    if (existing.length === 0) {
      return NextResponse.json({ success: false, message: "Shipping record not found" }, { status: 404 })
    }

    const oldOrderID = existing[0].orderID
    const oldDeliveryDate = existing[0].actualDeliveryDate

    // Update shipping record
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE shipping SET
        orderID = ?,
        shippingFee = ?,
        actualDeliveryDate = ?,
        sourceAddressID = ?,
        currentAddressID = ?,
        destinationAddressID = ?,
        courierID = ?,
        updatedAt = NOW()
      WHERE parcel_number = ?`,
      [
        orderID || null,
        shippingFee || 0,
        actualDeliveryDate || null,
        sourceAddressID || null,
        currentAddressID,
        destinationAddressID || null,
        courierID || null,
        parcel_number,
      ],
    )

    // Handle order status changes
    if (orderID) {
      // If delivery date is set and wasn't set before, update order status to "Delivered"
      if (actualDeliveryDate && !oldDeliveryDate) {
        await db.query("UPDATE `order` SET orderStatus = 'Delivered', updatedAt = NOW() WHERE id = ?", [orderID])
      }
      // If order ID changed, update the new order to "Shipped"
      else if (orderID !== oldOrderID) {
        await db.query("UPDATE `order` SET orderStatus = 'Shipped', updatedAt = NOW() WHERE id = ?", [orderID])
      }
    }

    // If old order ID exists and is different from new one, reset its status to "Processing"
    if (oldOrderID && oldOrderID !== orderID) {
      await db.query("UPDATE `order` SET orderStatus = 'Processing', updatedAt = NOW() WHERE id = ?", [oldOrderID])
    }

    return NextResponse.json({
      success: true,
      message: "Shipping record updated successfully",
    })
  } catch (error: any) {
    console.error("Error updating shipping record:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE handler to delete a shipping record
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const parcelNumber = url.searchParams.get("parcel_number")

    if (!parcelNumber) {
      return NextResponse.json({ success: false, message: "Parcel number is required" }, { status: 400 })
    }

    const db = await connectDB()

    // Check if shipping record exists and get associated order ID
    const [existing] = await db.query<RowDataPacket[]>("SELECT orderID FROM shipping WHERE parcel_number = ?", [
      parcelNumber,
    ])

    if (existing.length === 0) {
      return NextResponse.json({ success: false, message: "Shipping record not found" }, { status: 404 })
    }

    const orderID = existing[0].orderID

    // Delete shipping record
    const [result] = await db.query<ResultSetHeader>("DELETE FROM shipping WHERE parcel_number = ?", [parcelNumber])

    // If order exists, update its status back to "Processing"
    if (orderID) {
      await db.query("UPDATE `order` SET orderStatus = 'Processing', updatedAt = NOW() WHERE id = ?", [orderID])
    }

    return NextResponse.json({
      success: true,
      message: "Shipping record deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting shipping record:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
