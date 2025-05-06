// app/api/products/[slug]/route.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import { RowDataPacket } from "mysql2/promise"
import { showSuccessToast, showErrorToast, showLoadingToast } from '@/components/notify/Toast'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  try {
    // 1) สร้าง connection (singleton) ผ่าน connectDB()
    const db = await connectDB()

    // 2) รัน SQL query เพื่อดึงข้อมูลตาม slug
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
         p.name,
         p.price,
         p.quantity,
         p.description,
         COALESCE(img.firstImgId, NULL) AS firstImgId
       FROM products p
       LEFT JOIN (
         SELECT productID, MIN(id) AS firstImgId
         FROM productimages
         GROUP BY productID
       ) img ON img.productID = p.id
       WHERE p.name = ? AND p.status = 'Available'
       LIMIT 1
      `,
      [slug]
    )
    process.stdout.write(`  slug=${slug}\n`)
    // 3) ถ้าไม่เจอ product คืน 404
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // 4) แปลงผลลัพธ์ให้เป็น JSON format ที่ client ต้องการ
    const prod = rows[0]
    const imageUrl = prod.firstImgId
      ? `/api/blob/productimages/${prod.firstImgId}`
      : `/api/images/placeholder.png`

    return NextResponse.json({
      name    : prod.name,
      price    : `$${Number(prod.price).toFixed(2)}`,
      quantity: prod.quantity,
      description: prod.description,
      imageUrl,
      href     : slug,  // ถ้าต้องการใช้เป็นลิงก์
    })
  } catch (err) {
    console.error("DB error:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
