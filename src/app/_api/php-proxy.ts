import { type NextRequest, NextResponse } from "next/server"

// This is a proxy endpoint to avoid CORS issues when calling the PHP API from the browser
// You can use this in your Next.js app to forward requests to your PHP backend

const PHP_API_URL = process.env.PHP_API_URL || "http://your-php-api-url.com/api"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get("endpoint") || ""

  // Remove the endpoint param and forward the rest
  searchParams.delete("endpoint")
  const queryString = searchParams.toString()

  try {
    const response = await fetch(`${PHP_API_URL}/${endpoint}${queryString ? `?${queryString}` : ""}`, {
      headers: {
        "Content-Type": "application/json",
        // Forward authorization header if present
        ...(request.headers.get("Authorization") ? { Authorization: request.headers.get("Authorization") || "" } : {}),
      },
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying to PHP API:", error)
    return NextResponse.json({ error: "Failed to fetch data from PHP API" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get("endpoint") || ""

  // Remove the endpoint param
  searchParams.delete("endpoint")
  const queryString = searchParams.toString()

  try {
    const body = await request.json()

    const response = await fetch(`${PHP_API_URL}/${endpoint}${queryString ? `?${queryString}` : ""}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("Authorization") ? { Authorization: request.headers.get("Authorization") || "" } : {}),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying to PHP API:", error)
    return NextResponse.json({ error: "Failed to post data to PHP API" }, { status: 500 })
  }
}
