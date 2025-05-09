//api/blob/[entity]/[key]
import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { RowDataPacket } from "mysql2"

const TABLES: Record<
  // define whitelist protect SQL-Injection
  string,
  { pk: string; blobField: string; mimeField?: string }
> = {
  users: { pk: "username", blobField: "profilePicture", mimeField: "mimeType" },
  productimages: { pk: "id", blobField: "img", mimeField: "mimeType" },
}

export async function GET(req: NextRequest, { params }: { params: { entity: string; key: string } }) {
  const pathParts = req.nextUrl.pathname.split("/")
  const entity = pathParts[pathParts.length - 2]
  const key = pathParts[pathParts.length - 1]
  const meta = TABLES[entity]

  // ---------- 2.1 Check entity ----------
  if (!meta) {
    return NextResponse.json({ error: "Entity not allowed" }, { status: 400 })
  }

  try {
    // ---------- 2.2 Query BLOB ----------
    const db = await connectDB()
    const sql = `SELECT \`${meta.blobField}\`${meta.mimeField ? `,\`${meta.mimeField}\`` : ""} 
       FROM \`${entity}\` 
       WHERE \`${meta.pk}\` = ? 
       LIMIT 1`

    const [rows] = await db.query<RowDataPacket[]>(sql, [key])

    if (!rows.length || !rows[0][meta.blobField]) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const blob: Buffer = rows[0][meta.blobField]
    const mime = "image/" + ((meta.mimeField ? rows[0][meta.mimeField] : null) || "png") // fallback ถ้าไม่เก็บ mime

    // ---------- 2.3 ส่ง Buffer เป็นรูป ----------
    return new NextResponse(blob, {
      headers: {
        "Content-Type": mime,
        "Content-Length": blob.length.toString(),
        // cache รูป 1 วัน ถ้าเหมาะกับ use-case
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (err) {
    console.error(err)
    return new NextResponse("Server Error", { status: 500 })
  }
}
