อัพเดทพวก
- เพิ่มหน้าอื่นๆ ยังไม่ได้ ปรับแต่งเพิ่มจาก vzero

## วิธีติดตั้ง project
Method 1

[First clone this project on your vscode]

git clone https://github.com/i-don-t-sleep/Magic-Shop

[Open this repository and run command]

npm install

[Make file .env.local here if u use MySQL (เอาไฟล์ SQL ไปลง phpMyAdmin ด้วย)]

DB_HOST=localhost

DB_USER=Heart

DB_PASS=1234

DB_NAME=MagicShop

Method 2
หรือถ้าจะติดตตั้ง project ไม่ได้ใช้อันนี้แล้ว ไป copy code จาก git นี้ไปลงแก้
(https://drive.google.com/file/d/1_UQuYUKmzROgCg8N8mHHtSriQVeoX9Eq/view?usp=drive_link)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Role users

publisher - ใช้ reports reviews stock(ไม่มีเลขตำแหน่ง stock) poduct
admin - เห็นข้างบนหมด 
superadmin - เห็นทุกอย่าง
customer - product(ไม่มีปุ่มadd) carts shipping

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
