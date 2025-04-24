import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (typeof username !== 'string' || typeof password !== 'string') {
    return Response.json({ success: false, message: 'Invalid input' }, { status: 400 })
  }

  try {
    const db = await connectDB()
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT Username, Password FROM Admins WHERE Username = ?',
      [username]
    )

    if (rows.length === 0) {
      return Response.json({ success: false, field: 'error', message: 'Invalid username or password' })
    }

    const user = rows[0]
    const isMatch = await bcrypt.compare(password, user.Password)

    if (!isMatch) {
      return Response.json({ success: false, field: 'error', message: 'Invalid username or password' })
    }

    const cookieStore = await cookies()
    cookieStore.set('auth_token', 'valid', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })


    return Response.json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.Username,
      },
    })
  } catch (error: any) {
    return Response.json({ success: false, message: 'Database error: ' + error.message })
  }
}
