import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // In a real implementation, you would query the database for sales by region
    // For this example, we'll return mock data since the schema doesn't include region information

    // Mock data for sales by region
    const salesByRegion = {
      NA: 0.9, // North America
      SA: 0.7, // South America
      EU: 0.8, // Europe
      AF: 0.5, // Africa
      AS: 0.85, // Asia
      OC: 0.6, // Oceania
    }

    return NextResponse.json(salesByRegion)
  } catch (error) {
    console.error("Error fetching region data:", error)
    return NextResponse.json({ error: "Failed to fetch region data" }, { status: 500 })
  }
}
