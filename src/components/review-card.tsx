import { Star } from "lucide-react"
import Image from "next/image"

export interface ReviewCardProps {
  title: string
  publisher: string
  quantity: string | number
  price: string
  rating: number
  reviewCount: number
  imageUrl: string
  ratingDistribution?: number[]
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
}: ReviewCardProps) {
  // Generate stars based on rating
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
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
    </div>
  )
}
