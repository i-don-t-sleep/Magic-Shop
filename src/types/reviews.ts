export interface ReviewData {
  id?: number
  productID: number
  userID: number
  comment: string
  score: number
  createdAt: string
  updatedAt: string
}

export interface ProductData {
  id: number
  name: string
  description: string
  category_id: number
  price: number
  quantity: number
  status: "Available" | "Out of Stock"
  publisherID: number
  publisher_name?: string
  category_name?: string
}

export interface UserData {
  id: number
  username: string
  profilePicture?: string | null
  mimeType?: string | null
}

export interface ReviewWithDetails {
  review: ReviewData
  product: ProductData
  user: UserData
}

export interface ReviewsResponse {
  reviews: ReviewWithDetails[]
  totalCount: number
}

export interface ReviewItemProps {
  id: string | number
  userName: string
  userAvatar: string
  comment: string
  rating: number
  date: string
}

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
}
