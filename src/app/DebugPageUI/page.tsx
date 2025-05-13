"use client"

import React, { useState } from "react"
import { Spinbox } from "@/components/ui/spinbox"  // ปรับ path ตามโครงสร้างของคุณ

export default function SpinboxDemo() {
  // สร้าง state เก็บตัวเลข
  const [value, setValue] = useState<number>(0)

  return (
    <div className="p-4 bg-zinc-900 min-h-screen">
     <textarea
              id="newPublisherDescription"
              rows={3}
              placeholder="Enter publisher description"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm
               appearance-none outline-none
              focus:ring-red-500 focus:border-red-500
              
              "
            />
    </div>
  )
}
