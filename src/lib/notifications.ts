// Fetch notifications for the current user
export async function fetchNotifications(
  options: {
    limit?: number
    offset?: number
    category?: string
    isRead?: boolean
  } = {},
) {
  const { limit = 50, offset = 0, category, isRead } = options

  // Build query parameters
  const params = new URLSearchParams()
  params.append("limit", limit.toString())
  params.append("offset", offset.toString())

  if (category) {
    params.append("category", category)
  }

  if (isRead !== undefined) {
    params.append("isRead", isRead.toString())
  }

  // Fetch notifications
  const response = await fetch(`/api/notifications?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch notifications")
  }

  return response.json()
}

// Fetch notification counts
export async function fetchNotificationCounts() {
  const response = await fetch("/api/notifications/count")

  if (!response.ok) {
    throw new Error("Failed to fetch notification counts")
  }

  return response.json()
}

// Mark a notification as read
export async function markNotificationAsRead(id: string) {
  const response = await fetch(`/api/notifications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_read: true }),
  })

  if (!response.ok) {
    throw new Error("Failed to mark notification as read")
  }

  return response.json()
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(category?: string) {
  const params = new URLSearchParams()

  if (category) {
    params.append("category", category)
  }

  const response = await fetch(`/api/notifications/read-all?${params.toString()}`, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read")
  }

  return response.json()
}

// Delete a notification
export async function deleteNotification(id: string) {
  const response = await fetch(`/api/notifications/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete notification")
  }

  return response.json()
}

// Clear all read notifications
export async function clearReadNotifications(category?: string) {
  const params = new URLSearchParams()

  if (category) {
    params.append("category", category)
  }

  const response = await fetch(`/api/notifications/clear-read?${params.toString()}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to clear read notifications")
  }

  return response.json()
}

// Create a notification (admin only)
export async function createNotification(data: {
  user_id: number
  category: string
  type: string
  title: string
  message: string
  link_url?: string
  expire_at?: string
}) {
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create notification")
  }

  return response.json()
}
