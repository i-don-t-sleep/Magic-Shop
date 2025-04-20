/**
 * PHP API client configuration
 *
 * This file contains configuration and helper functions for connecting to a PHP API
 */

// Base URL for the PHP API
const API_BASE_URL = process.env.NEXT_PUBLIC_PHP_API_URL || "http://your-php-api-url.com/api"

// Default headers for API requests
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

// Optional: Add authentication token if needed
function getAuthHeaders() {
  // You can implement token storage/retrieval here
  const token = localStorage.getItem("auth_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Make a GET request to the PHP API
 */
export async function apiGet<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const queryString = new URLSearchParams(params).toString()
  const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ""}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Make a POST request to the PHP API
 */
export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Make a PUT request to the PHP API
 */
export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      ...DEFAULT_HEADERS,
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Make a DELETE request to the PHP API
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      ...DEFAULT_HEADERS,
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Upload a file to the PHP API
 */
export async function apiUploadFile<T>(
  endpoint: string,
  file: File,
  additionalData: Record<string, any> = {},
): Promise<T> {
  const formData = new FormData()
  formData.append("file", file)

  // Add any additional data
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      // Don't set Content-Type here, it will be set automatically with the boundary
      ...getAuthHeaders(),
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
