'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function loading() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
     <div className="flex flex-col items-center justify-center h-screen bg-black text-white">

      <div className="mb-15">
        <Image
          src="/magic-shop_Logo.svg"
          alt="Logo"
          width={250}
          height={250}
          className="object-contain"
          draggable={false}
        />
      </div>

      <div className="animate-spin rounded-full h-60 w-60 border-t-4 border-b-4 border-red-600 mb-8"></div>
      <p className="text-3xl font-medium">Loading{dots}</p>
    </div>
    
  )
}
