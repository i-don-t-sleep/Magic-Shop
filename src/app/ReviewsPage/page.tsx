"use client"

import { Bell, ChevronDown, Filter, Search } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { ReviewCard } from "@/components/review-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


let reviews = [
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

export function Header_ReviewsPage({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
}) {
  return (
    <main>
      <div className="flex justify-between ">
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
    </main>
  )
}

export function Body_ReviewsPage({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
}) {
  const filteredReviews = reviews.filter((review) =>
    review.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
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
  )
}
