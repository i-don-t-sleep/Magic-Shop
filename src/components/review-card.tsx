"use client"

import {  useEffect } from "react"
import { ChevronDown, ChevronUp, Edit, Star, Trash } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ReviewForm } from "@/components/review-form"

export interface ReviewCardProps {
  id: number
  title: string
  publisher: string
  quantity: string | number
  price: string
  rating: number
  reviewCount: number
  imageUrl: string
  ratingDistribution?: number[]
  reviews?: ReviewItemProps[]
  onReviewUpdated?: () => void
  currentUserId?: number
}

export interface ReviewItemProps {
  id: string | number
  userName: string
  userAvatar: string
  comment: string
  rating: number
  date: string
  userId?: number
  productId?: number
  currentUserId?: number
  onEdit?: () => void
  onDelete?: () => void
}

export function ReviewCard({
  id,
  title,
  publisher,
  quantity,
  price,
  rating,
  reviewCount,
  imageUrl,
  ratingDistribution = [80, 15, 3, 1, 1],
  reviews = [],
  onReviewUpdated,
  currentUserId,
}: ReviewCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reviewToEdit, setReviewToEdit] = useState<{
    productID: number
    comment: string
    score: number
  } | null>(null)
  const [reviewToDelete, setReviewToDelete] = useState<{
    productId: number
    userId: number
  } | null>(null)

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  const [userIdF, setUserIdF] = useState<number | null>(null) 

   useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await fetch("/api/me")
        if (!res.ok) throw new Error("Failed to fetch user info")
        const data = await res.json()
        setUserIdF(data.user.id)
      } catch (error) {
        console.error("Error fetching user ID from cookie:", error)
      }
    }
  
    if (!userIdF) {
      getUserInfo()
    }
  }, [userIdF])

  const handleEditReview = (review: ReviewItemProps) => {
    if (!review.productId || !review.userId) {
      toast({
        title: "Error",
        description: "Cannot edit this review. Missing product or user information.",
        variant: "destructive",
      })
      return
    }

    setReviewToEdit({
      productID: review.productId,
      comment: review.comment,
      score: review.rating,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteReview = (review: ReviewItemProps) => {
    if (!review.productId || !review.userId) {
      toast({
        title: "Error",
        description: "Cannot delete this review. Missing product or user information.",
        variant: "destructive",
      })
      return
    }

    setReviewToDelete({
      productId: review.productId,
      userId: review.userId,
    })
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return

    try {
      const response = await fetch(`/api/reviews/${reviewToDelete.productId}/${reviewToDelete.userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete review")
      }

      toast({
        title: "Success",
        description: "Your review has been deleted",
      })

      if (onReviewUpdated) {
        onReviewUpdated()
      }
    } catch (error: any) {
      console.error("Error deleting review:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setReviewToDelete(null)
    }
  }

  return (
    <div className="bg-gradient-to-b from-[#222222] to-[#1D1D1D] rounded-lg overflow-hidden">
      <div className="p-6 grid grid-cols-1 md:grid-cols-[200px_1fr_200px] gap-6">
        <div className="flex justify-center">
          <Image
            src={imageUrl}
            alt={title}
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-zinc-400 mb-4">By {publisher}</p>
          <p className="mb-4">Quantity: {quantity}</p>
          <p className="text-xl font-bold">{price}</p>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-6xl font-bold mb-2">{rating.toFixed(1)}</div>
          <div className="flex mb-4">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={`full-${i}`} className="w-6 h-6 fill-yellow-500" />
            ))}
            {hasHalfStar && <Star className="w-6 h-6 fill-yellow-500 text-zinc-700" strokeWidth={1} />}
            {[...Array(emptyStars)].map((_, i) => (
              <Star key={`empty-${i}`} className="w-6 h-6 fill-zinc-700" strokeWidth={1} />
            ))}
          </div>

          <div className="w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-4 text-right">{star}</span>
                <div className="w-32 bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full rounded-full"
                    style={{ width: `${ratingDistribution[index]}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-zinc-400 mt-2">{reviewCount.toLocaleString()}</div>
        </div>
      </div>

      <div className="text-center py-4 border-t border-zinc-800">
        <button
          className="text-zinc-400 hover:text-white flex items-center justify-center mx-auto"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              Hide details <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Click to see more details <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {showDetails && (
        <div className="border-t border-zinc-800 px-6 py-4 space-y-6">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewItem
                key={review.id}
                {...review}
                currentUserId={userIdF??-1}
                onEdit={() => handleEditReview(review)}
                onDelete={() => handleDeleteReview(review)}
              />
            ))
          ) : (
            <div className="text-center py-4 text-zinc-400">No individual reviews available</div>
          )}
        </div>
      )}

      {reviewToEdit && userIdF && (
        <ReviewForm
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setReviewToEdit(null)
          }}
          userId={userIdF}
          existingReview={reviewToEdit}
          onSuccess={() => {
            if (onReviewUpdated) onReviewUpdated()
          }}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently delete your review. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteReview} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ReviewItem({
  id,
  userName,
  userAvatar,
  comment,
  rating,
  date,
  userId,
  productId,
  currentUserId,
  onEdit,
  onDelete,
}: ReviewItemProps) {
  const isOwnReview = userId && currentUserId && userId === currentUserId

  return (
    <div className="flex items-start gap-4 py-4">
      <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          
          <Image
            src={userAvatar}
            alt={userName}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">{userName}</h4>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < rating ? "fill-yellow-500" : "fill-zinc-700"}`} strokeWidth={1} />
            ))}
          </div>
        </div>
        <p className="text-zinc-300 mb-2">"{comment}"</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-zinc-400">Posted on: {date}</p>

          {isOwnReview && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 border-zinc-700 hover:bg-zinc-800"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 border-zinc-700 hover:bg-zinc-800 text-red-500 hover:text-red-400"
                onClick={onDelete}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}