import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await connectDB();
    const [rows]: any = await db.execute(`
      SELECT
        u.id,
        u.username,
        u.name,
        u.surname,
        u.birthday,
        /* contactInfo → email */
        (SELECT e.email
         FROM emailaddress e
         WHERE e.contactInfoId = u.contactID
         LIMIT 1
        ) AS defaultEmail,
        /* contactInfo → phone */
        (SELECT p.phoneNumber
         FROM phonenumber p
         WHERE p.contactInfoId = u.contactID
         LIMIT 1
        ) AS defaultPhone,
        u.accountStatus,
        u.sessionState,
        u.profilePicture,
        u.mimeType,
        u.role,
        u.lastLogin
      FROM users u
      WHERE u.role IN ('Super Admin', 'Data Entry Admin')
      ORDER BY u.id;
    `);
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error('Error fetching admins:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
