/**
 * API client for fetching data from PHP backend
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Base function to fetch data from the PHP API
 */
async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("API fetch error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Product related API calls
 */
export interface Product {
  id: string | number
  title: string
  price: string
  inventory: number
  imageUrl: string
  description?: string
}

export async function getProducts(): Promise<ApiResponse<Product[]>> {
  return fetchFromApi<Product[]>("/api/products.php")
}

export async function getProductById(id: string | number): Promise<ApiResponse<Product>> {
  return fetchFromApi<Product>(`/api/products.php?id=${id}`)
}

/**
 * Review related API calls
 */
export interface Review {
  id: string | number
  productId: string | number
  title: string
  publisher: string
  quantity: string | number
  price: string
  rating: number
  reviewCount: number
  imageUrl: string
  ratingDistribution: number[]
}

export async function getReviews(): Promise<ApiResponse<Review[]>> {
  return fetchFromApi<Review[]>("/api/reviews.php")
}

export async function getReviewsByProductId(productId: string | number): Promise<ApiResponse<Review[]>> {
  return fetchFromApi<Review[]>(`/api/reviews.php?productId=${productId}`)
}

/**
 * Search functionality
 */
export async function searchProducts(query: string): Promise<ApiResponse<Product[]>> {
  return fetchFromApi<Product[]>(`/api/products.php?search=${encodeURIComponent(query)}`)
}

export async function searchReviews(query: string): Promise<ApiResponse<Review[]>> {
  return fetchFromApi<Review[]>(`/api/reviews.php?search=${encodeURIComponent(query)}`)
}
