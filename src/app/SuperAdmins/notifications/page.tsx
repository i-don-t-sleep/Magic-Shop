"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ShoppingBag,
  Package,
  Star,
  AlertCircle,
  Bell,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  X,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { LoadingComp } from "@/components/loading-comp"
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearReadNotifications,
} from "@/lib/notifications"
import type { Notification, NotificationCategory } from "@/types/notifications"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type FilterType = NotificationCategory | "all"

export default function NotificationsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  })

  // Load notifications on mount and when filter changes
  useEffect(() => {
    loadNotifications()
  }, [filterType])

  const loadNotifications = async (offset = 0) => {
    setIsLoading(true)
    setError(null)

    try {
      const category = filterType !== "all" ? filterType : undefined
      const result = await fetchNotifications({
        limit: pagination.limit,
        offset,
        category,
      })

      if (offset === 0) {
        setNotifications(result.notifications)
      } else {
        setNotifications((prev) => [...prev, ...result.notifications])
      }

      setPagination(result.pagination)
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
      }

      // Update local state
      setNotifications(notifications.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)))

      // Navigate to the relevant page
      if (notification.link_url) {
        router.push(notification.link_url)
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all as read in the database
      const category = filterType !== "all" ? filterType : undefined
      await markAllNotificationsAsRead(category)

      // Update local state
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err)
    }
  }

  const handleDeleteNotification = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the notification click

    try {
      await deleteNotification(id.toString())
      setNotifications(notifications.filter((n) => n.id !== id))
    } catch (err) {
      console.error("Failed to delete notification:", err)
    }
  }

  const handleClearReadNotifications = async () => {
    try {
      setIsClearing(true)

      // Clear read notifications from the database
      const category = filterType !== "all" ? filterType : undefined
      await clearReadNotifications(category)

      // Update local state - remove read notifications
      setNotifications(notifications.filter((n) => !n.is_read))
    } catch (err) {
      console.error("Failed to clear read notifications:", err)
    } finally {
      setIsClearing(false)
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

  const getTypeLabel = (type: FilterType) => {
    switch (type) {
      case "order":
        return "Orders"
      case "stock":
        return "Stock"
      case "review":
        return "Reviews"
      case "system":
        return "System"
      case "all":
        return "All"
      default:
        return "Unknown"
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

  const filteredNotifications = notifications.filter((notification) => {
    // Filter by search query
    if (searchQuery) {
      return (
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return true
  })

  const unreadCount = notifications.filter((n) => !n.is_read).length
  const readCount = notifications.filter((n) => n.is_read).length

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      {/* Header with search and filters */}
      <div className="px-6 pb-3 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search notifications..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-zinc-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filter: {getTypeLabel(filterType)}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(["all", "system", "order", "review", "stock"] as FilterType[]).map((type) => (
                <DropdownMenuItem
                  key={type}
                  className={cn(filterType === type && "bg-zinc-800")}
                  onClick={() => setFilterType(type)}
                >
                  {getTypeLabel(type)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="border-zinc-700 text-white"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || isLoading}
          >
            Mark all as read
          </Button>

          {readCount > 0 && (
            <Button
              variant="outline"
              className="border-zinc-700 text-white"
              onClick={handleClearReadNotifications}
              disabled={isClearing || readCount === 0}
              title="Clear all read notifications"
            >
              {isClearing ? <LoadingComp/> : <Trash2 className="h-4 w-4" />}
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            className="border-zinc-700 text-white"
            onClick={() => loadNotifications(0)}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Notifications</h2>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-zinc-400">{unreadCount} unread</div>
                  {readCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                      onClick={handleClearReadNotifications}
                      disabled={isClearing}
                    >
                      {isClearing ? (
                        <LoadingComp />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear {readCount} read
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                  <p className="text-zinc-400 text-center mb-4">{error}</p>
                  <Button variant="outline" className="border-zinc-700" onClick={() => loadNotifications(0)}>
                    Try Again
                  </Button>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-zinc-700 mb-2" />
                  <p className="text-zinc-500">No notifications found</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-zinc-800">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 hover:bg-zinc-800/50 cursor-pointer transition-colors rounded-md my-1 group",
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
                                  className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => handleDeleteNotification(notification.id, e)}
                                  title="Delete notification"
                                >
                                  <X className="h-4 w-4 text-zinc-500 hover:text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-zinc-400">{notification.message}</p>
                            {notification.link_url && (
                              <div className="mt-1 text-xs text-zinc-500">Click to view details</div>
                            )}
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

                  {pagination.hasMore && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        className="border-zinc-700 text-white"
                        onClick={() => loadNotifications(pagination.offset + pagination.limit)}
                        disabled={isLoading}
                      >
                        {isLoading ? <LoadingComp /> : "Load More"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
