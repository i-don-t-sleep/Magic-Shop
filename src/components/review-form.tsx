"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: number
  name: string
  publisher_name: string
  price: number
}

interface ReviewFormProps {
  isOpen: boolean
  onClose: () => void
  userId: number
  existingReview?: {
    productID: number
    comment: string
    score: number
  }
  onSuccess: () => void
}

export function ReviewForm({ isOpen, onClose, userIdx, existingReview, onSuccess }: ReviewFormProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | null>(existingReview?.productID || null)
  const [comment, setComment] = useState(existingReview?.comment || "")
  const [rating, setRating] = useState(existingReview?.score || 5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userId, setUserId] = useState<number | null>(null)  
  const isEditing = !!existingReview

  useEffect(() => {
    if (isOpen && !isEditing) {
      fetchProducts()
    }
  }, [isOpen, isEditing, searchQuery])

  useEffect(() => {
    if (existingReview) {
      setComment(existingReview.comment)
      setRating(existingReview.score)
      setSelectedProductId(existingReview.productID)
    } else {
      setComment("")
      setRating(5)
      setSelectedProductId(null)
    }
  }, [existingReview, isOpen])

  useEffect(() => {
  const getUserInfo = async () => {
    try {
      const res = await fetch("/api/me")
      if (!res.ok) throw new Error("Failed to fetch user info")
      const data = await res.json()
      setUserId(data.user.id)
    } catch (error) {
      console.error("Error fetching user ID from cookie:", error)
    }
  }

  if (!userId) {
    getUserInfo()
  }
}, [userId])


  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products/list?search=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (!selectedProductId && !isEditing) {
      toast({
        title: "Error",
        description: "Please select a product to review",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      if (isEditing) {
        // Update existing review
        const response = await fetch(`/api/reviews/${existingReview.productID}/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment,
            score: rating,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to update review")
        }

        toast({
          title: "Success",
          description: "Your review has been updated",
        })
      } else {
        // Add new review
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productID: selectedProductId,
            userID: userId,
            comment,
            score: rating,
          }),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to add review")
        }

        toast({
          title: "Success",
          description: "Your review has been added",
        })
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Your Review" : "Add a New Review"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Product</label>
              <Select
                value={selectedProductId?.toString() || ""}
                onValueChange={(value) => setSelectedProductId(Number.parseInt(value))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select a product to review" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <div className="py-2 px-3">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()} className="text-white">
                      {product.name} - {product.publisher_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? "fill-yellow-500 text-yellow-500" : "fill-zinc-700 text-zinc-700"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              className="min-h-[120px] bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-zinc-700">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : isEditing ? "Update Review" : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
