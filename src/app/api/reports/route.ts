import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "month"
    const reportType = searchParams.get("reportType") || "sales"

    // In a real implementation, this would query the database
    // For now, we'll return mock data based on the requested report type
    let reportData = {}

    switch (reportType) {
      case "sales":
        reportData = {
          totalRevenue: 125000,
          totalOrders: 850,
          averageOrderValue: 147.06,
          revenueChange: 12.5,
          ordersChange: 8.2,
          monthlySales: [
            { month: "Jan", sales: 15000 },
            { month: "Feb", sales: 18000 },
            { month: "Mar", sales: 22000 },
            { month: "Apr", sales: 25000 },
            { month: "May", sales: 30000 },
            { month: "Jun", sales: 28000 },
            { month: "Jul", sales: 32000 },
            { month: "Aug", sales: 35000 },
            { month: "Sep", sales: 38000 },
            { month: "Oct", sales: 40000 },
            { month: "Nov", sales: 42000 },
            { month: "Dec", sales: 45000 },
          ],
        }
        break
      case "products":
        reportData = {
          hotSales: [
            { id: 1, name: "2024 Dungeon Master's guide", price: 1200, quantity: 168, totalSales: 20184 },
            { id: 2, name: "2024 Player's Handbook Digital...", price: 950, quantity: 153, totalSales: 14502 },
            { id: 3, name: "Quest from the infinity stairc...", price: 850, quantity: 120, totalSales: 10230 },
            { id: 4, name: "Vecna: Eve of Ruin Digital", price: 1100, quantity: 80, totalSales: 8769 },
            { id: 5, name: "D&D Campaign Case: Crea...", price: 1090, quantity: 50, totalSales: 5450 },
            { id: 6, name: "D&D Expansion Gift Set Digit...", price: 1256, quantity: 10, totalSales: 1256 },
          ],
        }
        break
      case "categories":
        reportData = {
          categorySales: [
            { categoryId: 1, categoryName: "Core Rulebooks", totalSales: 45000, percentage: 35 },
            { categoryId: 2, categoryName: "Adventures", totalSales: 30000, percentage: 25 },
            { categoryId: 3, categoryName: "Accessories", totalSales: 20000, percentage: 15 },
            { categoryId: 4, categoryName: "Digital Content", totalSales: 15000, percentage: 12 },
            { categoryId: 5, categoryName: "Miniatures", totalSales: 10000, percentage: 8 },
            { categoryId: 6, categoryName: "Other", totalSales: 5000, percentage: 5 },
          ],
        }
        break
      default:
        reportData = {
          message: "Invalid report type",
        }
    }

    return NextResponse.json({
      timeRange,
      reportType,
      data: reportData,
    })
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
