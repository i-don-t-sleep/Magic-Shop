"use client"

import { useState } from "react"
import Image from "next/image"
import { Filter, Phone, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ShippingItem {
  id: number
  productImage: string
  productTitle: string
  client: {
    name: string
    avatar: string
    location: string
    country: string
  }
  status: "In Transit" | "Delivered" | "Processing" | "Cancelled"
  estimatedTime: string
  origin: {
    country: string
    city: string
  }
  destination: {
    country: string
    city: string
  }
  trackingSteps: number
  currentStep: number
}

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

function ShippingCard({ item }: { item: ShippingItem }) {
  return (
    <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
      <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <div className="flex gap-6">
              {/* Product Image */}
              <div className="w-24 h-24 relative">
                <Image
                  src={`/api/image?path=products/${item.productImage}`}
                  alt="Product"
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">{item.productTitle}</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={`/api/image?path=users/${item.client.avatar}`}
                      alt={item.client.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">Client</div>
                    <div className="font-medium">{item.client.name}</div>
                    <div className="flex items-center text-xs text-zinc-400">
                      <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full mr-1"></span>
                      {item.client.location}, {item.client.country}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-sm text-zinc-400">Status</div>
              <div className="font-medium text-xl mb-1">{item.status}</div>
              <div className="text-sm text-zinc-400">Estimated Time</div>
              <div className="text-sm">{item.estimatedTime}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-zinc-400 mb-1">Thailand</div>
              <div className="text-sm">{item.origin.city}</div>
            </div>

            <div className="flex-1 mx-4">
              <div className="relative">
                <div className="h-1 bg-zinc-800 rounded-full">
                  <div
                    className="h-1 bg-red-600 rounded-full"
                    style={{ width: `${(item.currentStep / item.trackingSteps) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  {Array.from({ length: item.trackingSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index < item.currentStep ? "bg-red-600" : "bg-zinc-800"
                      } ${index === item.currentStep - 1 ? "ring-2 ring-red-600/30" : ""}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-zinc-400 mb-1">{item.destination.country}</div>
              <div className="text-sm">{item.destination.city}</div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" size="sm" className="border-zinc-700 text-white">
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
