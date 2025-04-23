import path from "path"
import fs from "fs"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const imgPath = req.nextUrl.searchParams.get("path")
  if (!imgPath) return new Response("Not found", { status: 404 })

  const filePath = path.join(process.cwd(), "storage", imgPath)
  if (!fs.existsSync(filePath)) return new Response("Not found", { status: 404 })

  const buffer = fs.readFileSync(filePath)
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  })
}
