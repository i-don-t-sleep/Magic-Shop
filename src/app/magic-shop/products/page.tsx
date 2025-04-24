"use client"

import { useState } from "react"
import { ChevronDown, Filter, Plus, Search } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function productsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex width=120% h-screen overflow-y-auto scrollbar-overlay">
        <Body searchQuery={searchQuery} />
      </div>
    </div>
  )
}

function Header({
  searchQuery,
  setSearchQuery,
  classN = 'px-6 pb-3',
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  classN?: string
}) {
  return (
    <div className={`${classN} flex justify-between`}>
      <div className="w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search items..."
            className="pl-10 bg-zinc-900 border-zinc-800 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
    </div>
  )
}

function Body({ searchQuery, classN = 'px-6 pb-3' }: { searchQuery: string, classN?: string }) {
  return (
    <div className={`${classN} grid grid-cols-1 lg:grid-cols-3 gap-6`}>
      {/* ตัวอย่าง product card */}
      <ProductCard
        title="2024 Digital & Physical Core Rulebook Bundle"
        price="$179.97"
        inventory={2704}
        imageUrl="cf27466446e6da568b1eae990514f787.png"
        href="/magic-shop/products/core-rulebook-bundle"
      />
      <ProductCard
        title="2024 Dungeon Master's Guide Digital + Physical Bundle"
        price="$59.99"
        inventory={142}
        imageUrl="dcfbd4a80d735ed524c31123e084659c.png"
        href="/magic-shop/products/dungeon-masters-guide"
      />
      <ProductCard
        title="2024 Player's Handbook Digital + Physical Bund"
        price="$59.99"
        inventory={573}
        imageUrl="dc84620855214ac09da2632bd939da1f.png"
        href="/magic-shop/products/infinite-staircase"
      />
      <ProductCard
        title="Vecna: Eve of Ruin Digital + Physical Bundle"
        price="$69.95"
        inventory={25}
        imageUrl="036c70a2a0fc58eb24a89b0d7c4dcdab.png"
        href="/magic-shop/products/dungeon-masters-guide"
      />
      <ProductCard
        title="Quests from the Infinite Staircase Digital + Physical Bundle"
        price="$69.95"
        inventory={0}
        imageUrl="2c4c88e9ecc12670d82aece0ec209b09.png"
        href="/magic-shop/products/infinite-staircase"
      />
      {/* เพิ่ม ProductCard ได้ตามต้องการ */}
      
    </div>
  )
}
