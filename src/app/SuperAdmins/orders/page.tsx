"use client"

import { useState } from "react"
import { Filter, Search, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OrderStatus, Order, OrderCard } from "@/components/order-card"

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const ordersPerPage = 2 // จำนวนรายการต่อหน้า

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      productImage: "dcfbd4a80d735ed524c31123e084659c.png",
      quantity: 2,
      client: {
        name: "Santipab Tongchan",
        avatar: "9d0c44febd0f539d6bdc2bac6ef8e6f2.png",
        location: "Surin",
        country: "Thailand",
      },
      status: "Processing",
      date: "18/3/2025 15:26 น.",
    },
    {
      id: 2,
      productImage: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
      quantity: 4,
      client: {
        name: "Song Jin Woo",
        avatar: "5861e0f46ef92ca30b2e3bf5f3412863.png",
        location: "Pakchong, Korat",
        country: "Thailand",
      },
      status: "Pending",
      date: "17/3/2025 12:40 น.",
    },
    {
      id: 3,
      productImage: "2c4c88e9ecc12670d82aece0ec209b09.png",
      quantity: 20,
      client: {
        name: "Kirito",
        avatar: "15e79c509e5a3a3b09117fd3dd960f70.png",
        location: "Pracha Uthit, Bang Mod",
        country: "Thailand",
      },
      status: "Cancelled",
      date: "16/3/2025 11:15 น.",
    },
    {
      id: 4,
      productImage: "f9657989f2f325adb5a1a578f97643ab.png",
      quantity: 0,
      client: {
        name: "Remu",
        avatar: "5da204754376289f2469c71ad69b2fd99411d5b0.jpg",
        location: "Tokyo",
        country: "Japan",
      },
      status: "Refunded",
      date: "20/3/2025 08:40 น.",
    },
  ])

  const filteredOrders = orders.filter(
    (order) =>
      order.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      {/* Header with search and filters */}
      <div className="px-6 pb-3 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search orders..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // reset หน้าเมื่อค้นหาใหม่
              }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="border-zinc-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-zinc-700 text-white p-2">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="space-y-4">
          {currentOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>

      {/* Footer Pagination */}
      <div className="relative w-full">
        {filteredOrders.length > ordersPerPage && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50">
            <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-full">
              <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-full overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1b1b1b]/90 backdrop-blur-sm">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-zinc-700 hover:bg-magic-red hover:text-white transition-colors"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {[...Array(totalPages)].map((_, index) => {
                    const number = index + 1
                    return (
                      <Button
                        key={number}
                        variant={currentPage === number ? "default" : "outline"}
                        className={`h-10 w-10 rounded-full p-0 ${
                          currentPage === number ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                        } transition-colors`}
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-zinc-700 hover:bg-magic-red hover:text-white transition-colors"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
