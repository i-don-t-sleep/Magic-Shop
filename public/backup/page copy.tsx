"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Bell, ChevronLeft, ChevronRight } from "lucide-react"
import { NavItem } from "@/components/nav-item"
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


const titleMap: Record<string, string> = {
  dashboard: "Dashboard",
  orders: "Orders",
  products: "Products",
  transactions: "Transactions",
  reports: "Reports",
  reviews: "Reviews",
  shipping: "Shipping",
  users: "Users",
  publishers: "Publishers",
  admins: "Admins",
}

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState("Products")
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [fullCollapse, setFullCollapse] = useState(false)

  const title = titleMap[currentPage]

  const RenderPage = () => {
    switch (currentPage) {
      case "Products":
        return {
          headerRender: <Header_ProductsPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />,
          bodyRender: <Body_ProductsPage searchQuery={searchQuery} />,
        }
      case "Reviews":
        return {
          headerRender: <Header_ReviewsPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />,
          bodyRender: <Body_ReviewsPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />,
        }
      default:
        return {
          headerRender: null,
          bodyRender: <p>not found.</p>,
        }
    }
  }

  const { headerRender, bodyRender } = RenderPage()

  const toggleSidebar = () => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false)
      setFullCollapse(false)
    } else {
      setSidebarCollapsed(true)
    }
  }

  // Effect to handle the full collapse after animation
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (sidebarCollapsed) {
      timer = setTimeout(() => {
        setFullCollapse(true)
      }, 0) // Match this to your transition duration
    }
    return () => clearTimeout(timer)
  }, [sidebarCollapsed])

  return (
    <div className="flex h-screen bg-magic-back text-white p-4 overflow-hidden">
      {/* Main Container with Sidebar and Toggle */}
      <div className="flex relative">
        {/* Sidebar Container */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            fullCollapse
              ? "w-0 min-w-0 opacity-0"
              : sidebarCollapsed
                ? "w-[80px] min-w-[80px]"
                : "w-[20vw] min-w-[240px] max-w-[320px]"
          }`}
        >
          {/* Sidebar */}
          <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[24] flex h-full">
            <div className="bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-3xl overflow-hidden flex flex-col w-full">
              <div className={`p-6 flex flex-col h-full relative ${sidebarCollapsed ? "items-center p-3" : ""}`}>
                {/* Logo */}
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

                {/* Section: Administrator */}
                <div className="flex-1 overflow-y-auto force-scrollbar-zero w-full">
                  <div className="space-y-1">
                    {!sidebarCollapsed && <p className="text-sm text-zinc-400 px-2 py-2">Administrator</p>}
                    <NavItem
                      icon={<GridIcon />}
                      label="Dashboard"
                      onClick={() => setCurrentPage("Dashboard")}
                      active={currentPage === "Dashboard"}
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<ShoppingBagIcon />}
                      label="Orders"
                      onClick={() => setCurrentPage("Orders")}
                      active={currentPage === "Orders"}
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<PackageIcon />}
                      label="Products"
                      onClick={() => setCurrentPage("Products")}
                      active={currentPage === "Products"}
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<ReceiptIcon />}
                      label="Transactions"
                      onClick={() => setCurrentPage("Transactions")}
                      active={currentPage === "Transactions"}
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<BarChartIcon />}
                      label="Reports"
                      onClick={() => setCurrentPage("Reports")}
                      active={currentPage === "Reports"}
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<StarIcon />}
                      label="Reviews"
                      onClick={() => setCurrentPage("Reviews")}
                      active={currentPage === "Reviews"}
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<TruckIcon />}
                      label="Shipping"
                      onClick={() => setCurrentPage("Shipping")}
                      active={currentPage === "Shipping"}
                      collapsed={sidebarCollapsed}
                    />
                  </div>

                  <hr className="h-px my-2 bg-transparent border-0" />

                  {/* Section: Super Admin */}
                  <div className="space-y-1">
                    {!sidebarCollapsed && <p className="text-sm text-zinc-400 px-2 py-2">Super Admin</p>}
                    <NavItem
                      icon={<UserIcon />}
                      label="Users"
                      onClick={() => setCurrentPage("Users")}
                      active={currentPage === "Users"}
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<TagIcon />}
                      label="Publishers"
                      onClick={() => setCurrentPage("Publishers")}
                      active={currentPage === "Publishers"}
                      collapsed={sidebarCollapsed}
                    />
                    <NavItem
                      icon={<ShieldIcon />}
                      label="Admins"
                      onClick={() => setCurrentPage("Admins")}
                      active={currentPage === "Admins"}
                      collapsed={sidebarCollapsed}
                    />
                  </div>
                </div>

                {/* Footer */}
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

        {/* Toggle Button Container - Full height and positioned at left edge when collapsed */}
        <div
          className={`
            absolute h-full flex items-center transition-all duration-300 ease-in-out
            ${fullCollapse ? "left-0" : "left-auto"}
          `}
          style={{
            right: fullCollapse ? "auto" : "-5px",
            top: 0,
          }}
        >
          <div className="h-full flex items-center">
            <Button
              variant="default"
              size="icon"
              className="bg-magic-iron-2 border border-magic-border-1 rounded-full h-10 w-10 p-0 z-10 flex items-center justify-center"
              onClick={toggleSidebar}
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Global Header */}
        <header className="flex items-center justify-between px-6 py-4 border-transparent">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex items-center gap-5">
            <Button variant="outline" size="icon" className="rounded-full bg-zinc-900">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="w-px h-10 bg-[#4E4E4E]" />
            <div className="flex items-center gap-4 ">
              <span className="text-base">
                Hello, <span className="font-bold">User</span>
              </span>
              <div className="h-10 w-10 rounded-full bg-zinc-700 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=40&width=40"
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

        {/* Page-specific Header */}
        <div className="px-6 pb-4 pt-1 border-transparent">{headerRender}</div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto scrollbar-overlay pl-6 pr-3.5">{bodyRender}</div>
      </div>
    </div>
  )
}
