// src/app/api/users/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'

export async function GET() {
  const db = await connectDB()
  const [rows] = await db.execute(`
    SELECT
      u.id,
      u.name,
      u.surname,
      CONCAT(u.name,' ',u.surname)           AS fullName,
      CONCAT(u.name,' ',u.surname)           AS username,          -- 👈 ใส่คืนให้ UsersPage ใช้
      e.email                                AS email,
      e.email                                AS defaultEmailAddress, -- 👈 ส่งชื่อเก่าเผื่อโค้ดยังใช้
      p.phoneNumber                          AS phone,
      p.phoneNumber                          AS defaultPhoneNumber, -- 👈 ส่งชื่อเก่า
      CONCAT_WS(', ',
        COALESCE(a.city,'???'),
        COALESCE(a.country,'???'),
        COALESCE(a.postalCode,'???')
      )                                      AS address,
      a.city, a.country, a.postalCode,
      u.sessionState                         AS session,
      u.sessionState                         AS sessionState,      -- 👈 ใส่ alias เดิม
      u.role,
      DATE_FORMAT(u.lastLogin,'%m/%d/%Y')    AS lastLogin
    FROM users u
    LEFT JOIN contactinfo  c ON c.id = u.contactID
    LEFT JOIN emailaddress e ON e.id = c.defaultEmailAddressID
    LEFT JOIN phonenumber  p ON p.id = c.defaultPhoneNumberID
    LEFT JOIN address      a ON a.id = c.defaultAddressID
    ORDER BY u.id DESC
  `);
  return NextResponse.json(rows)
}

/**
 * POST /api/users
 * รับข้อมูลจาก pop.tsx แล้วสร้างผู้ใช้ใหม่
 */
export async function POST(request: Request) {
  const {
    name,
    surname,
    email,
    phone = null,
    city = null,
    country = null,
    postalCode = null,
    // ตั้งค่าเริ่มต้น: sessionState = 'Online' ตามที่ผู้ใช้ต้องการ
    sessionState = 'Online',
    role = 'Customer',
  } = await request.json()

  // field จำเป็น
  if (!name || !surname || !email) {
    return NextResponse.json(
      { error: 'Missing required fields (name, surname, email)' },
      { status: 400 },
    )
  }

  const db = await connectDB()
  try {
    // ------ 1. เริ่ม transaction ------
    await db.beginTransaction()

    // ------ 2. สร้างบันทึก address / email / phone ------
    const [addrRes] = await db.execute(
      `INSERT INTO address (city, country, postalCode) VALUES (?, ?, ?)`,
      [city, country, postalCode],
    ) as any
    const addressId = addrRes.insertId

    const [emailRes] = await db.execute(
      `INSERT INTO emailaddress (email) VALUES (?)`,
      [email],
    ) as any
    const emailId = emailRes.insertId

    const [phoneRes] = await db.execute(
      `INSERT INTO phonenumber (phoneNumber) VALUES (?)`,
      [phone],
    ) as any
    const phoneId = phoneRes.insertId

    // ------ 3. contactinfo ------
    const [ciRes] = await db.execute(
      `INSERT INTO contactinfo (defaultEmailAddressID, defaultPhoneNumberID, defaultAddressID)
       VALUES (?, ?, ?)`,
      [emailId, phoneId, addressId],
    ) as any
    const contactId = ciRes.insertId

    // ------ 4. users ------
    // ใช้ email เป็น username ชั่วคราว (ปรับได้ตามต้องการ)
    await db.execute(
      `INSERT INTO users
        (birthday, username, name, surname, contactID,
         accountStatus, sessionState, profilePicture, mimeType, role, lastLogin)
       VALUES
        (NULL, ?, ?, ?, ?, 'Active', ?, NULL, NULL, ?, NOW())`,
      [email, name, surname, contactId, sessionState, role],
    )

    // ------ 5. commit ------
    await db.commit()
    return NextResponse.json({ success: true })
  } catch (err: any) {
    await db.rollback()
    console.error('Create user failed:', err)
    return NextResponse.json(
      { error: 'Failed to create user', detail: err.message },
      { status: 500 },
    )
  }
}
/**
 * DELETE /api/users?id=123
 * ลบผู้ใช้ตาม id
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  const db = await connectDB()
  await db.execute('DELETE FROM users WHERE id = ?', [id])
  return NextResponse.json({ success: true })
}
