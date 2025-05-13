"use client"

import { MoreVertical, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, Edit, Trash, History } from "lucide-react"
import { showSuccessToast, showErrorToast } from "@/components/notify/Toast"

export interface ProductCardProps {
  name: string
  price: string
  quantity: number
  primaryImage: string
  href: string
}

export function ProductCard({ name, price, quantity, primaryImage, href }: ProductCardProps) {
  const isOutOfStock = quantity === 0
  const statusRef = useRef<HTMLSpanElement>(null)

  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Extract product ID from href
  const productId = href.split("&pid=")[1]?.split("&")[0]

  const handleDeleteProduct = async () => {
    if (!productId) {
      showErrorToast("Product ID not found")
      setShowDeleteConfirm(false)
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/products/edit/${productId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        showSuccessToast("Product deleted successfully")
        // Refresh the page or update the product list
        window.location.reload()
      } else {
        const data = await response.json()
        showErrorToast(data.message || "Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      showErrorToast("An error occurred while deleting the product")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="col-span-1">
      <div
        className={`p-[1px] ${isOutOfStock ? "brightness-40" : ""} bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19]`}
      >
        <div
          className={`p-[1px] ${isOutOfStock ? "bg-gradient-to-t from-[#E8443C] to-[#822622]" : "bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80%"} rounded-[18] overflow-hidden`}
        >
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className={`h-5 w-5 ${isOutOfStock ? "text-red-500" : "text-zinc-400"}`} />
              <div className="h-[2.5rem] flex items-center">
                <span
                  ref={statusRef}
                  className={`text-sm overflow-hidden text-ellipsis ${isOutOfStock ? "text-red-500" : "text-zinc-400"}`}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {isOutOfStock ? "Out of stock" : `Total remaining ${quantity} pieces`}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={`${isOutOfStock ? "outStock" : "moreVert"}`} size="etc" className="text-zinc-400">
                  <MoreVertical className="text-white h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700">
                <DropdownMenuItem
                  onClick={() => router.push(`/SuperAdmins/products/${href}`)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  See Detail
                </DropdownMenuItem>
              {/*  <DropdownMenuItem
                  onClick={() => router.push(`/SuperAdmins/products/history/${productId}`)}
                  className="cursor-pointer"
                >
                  <History className="mr-2 h-4 w-4" />
                  See History
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={() => router.push(`/SuperAdmins/products/edit/${productId}`)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-500 cursor-pointer focus:text-red-500"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link href={`/SuperAdmins/products/${href}`} className="block px-4 pb-4">
            <div className="aspect-square relative rounded-lg overflow-hidden mb-3">
              <Image
                src={`${primaryImage}`}
                alt={name}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ width: "100%", height: "auto" }}
                className="object-contain"
                unoptimized
              />
            </div>
            <h3 className="text-lg font-medium text-center mb-2 line-clamp-2 h-[3.25rem]">{name}</h3>
            <div
              className={`${isOutOfStock ? "text-white bg-[#a20000] hover:bg-[#e70000] transition-all duration-10 rounded-lg p-3 text-center" : "text-white bg-[#373737] hover:bg-magic-red transition-all duration-100 rounded-sm bg-zinc-800 rounded-lg p-3 text-center"}`}
            >
              <span
                className="text-xl font-bold"
                style={{
                  WebkitTextStroke: "0.5px #323232",
                  WebkitTextFillColor: "white",
                }}
              >
                ${price}
              </span>
            </div>
          </Link>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full border border-zinc-700">
            <h3 className="text-xl font-bold mb-4">Delete Product</h3>
            <p className="mb-6">Are you sure you want to delete "{name}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteProduct} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
