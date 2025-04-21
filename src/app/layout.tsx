import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast' //npm install react-hot-toast

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "Magic Shop",
  description: "Shop for DnD lovers by DnD lovers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'normal_toast',
            duration: 3000,
          }}
        />
      </body>
    </html>
  )
}

