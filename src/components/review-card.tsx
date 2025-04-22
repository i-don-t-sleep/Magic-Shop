"use client"

import { ChevronDown, ChevronUp, Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export interface ReviewCardProps {
  title: string
  publisher: string
  quantity: string | number
  price: string
  rating: number
  reviewCount: number
  imageUrl: string
  ratingDistribution?: number[]
  // New props for individual reviews
  reviews?: ReviewItemProps[]
}

export interface ReviewItemProps {
  id: string | number
  userName: string
  userAvatar: string
  comment: string
  rating: number
  date: string
}

export function ReviewCard({
  title,
  publisher,
  quantity,
  price,
  rating,
  reviewCount,
  imageUrl,
  ratingDistribution = [80, 15, 3, 1, 1],
  reviews = [],
}: ReviewCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Generate stars based on rating
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-lg overflow-hidden">
      <div className="p-6 grid grid-cols-1 md:grid-cols-[200px_1fr_200px] gap-6">
        <div className="flex justify-center">
          <Image src={imageUrl || "/placeholder.svg"} alt={title} width={160} height={200} className="object-contain" />
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

      {/* Review details toggle button */}
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

      {/* Expanded review details */}
      {showDetails && (
        <div className="border-t border-zinc-800 px-6 py-4 space-y-6">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewItem
                key={review.id}
                userName={review.userName}
                userAvatar={review.userAvatar}
                comment={review.comment}
                rating={review.rating}
                date={review.date}
              />
            ))
          ) : (
            <div className="text-center py-4 text-zinc-400">No individual reviews available</div>
          )}
        </div>
      )}
    </div>
  )
}

function ReviewItem({ userName, userAvatar, comment, rating, date }: Omit<ReviewItemProps, "id">) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <Image
            src={userAvatar || "/placeholder.svg?height=40&width=40"}
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
        <p className="text-sm text-zinc-400">Post On: {date}</p>
      </div>
    </div>
  )
}