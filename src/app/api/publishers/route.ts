// import { NextRequest, NextResponse } from "next/server"
// import { connectDB } from "@/lib/db"
// import type { RowDataPacket } from "mysql2/promise"

// // — GET handler remains unchanged —
// export async function GET(req: NextRequest) {
//   try {
//     const db = await connectDB()
//     const [rows] = await db.query<RowDataPacket[]>(
//       // `SELECT 
//       //    p.id,
//       //    p.name,
//       //    p.description,
//       //    p.servicesFee,
//       //    p.publisherWeb
//       //  FROM publishers p
//       //  ORDER BY p.name`

//       `SELECT p.id,
//         p.username,
//         p.name,
//         p.description,
//         p.servicesFee,
//         p.publisherWeb,
//         ei.email   AS defaultEmail,
//         ph.phoneNumber   AS defaultPhone,
//         ad.city, ad.country, ad.postalCode,
//         p.mimeType,
//         p.sessionState AS sessionState,
//         CASE
//           WHEN p.logo_img IS NOT NULL
//           THEN CONCAT('data:image/',p.mimeType,';base64,',TO_BASE64(p.logo_img))
//           ELSE NULL
//         END        AS logoUrl
//       FROM publishers p
//       LEFT JOIN contactinfo  ci ON ci.id = p.contactID
//       LEFT JOIN emailaddress ei ON ei.id = ci.defaultEmailAddressID
//       LEFT JOIN phonenumber  ph ON ph.id = ci.defaultPhoneNumberID
//       LEFT JOIN address      ad ON ad.id = ci.defaultAddressID
//       ORDER BY p.name;`
//     )
//     return NextResponse.json({ success: true, publishers: rows })
//   } catch (error: any) {
//     console.error("Error fetching publishers:", error)
//     return NextResponse.json(
//       { success: false, message: `Error fetching publishers: ${error.message}` },
//       { status: 500 }
//     )
//   }
// }

// // — POST handler now parses JSON, inserts, and returns the new publisher —
// export async function POST(req: NextRequest) {
//   try {
//     // 1. Parse JSON body
//     const { 
//       username, 
//       description = null,
//       publisherWeb = null, 
//       servicesFee = 0 } = await req.json()

//     // 2. Basic validation
//     if (!username) {
//       return NextResponse.json(
//         { success: false, message: "Missing required field: name" },
//         { status: 400 }
//       )
//     }

//     const db = await connectDB()
//     await db.beginTransaction()

//     try {
//       // 3. Create a contactinfo record to satisfy the foreign key
//       const [contactResult] = await db.execute(
//         "INSERT INTO contactinfo (notes) VALUES (?)",
//         ["Publisher contact info"]
//       )
//       const contactId = (contactResult as any).insertId

//       // 4. Insert into publishers
//       const [insertResult] = await db.execute(
//         `INSERT INTO publishers
//            (username, description, publisherWeb, servicesFee, contactID)
//          VALUES (?, ?, ?, ?, ?)`,
//         [username, description, publisherWeb, servicesFee, contactId]
//       )
//       const publisherId = (insertResult as any).insertId

//       // 5. Commit transaction
//       await db.commit()

//       // 6. Retrieve and return the newly created publisher
//       const [rows] = await db.query<RowDataPacket[]>(
//         `SELECT id, name, description, servicesFee, publisherWeb
//          FROM publishers
//          WHERE id = ?`,
//         [publisherId]
//       )
//       const publisher = rows[0]

//       return NextResponse.json({ success: true, publisher }, { status: 201 })
//     } catch (err: any) {
//       await db.rollback()
//       throw err
//     }
//   } catch (error: any) {
//     console.error("Error adding publisher:", error)
//     return NextResponse.json(
//       { success: false, message: error.message || "Error adding publisher" },
//       { status: 500 }
//     )
//   }
// }

