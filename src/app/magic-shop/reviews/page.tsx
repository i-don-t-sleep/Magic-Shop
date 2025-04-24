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
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    ratingDistribution: [80, 15, 3, 1, 1],
    reviews: [
      {
        id: 1,
        userName: "Song Jin Woo",
        userAvatar: "5861e0f46ef92ca30b2e3bf5f3412863.png",
        comment: "One of the greatest D&D product of all time",
        rating: 5,
        date: "January 20, 2025",
      },
      {
        id: 2,
        userName: "Kirigaya Kasuto",
        userAvatar: "15e79c509e5a3a3b09117fd3dd960f70.png",
        comment: "Not gonna lie, it's worth every yen",
        rating: 5,
        date: "January 12, 2025",
      },
      {
        id: 3,
        userName: "Santipab Tongchan",
        userAvatar: "9d0c44febd0f539d6bdc2bac6ef8e6f2.png",
        comment: "Quality Stuff",
        rating: 5,
        date: "December 29, 2024",
      },
      {
        id: 4,
        userName: "Jamal Mormai",
        userAvatar: "64f86257b99f4965a1f087852cbf7016.png",
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
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    ratingDistribution: [20, 20, 20, 20, 20],
    reviews: [
      {
        id: 1,
        userName: "Mormai Jamal",
        userAvatar: "64f86257b99f4965a1f087852cbf7016.png",
        comment: "Too many changes from the previous edition",
        rating: 2,
        date: "January 15, 2025",
      },
      {
        id: 2,
        userName: "Elminster Aumar",
        userAvatar: "images.jpeg",
        comment: "The new rules are quite balanced",
        rating: 4,
        date: "January 10, 2025",
      },
      {
        id: 3,
        userName: "Drizzt Do'Urden",
        userAvatar: "1_g-7NcjhvVteOq7tsSevvsw.jpg",
        comment: "I like the new character options",
        rating: 5,
        date: "December 25, 2024",
      },
    ],
  },
]

export default function reviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex width=120% h-screen overflow-y-auto scrollbar-overlay">
        <Body searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </div>
  )
}



export function Header({
  searchQuery,
  setSearchQuery,
  classN = 'px-6 pb-3',
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  classN?: string
}) {
  return (
    <main>
      <div className={`${classN} flex justify-between`}>
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

export function Body({
  searchQuery,
  setSearchQuery,
  classN = 'px-6 pb-3',
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  classN?: string
}) {
  const filteredReviews = reviews.filter((review) =>
    review.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`${classN} space-y-4`}>
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
