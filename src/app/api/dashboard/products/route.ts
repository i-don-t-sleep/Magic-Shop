import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const db = await connectDB()

    // Get product status information
    const [productStatus] = await db.query(
      `SELECT 
         p.id,
         p.name,
         p.status
       FROM products p
       ORDER BY p.name
       LIMIT 6`,
    )

    // Format the response
    const formattedProducts = Array.isArray(productStatus)
      ? productStatus.map((product) => ({
          id: product.id,
          name: product.name,
          status: product.status,
        }))
      : []

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Error fetching product status:", error)
    return NextResponse.json({ error: "Failed to fetch product status" }, { status: 500 })
  }
}
