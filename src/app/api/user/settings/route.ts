// pages/api/user/settings.ts

import type { NextApiRequest, NextApiResponse } from "next";
/*import formidable from "formidable";
import fs from "fs";
import { connectDB } from "@/lib/db";

// ปิด built-in bodyParser เพื่อให้ formidable จัดการ parsing เอง
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const form = new formidable.IncomingForm({
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error parsing form data" });
    }

    const newUsername = fields.username as string;
    const newEmail = fields.email as string;
    const avatar = files.profileImage as formidable.File | undefined;

    try {
      const conn = await connectDB();
      await conn.beginTransaction();

      // ดึง cookie "account-info" เพื่อระบุผู้ใช้ (username เดิม)
      const cookie = req.cookies["account-info"];
      if (!cookie) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthenticated" });
      }
      const account = JSON.parse(decodeURIComponent(cookie));
      const oldUsername = account.username as string;

      // อัพเดต username
      if (newUsername && newUsername !== oldUsername) {
        await conn.execute(
          `UPDATE users
             SET username = ?, modifyDate = NOW()
           WHERE username = ?`,
          [newUsername, oldUsername]
        );
      }

      // อัพเดต email (สมมติว่ามีคอลัมน์ email ในตาราง users)
      if (newEmail) {
        await conn.execute(
          `UPDATE users
             SET email = ?
           WHERE username = ?`,
          [newEmail, newUsername || oldUsername]
        );
      }

      // อัพเดต profile picture (BLOB) และ mimeType
      if (avatar && avatar.filepath) {
        const data = await fs.promises.readFile(avatar.filepath);
        const mimeType = avatar.mimetype || null;
        await conn.execute(
          `UPDATE users
             SET profilePicture = ?, mimeType = ?
           WHERE username = ?`,
          [data, mimeType, newUsername || oldUsername]
        );
      }

      await conn.commit();
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("DB update error:", error);
      try {
        const conn = await connectDB();
        await conn.rollback();
      } catch {}
      return res
        .status(500)
        .json({ success: false, message: "Failed to update settings" });
    }
  });
}
*/