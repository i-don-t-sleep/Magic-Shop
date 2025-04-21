import { connectDB } from '@/lib/db'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs' //install is; ' npm install bcryptjs '

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (typeof username !== 'string' || typeof password !== 'string') {
    return Response.json({ success: false, message: 'Invalid input' }, { status: 400 })
  }

  try {
    const db = await connectDB()
    const [rows]: any = await db.query('SELECT * FROM Admins WHERE Username = ?', [username])

    if (rows.length === 0) {
      return Response.json({ success: false, field: 'username', message: 'Username not found.' })
    }

    const isMatch = await bcrypt.compare(password, rows[0].Password)
    if (!isMatch) {
      return Response.json({ success: false, field: 'password', message: 'Incorrect password.' })
    }

    return Response.json({ success: true, user: rows[0] })
  } catch (error: any) {
    return Response.json({ success: false, message: 'Database error: ' + error.message })
  }
}

