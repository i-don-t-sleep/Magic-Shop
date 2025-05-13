import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // In a real implementation, this would query the database
    // For now, we'll return mock data
    const mockOrder = {
      id,
      userID: 1,
      totalPrice: 1500.0,
      orderStatus: "Processing",
      createdAt: "2025-03-18T15:26:00",
      updatedAt: "2025-03-18T15:26:00",
      notes: "Express delivery requested",
      user: {
        name: "Santipab Tongchan",
        avatar: "9d0c44febd0f539d6bdc2bac6ef8e6f2.png",
        location: "Surin",
        country: "Thailand",
      },
      product: {
        image: "dcfbd4a80d735ed524c31123e084659c.png",
        quantity: 2,
      },
    }

    return NextResponse.json(mockOrder)
  } catch (error) {
    console.error(`Error fetching order ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    // In a real implementation, this would update the database
    // For now, we'll just return the updated data
    const updatedOrder = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error(`Error updating order ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // In a real implementation, this would delete from the database
    // For now, we'll just return a success message
    return NextResponse.json({ message: `Order ${id} deleted successfully` })
  } catch (error) {
    console.error(`Error deleting order ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