// // New DELETE handler
// export async function DELETE(request: NextRequest) {
//   try {
//     const url = new URL(request.url);
//     const idParam = url.searchParams.get('id');
//     if (!idParam) {
//       return NextResponse.json(
//         { success: false, message: 'Missing id parameter' },
//         { status: 400 }
//       );
//     }
//     const id = parseInt(idParam, 10);
//     const db = await connectDB();
//     await db.execute(`DELETE FROM publishers WHERE id = ?`, [id]);
//     return NextResponse.json({ success: true, id });
//   } catch (err: any) {
//     console.error('Error deleting publisher:', err);
//     return NextResponse.json(
//       { success: false, message: err.message || 'Delete failed' },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/publishers/route.ts
// src/app/api/publishers/route.ts
// src/app/api/publishers/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';

const BASE_SELECT = `
  SELECT
    p.id,
    p.username,
    p.name,
    p.description,
    p.servicesFee,
    p.publisherWeb,
    p.sessionState,
    ei.email         AS defaultEmail,
    ph.phoneNumber   AS defaultPhone,    -- เปลี่ยนจาก ph.phone เป็น ph.phoneNumber
    ad.city,
    ad.country,
    ad.postalCode,
    p.mimeType,
    CASE
      WHEN p.logo_img IS NOT NULL
      THEN CONCAT('data:image/', p.mimeType, ';base64,', TO_BASE64(p.logo_img))
      ELSE NULL
    END AS logoUrl
  FROM publishers p
  LEFT JOIN contactinfo ci ON ci.id = p.contactID
  LEFT JOIN emailaddress ei ON ei.id = ci.defaultEmailAddressID
  LEFT JOIN phonenumber   ph ON ph.id = ci.defaultPhoneNumberID  -- ให้ join กับ defaultPhoneNumberID
  LEFT JOIN address       ad ON ad.id = ci.defaultAddressID
`;

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(BASE_SELECT + ' ORDER BY p.name');
    return NextResponse.json({ success: true, publishers: rows });
  } catch (err: any) {
    console.error('Error fetching publishers:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      username,
      name,
      description = '',
      servicesFee = 0,
      publisherWeb = '',
      sessionState = 'Offline',
      defaultEmail = '',
      defaultPhone = '',
      city = '',
      country = '',
      postalCode = '',
    } = await request.json();

    const db = await connectDB();

    // 1️⃣ Insert (or reuse) email
    const [emailRes]: any = await db.execute(
      `INSERT INTO emailaddress (email)
       VALUES (?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [defaultEmail]
    );
    const emailID = emailRes.insertId;

    // 2️⃣ Insert (or reuse) phone
    const [phoneRes]: any = await db.execute(
      `INSERT INTO phonenumber (phoneNumber)
       VALUES (?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [defaultPhone]
    );
    const phoneID = phoneRes.insertId;

    // 3️⃣ Insert (or reuse) address
    const [addrRes]: any = await db.execute(
      `INSERT INTO address (city, country, postalCode)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [city, country, postalCode]
    );
    const addrID = addrRes.insertId;

    // 4️⃣ Create contactinfo
    const [ciRes]: any = await db.execute(
      `INSERT INTO contactinfo
         (defaultEmailAddressID, defaultPhoneNumberID, defaultAddressID)
       VALUES (?, ?, ?)`,
      [emailID, phoneID, addrID]
    );
    const contactID = ciRes.insertId;

    // 5️⃣ Finally, insert publisher
    const [pubRes]: any = await db.execute(
      `INSERT INTO publishers
         (username, name, description, servicesFee, publisherWeb, sessionState, contactID)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, name, description, servicesFee, publisherWeb, sessionState, contactID]
    );

    return NextResponse.json({ success: true, id: pubRes.insertId });
  } catch (err: any) {
    console.error('Error creating publisher:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const db = await connectDB();
    await db.execute('DELETE FROM publishers WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting publisher:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

