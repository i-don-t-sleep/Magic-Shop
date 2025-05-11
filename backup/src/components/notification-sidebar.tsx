"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ShoppingBag, Package, Bell, Star, AlertCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LoadingComp } from "@/components/loading-comp"
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearReadNotifications,
} from "@/lib/notifications"
import type { Notification, NotificationCategory } from "@/types/notifications"

interface NotificationSidebarProps {
  open: boolean
  onClose: () => void
  onNotificationsUpdate?: () => void
}

export function NotificationSidebar({ open, onClose, onNotificationsUpdate }: NotificationSidebarProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications when sidebar opens
  useEffect(() => {
    if (open) {
      loadNotifications()
    }
  }, [open])

  const loadNotifications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchNotifications({ limit: 20 })
      setNotifications(result.notifications)
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
      setError("Failed to load notifications. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read in the database
      if (!notification.is_read) {
        await markNotificationAsRead(notification.id.toString())

        // Update local state
        setNotifications(notifications.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)))

        // Notify parent component to update counts
        if (onNotificationsUpdate) {
          onNotificationsUpdate()
        }
      }

      // Navigate to the relevant page
      if (notification.link_url) {
        router.push(notification.link_url)
      }

      // Close the sidebar
      onClose()
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all as read in the database
      await markAllNotificationsAsRead()

      // Update local state
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))

      // Notify parent component to update counts
      if (onNotificationsUpdate) {
        onNotificationsUpdate()
      }
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err)
    }
  }

  const handleClearReadNotifications = async () => {
    try {
      setIsClearing(true)

      // Clear read notifications from the database
      await clearReadNotifications()

      // Update local state - remove read notifications
      setNotifications(notifications.filter((n) => !n.is_read))

      // Notify parent component to update counts
      if (onNotificationsUpdate) {
        onNotificationsUpdate()
      }
    } catch (err) {
      console.error("Failed to clear read notifications:", err)
    } finally {
      setIsClearing(false)
    }
  }

  const handleDeleteNotification = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the notification click

    try {
      // Delete from database
      await deleteNotification(id.toString())

      // Update local state
      setNotifications(notifications.filter((n) => n.id !== id))

      // Notify parent component to update counts
      if (onNotificationsUpdate) {
        onNotificationsUpdate()
      }
    } catch (err) {
      console.error("Failed to delete notification:", err)
    }
  }

  const getNotificationIcon = (category: NotificationCategory) => {
    switch (category) {
      case "order":
        return <ShoppingBag className="h-5 w-5 text-blue-500" />
      case "stock":
        return <Package className="h-5 w-5 text-green-500" />
      case "review":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "system":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-zinc-400" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return "just now"
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`

    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length
  const readCount = notifications.length - unreadCount

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-full max-w-sm bg-magic-iron-1 shadow-xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 h-full">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% h-full overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-xl font-bold">Notifications</h2>
                  <p className="text-sm text-zinc-400">{unreadCount} unread</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-white"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0 || isLoading}
                  >
                    Mark all as read
                  </Button>
                  <Button variant="ghost" size="icon" className="text-zinc-400" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <LoadingComp />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-40 p-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                    <p className="text-zinc-400 text-center">{error}</p>
                    <Button variant="outline" size="sm" className="mt-4 border-zinc-700" onClick={loadNotifications}>
                      Try Again
                    </Button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 p-4">
                    <Bell className="h-12 w-12 text-zinc-700 mb-2" />
                    <p className="text-zinc-500">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 hover:bg-zinc-800/50 cursor-pointer transition-colors group",
                          !notification.is_read && "bg-zinc-800/20",
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.category)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className={cn("font-medium", !notification.is_read && "text-white")}>
                                {notification.title}
                              </p>
                              <div className="flex items-center">
                                <span className="text-xs text-zinc-500 whitespace-nowrap">
                                  {formatTimeAgo(notification.created_at)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => handleDeleteNotification(notification.id, e)}
                                  title="Delete notification"
                                >
                                  <X className="h-4 w-4 text-zinc-500 hover:text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-zinc-400 line-clamp-2">{notification.message}</p>
                          </div>
                          {!notification.is_read && (
                            <div className="flex-shrink-0 self-center">
                              <div className="w-2 h-2 rounded-full bg-red-600"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-800">
                <div className="flex flex-col gap-2">
                  {readCount > 0 && (
                    <Button
                      variant="outline"
                      className="w-full border-zinc-700 text-white"
                      onClick={handleClearReadNotifications}
                      disabled={isClearing}
                    >
                      {isClearing ? (
                        <LoadingComp  />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear {readCount} read notification{readCount !== 1 ? "s" : ""}
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-zinc-700 text-white"
                    onClick={() => {
                      router.push("/SuperAdmins/notifications")
                      onClose()
                    }}
                  >
                    View all notifications
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
