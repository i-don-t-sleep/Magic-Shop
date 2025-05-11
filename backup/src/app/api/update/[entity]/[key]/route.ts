import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import type { ResultSetHeader } from "mysql2/promise"

// ========== table meta (whitelist) ==========
const ALLOW_TABLE: Record<string, { pk: string; editable: readonly string[] }> = {
  users: {
    pk: "username",
    editable: ["accountStatus", "role"] as const,
  },
}

// ========== PATCH handler ==========
export async function PATCH(req: NextRequest, { params }: { params: { entity: string; key: string } }) {
  const { entity, key } = params
  const meta = ALLOW_TABLE[entity]

  if (!meta) return NextResponse.json({ error: "Entity not allowed" }, { status: 400 })

  const body = (await req.json()) as Record<string, unknown>
  const fields = Object.keys(body)
  if (fields.length === 0) return NextResponse.json({ error: "Empty payload" }, { status: 400 })

  // --- validate editable field ---
  const editableSet = new Set<string>(meta.editable)
  for (const f of fields)
    if (!editableSet.has(f)) return NextResponse.json({ error: `Field ${f} not editable` }, { status: 400 })

  // --- build dynamic SQL ---
  const setClause = fields.map((f) => `\`${f}\` = ?`).join(", ")
  const values = fields.map((f) => body[f])
  const sql = `UPDATE \`${entity}\` SET ${setClause} WHERE \`${meta.pk}\` = ?`

  try {
    const db = await connectDB()
    const [result] = await db.execute<ResultSetHeader>(sql, [...values, key])

    if (result.affectedRows === 0) return NextResponse.json({ error: "Not Found" }, { status: 404 })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}
