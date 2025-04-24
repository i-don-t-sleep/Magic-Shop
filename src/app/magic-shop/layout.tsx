"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Bell, ChevronLeft, ChevronRight } from "lucide-react"
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

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [profilePicture, setProfilePicture] = useState("unnamed.png")
  const [displayName, setDisplayName] = useState("User")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [fullCollapse, setFullCollapse] = useState(false)

  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
      return match ? decodeURIComponent(match[2]) : null
    }
  
    const cookieData = getCookie("account-info")
    if (!cookieData) return
  
    try {
      const parsed = JSON.parse(cookieData)
      setProfilePicture(`users/${parsed.profilePicture}` || "unnamed.png")
      setDisplayName(parsed.username || "User")
    } catch (err) {
      console.error("Invalid cookie format:", err)
      setProfilePicture("users/unnamed.png")
      setDisplayName("User")
    }
  }, [])
  

  const handleLogout = async () => {
    try {
      await fetch('/api/LogoutAPI', { method: 'GET' })
      router.push('/LoginPage')
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const pathname = usePathname()
  const titleMap: Record<string, string> = {
    "/magic-shop/dashboard": "Dashboard",
    "/magic-shop/products": "Products",
    "/magic-shop/reviews": "Reviews",
    "/magic-shop/orders": "Orders",
    "/magic-shop/transactions": "Transactions",
    "/magic-shop/reports": "Reports",
    "/magic-shop/shipping": "Shipping",
    "/magic-shop/users": "Users",
    "/magic-shop/publishers": "Publishers",
    "/magic-shop/admins": "Admins",
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
                    <NavItem icon={<GridIcon />} label="Dashboard" href="/magic-shop/dashboard" collapsed={sidebarCollapsed} />
                    <NavItem icon={<ShoppingBagIcon />} label="Orders" href="/magic-shop/orders" collapsed={sidebarCollapsed} />
                    <NavItem icon={<PackageIcon />} label="Products" href="/magic-shop/products" collapsed={sidebarCollapsed} />
                    <NavItem icon={<ReceiptIcon />} label="Transactions" href="/magic-shop/transactions" collapsed={sidebarCollapsed} />
                    <NavItem icon={<BarChartIcon />} label="Reports" href="/magic-shop/reports" collapsed={sidebarCollapsed} />
                    <NavItem icon={<StarIcon />} label="Reviews" href="/magic-shop/reviews" collapsed={sidebarCollapsed} />
                    <NavItem icon={<TruckIcon />} label="Shipping" href="/magic-shop/shipping" collapsed={sidebarCollapsed} />
                  </div>

                  <hr className="h-px my-2 bg-transparent border-0" />

                  <div className="space-y-1">
                    {!sidebarCollapsed && <p className="text-sm text-zinc-400 px-2 py-2">Super Admin</p>}
                    <NavItem icon={<UserIcon />} label="Users" href="/magic-shop/users" collapsed={sidebarCollapsed} />
                    <NavItem icon={<TagIcon />} label="Publishers" href="/magic-shop/publishers" collapsed={sidebarCollapsed} />
                    <NavItem icon={<ShieldIcon />} label="Admins" href="/magic-shop/admins" collapsed={sidebarCollapsed} />
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
          className={
            `absolute h-full flex items-center transition-all duration-300 ease-in-out ${
              fullCollapse ? "left-0" : "left-auto"
            }`
          }
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
            <Button variant="outline" size="icon" className="rounded-full bg-zinc-900">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="w-px h-10 bg-[#4E4E4E]" />
            <div className="flex items-center gap-4">
              <span className="text-base">
                Hello, <span className="font-bold">{displayName}</span>
              </span>
              <div onClick={handleLogout} title="Click to Logout" className="h-10 w-10 rounded-full bg-zinc-700 overflow-hidden">
                <Image
                  src={`/api/image?path=${profilePicture}`}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </header>

        {/* Slot for routed page content */}
        {children} {/*className="flex-1 overflow-y-auto scrollbar-overlay">*/}
      </div>
    </div>
  )
}