export type NotificationCategory = "system" | "order" | "review" | "stock"

export type NotificationType =
  | "system_announcement"
  | "maintenance"
  | "order_placed"
  | "order_shipped"
  | "order_cancelled"
  | "order_delivered"
  | "new_review"
  | "review_reported"
  | "stock_low"
  | "stock_out"

export interface Notification {
  id: number
  user_id: number
  category: NotificationCategory
  type: NotificationType
  title: string
  message: string
  link_url: string | null
  is_read: boolean
  created_at: string
  expire_at: string | null
}

export interface NotificationCount {
  total: number
  categories: {
    system?: number
    order?: number
    review?: number
    stock?: number
  }
}
