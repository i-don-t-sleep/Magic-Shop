import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { RowDataPacket } from "mysql2/promise"

/* GET /api/mock-products -------------------------------------------------- */
export async function GET(req: NextRequest) {
  const db = await connectDB()

  /* ดึงสินค้า + id ของรูปแรก (MIN(id)) ต่อสินค้า */
  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT
      p.id,
      p.name,
      p.price,
      p.quantity,
      img.firstImgId
    FROM products p
    LEFT JOIN (
        SELECT productID, MIN(id) AS firstImgId
        FROM productimages
        GROUP BY productID
    ) AS img ON img.productID = p.id
    WHERE p.status = 'Available'
    ORDER BY p.id;
    `
  )

  /* แปลงเป็น mockProducts ------------------------------------------------- */
  //const origin = req.nextUrl.origin 
  const data = rows.map(r => ({
    name    : r.name,
    price    : `$${Number(r.price).toFixed(2)}`,
    quantity: r.quantity,
    imageUrl : r.firstImgId
                ? `/api/blob/productimages/${r.firstImgId}`   // สตรีม BLOB
                : `/api/images/placeholder.png`,             // fallback
    href     : r.name //weird
  }))

  return NextResponse.json(data)
}

/* helper: สร้าง slug จากชื่อสินค้า */
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}
