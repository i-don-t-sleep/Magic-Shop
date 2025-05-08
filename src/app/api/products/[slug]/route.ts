// app/api/products/[slug]/route.ts
import { NextResponse } from 'next/server'
import { RowDataPacket } from 'mysql2'
import { connectDB } from '@/lib/db'

/** slugify ต้องตรงกับฝั่ง client */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, '')      // trim leading/trailing hyphens
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const db = await connectDB()

  // รอ params.resolve
  const { slug } = await context.params

  // Decode slug
  const decoded = decodeURIComponent(slug)
  // e.g. '2024-digital-&-physical-core-rulebook-bundle&pid=3&pub=wangshu-corporation'

  // หา index ของ key แต่ละตัว
  const pidKey = '&pid='
  const pubKey = '&pub='
  const pidIdx = decoded.indexOf(pidKey)
  const pubIdx = decoded.indexOf(pubKey)

  if (pidIdx === -1 || pubIdx === -1) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  // แยกค่า nameSlug, pidValue, pubSlug
  const nameSlug = decoded.substring(0, pidIdx)
  const pidValue = Number(decoded.substring(pidIdx + pidKey.length, pubIdx))
  const pubSlug  = decoded.substring(pubIdx + pubKey.length)

  if (!nameSlug || isNaN(pidValue) || !pubSlug) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  // Query DB ด้วย id อย่างเดียว
  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT
      p.id,
      p.name,
      p.price,
      p.quantity,
      pub.name       AS publisherName,
      img.firstImgId
    FROM products AS p
    JOIN publishers AS pub
      ON pub.id = p.publisherID
    LEFT JOIN (
      SELECT productID, img, MIN(id) AS firstImgId
      FROM productimages
      GROUP BY productID
    ) AS img
      ON img.productID = p.id
    WHERE p.id = ?
    LIMIT 1
    `,
    [pidValue]
  )
  
  if (rows.length === 0 || (nameSlug!=slugify(rows[0].name) || pubSlug!=slugify(rows[0].publisherName))) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const r = rows[0] as {
    id: number
    name: string
    price: number
    quantity: number
    publisherName: string
    firstImgId: number | null
  }

  // สร้าง imageUrl แล้วส่ง JSON กลับ
  const imageUrl = r.firstImgId
    ? `/api/blob/productimages/${r.firstImgId}`
    : `/api/images/placeholder.png`
  process.stdout.write(` ${imageUrl}\n`)
  return NextResponse.json(
    {
      id           : r.id,
      name         : r.name,
      price        : `$${Number(r.price).toFixed(2)}`,
      quantity     : r.quantity,
      publisherName: r.publisherName,
      imageUrl     : imageUrl,
    },
    { status: 200 }
  )
}
