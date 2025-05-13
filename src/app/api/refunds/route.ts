import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const offset = (page - 1) * limit

    // In a real implementation, this would query the database
    // For now, we'll return mock data
    const mockRefunds = [
      {
        id: 1,
        orderID: 1,
        userID: 1,
        refundAmount: 1500.0,
        reason: "Product damaged during shipping",
        status: "refunded",
        requestedAt: "2025-03-18T15:26:00",
        processedAt: "2025-03-19T10:15:00",
        approveBy: 5,
        user: {
          name: "Santipab Tongchan",
          avatar: "9d0c44febd0f539d6bdc2bac6ef8e6f2.png",
          location: "Surin",
          country: "Thailand",
        },
        product: {
          image: "cf27466446e6da568b1eae990514f787.png",
          quantity: 2,
        },
        paymentMethod: {
          type: "Mastercard",
          logo: "mastercard.png",
        },
      },
      // ... more mock refunds
    ]

    const total = mockRefunds.length

    return NextResponse.json({
      refunds: mockRefunds,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching refunds:", error)
    return NextResponse.json({ error: "Failed to fetch refunds" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.orderID || !body.userID || !body.refundAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real implementation, this would insert into the database
    // For now, we'll just return the data with a mock ID
    const newRefund = {
      id: Math.floor(Math.random() * 1000) + 10,
      ...body,
      requestedAt: new Date().toISOString(),
      status: body.status || "requested",
    }

    return NextResponse.json(newRefund, { status: 201 })
  } catch (error) {
    console.error("Error creating refund:", error)
    return NextResponse.json({ error: "Failed to create refund" }, { status: 500 })
  }
}
