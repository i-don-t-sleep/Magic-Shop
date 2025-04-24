อัพเดทพวก
- LoginPage เพิ่ม Toast เข้ามาแทน alert ให้สวยขึ้น (อนาคตเดะจะปรับให้สวยกว่านี้)
- อัพเดทความ secure ของ MySQL ตอนแรกมัน เจาะระบบง่าย ตอนนี้ทำให้มันกัน SQL injection กับพวกเด็กซน DevTools ได้
- เปลี่ยนชื่อไฟล์เล็กน้อยพวก lording เป็น loading ไรงี้
- เพิ่ม folder แยกกันชัดเจน
- เปลี่ยนชื่อ _api เป็น api รวมถึง lib ย้ายไปนอก app แต่อยู่ใน src อยุ่
- ใช้ db.ts ในการเชื่อมต่อ mySQL และ api จะมี LoginAPI สำหรับการใช้งานจะอยู่ใน route.ts ตัวนั้น ตัวอย่างการ query
- ย้าย middleware ไปที่ MySQL

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("auth-token")

  if (!isLoggedIn && request.nextUrl.pathname.startsWith("/main")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

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
