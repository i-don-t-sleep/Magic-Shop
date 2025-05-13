import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const db = await connectDB()

    // Get sales by category
    const [categorySales] = await db.query(
      `SELECT 
         c.id,
         c.name,
         COUNT(oi.id) as orderCount,
         SUM(oi.totalPrice) as totalSales
       FROM categories c
       LEFT JOIN products p ON c.id = p.categoryId
       LEFT JOIN orderitems oi ON p.id = oi.productID
       GROUP BY c.id, c.name
       ORDER BY totalSales DESC`,
    )

    // Calculate total sales for percentage
    let totalSales = 0
    if (Array.isArray(categorySales)) {
      categorySales.forEach((category) => {
        totalSales += Number.parseFloat(category.totalSales || 0)
      })
    }

    // Format the response with percentages
    const formattedCategories = Array.isArray(categorySales)
      ? categorySales.map((category) => ({
          id: category.id,
          name: category.name,
          orderCount: category.orderCount,
          totalSales: Number.parseFloat(category.totalSales || 0),
          percentage: totalSales > 0 ? Math.round((Number.parseFloat(category.totalSales || 0) / totalSales) * 100) : 0,
        }))
      : []

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error("Error fetching category data:", error)
    return NextResponse.json({ error: "Failed to fetch category data" }, { status: 500 })
  }
}
