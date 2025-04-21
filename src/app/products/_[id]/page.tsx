"use client"

import { ArrowLeft, Heart, Package, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { type Product, getProductById } from "@/lib/phpAPI/api"

export default function ProductDetail() {
  const { id } = useParams() as { id: string }
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getProductById(id)
        if (response.success && response.data) {
          setProduct(response.data)
        } else {
          setError(response.error || "Failed to load product")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href="/products" className="inline-flex items-center text-zinc-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </div>

          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href="/products" className="inline-flex items-center text-zinc-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </div>

          <div className="text-center py-10">
            <p className="text-zinc-400 mb-4">Product not found</p>
            <Link href="/products">
              <Button>View All Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.inventory === 0

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold">{product.price}</span>
              <div className="flex items-center gap-2">
                <Package className={`h-5 w-5 ${isOutOfStock ? "text-red-500" : "text-green-500"}`} />
                <span className={`${isOutOfStock ? "text-red-500" : "text-green-500"}`}>
                  {isOutOfStock ? "Out of stock" : `${product.inventory} in stock`}
                </span>
              </div>
            </div>

            <p className="text-zinc-300 mb-8">{product.description || "No description available."}</p>

            <div className="flex gap-4">
              <Button className="flex-1" disabled={isOutOfStock}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button variant="outline" size="icon" className="border-zinc-700">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to Wishlist</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
