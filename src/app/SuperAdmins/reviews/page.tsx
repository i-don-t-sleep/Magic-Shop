"use client"

import { ChevronDown, Filter, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"

import { ReviewCard } from "@/components/review-card"
import { ReviewForm } from "@/components/review-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ReviewCardProps, ReviewItemProps, ReviewWithDetails } from "@/types/reviews"

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [reviews, setReviews] = useState<ReviewCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  // For demo purposes, we'll set a mock current user ID
  // In a real application, you would get this from your authentication system
  useEffect(() => {
    // Mock user ID - replace with actual user ID from your auth system
    setCurrentUserId(1) // Assuming user ID 1 is logged in
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?search=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch reviews")
      }

      const data = await response.json()

      // Group reviews by product
      const productMap = new Map<number, ReviewWithDetails[]>()
      data.reviews.forEach((review: ReviewWithDetails) => {
        const productId = review.product.id
        if (!productMap.has(productId)) {
          productMap.set(productId, [])
        }
        productMap.get(productId)?.push(review)
      })

      // Process each product's reviews
      const processedReviews: ReviewCardProps[] = []

      for (const [productId, productReviews] of productMap.entries()) {
        if (productReviews.length === 0) continue

        // Get the first review to extract product details
        const firstReview = productReviews[0]
        const product = firstReview.product as typeof firstReview.product & { thumbnailUrl?: string }

        // Fetch rating distribution for this product
        const ratingResponse = await fetch(`/api/reviews/ratings?productId=${productId}`)
        const ratingData = await ratingResponse.json()

        // Format individual reviews
        const reviewItems: ReviewItemProps[] = await Promise.all(
          productReviews.map(async (r) => ({
            id: `${r.product.id}-${r.user.id}`,
            userName: r.user.username,
            userAvatar: `/api/blob/users/${encodeURIComponent(r.user.username)}`,
            comment: r.review.comment,
            rating: r.review.score,
            date: new Date(r.review.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            userId: r.user.id,
            productId: r.product.id,
          })),
        )

        // Create the review card props
        processedReviews.push({
          id: product.id,
          title: product.name,
          publisher: product.publisher_name || "Unknown Publisher",
          quantity: product.status === "Available" ? product.quantity : "Out of Stock",
          price: `$${typeof product.price === "number" ? product.price.toFixed(2) : Number(product.price || 0).toFixed(2)}`,
          rating: ratingData.averageRating || 0,
          reviewCount: ratingData.reviewCount || 0,
          imageUrl: product.thumbnailUrl??"", // Assuming this naming convention
          ratingDistribution: ratingData.distribution,
          reviews: reviewItems,
        })
      }

      setReviews(processedReviews)
    } catch (err) {
      console.error("Error fetching reviews:", err)
      setError("Failed to load reviews. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [searchQuery])

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddReview={() => setIsAddReviewOpen(true)}
        currentUserId={currentUserId}
      />
      <div className="flex w-full h-screen overflow-y-auto scrollbar-overlay">
        <Body
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          reviews={reviews}
          loading={loading}
          error={error}
          onReviewUpdated={fetchReviews}
          currentUserId={currentUserId}
        />
      </div>

      {currentUserId && (
        <ReviewForm
          isOpen={isAddReviewOpen}
          onClose={() => setIsAddReviewOpen(false)}
          userId={currentUserId}
          onSuccess={fetchReviews}
        />
      )}
    </div>
  )
}

export function Header({
  searchQuery,
  setSearchQuery,
  onAddReview,
  currentUserId,
  classN = "px-6 pb-3",
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  onAddReview: () => void
  currentUserId: number | null
  classN?: string
}) {
  return (
    <main>
      <div className={`${classN} flex justify-between`}>
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search products..."
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

          {currentUserId && (
            <Button onClick={onAddReview} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}

export function Body({
  searchQuery,
  setSearchQuery,
  reviews,
  loading,
  error,
  onReviewUpdated,
  currentUserId,
  classN = "px-6 pb-3",
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  reviews: ReviewCardProps[]
  loading: boolean
  error: string | null
  onReviewUpdated: () => void
  currentUserId: number | null
  classN?: string
}) {
  if (loading) {
    return (
      <div className={`${classN} w-full`}>
        <div className="text-center py-10">
          <p className="text-zinc-400">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${classN} w-full`}>
        <div className="text-center py-10">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${classN} space-y-4 w-full`}>
      {reviews.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-zinc-400 mb-4">No reviews found</p>
          {searchQuery && (
            <Button onClick={() => setSearchQuery("")} variant="outline">
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        reviews.map((review) => (
          <ReviewCard
            key={review.id}
            {...review}
            onReviewUpdated={onReviewUpdated}
            currentUserId={currentUserId || undefined}
          />
        ))
      )}
    </div>
  )
}
