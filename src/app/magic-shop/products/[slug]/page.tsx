"use client"


import { ArrowLeft, Heart, Package, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

interface ProductData {
  title: string
  price: string
  inventory: number
  description: string
  imageUrl: string
}

interface ProductDataMap {
  [key: string]: ProductData
}

export default function ProductDetail() {
  const router = useRouter()
  const { slug } = useParams() as { slug: string }

  // This would normally come from a database or API
  const productData: ProductDataMap = {
    "core-rulebook-bundle": {
      title: "2024 Digital & Physical Core Rulebook Bundle",
      price: "$179.97",
      inventory: 2704,
      description:
        "Get the complete set of core rulebooks for Dungeons & Dragons, including the Player's Handbook, Dungeon Master's Guide, and Monster Manual. This bundle includes both digital and physical copies.",
      imageUrl: "cf27466446e6da568b1eae990514f787.png",
    },
    "dungeon-masters-guide": {
      title: "2024 Dungeon Master's Guide Digital + Physical Bundle",
      price: "$59.99",
      inventory: 142,
      description:
        "The essential guide for Dungeon Masters. Learn how to create adventures, build worlds, and run great games. Includes both digital and physical copies.",
      imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    },
    "players-handbook": {
      title: "2024 Player's Handbook Digital + Physical Bundle",
      price: "$59.99",
      inventory: 573,
      description:
        "Create heroic characters for the world's greatest roleplaying game. This bundle includes both digital and physical copies of the Player's Handbook.",
      imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    },
    "vecna-eve-of-ruin": {
      title: "Vecna: Eve of Ruin Digital + Physical Bundle",
      price: "$69.95",
      inventory: 25,
      description:
        "Face the ultimate lich in this epic adventure that spans the multiverse. Includes both digital and physical copies of the adventure.",
      imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    },
    "infinite-staircase": {
      title: "Quests from the Infinite Staircase Digital + Physical Bundle",
      price: "$69.95",
      inventory: 0,
      description:
        "Explore the mysterious Infinite Staircase in this collection of adventures. Includes both digital and physical copies of the adventure.",
      imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    },
  }

  const product = productData[slug] || {
    title: "Product Not Found",
    price: "N/A",
    inventory: 0,
    description: "This product could not be found.",
    imageUrl: "/placeholder.svg?height=400&width=400",
  }

  const isOutOfStock = product.inventory === 0

  return (
    <div className="min-h-screen text-white p-4">
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
              src={`/api/image?path=products/${product.imageUrl}`}
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
