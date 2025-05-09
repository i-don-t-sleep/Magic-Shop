//For design UI test
"use client"

import { useEffect, useState } from "react"

export default function loading() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <div className="flex flex-col h-screen">
        <div>Header</div>
        <div className="flex-grow overflow-auto">
          Content <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />{" "}
          <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />{" "}
          <br /> <br /> <br /> <br /> ds
        </div>
        <div>Footer</div>
      </div>
    </div>
  )
}
