"\"use client"

import { useEffect, useState } from "react"

export function LoadingComp() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col  items-center justify-center text-white">
      <div className="animate-spin rounded-full h-60 w-60 border-t-4 border-b-4 border-red-600 mb-8"></div>
      <p className="text-3xl font-medium">Loading{dots}</p>
    </div>
  )
}
