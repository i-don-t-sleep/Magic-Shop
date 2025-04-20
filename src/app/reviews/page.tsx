"use client"

import { Bell, ChevronDown, Filter, Search } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { NavItem } from "@/components/nav-item"
import { ReviewCard } from "@/components/review-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BarChartIcon,
  GridIcon,
  PackageIcon,
  ReceiptIcon,
  ShieldIcon,
  ShoppingBagIcon,
  StarIcon,
  TagIcon,
  TruckIcon,
  UserIcon,
} from "@/components/ui/icons"

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for reviews including individual review details
  const reviews = [
    {
      id: 1,
      title: "2024 Dungeon Master's Guide Digital + Physical Bundle",
      publisher: "Wizards of the coast",
      quantity: 200,
      price: "$59.99",
      rating: 4.8,
      reviewCount: 11114,
      imageUrl: "/placeholder.svg?height=200&width=160",
      ratingDistribution: [80, 15, 3, 1, 1],
      reviews: [
        {
          id: 1,
          userName: "Song Jin Woo",
          userAvatar: "/placeholder.svg?height=40&width=40",
          comment: "One of the greatest D&D product of all time",
          rating: 5,
          date: "January 20, 2025",
        },
        {
          id: 2,
          userName: "Kirigaya Kasuto",
          userAvatar: "/placeholder.svg?height=40&width=40",
          comment: "Not gonna lie, it's worth every yen",
          rating: 5,
          date: "January 12, 2025",
        },
        {
          id: 3,
          userName: "Santipab Tongchan",
          userAvatar: "/placeholder.svg?height=40&width=40",
          comment: "Quality Stuff",
          rating: 5,
          date: "December 29, 2024",
        },
        {
          id: 4,
          userName: "Jamal Mormai",
          userAvatar: "/placeholder.svg?height=40&width=40",
          comment: "Missing lots of pages",
          rating: 3,
          date: "January 20, 2025",
        },
      ],
    },
    {
      id: 2,
      title: "2024 Player's Handbook Digital + Physical Bundle",
      publisher: "Wizards of the coast",
      quantity: "Out of Stock",
      price: "$59.99",
      rating: 3.0,
      reviewCount: 1290,
      imageUrl: "/placeholder.svg?height=200&width=160",
      ratingDistribution: [20, 20, 20, 20, 20],
      reviews: [
        {
          id: 1,
          userName: "Mormai Jamal",
          userAvatar: "/placeholder.svg?height=40&width=40",
          comment: "Too many changes from the previous edition",
          rating: 2,
          date: "January 15, 2025",
        },
        {
          id: 2,
          userName: "Elminster Aumar",
          userAvatar: "/placeholder.svg?height=40&width=40",
          comment: "The new rules are quite balanced",
          rating: 4,
          date: "January 10, 2025",
        },
        {
          id: 3,
          userName: "Drizzt Do'Urden",
          userAvatar: "/placeholder.svg?height=40&width=40",
          comment: "I like the new character options",
          rating: 5,
          date: "December 25, 2024",
        },
      ],
    },
  ]

  // Filter reviews based on search query
  const filteredReviews = reviews.filter((review) => review.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex h-screen bg-black text-white p-4">
      {/* Sidebar */}
      <div className="w-[320px] bg-zinc-950 rounded-3xl overflow-hidden flex flex-col mr-4">
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="block text-center">MAGIC</span>
                <span className="block text-center">SHOP</span>
              </h1>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-12 h-12">
                <div className="w-full h-full bg-red-600 rotate-45 transform origin-center"></div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-zinc-400 px-2 py-2">Administrator</p>
            <NavItem href="/dashboard" icon={<GridIcon />} label="Dashboard" />
            <NavItem href="/orders" icon={<ShoppingBagIcon />} label="Orders" />
            <NavItem href="/products" icon={<PackageIcon />} label="Product" />
            <NavItem href="/transactions" icon={<ReceiptIcon />} label="Transaction" />
            <NavItem href="/reports" icon={<BarChartIcon />} label="Reports" />
            <NavItem href="/reviews" icon={<StarIcon />} label="Reviews" active />
            <NavItem href="/shipping" icon={<TruckIcon />} label="Shipping" />
          </div>

          <div className="mt-8 space-y-1">
            <p className="text-sm text-zinc-400 px-2 py-2">Super Admin</p>
            <NavItem href="/users" icon={<UserIcon />} label="Users" />
            <NavItem href="/publishers" icon={<TagIcon />} label="Publishers" />
            <NavItem href="/admins" icon={<ShieldIcon />} label="Admins" />
          </div>

          <div className="mt-auto text-center text-zinc-500 text-sm">
            <p>shop for DnD lovers</p>
            <p>by DnD lovers</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h1 className="text-3xl font-bold">Reviews</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full bg-zinc-900">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="flex items-center gap-2 px-4">
              <span>Hello, Mormai</span>
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

        <main className="p-6">
          <div className="flex justify-between mb-6">
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
            <div>
              <Button variant="outline" className="border-zinc-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-zinc-400 mb-4">No reviews found</p>
                {searchQuery && (
                  <Button onClick={() => setSearchQuery("")} variant="outline">
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              filteredReviews.map((review) => <ReviewCard key={review.id} {...review} />)
            )}
          </div>
        </main>
      </div>
    </div>
  )
}