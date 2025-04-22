"use client"

import { useState } from "react"
import Image from "next/image"
import { Bell } from "lucide-react"
import { NavItem } from "@/components/nav-item"
import {
  GridIcon, ShoppingBagIcon, PackageIcon, ReceiptIcon,
  BarChartIcon, StarIcon, TruckIcon, UserIcon, TagIcon, ShieldIcon
} from "@/components/ui/icons"
import { Button } from "@/components/ui/button"

import { Header_ProductsPage, Body_ProductsPage } from "@/app/ProductsPage/page"
import { Header_ReviewsPage, Body_ReviewsPage } from "@/app/ReviewsPage/page"

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

  const title = titleMap[currentPage]

  const RenderPage = () => {
    switch (currentPage) {
      case "Products":
        return {
          headerRender: <Header_ProductsPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />,
          bodyRender: <Body_ProductsPage searchQuery={searchQuery} />
        }
      case "Reviews":
        return {
          headerRender: <Header_ReviewsPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />,
          bodyRender: <Body_ReviewsPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        }
      default:
        return {
          headerRender: null,
          bodyRender: <p>not found.</p>
        }
    }
  }
  
  const { headerRender, bodyRender } = RenderPage()

  return (
    <div className="flex h-screen bg-magic-back text-white p-4 overflow-hidden">
      {/* Sidebar */}
      <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[24] flex">
        <div className="w-[20vw] min-w-[240px] max-w-[320px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 flex flex-col h-full">
                  
            {/* Logo */}
            <div className="my-5 text-center">
              <Image
                src="/magic-shop_Logo.svg"
                alt="Logo"
                width={0}
                height={0}
                className="w-full max-w-[240px] h-auto mx-auto object-contain"
                draggable={false}
              />
            </div>
            <hr className="h-px my-1 bg-transparent border-0" />
            

            {/* Section: Administrator */}
            <div className="flex-1 overflow-y-auto force-scrollbar-zero">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400 px-2 py-2">Administrator</p>
                <NavItem icon={<GridIcon />} label="Dashboard" onClick={() => setCurrentPage("Dashboard")} active={currentPage === "Dashboard"} />
                <NavItem icon={<ShoppingBagIcon />} label="Orders" onClick={() => setCurrentPage("Orders")} active={currentPage === "Orders"} />
                <NavItem icon={<PackageIcon />} label="Products" onClick={() => setCurrentPage("Products")} active={currentPage === "Products"} />
                <NavItem icon={<ReceiptIcon />} label="Transactions" onClick={() => setCurrentPage("Transactions")} active={currentPage === "Transactions"} />
                <NavItem icon={<BarChartIcon />} label="Reports" onClick={() => setCurrentPage("Reports")} active={currentPage === "Reports"} />
                <NavItem icon={<StarIcon />} label="Reviews" onClick={() => setCurrentPage("Reviews")} active={currentPage === "Reviews"} />
                <NavItem icon={<TruckIcon />} label="Shipping" onClick={() => setCurrentPage("Shipping")} active={currentPage === "Shipping"} />
              </div>

              <hr className="h-px my-2 bg-transparent border-0" />

              {/* Section: Super Admin */}
              <div className="space-y-1">
                <p className="text-sm text-zinc-400 px-2 py-2">Super Admin</p>
                <NavItem icon={<UserIcon />} label="Users" onClick={() => setCurrentPage("Users")} active={currentPage === "Users"} />
                <NavItem icon={<TagIcon />} label="Publishers" onClick={() => setCurrentPage("Publishers")} active={currentPage === "Publishers"} />
                <NavItem icon={<ShieldIcon />} label="Admins" onClick={() => setCurrentPage("Admins")} active={currentPage === "Admins"} />
              </div>
            </div>
            
            {/* Footer */}
            <div className="pt-2 mt-auto text-center text-zinc-500 text-sm">
              <p>shop for DnD lovers</p>
              <p>by DnD lovers</p>
            </div>
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
        <div className="px-6 pb-4 pt-1 border-transparent">
          {headerRender}
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto scrollbar-overlay pl-6 pr-3.5">
          {bodyRender}
        </div>
      </div>
    </div>
  )
}
