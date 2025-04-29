"use client"

import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"

// Mock product data
const mockProducts = [
  {
    title: "2024 Digital & Physical Core Rulebook Bundle",
    price: "$179.97",
    inventory: 2704,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "/magic-shop/products/core-rulebook-bundle",
  },
  {
    title: "2024 Dungeon Master's Guide Digital + Physical Bundle",
    price: "$59.99",
    inventory: 142,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "/magic-shop/products/dungeon-masters-guide",
  },
  {
    title: "2024 Player's Handbook Digital + Physical Bundle",
    price: "$59.99",
    inventory: 573,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "/magic-shop/products/players-handbook",
  },
  {
    title: "Vecna: Eve of Ruin Digital + Physical Bundle",
    price: "$69.95",
    inventory: 25,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "/magic-shop/products/vecna-eve-of-ruin",
  },
  {
    title: "Quests from the Infinite Staircase Digital + Physical Bundle",
    price: "$69.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "/magic-shop/products/infinite-staircase",
  },
  {
    title: "D&D Campaign Case: Creatures",
    price: "$64.99",
    inventory: 89,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "/magic-shop/products/campaign-case-creatures",
  },
  {
    title: "D&D Expansion Gift Set Digital + Physical Bundle",
    price: "$169.95",
    inventory: 42,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "/magic-shop/products/expansion-gift-set",
  },
  {
    title: "Tasha's Cauldron of Everything",
    price: "$49.95",
    inventory: 215,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "/magic-shop/products/tashas-cauldron",
  },
  {
    title: "Xanathar's Guide to Everything",
    price: "$49.95",
    inventory: 178,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "/magic-shop/products/xanathars-guide",
  },
  {
    title: "Mordenkainen's Tome of Foes",
    price: "$49.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "/magic-shop/products/mordenkainens-tome",
  },
  {
    title: "Volo's Guide to Monsters",
    price: "$49.95",
    inventory: 67,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "/magic-shop/products/volos-guide",
  },
  {
    title: "Fizban's Treasury of Dragons",
    price: "$49.95",
    inventory: 93,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "/magic-shop/products/fizbans-treasury",
  },
  {
    title: "Sword Coast Adventurer's Guide",
    price: "$39.95",
    inventory: 124,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "/magic-shop/products/sword-coast",
  },
  {
    title: "Ghosts of Saltmarsh",
    price: "$49.95",
    inventory: 56,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "/magic-shop/products/ghosts-saltmarsh",
  },
  {
    title: "Curse of Strahd",
    price: "$49.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "/magic-shop/products/curse-strahd",
  },
  {
    title: "Icewind Dale: Rime of the Frostmaiden",
    price: "$49.95",
    inventory: 78,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "/magic-shop/products/icewind-dale",
  },
  {
    title: "Baldur's Gate: Descent into Avernus",
    price: "$49.95",
    inventory: 112,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "/magic-shop/products/baldurs-gate",
  },
  {
    title: "Waterdeep: Dragon Heist",
    price: "$49.95",
    inventory: 89,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "/magic-shop/products/waterdeep-dragon-heist",
  },
  // Additional products to demonstrate pagination
  {
    title: "Waterdeep: Dungeon of the Mad Mage",
    price: "$49.95",
    inventory: 67,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "/magic-shop/products/waterdeep-mad-mage",
  },
  {
    title: "Mythic Odysseys of Theros",
    price: "$49.95",
    inventory: 45,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "/magic-shop/products/theros",
  },
  {
    title: "Explorer's Guide to Wildemount",
    price: "$49.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "/magic-shop/products/wildemount",
  },
  {
    title: "Van Richten's Guide to Ravenloft",
    price: "$49.95",
    inventory: 103,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "/magic-shop/products/ravenloft",
  },
  {
    title: "The Wild Beyond the Witchlight",
    price: "$49.95",
    inventory: 87,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "/magic-shop/products/witchlight",
  },
  {
    title: "Strixhaven: A Curriculum of Chaos",
    price: "$49.95",
    inventory: 76,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "/magic-shop/products/strixhaven",
  },
  {
    title: "Call of the Netherdeep",
    price: "$49.95",
    inventory: 54,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "/magic-shop/products/netherdeep",
  },
  {
    title: "Journeys through the Radiant Citadel",
    price: "$49.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "/magic-shop/products/radiant-citadel",
  },
  {
    title: "Spelljammer: Adventures in Space",
    price: "$69.95",
    inventory: 123,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "/magic-shop/products/spelljammer",
  },
  {
    title: "Dragonlance: Shadow of the Dragon Queen",
    price: "$49.95",
    inventory: 98,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "/magic-shop/products/dragonlance",
  },
  {
    title: "Keys from the Golden Vault",
    price: "$49.95",
    inventory: 76,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "/magic-shop/products/golden-vault",
  },
  {
    title: "Bigby Presents: Glory of the Giants",
    price: "$49.95",
    inventory: 65,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "/magic-shop/products/glory-giants",
  },
  {
    title: "Planescape: Adventures in the Multiverse",
    price: "$69.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "/magic-shop/products/planescape",
  },
  {
    title: "The Book of Many Things",
    price: "$49.95",
    inventory: 87,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "/magic-shop/products/many-things",
  },
  {
    title: "Phandelver and Below: The Shattered Obelisk",
    price: "$59.95",
    inventory: 76,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "/magic-shop/products/phandelver",
  },
  {
    title: "Dice & Miscellany: Vecna",
    price: "$29.95",
    inventory: 45,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "/magic-shop/products/dice-vecna",
  },
  {
    title: "D&D Icons of the Realms: Gargantuan Tiamat",
    price: "$399.99",
    inventory: 12,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "/magic-shop/products/tiamat",
  },
  {
    title: "D&D Icons of the Realms: Adult Red Dragon",
    price: "$89.99",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "/magic-shop/products/red-dragon",
  },
  {
    title: "D&D Icons of the Realms: Beholder",
    price: "$69.99",
    inventory: 23,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "/magic-shop/products/beholder",
  },{
    title: "D&D Icons of the Realms: Gargantuan Tiamat",
    price: "$399.99",
    inventory: 12,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "/magic-shop/products/tiamat",
  },
  {
    title: "D&D Icons of the Realms: Adult Red Dragon",
    price: "$89.99",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "/magic-shop/products/red-dragon",
  },
  {
    title: "D&D Icons of the Realms: Beholder",
    price: "$69.99",
    inventory: 23,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "/magic-shop/products/beholder",
  },{
    title: "D&D Icons of the Realms: Gargantuan Tiamat",
    price: "$399.99",
    inventory: 12,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "/magic-shop/products/tiamat",
  },
  {
    title: "D&D Icons of the Realms: Adult Red Dragon",
    price: "$89.99",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "/magic-shop/products/red-dragon",
  },
  {
    title: "D&D Icons of the Realms: Beholder",
    price: "$69.99",
    inventory: 23,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "/magic-shop/products/beholder",
  },{
    title: "D&D Icons of the Realms: Gargantuan Tiamat",
    price: "$399.99",
    inventory: 12,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "/magic-shop/products/tiamat",
  },
  {
    title: "D&D Icons of the Realms: Adult Red Dragon",
    price: "$89.99",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "/magic-shop/products/red-dragon",
  },
  {
    title: "D&D Icons of the Realms: Beholder",
    price: "$69.99",
    inventory: 23,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "/magic-shop/products/beholder",
  },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 20  //can selected by user needed (minimum)
  const productPerRows = 15 //*

  //mockProducts in backend should be here. when use API

  // Filter products based on search query
  const filteredProducts = mockProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      {/* ==================== Header with search and filters ==================== */}
      <div className="px-6 pb-3 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="border-zinc-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" className="border-zinc-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* ==================== Body ====================*/}
      {/* Products grid - with padding at the bottom to account for fixed pagination */}
      <div className="flex-1 px-6 overflow-y-auto">
        {currentProducts.length > 0 ? (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${productPerRows} gap-6 mb-2`}>
              {currentProducts.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16">
            <div className="text-2xl font-bold text-zinc-500 mb-4">No products found</div>
            <div className="text-zinc-400 mb-8">Try adjusting your search or filter criteria</div>
            {searchQuery && (
              <Button
                variant="outline"
                className="border-zinc-700 text-white"
                onClick={() => {
                  setSearchQuery("")
                  setCurrentPage(1)
                }}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* ==================== Footer ====================*/}
        {/* Footer */}
        {/* Centered pagination */}
        <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-zinc-700"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
            <ChevronLeft className="h-4 w-4" />
            </Button>

            {totalPages <= 5 ? (
              // If we have 5 or fewer pages, show all page numbers
              pageNumbers.map((number) => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  className={`h-10 w-10 rounded-full p-0 ${
                    currentPage === number ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                  }`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </Button>
              ))
            ) : (
              // If we have more than 5 pages, show a subset with ellipsis
              <>
                {/* First page */}
                <Button
                  variant={currentPage === 1 ? "default" : "outline"}
                  className={`h-10 w-10 rounded-full p-0 ${
                    currentPage === 1 ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                  }`}
                  onClick={() => paginate(1)}
                >
                  1
                </Button>

                {/* Show ellipsis if current page is far from the start */}
                {currentPage > 3 && <span className="px-2 text-zinc-500">...</span>}

                {/* Pages around current page */}
                {pageNumbers
                  .filter(
                    (number) =>
                      number !== 1 &&
                      number !== totalPages &&
                      ((currentPage <= 3 && number <= 4) ||
                        (currentPage > totalPages - 3 && number > totalPages - 4) ||
                        (number >= currentPage - 1 && number <= currentPage + 1)),
                  )
                  .map((number) => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      className={`h-10 w-10 rounded-full p-0 ${
                        currentPage === number ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                      }`}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </Button>
                  ))}

                {/* Show ellipsis if current page is far from the end */}
                {currentPage < totalPages - 2 && <span className="px-2 text-zinc-500">...</span>}

                {/* Last page */}
                {totalPages > 1 && (
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    className={`h-10 w-10 rounded-full p-0 ${
                      currentPage === totalPages ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                    }`}
                    onClick={() => paginate(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}
              </>
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-zinc-700"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/*
          <div className="flex items-center gap-2">
              <span className="text-zinc-400">Show:</span>
              <Button variant="outline" className="border-zinc-700 text-white h-8">
                {cardPerPage} rows
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
          </div>*/}
        </div>
      </div>
    </div>
  )
}
