"use client"

import { Bell, ChevronDown, Filter, Plus, Search } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

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
import { type Product, getProducts, searchProducts } from "@/lib/phpAPI/api"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products on initial load
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getProducts()
        if (response.success && response.data) {
          setProducts(response.data)
        } else {
          setError(response.error || "Failed to load products")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery) {
        setIsLoading(true)
        const response = await searchProducts(searchQuery)
        if (response.success && response.data) {
          setProducts(response.data)
        }
        setIsLoading(false)
      } else {
        // If search is cleared, load all products
        const response = await getProducts()
        if (response.success && response.data) {
          setProducts(response.data)
        }
        setIsLoading(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  return (
    <div className="flex h-screen bg-black text-white p-4">
      {/* Sidebar */}
      <div className="w-[320px] bg-zinc-950 rounded-3xl overflow-hidden flex flex-col mr-4">
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="block text-center">MAGIC</span>
                <span className="block text-center">SHOP</span>
              </h1>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-12 h-12">
                <div className="w-full h-full bg-red-600 rotate-45 transform origin-center"></div>
              </div>
            </div>
          </div>

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

          <div className="mt-8 space-y-1">
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h1 className="text-3xl font-bold">Product</h1>
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

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-zinc-400 mb-4">No products found</p>
              {searchQuery && <Button onClick={() => setSearchQuery("")}>Clear Search</Button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  inventory={product.inventory}
                  imageUrl={product.imageUrl}
                  href={`/products/${product.id}`}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
