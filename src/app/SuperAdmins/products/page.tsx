"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
    href: "core-rulebook-bundle",
  },
  {
    title: "2024 Dungeon Master's Guide Digital + Physical Bundle",
    price: "$59.99",
    inventory: 142,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "dungeon-masters-guide",
  },
  {
    title: "2024 Player's Handbook Digital + Physical Bundle",
    price: "$59.99",
    inventory: 573,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "players-handbook",
  },
  {
    title: "Vecna: Eve of Ruin Digital + Physical Bundle",
    price: "$69.95",
    inventory: 25,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "vecna-eve-of-ruin",
  },
  {
    title: "Quests from the Infinite Staircase Digital + Physical Bundle",
    price: "$69.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "infinite-staircase",
  },
  {
    title: "D&D Campaign Case: Creatures",
    price: "$64.99",
    inventory: 89,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "campaign-case-creatures",
  },
  {
    title: "D&D Expansion Gift Set Digital + Physical Bundle",
    price: "$169.95",
    inventory: 42,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "expansion-gift-set",
  },
  {
    title: "Tasha's Cauldron of Everything",
    price: "$49.95",
    inventory: 215,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "tashas-cauldron",
  },
  {
    title: "Xanathar's Guide to Everything",
    price: "$49.95",
    inventory: 178,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "xanathars-guide",
  },
  {
    title: "Mordenkainen's Tome of Foes",
    price: "$49.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "mordenkainens-tome",
  },
  {
    title: "Volo's Guide to Monsters",
    price: "$49.95",
    inventory: 67,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "volos-guide",
  },
  {
    title: "Fizban's Treasury of Dragons",
    price: "$49.95",
    inventory: 93,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "fizbans-treasury",
  },
  {
    title: "Sword Coast Adventurer's Guide",
    price: "$39.95",
    inventory: 124,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "sword-coast",
  },
  {
    title: "Ghosts of Saltmarsh",
    price: "$49.95",
    inventory: 56,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "ghosts-saltmarsh",
  },
  {
    title: "Curse of Strahd",
    price: "$49.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "curse-strahd",
  },
  {
    title: "Icewind Dale: Rime of the Frostmaiden",
    price: "$49.95",
    inventory: 78,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "icewind-dale",
  },
  {
    title: "Baldur's Gate: Descent into Avernus",
    price: "$49.95",
    inventory: 112,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "baldurs-gate",
  },
  {
    title: "Waterdeep: Dragon Heist",
    price: "$49.95",
    inventory: 89,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "waterdeep-dragon-heist",
  },
  // Additional products to demonstrate pagination
  {
    title: "Waterdeep: Dungeon of the Mad Mage",
    price: "$49.95",
    inventory: 67,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "waterdeep-mad-mage",
  },
  {
    title: "Mythic Odysseys of Theros",
    price: "$49.95",
    inventory: 45,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "theros",
  },
  {
    title: "Explorer's Guide to Wildemount",
    price: "$49.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "wildemount",
  },
  {
    title: "Van Richten's Guide to Ravenloft",
    price: "$49.95",
    inventory: 103,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "ravenloft",
  },
  {
    title: "The Wild Beyond the Witchlight",
    price: "$49.95",
    inventory: 87,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "witchlight",
  },
  {
    title: "Strixhaven: A Curriculum of Chaos",
    price: "$49.95",
    inventory: 76,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "strixhaven",
  },
  {
    title: "Call of the Netherdeep",
    price: "$49.95",
    inventory: 54,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "netherdeep",
  },
  {
    title: "Journeys through the Radiant Citadel",
    price: "$49.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "radiant-citadel",
  },
  {
    title: "Spelljammer: Adventures in Space",
    price: "$69.95",
    inventory: 123,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "spelljammer",
  },
  {
    title: "Dragonlance: Shadow of the Dragon Queen",
    price: "$49.95",
    inventory: 98,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "dragonlance",
  },
  {
    title: "Keys from the Golden Vault",
    price: "$49.95",
    inventory: 76,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "golden-vault",
  },
  {
    title: "Bigby Presents: Glory of the Giants",
    price: "$49.95",
    inventory: 65,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "glory-giants",
  },
  {
    title: "Planescape: Adventures in the Multiverse",
    price: "$69.95",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "planescape",
  },
  {
    title: "The Book of Many Things",
    price: "$49.95",
    inventory: 87,
    imageUrl: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
    href: "many-things",
  },
  {
    title: "Phandelver and Below: The Shattered Obelisk",
    price: "$59.95",
    inventory: 76,
    imageUrl: "dcfbd4a80d735ed524c31123e084659c.png",
    href: "phandelver",
  },
  {
    title: "Dice & Miscellany: Vecna",
    price: "$29.95",
    inventory: 45,
    imageUrl: "dc84620855214ac09da2632bd939da1f.png",
    href: "dice-vecna",
  },
  {
    title: "D&D Icons of the Realms: Gargantuan Tiamat",
    price: "$399.99",
    inventory: 12,
    imageUrl: "cf27466446e6da568b1eae990514f787.png",
    href: "tiamat",
  },
  {
    title: "D&D Icons of the Realms: Adult Red Dragon",
    price: "$89.99",
    inventory: 0,
    imageUrl: "2c4c88e9ecc12670d82aece0ec209b09.png",
    href: "red-dragon",
  },
  {
    title: "D&D Icons of the Realms: Beholder",
    price: "$69.99",
    inventory: 23,
    imageUrl: "f9657989f2f325adb5a1a578f97643ab.png",
    href: "beholder",
  },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(6)
  const [cardsPerRow, setCardsPerRow] = useState(3)
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false)
  const [itemsPerPageInput, setItemsPerPageInput] = useState(productsPerPage.toString())
  const [showItemsPerPageInput, setShowItemsPerPageInput] = useState(false)

  // Reference to the bottom of the page for scrolling
  const bottomRef = useRef<HTMLDivElement>(null)

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

  // Change page and scroll to bottom
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    bottomRef.current?.scrollIntoView({ behavior: "auto" })
  }

  // Handle items per page change
  const handleItemsPerPageChange = () => {
    const newValue = Number.parseInt(itemsPerPageInput)
    if (!isNaN(newValue) && newValue > 0) {
      setProductsPerPage(newValue)
      // Reset to page 1 when changing items per page
      setCurrentPage(1)
    }
    setShowItemsPerPageInput(false)
  }

  // Handle input keydown for items per page
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleItemsPerPageChange()
    }
  }

  // Generate items per page options based on cards per row
  const getItemsPerPageOptions = () => {
    const baseMultiple = cardsPerRow
    // Generate 5 options (1-5 rows of cards)
    let j = 10;
    return Array.from({ length: j }, (_, i) => baseMultiple * (j - i)) //4 16 40 100 200
  }

  // Update the useEffect to adjust productsPerPage when cardsPerRow changes
  useEffect(() => {
    // When cards per row changes, adjust products per page to be a multiple of cards per row
    setProductsPerPage(cardsPerRow * Math.ceil(productsPerPage / cardsPerRow))
  }, [cardsPerRow])

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      {/* Header with search and filters */}
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

      {/* Products grid */}
      <div className="flex-1 px-6 overflow-y-auto">
        {currentProducts.length > 0 ? (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              cardsPerRow === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
            } gap-6`}
          >
            {currentProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
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

        {/* Reference div for scrolling to bottom */}
        <div ref={bottomRef} className="h-4"></div>

        {/* Pagination at the bottom */}
        <div className="flex justify-between items-center mt-1">
          {/* Left side - pagination controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-zinc-700"
              onClick={() => paginate(Math.max(1, currentPage - 1))}
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
                  className={`h-8 w-8 rounded-full p-0 ${
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
                  className={`h-8 w-8 rounded-full p-0 ${
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
                      className={`h-8 w-8 rounded-full p-0 ${
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
                    className={`h-8 w-8 rounded-full p-0 ${
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
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right side - cards per row and items per page controls */}
          <div className="flex items-center gap-4">
            {/* Cards per row controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Cards per row:</span>
              <div className="flex">
                <Button
                  variant={cardsPerRow === 3 ? "default" : "outlineWithOut"}
                  size="icon"
                  className={`h-8 w-8 rounded-l-md rounded-r-none ${
                    cardsPerRow === 3 ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                  }`}
                  onClick={() => {
                    setCardsPerRow(3)
                    bottomRef.current?.scrollIntoView({ behavior: "auto" })
                  }}
                >
                  <span className="text-xs">3</span>
                </Button>
                <Button
                  variant={cardsPerRow === 4 ? "default" : "outlineWithOut"}
                  size="icon"
                  className={`h-8 w-8 rounded-l-none rounded-r-md ${
                    cardsPerRow === 4 ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                  }`}
                  onClick={() => {
                    setCardsPerRow(4)
                    bottomRef.current?.scrollIntoView({ behavior: "auto" })
                  }}
                >
                  <span className="text-xs">4</span>
                </Button>
              </div>
            </div>

            {/* Items per page dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Items per page:</span>
              <div className="relative">
                <Button
                  variant="outline"
                  className="h-8 border-zinc-700 text-white"
                  onClick={() => {
                    setShowItemsPerPageDropdown(!showItemsPerPageDropdown)
                    bottomRef.current?.scrollIntoView({ behavior: "auto" })
                  }}
                >
                  {productsPerPage}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>

                {showItemsPerPageDropdown && (
                  <div className="absolute right-0 bottom-full mb-1 w-24 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-10">
                    {getItemsPerPageOptions().map((option) => (
                      <button
                        key={option}
                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-zinc-700"
                        onClick={() => {
                          setProductsPerPage(option)
                          setShowItemsPerPageDropdown(false)
                          setCurrentPage(1) // Reset to page 1 when changing items per page
                          bottomRef.current?.scrollIntoView({ behavior: "auto" })
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
