import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2/promise"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const field = url.searchParams.get("field") || "null"
    const bins = Number.parseInt(url.searchParams.get("bins") || "10")

    // Validate field to prevent SQL injection
    if (!["price", "quantity"].includes(field)) {
      return NextResponse.json({ success: false, error: "Invalid field parameter" }, { status: 400 })
    }

    
    const db = await connectDB()

    // Get min, max, and average values
    const [stats] = await db.query<RowDataPacket[]>(
      `SELECT 
        MIN(${field}) as min_value, 
        MAX(${field}) as max_value,
        AVG(${field}) as avg_value
      FROM products`,
    )

    if (!stats || stats.length === 0) {
      return NextResponse.json({ success: false, error: "No data available" }, { status: 404 })
    }

    const minValue = parseFloat(stats[0].min_value)
    const maxValue = parseFloat(stats[0].max_value)
    const avgValue = parseFloat(stats[0].avg_value)

    // If min and max are the same, we can't create bins
    if (minValue === maxValue) {
      return NextResponse.json({
        success: true,
        histogram: {
          bins: [minValue],
          counts: [1],
          min: minValue,
          max: maxValue,
          average: avgValue,
        },
      })
    }

    // Calculate bin width
    const binWidth = (maxValue - minValue) / bins

    // Generate bin edges
    const binEdges = Array.from({ length: bins + 1 }, (_, i) => Math.round((minValue + i * binWidth) * 100) / 100)

    // Create SQL to count items in each bin
    const binQueries = []
    const binParams = []

    for (let i = 0; i < bins; i++) {
      const lowerBound = binEdges[i]
      const upperBound = binEdges[i + 1]

      if (i === bins - 1) {
        // Include the max value in the last bin
        binQueries.push(`COUNT(CASE WHEN ${field} >= ? AND ${field} <= ? THEN 1 END) as bin_${i}`)
      } else {
        binQueries.push(`COUNT(CASE WHEN ${field} >= ? AND ${field} < ? THEN 1 END) as bin_${i}`)
      }

      binParams.push(lowerBound, upperBound)
    }

    // Execute the query to get counts for each bin
    const [binCounts] = await db.query<RowDataPacket[]>(`SELECT ${binQueries.join(", ")} FROM products`, binParams)

    // Extract the counts from the result
    const counts = Object.values(binCounts[0]).map((count) => Number(count))

    return NextResponse.json({
      success: true,
      histogram: {
        bins: binEdges.slice(0, -1), // Remove the last edge as it's just the upper bound of the last bin
        counts,
        min: minValue,
        max: maxValue,
        average: avgValue,
      },
    })
  } catch (err) {
    console.error("Error generating histogram:", err)
    process.stdout.write("Error generating histogram: "+err)
    return NextResponse.json({ success: false, error: "Failed to generate histogram" }, { status: 500 })
  }
}
