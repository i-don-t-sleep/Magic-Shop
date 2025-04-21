"use client"

import { Bell, ChevronDown, Filter, Plus, Search } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { NavItem } from "@/components/nav-item"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BarChartIcon,
  GridIcon,
  PackageIcon,
  ReceiptIcon,
  ShieldIcon,
  ShoppingBagIcon,
  StarIcon,
  TagIcon,
  TruckIcon,
  UserIcon,
} from "@/components/ui/icons"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-screen bg-magic-back text-white p-4">
      {/* Sidebar */}
      <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[24] flex">
        <div className="w-[320px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 flex flex-col h-full">

            <div className="my-5 space-y-1">
              <div className="flex flex-col items-center">
                <Image src="magic-shop_Logo.svg" alt="Logo" width={300} height={300} className="object-contain" draggable={false} />
              </div>
            </div>

            <hr className="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700">
            </hr>

            <div className="space-y-1">
              <p className="text-sm text-zinc-400 px-2 py-2">Administrator</p>
              <NavItem href="/dashboard" icon={<GridIcon />} label="Dashboard" />
              <NavItem href="/orders" icon={<ShoppingBagIcon />} label="Orders" />
              <NavItem href="/products" icon={<PackageIcon />} label="Product" active />
              <NavItem href="/transactions" icon={<ReceiptIcon />} label="Transaction" />
              <NavItem href="/reports" icon={<BarChartIcon />} label="Reports" />
              <NavItem href="/reviews" icon={<StarIcon />} label="Reviews" />
              <NavItem href="/shipping" icon={<TruckIcon />} label="Shipping" />
            </div>

            <hr className="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700">
            </hr>

            <div className="space-y-1">
              <p className="text-sm text-zinc-400 px-2 py-2">Super Admin</p>
              <NavItem href="/users" icon={<UserIcon />} label="Users" />
              <NavItem href="/publishers" icon={<TagIcon />} label="Publishers" />
              <NavItem href="/admins" icon={<ShieldIcon />} label="Admins" />
            </div>

            <div className="mt-auto text-center text-zinc-500 text-sm">
              <p>shop for DnD lovers</p>
              <p>by DnD lovers</p>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Main Content */}
        {/* top */}
      <div className="flex-1 overflow-auto">
        <header className="flex items-center justify-between p-4 border-b border-magic-back">
          <h1 className="ml-2 text-4xl font-bold">Product</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full bg-zinc-900">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="flex items-center gap-2 px-4">
              <span>Hello, Mormai</span>
              <div className="h-10 w-10 rounded-full bg-zinc-700 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">

          <div className="flex justify-between mb-6">

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
              <Button variant="outline" className="border-zinc-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>

            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ProductCard
              title="2024 Digital & Physical Core Rulebook Bundle"
              price="$179.97"
              inventory={2704}
              imageUrl="/placeholder.svg?height=500&width=400"
              href="/products/core-rulebook-bundle"
            />

            <ProductCard
              title="2024 Dungeon Master's Guide Digital + Physical Bundle"
              price="$59.99"
              inventory={142}
              imageUrl="/placeholder.svg?height=400&width=400"
              href="/products/dungeon-masters-guide"
            />

            <ProductCard
              title="2024 Player's Handbook Digital + Physical Bundle"
              price="$59.99"
              inventory={573}
              imageUrl="/placeholder.svg?height=400&width=400"
              href="/products/players-handbook"
            />

            <ProductCard
              title="Vecna: Eve of Ruin Digital + Physical Bundle"
              price="$69.95"
              inventory={25}
              imageUrl="/placeholder.svg?height=400&width=400"
              href="/products/vecna-eve-of-ruin"
            />

            <ProductCard
              title="Quests from the Infinite Staircase Digital + Physical Bundle"
              price="$69.95"
              inventory={0}
              imageUrl="/placeholder.svg?height=400&width=400"
              href="/products/infinite-staircase"
            />
            
            <ProductCard
              title="Quests from the Infinite Staircase Digital + Physical Bundle"
              price="$69.95"
              inventory={0}
              imageUrl="/placeholder.svg?height=400&width=400"
              href="/products/infinite-staircase"
            />

            <ProductCard
              title="Vecna: Eve of Ruin Digital + Physical Bundle"
              price="$69.95"
              inventory={25}
              imageUrl="/placeholder.svg?height=400&width=400"
              href="/products/vecna-eve-of-ruin"
            />

            <ProductCard
              title="Quests from the Infinite Staircase Digital + Physical Bundle"
              price="$69.95"
              inventory={0}
              imageUrl="/placeholder.svg?height=400&width=400"
              href="/products/infinite-staircase"
            />
            
            <ProductCard
              title="Quests from the Infinite Staircase Digital + Physical Bundle"
              price="$69.95"
              inventory={0}
              imageUrl="/placeholder.svg?height=400&width=400"
              href="/products/infinite-staircase"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
