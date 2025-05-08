"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter, Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { Loading } from "@/components/loading-comp"

type Product = {
  name: string
  price: string
  quantity: number
  imageUrl: string
  href: string
}

type FilterState = {
  category: string
  publisher: string
  minPrice: string
  maxPrice: string
  status: string
  sort: string
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(4)
  const [IsFirstfetch, setIsFirstfetch] = useState(false)
  const [cardsPerRow, setCardsPerRow] = useState(4)
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Add this right after the showFilters state declaration:
  // Ref for the filter dialog
  const filterDialogRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close filter dialog
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showFilters && filterDialogRef.current && !filterDialogRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }

    // Add event listener when filter dialog is open
    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showFilters])

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    publisher: "",
    minPrice: "",
    maxPrice: "",
    status: "",
    sort: "price-asc",
  })

  // Categories and publishers for filter dropdowns
  const [categories, setCategories] = useState<string[]>([
    "Books",
    "Miniatures",
    "Dice",
    "Accessories",
    "Digital Content",
  ])

  const [publishers, setPublishers] = useState<string[]>([
    "Wizards of the Coast",
    "Paizo",
    "Critical Role",
    "Kobold Press",
    "Green Ronin",
  ])

  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / productsPerPage)

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Generate items per page options based on cards per row
  const getItemsPerPageOptions = () => {
    const baseMultiple = cardsPerRow
    const multipliers = [25, 10, 8, 4, 2, 1]
    return multipliers.map((multiplier) => baseMultiple * multiplier)
  }

  // Handle filter change
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "",
      publisher: "",
      minPrice: "",
      maxPrice: "",
      status: "",
      sort: "price-asc",
    })
    setCurrentPage(1)
  }

  // Fetch products from API
  const fetchProducts = async () => {
    if (!IsFirstfetch) {
      setLoading(true)
      setIsFirstfetch(true)
    }
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: productsPerPage.toString(),
        sort: filters.sort,
      })

      if (searchQuery) {
        queryParams.append("search", searchQuery)
      }

      // Add filters to query params
      if (filters.category) {
        queryParams.append("category", filters.category)
      }

      if (filters.publisher) {
        queryParams.append("publisher", filters.publisher)
      }

      if (filters.minPrice) {
        queryParams.append("minPrice", filters.minPrice)
      }

      if (filters.maxPrice) {
        queryParams.append("maxPrice", filters.maxPrice)
      }

      if (filters.status) {
        queryParams.append("status", filters.status)
      }

      const response = await fetch(`/api/products?${queryParams.toString()}`)
      const data = await response.json()

      setProducts(data.data)
      setTotalRecords(data.total)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Check if content is overflowing
  useEffect(() => {
    const el = containerRef.current
    if (el) {
      const checkOverflow = () => {
        const overflow = el.scrollHeight > el.clientHeight
        setIsOverflowing(overflow)
      }

      checkOverflow()

      // Also check on window resize
      window.addEventListener("resize", checkOverflow)
      return () => window.removeEventListener("resize", checkOverflow)
    }
  }, [products, loading])

  // Fetch products when page, productsPerPage, search, or filters change
  useEffect(() => {
    fetchProducts()
  }, [currentPage, productsPerPage, searchQuery, filters])

  // Update productsPerPage when cardsPerRow changes
  useEffect(() => {
    // This effect should only run after initial render
    if (IsFirstfetch) {
      // Calculate current multiplier (how many rows of products)
      const currentMultiplier = Math.round(productsPerPage / cardsPerRow)

      // Set new products per page maintaining the same multiplier
      const newProductsPerPage = cardsPerRow * currentMultiplier

      // Only update if it's different to avoid infinite loop
      if (newProductsPerPage !== productsPerPage) {
        setProductsPerPage(newProductsPerPage)
      }
    }
  }, [cardsPerRow, IsFirstfetch])

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Check if any filters are active
  const hasActiveFilters =
    filters.category ||
    filters.publisher ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.status ||
    filters.sort !== "price-asc"

  // Add this right before the return statement in ProductsPage
  return (
    <>
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
            <Button
              variant="outline"
              className={`border-zinc-700 text-white ${hasActiveFilters ? "bg-magic-red" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {hasActiveFilters && (
                <span className="ml-2 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {Object.values(filters).filter((v) => v && v !== "price-asc").length}
                </span>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" className="border-zinc-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Filter dialog */}
            <div className="relative z-10 w-full max-w-3xl mx-auto" ref={filterDialogRef}>
              <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
                <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-medium">Filter Products</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Category filter */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                          className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
                          value={filters.category}
                          onChange={(e) => handleFilterChange("category", e.target.value)}
                        >
                          <option value="">All Categories</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Publisher filter */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Publisher</label>
                        <select
                          className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
                          value={filters.publisher}
                          onChange={(e) => handleFilterChange("publisher", e.target.value)}
                        >
                          <option value="">All Publishers</option>
                          {publishers.map((publisher) => (
                            <option key={publisher} value={publisher}>
                              {publisher}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status filter */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                          className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
                          value={filters.status}
                          onChange={(e) => handleFilterChange("status", e.target.value)}
                        >
                          <option value="">All Status</option>
                          <option value="Available">Available</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>

                      {/* Price range */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Min Price</label>
                        <Input
                          type="number"
                          placeholder="Min Price"
                          className="bg-zinc-900 border-zinc-700 text-white"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Max Price</label>
                        <Input
                          type="number"
                          placeholder="Max Price"
                          className="bg-zinc-900 border-zinc-700 text-white"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                        />
                      </div>

                      {/* Sort order */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Sort By</label>
                        <select
                          className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
                          value={filters.sort}
                          onChange={(e) => handleFilterChange("sort", e.target.value)}
                        >
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="quantity-asc">Quantity: Low to High</option>
                          <option value="quantity-desc">Quantity: High to Low</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button variant="outline" className="border-zinc-700 text-white mr-3" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                      <Button className="bg-magic-red hover:bg-red-700" onClick={() => setShowFilters(false)}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/*flex-1 px-6 pb-6 overflow-y-auto*/}
        {/* Products grid */}
        <div className={`flex-1 overflow-y-auto ${isOverflowing ? "pl-6 pr-4" : "px-6"}`} ref={containerRef}>
          {loading ? (
            <Loading />
          ) : products.length > 0 ? (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                cardsPerRow === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
              } gap-6`}
            >
              {products.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <div className="text-2xl font-bold text-zinc-500 mb-4">No products found</div>
              <div className="text-zinc-400 mb-8">Try adjusting your search or filter criteria</div>
              {(searchQuery || hasActiveFilters) && (
                <div className="flex gap-4">
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
                  {hasActiveFilters && (
                    <Button variant="outline" className="border-zinc-700 text-white" onClick={resetFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pagination for overflow content */}
          {products.length > 0 && isOverflowing && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              cardsPerRow={cardsPerRow}
              setCardsPerRow={setCardsPerRow}
              productsPerPage={productsPerPage}
              setProductsPerPage={setProductsPerPage}
              pageNumbers={pageNumbers}
              paginate={paginate}
              showItemsPerPageDropdown={showItemsPerPageDropdown}
              setShowItemsPerPageDropdown={setShowItemsPerPageDropdown}
              getItemsPerPageOptions={getItemsPerPageOptions}
            />
          )}
        </div>

        {/* Pagination for non-overflow content */}
        {products.length > 0 && !isOverflowing && (
          <div className="px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              cardsPerRow={cardsPerRow}
              setCardsPerRow={setCardsPerRow}
              productsPerPage={productsPerPage}
              setProductsPerPage={setProductsPerPage}
              pageNumbers={pageNumbers}
              paginate={paginate}
              showItemsPerPageDropdown={showItemsPerPageDropdown}
              setShowItemsPerPageDropdown={setShowItemsPerPageDropdown}
              getItemsPerPageOptions={getItemsPerPageOptions}
            />
          </div>
        )}
      </div>
    </>
  )
}

type PaginationProps = {
  currentPage: number
  totalPages: number
  cardsPerRow: number
  setCardsPerRow: (value: number) => void
  productsPerPage: number
  setProductsPerPage: (value: number) => void
  pageNumbers: number[]
  paginate: (page: number) => void
  showItemsPerPageDropdown: boolean
  setShowItemsPerPageDropdown: (val: boolean) => void
  getItemsPerPageOptions: () => number[]
}

export function Pagination({
  currentPage,
  totalPages,
  cardsPerRow,
  setCardsPerRow,
  productsPerPage,
  setProductsPerPage,
  pageNumbers,
  paginate,
  showItemsPerPageDropdown,
  setShowItemsPerPageDropdown,
  getItemsPerPageOptions,
}: PaginationProps) {
  // Add a ref for the dropdown button and a useEffect for click outside
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowItemsPerPageDropdown(false)
      }
    }

    // Add event listener when dropdown is open
    if (showItemsPerPageDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showItemsPerPageDropdown, setShowItemsPerPageDropdown])

  // Keep track of the multiplier index when changing cards per row
  const handleCardsPerRowChange = (newCardsPerRow: number) => {
    // Calculate current multiplier
    const currentMultiplier = Math.round(productsPerPage / cardsPerRow)

    // Set new products per page maintaining the same multiplier
    setProductsPerPage(newCardsPerRow * currentMultiplier)
    setCardsPerRow(newCardsPerRow)
  }

  return (
    <div className="flex justify-between items-center mt-4">
      {/* Left side - pagination controls - only show if more than one page */}
      {totalPages > 1 ? (
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
            <>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                className={`h-8 w-8 rounded-full p-0 ${
                  currentPage === 1 ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                }`}
                onClick={() => paginate(1)}
              >
                1
              </Button>

              {currentPage > 3 && <span className="px-2 text-zinc-500">...</span>}

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

              {currentPage < totalPages - 2 && <span className="px-2 text-zinc-500">...</span>}

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
      ) : (
        <div></div>
      )}

      {/* Right side - cards per row and items per page controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Cards per row:</span>
          <div className="flex">
            {[3, 4].map((val) => (
              <Button
                key={val}
                variant={cardsPerRow === val ? "default" : "outlineWithOut"}
                size="icon"
                className={`h-8 w-8 ${
                  val === 3 ? "rounded-l-md rounded-r-none" : "rounded-l-none rounded-r-md"
                } ${cardsPerRow === val ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"}`}
                onClick={() => handleCardsPerRowChange(val)}
              >
                <span className="text-xs">{val}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Items per page:</span>
          <div className="relative" ref={dropdownRef}>
            <Button
              variant={showItemsPerPageDropdown ? "default" : "default"}
              className={`h-8 border-zinc-700 text-white`}
              onClick={() => {
                setShowItemsPerPageDropdown(!showItemsPerPageDropdown)
              }}
            >
              {productsPerPage}
              {showItemsPerPageDropdown ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : (
                <ChevronDown className="ml-1 h-3 w-3" />
              )}
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
                      paginate(1)
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
  )
}
