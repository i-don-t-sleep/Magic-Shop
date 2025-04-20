/**
 * API configuration file
 * Update these values to match your PHP API endpoints
 */

// Base API URL - can be overridden with environment variable
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/php-proxy"

// API Endpoints
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: "products.php",
  PRODUCT_BY_ID: (id: string | number) => `products.php?id=${id}`,
  SEARCH_PRODUCTS: (query: string) => `products.php?search=${encodeURIComponent(query)}`,

  // Reviews
  REVIEWS: "reviews.php",
  REVIEWS_BY_PRODUCT: (productId: string | number) => `reviews.php?productId=${productId}`,
  SEARCH_REVIEWS: (query: string) => `reviews.php?search=${encodeURIComponent(query)}`,

  // Users
  LOGIN: "auth/login.php",
  REGISTER: "auth/register.php",
  USER_PROFILE: "users/profile.php",

  // Orders
  ORDERS: "orders.php",
  ORDER_BY_ID: (id: string | number) => `orders.php?id=${id}`,

  // Other endpoints as needed
}

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000

// Maximum number of retries for failed requests
export const MAX_RETRIES = 3

// Default headers for API requests
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

// Sample expected response structure from PHP API
export interface ApiResponseStructure<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}
