- ปรับ MainPage ให้มีความ smooth ขึ้น กับ link ไปยังหน้าอื่นๆได้ โดยที่ยังมี navigate เช่น product review
- ปรับ secure login ให้ hacker เดายาก
- ปรับสี css อื่นๆให้สวย

- *** อาจจะปรับต่อ คงยังไม่ merge เพราะยังจัด folder ไม่เรียบร้อย แต่เอาไปใช้ได้อยู่

เกี่ยวกับ database
1. ให้สร้าง files ชื่อ .env.local ขึ้นมา
2. ใส่พวกนี้ในไฟล์
DB_HOST=localhost
DB_USER=[User]
DB_PASS=[Pass]
DB_NAME=[NameDB]
พวก [] ใส่ตาม phpMyAdmin เลยที่สร้าง
อาจจะใช้ไฟล์ sql นี้ก็ได้ ที่ใช้อยู่ตอนนี้ (MagicShop.sql) Upload ใส่ phpMyAdmin จะได้ DB ใหม่ อันนี้จะเอาไปใช้กับ web ได้ (ใช้จริงอาจจะต้องเปลี่ยน แต่ตอนนี้เอามาแค่ใช้เทส)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
