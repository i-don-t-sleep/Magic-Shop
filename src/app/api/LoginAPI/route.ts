import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // 1. อ่านค่า username, password จาก request body
  const { username, password } = await req.json();

  // 2. ตรวจสอบ type ให้เป็น string เสมอ
  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const db = await connectDB();

    // 3. พยายามค้นในตาราง users ก่อน
    const [userRows] = await db.query<RowDataPacket[]>(
      "SELECT id, password, role FROM users WHERE username = ?",
      [username]
    );

    let userId: number;
    let hashedPwd: string;
    let role: string;

    if (userRows.length > 0) {
      // 3.1 ถ้าเจอ user ใน users
      userId = userRows[0].id;
      hashedPwd = userRows[0].password;
      role = userRows[0].role; // Customer | Data Entry Admin | Super Admin
    } else {
      // 4. ถ้าไม่เจอใน users ให้ค้นในตาราง publishers
      const [pubRows] = await db.query<RowDataPacket[]>(
        "SELECT id, password FROM publishers WHERE username = ?",
        [username]
      );
      if (pubRows.length === 0) {
        // 4.1 ถ้าไม่เจอทั้งสองตาราง ให้ตอบ 401
        return NextResponse.json(
          { success: false, field: "error", message: "Invalid username or password" },
          { status: 401 }
        );
      }
      userId = pubRows[0].id;
      hashedPwd = pubRows[0].password;
      role = "Publisher";
    }

    // 5. ตรวจสอบรหัสผ่านด้วย bcrypt
    const isMatch = await bcrypt.compare(password, hashedPwd);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, field: "error", message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // 6. สร้าง NextResponse สำหรับส่งกลับ และเซ็ต cookies
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      username,
      role,
    });

    response.cookies.set("auth_token", "valid", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    response.cookies.set(
      "account-info",
      JSON.stringify({ id: userId, username, role }),
      { path: "/", maxAge: 86400, sameSite: "strict" }
    );

    // 7. อัปเดต sessionState ในฐานข้อมูลตาม role
    if (role === "Publisher") {
      await db.execute<ResultSetHeader>(
        "UPDATE publishers SET sessionState = ? WHERE id = ?",
        ["Online", userId]
      );
    } else {
      await db.execute<ResultSetHeader>(
        "UPDATE users SET sessionState = ? WHERE id = ?",
        ["Online", userId]
      );
    }

    return response;
  } catch (error: any) {
    // 8. กรณีมี error จาก database
    return NextResponse.json(
      { success: false, message: "Database error: " + error.message },
      { status: 500 }
    );
  }
}
