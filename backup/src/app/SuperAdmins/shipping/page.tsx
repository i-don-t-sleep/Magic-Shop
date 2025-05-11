"use client"

import { useState } from "react"
import { Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type ShippingItem, ShippingCard } from "@/components/shipping-card"

export default function ShippingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [shippingItems, setShippingItems] = useState<ShippingItem[]>([
    {
      id: 1,
      productImage: "dcfbd4a80d735ed524c31123e084659c.png",
      productTitle: "2024 Dungeon Master's Guide Digital + Physical Bundle",
      client: {
        name: "Santipab Tongchan",
        avatar: "9d0c44febd0f539d6bdc2bac6ef8e6f2.png",
        location: "Surin",
        country: "Thailand",
      },
      status: "In Transit",
      estimatedTime: "18/3/2025",
      origin: {
        country: "Thailand",
        city: "Soi Sukawat, Bangkok",
      },
      destination: {
        country: "Thailand",
        city: "Soi Phrarami9, Surin",
      },
      trackingSteps: 7,
      currentStep: 5,
    },
    {
      id: 2,
      productImage: "f9657989f2f325adb5a1a578f97643ab.png",
      productTitle: "2024 Player's Handbook Digital + Physical Bundle",
      client: {
        name: "Sirawitkamol Lomphong",
        avatar: "64f86257b99f4965a1f087852cbf7016.png",
        location: "Surin",
        country: "Thailand",
      },
      status: "Delivered",
      estimatedTime: "18/3/2025",
      origin: {
        country: "Thailand",
        city: "Soi Sukawat, Bangkok",
      },
      destination: {
        country: "Thailand",
        city: "Soi Phrarami9, Surin",
      },
      trackingSteps: 7,
      currentStep: 7,
    },
    {
      id: 3,
      productImage: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
      productTitle: "Vecna: Eve of Ruin Digital + Physical Bundle",
      client: {
        name: "Kirigaya Kazuto",
        avatar: "15e79c509e5a3a3b09117fd3dd960f70.png",
        location: "Tokyo",
        country: "Japan",
      },
      status: "Delivered",
      estimatedTime: "18/3/2025",
      origin: {
        country: "Thailand",
        city: "Soi Sukawat, Bangkok",
      },
      destination: {
        country: "Japan",
        city: "Kameda Street, Tokyo",
      },
      trackingSteps: 7,
      currentStep: 7,
    },
  ])

  const filteredItems = shippingItems.filter(
    (item) =>
      item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <div className="px-6 pb-3 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search items..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="border-zinc-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <ShippingCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
