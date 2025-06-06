"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Bell, ChevronLeft, ChevronRight, Settings, MessageSquare, Info, LogOut } from "lucide-react"
import { NavItem } from "@/components/nav-item"
import { usePathname, useRouter } from "next/navigation"
import {
  GridIcon,
  ShoppingBagIcon,
  PackageIcon,
  ReceiptIcon,
  BarChartIcon,
  StarIcon,
  TruckIcon,
  UserIcon,
  TagIcon,
  ShieldIcon,
} from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { showLoadingToast } from "@/components/notify/Toast"
import { NotificationSidebar } from "@/components/notification-sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetchNotificationCounts } from "@/lib/notifications"
import type { Notification } from "@/types/notifications"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [fullCollapse, setFullCollapse] = useState(false)
  const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)

  // Fetch notification counts on mount and periodically
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts = await fetchNotificationCounts()
        setUnreadCount(counts.total)
      } catch (error) {
        console.error("Failed to fetch notification counts:", error)
      }
    }

    // Fetch immediately
    fetchCounts()

    // Then fetch every minute
    const interval = setInterval(fetchCounts, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
      return match ? decodeURIComponent(match[2]) : null
    }

    const cookieData = getCookie("account-info")
    if (!cookieData) return

    try {
      const parsed = JSON.parse(cookieData)
      setDisplayName(parsed.username || "")
    } catch (err) {
      console.error("Invalid cookie format:", err)
      setDisplayName("")
    }
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/LogoutAPI", { method: "POST" })
      showLoadingToast("Log Out...")
      router.push("/LoginPage")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const pathname = usePathname()
  const titleMap: Record<string, string> = {
    "/SuperAdmins/dashboard": "Dashboard",
    "/SuperAdmins/products": "Products",
    "/SuperAdmins/reviews": "Reviews",
    "/SuperAdmins/orders": "Orders",
    "/SuperAdmins/transactions": "Transactions",
    "/SuperAdmins/reports": "Reports",
    "/SuperAdmins/shipping": "Shipping",
    "/SuperAdmins/users": "Users",
    "/SuperAdmins/publishers": "Publishers",
    "/SuperAdmins/admins": "Admins",
  }
  const pageTitle = Object.entries(titleMap).find(([path]) => pathname.startsWith(path))?.[1] || "MagicShop"

  const toggleSidebar = () => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false)
      setFullCollapse(false)
    } else {
      setSidebarCollapsed(true)
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (sidebarCollapsed) {
      timer = setTimeout(() => {
        setFullCollapse(true)
      }, 0)
    }
    return () => clearTimeout(timer)
  }, [sidebarCollapsed])

  return (
    <div className="flex h-screen bg-magic-back text-white p-4 overflow-hidden">
      {/* Sidebar */}
      <div className="flex relative">
        <div
          className={`transition-all duration-300 ease-in-out ${
            fullCollapse
              ? "w-0 min-w-0 opacity-0"
              : sidebarCollapsed
                ? "w-[80px] min-w-[80px]"
                : "w-[20vw] min-w-[240px] max-w-[320px]"
          }`}
        >
          <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[24] flex h-full">
            <div className="bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-3xl overflow-hidden flex flex-col w-full">
              <div className={`p-6 flex flex-col h-full relative ${sidebarCollapsed ? "items-center p-3" : ""}`}>
                <div className={`my-5 text-center ${sidebarCollapsed ? "my-2" : ""}`}>
                  <Image
                    src="/magic-shop_Logo.svg"
                    alt="Logo"
                    width={0}
                    height={0}
                    className={`h-auto mx-auto object-contain ${sidebarCollapsed ? "w-10" : "w-full max-w-[240px]"}`}
                    draggable={false}
                  />
                </div>
                <hr className="h-px my-1 bg-transparent border-0" />
                <div className="flex-1 overflow-y-auto force-scrollbar-zero w-full">
                  <div className="space-y-1">
                    {!sidebarCollapsed && <p className="text-sm text-zinc-400 px-2 py-2">Administrator</p>}
                    <NavItem
                      icon={<GridIcon />}
                      label="Dashboard"
                      href="/SuperAdmins/dashboard"
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<ShoppingBagIcon />}
                      label="Orders"
                      href="/SuperAdmins/orders"
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<PackageIcon />}
                      label="Products"
                      href="/SuperAdmins/products"
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<ReceiptIcon />}
                      label="Transactions"
                      href="/SuperAdmins/transactions"
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<BarChartIcon />}
                      label="Reports"
                      href="/SuperAdmins/reports"
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<StarIcon />}
                      label="Reviews"
                      href="/SuperAdmins/reviews"
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<TruckIcon />}
                      label="Shipping"
                      href="/SuperAdmins/shipping"
                      collapsed={sidebarCollapsed}
                    />
                  </div>

                  <hr className="h-px my-2 bg-transparent border-0" />

                  <div className="space-y-1">
                    {!sidebarCollapsed && <p className="text-sm text-zinc-400 px-2 py-2">Super Admin</p>}
                    <NavItem icon={<UserIcon />} label="Users" href="/SuperAdmins/users" collapsed={sidebarCollapsed} />
                    <NavItem
                      icon={<TagIcon />}
                      label="Publishers"
                      href="/SuperAdmins/publishers"
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<ShieldIcon />}
                      label="Admins"
                      href="/SuperAdmins/admins"
                      collapsed={sidebarCollapsed}
                    />
                  </div>
                </div>

                {!sidebarCollapsed && (
                  <div className="pt-2 mt-auto text-center text-zinc-500 text-sm">
                    <p>shop for DnD lovers</p>
                    <p>by DnD lovers</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`absolute h-full flex items-center transition-all duration-300 ease-in-out ${
            fullCollapse ? "left-0" : "left-auto"
          }`}
          style={{ right: fullCollapse ? "auto" : "0px", top: 0 }}
        >
          <div className="h-full flex items-center">
            <Button
              variant="default"
              size="icon"
              className={`
                bg-magic-iron-2 border border-magic-border-1
                rounded-full w-[10px] h-[90%]
                opacity-60 hover:opacity-100 
                flex items-center justify-center
              `}
              onClick={toggleSidebar}
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Header about accounts */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 pt-4 border-transparent">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <div className="flex items-center gap-5">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-zinc-900 relative"
              onClick={() => setNotificationSidebarOpen(true)}
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
            <div className="w-px h-10 bg-[#4E4E4E]" />
            <div className="flex items-center gap-4">
              <span className="text-base">
                Hello, <span className="font-bold">{displayName}</span>
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    title="Profile Options"
                    className="h-10 w-10 rounded-full bg-zinc-700 overflow-hidden cursor-pointer hover:ring-2 hover:ring-zinc-500 transition-all"
                  >
                    {displayName!="" && <Image
                      src={`/api/blob/users/${encodeURIComponent(displayName)}`}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover"
                      priority
                    />}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Image
                      src={`/api/blob/users/${encodeURIComponent(displayName)}`}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="object-cover rounded-full"
                    />
                    <span>{displayName}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/SuperAdmins/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/SuperAdmins/feedback")}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Feedback</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/SuperAdmins/about")}>
                    <Info className="mr-2 h-4 w-4" />
                    <span>Info us</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        {/* Slot for routed page content */}
        {children} {/*className="flex-1 overflow-y-auto scrollbar-overlay">*/}
        <NotificationSidebar open={notificationSidebarOpen} onClose={() => setNotificationSidebarOpen(false)} />
      </div>
    </div>
  )
}
