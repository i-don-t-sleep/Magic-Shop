"use client"

import { ArrowLeft, Heart, Package, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/loading-comp"

interface ProductData {
  name: string
  price: string
  inventory: number
  description: string
  imageUrl: string
}

export default function ProductDetail() {
  const router = useRouter()
  const { slug } = useParams() as { slug: string }

  // 1) สร้าง state สำหรับเก็บข้อมูล, loading, notFound, error
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 2) useEffect เดียว จัดการ fetch + handle 404/other errors
  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setError(null)

    fetch(`/api/products/${slug}`)
      .then(res => {
        if (res.status === 404) {
          // กรณี API คืน 404
          setNotFound(true)
          return null
        }
        if (!res.ok) throw new Error(`Status ${res.status}\n ${JSON.stringify(res)} slug:${slug}`)
        return res.json() as Promise<ProductData>
      })
      .then(data => {
        if (data) {
          setProduct(data)
        }
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  // 3) แสดงผลตามสถานะ
  if (loading) {
    return <Loading></Loading>
  }
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <Button onClick={() => router.back()} className="mt-4">
            Back to Products Page.
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-4 text-red-500">
        Error load data.
      </div>
    )
  }

  const isOutOfStock = product.inventory === 0

  return (
    <div className="min-h-screen text-white p-4">
      {/*<p>{JSON.stringify(product)} {product.name}</p>*/}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold">{product.price}</span>
              <div className="flex items-center gap-2">
                <Package
                  className={`h-5 w-5 ${
                    isOutOfStock ? "text-red-500" : "text-green-500"
                  }`}
                />
                <span
                  className={`${
                    isOutOfStock ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of stock"
                    : `${product.inventory} in stock`}
                </span>
              </div>
            </div>

            <p className="text-zinc-300 mb-8">{product.description}</p>

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
