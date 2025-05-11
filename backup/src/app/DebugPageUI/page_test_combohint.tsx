// app/products/page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import SuggestInput, { ComboboxItem } from "@/components/newcomp/comboboxhint"  // <-- import component

/* ---------- mock data ---------- */
interface Product {
  id: number
  name: string
  category: string
}

const mockProducts: Product[] = [
  { id: 0, name: "Mystic Dice Set", category: "Dice" },
  { id: 1, name: "Dragon Miniature", category: "Miniature" },
  { id: 2, name: "Core Rulebook 5e", category: "Rulebook" },
  { id: 3, name: "Condition Tokens", category: "Game Aid" },
]

/* ---------- build category list for dropdown ---------- */
const categories: ComboboxItem[] = [
  ...new Set(mockProducts.map((p) => p.category)),
].map((c, idx) => ({ id: idx, name: c }))

/* ---------- page component ---------- */
export default function ProductsPage() {
  /* เก็บ keyword จาก SuggestInput (string อิสระ) */
  const [keyword, setKeyword] = useState("")

  /* ฟิลเตอร์สินค้าเมื่อ keyword เปลี่ยน */
  const filteredProducts = useMemo(() => {
    const kw = (keyword ?? "")            // fallback เป็น string ว่าง
                  .trim()
                  .toLowerCase()
  
    if (kw === "") return mockProducts
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.category.toLowerCase().includes(kw),
    )
  }, [keyword])
  

  

  /*—-—- optional: side-effect เช่น fetch backend —-—-*/
  useEffect(() => {
    // สมมุติเรียก API /api/products?search=<keyword>
    // (ตรงนี้ตัวอย่างแค่ console.log)
    console.log("search:", keyword)
  }, [keyword])

  return (
    <main className="p-6 space-y-4">
      {/* ---------- Search / Filter ---------- */}
      <SuggestInput
        items={categories}
        value={keyword}
        setValue={setKeyword}
        placeholder="ค้นหาหรือเลือกหมวดหมู่…"
        className="max-w-xs"
      />

      {/* ---------- List ---------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-zinc-700 p-4 bg-zinc-900"
          >
            <h2 className="text-lg font-semibold text-white">{p.name}</h2>
            <p className="text-sm text-zinc-400">{p.category}</p>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <p className="text-zinc-400">ไม่พบสินค้า</p>
        )}
      </section>
    </main>
  )
}
