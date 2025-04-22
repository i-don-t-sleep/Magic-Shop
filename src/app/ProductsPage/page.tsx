"use client"

import { Bell, ChevronDown, Filter, Plus, Search } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header_ProductsPage({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (v: string) => void }) {
  return (
    <div className="flex justify-between">
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
  );
}

export function Body_ProductsPage({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ProductCard
        title="2024 Digital & Physical Core Rulebook Bundle"
        price="$179.97"
        inventory={2704}
        imageUrl="/placeholder.svg?height=500&width=400"
        href="/ProductsPage/core-rulebook-bundle"
      />
      <ProductCard
        title="2024 Dungeon Master's Guide Digital + Physical Bundle"
        price="$59.99"
        inventory={142}
        imageUrl="/placeholder.svg?height=400&width=400"
        href="/ProductsPage/dungeon-masters-guide"
      />
      <ProductCard
        title="2024 Player's Handbook Digital + Physical Bundle"
        price="$59.99"
        inventory={573}
        imageUrl="/placeholder.svg?height=400&width=400"
        href="/ProductsPage/players-handbook"
      />
      <ProductCard
        title="Vecna: Eve of Ruin Digital + Physical Bundle"
        price="$69.95"
        inventory={25}
        imageUrl="/placeholder.svg?height=400&width=400"
        href="/ProductsPage/vecna-eve-of-ruin"
      />
      <ProductCard
        title="Quests from the Infinite Staircase Digital + Physical Bundle"
        price="$69.95"
        inventory={0}
        imageUrl="/placeholder.svg?height=400&width=400"
        href="/ProductsPage/infinite-staircase"
      />
      <ProductCard
        title="Quests from the Infinite Staircase Digital + Physical Bundle"
        price="$69.95"
        inventory={0}
        imageUrl="/placeholder.svg?height=400&width=400"
        href="/ProductsPage/infinite-staircase"
      />
      <ProductCard
        title="Vecna: Eve of Ruin Digital + Physical Bundle"
        price="$69.95"
        inventory={25}
        imageUrl="/placeholder.svg?height=400&width=400"
        href="/ProductsPage/vecna-eve-of-ruin"
      />
      <ProductCard
        title="Quests from the Infinite Staircase Digital + Physical Bundle"
        price="$69.95"
        inventory={0}
        imageUrl="/placeholder.svg?height=400&width=400"
        href="/ProductsPage/infinite-staircase"
      />
      <ProductCard
        title="Quests from the Infinite Staircase Digital + Physical Bundle"
        price="$69.95"
        inventory={0}
        imageUrl="/placeholder.svg?height=400&width=400"
        href="/ProductsPage/infinite-staircase"
      />
    </div>
  )
}
