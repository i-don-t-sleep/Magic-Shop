"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { LoadingComp } from "@/components/loading-comp"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import SuggestSearchSpan, { type ComboboxItem } from "@/components/newcomp/SuggestSearchSpan"
import { Histogram } from "@/components/ui/histogram"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UnifiedTagInput, type FilterOption, type FilterTag } from "@/components/ui/uniified-tag-input"
import { Spinbox } from "@/components/ui/spinbox"

type Product = {
  name: string
  price: string
  quantity: number
  primaryImage: string
  href: string
}

type FilterState = {
  categories: string[]
  publishers: string[]
  minPrice: string
  maxPrice: string
  minQuantity: string
  maxQuantity: string
  statuses: string[]
  sort: string
}

type HistogramData = {
  bins: number[]
  counts: number[]
  min: number
  max: number
  average: number
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(3)
  const [IsFirstfetch, setIsFirstfetch] = useState(false)
  const [cardsPerRow, setCardsPerRow] = useState(3)
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isUpdateRows, setisUpdateRows] = useState(false)
  const [isUpdateItems, setisUpdateItems] = useState(false)
  const [categoryEnum, setCategoryEnum] = useState<string[]>([])
  const [statusEnum, setStatusEnum] = useState<string[]>([])
  const [publisherNames, setPublisherNames] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 100])
  const [maxPriceValue, setMaxPriceValue] = useState(1000)
  const [maxQuantityValue, setMaxQuantityValue] = useState(100)

  // Histogram data
  const [priceHistogram, setPriceHistogram] = useState<HistogramData | null>(null)
  const [quantityHistogram, setQuantityHistogram] = useState<HistogramData | null>(null)
  const [loadingHistograms, setLoadingHistograms] = useState(false)

  // Filter tags
  const [filterTags, setFilterTags] = useState<FilterTag[]>([])
  const [pendingFilterTags, setPendingFilterTags] = useState<FilterTag[]>([])


  const fetchMetadata = async () => {
    const res = await fetch("/api/products/meta")
    const data = await res.json()
    if (data.success) {
      setCategoryEnum(data.categoryEnum)
      setStatusEnum(data.statusEnum)
      setPublisherNames(data.publishers)

      // Get max price and quantity for sliders
      if (data.maxPrice) setMaxPriceValue(data.maxPrice)
      if (data.maxQuantity) setMaxQuantityValue(data.maxQuantity)

      // Initialize ranges
      setPriceRange([0, data.maxPrice || 1000])
      setQuantityRange([0, data.maxQuantity || 100])
    } else {
      console.error("Failed to fetch metadata")
    }
  }

  const fetchHistograms = async () => {
    setLoadingHistograms(true)
    const bins = 90
    try {
      // Fetch price histogram
      const priceRes = await fetch(`/api/products/histogram?field=price&bins=${bins}`)
      const priceData = await priceRes.json()

      if (priceData.success) {
        setPriceHistogram(priceData.histogram)
        // Update price range with actual min/max from data
        setPriceRange([priceData.histogram.min, priceData.histogram.max])
      }

      // Fetch quantity histogram
      const quantityRes = await fetch(`/api/products/histogram?field=quantity&bins=${bins}`)
      const quantityData = await quantityRes.json()

      if (quantityData.success) {
        setQuantityHistogram(quantityData.histogram)
        // Update quantity range with actual min/max from data
        setQuantityRange([quantityData.histogram.min, quantityData.histogram.max])
      }
    } catch (error) {
      console.error("Error fetching histograms:", error)
    } finally {
      setLoadingHistograms(false)
    }
  }

  // after add product, update product
  useEffect(() => {
    fetchMetadata()
    fetchHistograms()
  }, [])

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    publishers: [],
    minPrice: "",
    maxPrice: "",
    minQuantity: "",
    maxQuantity: "",
    statuses: [],
    sort: "price-asc",
  })
  const [pendingFilters, setPendingFilters] = useState<FilterState>(filters)


  // Convert filter tags to filter state
  const updateFiltersFromTags = (tags: FilterTag[]) => {
    const newFilters: FilterState = {
      categories: [],
      publishers: [],
      minPrice: "",
      maxPrice: "",
      minQuantity: "",
      maxQuantity: "",
      statuses: [],
      sort: "price-asc",
    }

    tags.forEach((tag) => {
      switch (tag.type) {
        case "category":
          newFilters.categories.push(tag.value)
          break
        case "publisher":
          newFilters.publishers.push(tag.value)
          break
        case "status":
          newFilters.statuses.push(tag.value)
          break
        case "sort":
          newFilters.sort = tag.value
          break
        case "price-min":
          newFilters.minPrice = tag.value
          break
        case "price-max":
          newFilters.maxPrice = tag.value
          break
        case "quantity-min":
          newFilters.minQuantity = tag.value
          break
        case "quantity-max":
          newFilters.maxQuantity = tag.value
          break
      }
    })

    return newFilters
  }

  // Update filter tags when price/quantity ranges change
  useEffect(() => {
    if (showFilters) {
      // Remove existing price tags
      const tagsWithoutPrice = pendingFilterTags.filter((tag) => tag.type !== "price-min" && tag.type !== "price-max")

      // Add new price tags if values are set
      const newTags = [...tagsWithoutPrice]

      if (priceRange[0] > (priceHistogram?.min || 0)) {
        newTags.push({
          type: "price-min",
          typeLabel: "Min Price",
          value: priceRange[0].toString(),
          label: `$${priceRange[0]}`,
        })
      }

      if (priceRange[1] < (priceHistogram?.max || maxPriceValue)) {
        newTags.push({
          type: "price-max",
          typeLabel: "Max Price",
          value: priceRange[1].toString(),
          label: `$${priceRange[1]}`,
        })
      }

      setPendingFilterTags(newTags)
      setPendingFilters(updateFiltersFromTags(newTags))
    }
  }, [priceRange, priceHistogram])

  // Update filter tags when quantity ranges change
  useEffect(() => {
    if (showFilters) {
      // Remove existing quantity tags
      const tagsWithoutQuantity = pendingFilterTags.filter(
        (tag) => tag.type !== "quantity-min" && tag.type !== "quantity-max",
      )

      // Add new quantity tags if values are set
      const newTags = [...tagsWithoutQuantity]

      if (quantityRange[0] > (quantityHistogram?.min || 0)) {
        newTags.push({
          type: "quantity-min",
          typeLabel: "Min Quantity",
          value: quantityRange[0].toString(),
          label: quantityRange[0].toString(),
        })
      }

      if (quantityRange[1] < (quantityHistogram?.max || maxQuantityValue)) {
        newTags.push({
          type: "quantity-max",
          typeLabel: "Max Quantity",
          value: quantityRange[1].toString(),
          label: quantityRange[1].toString(),
        })
      }

      setPendingFilterTags(newTags)
      setPendingFilters(updateFiltersFromTags(newTags))
    }
  }, [quantityRange, quantityHistogram])

  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / productsPerPage)

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    })
  }

  // Generate items per page options based on cards per row
  const getItemsPerPageOptions = () => {
    const baseMultiple = cardsPerRow
    const multipliers = [25, 10, 8, 4, 2, 1]
    return multipliers.map((multiplier) => baseMultiple * multiplier)
  }

  // Reset filters
  const resetFilters = () => {
    setPendingFilterTags([])
    setPendingFilters({
      categories: [],
      publishers: [],
      minPrice: "",
      maxPrice: "",
      minQuantity: "",
      maxQuantity: "",
      statuses: [],
      sort: "price-asc",
    })

    // Reset ranges to histogram min/max
    if (priceHistogram) {
      setPriceRange([priceHistogram.min, priceHistogram.max])
    }

    if (quantityHistogram) {
      setQuantityRange([quantityHistogram.min, quantityHistogram.max])
    }
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
      if (filters.categories.length > 0) {
        filters.categories.forEach((category) => {
          queryParams.append("category", category)
        })
      }

      if (filters.publishers.length > 0) {
        filters.publishers.forEach((publisher) => {
          queryParams.append("publisher", publisher)
        })
      }

      if (filters.minPrice) {
        queryParams.append("minPrice", filters.minPrice)
      }

      if (filters.maxPrice) {
        queryParams.append("maxPrice", filters.maxPrice)
      }

      if (filters.minQuantity) {
        queryParams.append("minQuantity", filters.minQuantity)
      }

      if (filters.maxQuantity) {
        queryParams.append("maxQuantity", filters.maxQuantity)
      }

      if (filters.statuses.length > 0) {
        filters.statuses.forEach((status) => {
          queryParams.append("status", status)
        })
      }

      const response = await fetch(`/api/products?${queryParams.toString()}`)
      const data = await response.json()
      alert(`/api/products?${queryParams.toString()}`)

      setProducts(data.data)
      setTotalRecords(data.total)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
      setisUpdateRows(false)
      setisUpdateItems(false)
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
    if (!showFilters) fetchProducts()
  }, [currentPage, productsPerPage, searchQuery, filters, showFilters])

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
  const hasActiveFilters = filterTags.length > 0

  // Sort options
  const sortOptions = [
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "quantity-asc", label: "Quantity: Low to High" },
    { value: "quantity-desc", label: "Quantity: High to Low" },
    { value: "id-desc", label: "Newest First" },
    { value: "id-asc", label: "Oldest First" },
  ]

  // Create filter options for the unified tag input
  const filterOptions: FilterOption[] = [
    // Category options
    ...categoryEnum.map((category) => ({
      type: "category",
      typeLabel: "Category",
      value: category,
      label: category,
    })),

    // Publisher options
    ...publisherNames.map((publisher) => ({
      type: "publisher",
      typeLabel: "Publisher",
      value: publisher,
      label: publisher,
    })),

    // Status options
    ...statusEnum.map((status) => ({
      type: "status",
      typeLabel: "Status",
      value: status,
      label: status,
    })),

    // Sort options
    ...sortOptions.map((option) => ({
      type: "sort",
      typeLabel: "Sort By",
      value: option.value,
      label: option.label,
    })),
  ]

  // Handle adding a tag
  const handleAddTag = (tag: FilterTag) => {
    // For sort type, remove any existing sort tags first
    let newTags = [...pendingFilterTags]

    if (tag.type === "sort") {
      newTags = newTags.filter((t) => t.type !== "sort")
    }

    // Add the new tag
    newTags.push(tag)

    // Update pending filters
    setPendingFilterTags(newTags)
    setPendingFilters(updateFiltersFromTags(newTags))
  }

  // Handle removing a tag
  const handleRemoveTag = (tag: FilterTag) => {
    const newTags = pendingFilterTags.filter((t) => !(t.type === tag.type && t.value === tag.value))

    setPendingFilterTags(newTags)
    setPendingFilters(updateFiltersFromTags(newTags))

    // Reset price/quantity ranges if those tags are removed
    if (tag.type === "price-min" || tag.type === "price-max") {
      setPriceRange([
        tag.type === "price-min" ? priceHistogram?.min || 0 : priceRange[0],
        tag.type === "price-max" ? priceHistogram?.max || maxPriceValue : priceRange[1],
      ])
    }

    if (tag.type === "quantity-min" || tag.type === "quantity-max") {
      setQuantityRange([
        tag.type === "quantity-min" ? quantityHistogram?.min || 0 : quantityRange[0],
        tag.type === "quantity-max" ? quantityHistogram?.max || maxQuantityValue : quantityRange[1],
      ])
    }
  }

  // Add this right before the return statement in ProductsPage
  return (
    <>
      <div className="pt-3 flex flex-col h-full overflow-hidden">
        {/* Header with search and filters */}
        <div className="px-6 pb-3 flex justify-between items-center">
          <div className="w-full max-w-md">
            <SuggestSearchSpan<ComboboxItem>
              items={products}
              value={searchQuery}
              setValue={setSearchQuery}
              placeholder="Search products..."
              className="z-10"
              maxVisible={1}
              enableSuggest={true}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`border-zinc-700 text-white ${hasActiveFilters ? "bg-magic-red" : ""}`}
              onClick={() => {
                setShowFilters(true)
                setPendingFilterTags(filterTags)
                setPriceRange([
                  filters.minPrice ? Number.parseInt(filters.minPrice) : priceHistogram?.min || 0,
                  filters.maxPrice ? Number.parseInt(filters.maxPrice) : priceHistogram?.max || maxPriceValue,
                ])
                setQuantityRange([
                  filters.minQuantity ? Number.parseInt(filters.minQuantity) : quantityHistogram?.min || 0,
                  filters.maxQuantity
                    ? Number.parseInt(filters.maxQuantity)
                    : quantityHistogram?.max || maxQuantityValue,
                ])
              }}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter
              {hasActiveFilters && (
                <span className="ml-2 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {filterTags.length}
                </span>
              )}
            </Button>
            <Link href="/SuperAdmins/products/add-movement">
              <Button variant="outline" className="border-zinc-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Dialog */}
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogContent className="sm:max-w-[500px] bg-gradient-to-t from-magic-iron-1 from-50% to-magic-iron-2 to-100% border-zinc-700 p-0 overflow-hidden">  
            <DialogHeader className="max-h-[20vh] pt-4 flex items-center justify-center bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% border-zinc-700">
              <DialogTitle className="flex text-2xl font-semibold text-white"> <SlidersHorizontal className="h-7 w-7 mr-2 text-white" /> Filter Products</DialogTitle>
              <div className="w-full h-px bg-zinc-700" />
            </DialogHeader>
            <div className="max-h-[60vh] overflow-auto">
              <div className="pt-6 pb-6 px-6">
                <div className="space-y-6">
                  {/* Unified Tag Input */}
                  <div className="space-y-2">
                  <h3 className="text-xl font-medium text-white">Filters</h3>
                    <UnifiedTagInput
                      options={filterOptions}
                      selectedTags={pendingFilterTags.filter(
                        (tag) =>
                          tag.type !== "price-min" &&
                          tag.type !== "price-max" &&
                          tag.type !== "quantity-min" &&
                          tag.type !== "quantity-max",
                      )}
                      onTagSelect={handleAddTag}
                      onTagRemove={handleRemoveTag}
                      placeholder="Add filters..."
                      maxHeight="200px"
                    />
                  </div>

                  {/* Price Range */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium text-white">Price Range</h3>
                      <p className="text-zinc-400 text-sm">
                        The average price is {priceHistogram && (priceHistogram.average)}
                      </p>
                    </div>

                    {/* Price Histogram */}
                    {loadingHistograms ? (
                      <div className="h-20 flex items-center justify-center">
                        <div className="animate-pulse bg-zinc-700 h-16 w-full rounded"></div>
                      </div>
                    ) : priceHistogram ? (
                      <Histogram
                        data={priceHistogram.counts}
                        bins={priceHistogram.bins}
                        min={priceHistogram.min}
                        max={priceHistogram.max}
                        selectedRange={priceRange}
                        colorStart="#7f1d1d"
                        colorEnd="#ef4444"
                      />
                    ) : (
                      <div className="h-20 flex items-center justify-center text-zinc-400">No price data available</div>
                    )}

                    <Slider
                      value={priceRange}
                      min={priceHistogram?.min || 0}
                      max={priceHistogram?.max || maxPriceValue}
                      step={1}
                      onValueChange={(value) => {
                        setPriceRange(value as [number, number])
                        setPendingFilters((prev) => ({
                          ...prev,
                          minPrice: value[0].toString(),
                          maxPrice: value[1].toString(),
                        }))
                      }}
                      className="my-4"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-zinc-400 mb-1 block">Min Price</label>
                        <Spinbox
                          value={priceRange[0]}
                          min={priceHistogram?.min || 0}
                          max={priceHistogram?.max || maxPriceValue}
                          step={1}
                          onChange={(e) => {
                            const value = Number(e.toFixed(2))
                            setPriceRange([value, priceRange[1]])
                            setPendingFilters((prev) => ({
                              ...prev,
                              minPrice: value.toString(),
                            }))
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="text-sm text-zinc-400 mb-1 block">Max Price</label>
                          <Spinbox
                            value={priceRange[1]}
                            min={priceHistogram?.min || 0}
                            max={priceHistogram?.max || maxPriceValue}
                            step={1}
                            onChange={(e) => {
                              const value = Number(e.toFixed(2))
                              setPriceRange([value, priceRange[0]])
                              setPendingFilters((prev) => ({
                                ...prev,
                                maxPrice: value.toString(),
                              }))
                            }}
                         />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Range */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium text-white">Quantity Range</h3>
                      <p className="text-zinc-400 text-sm">
                        The average quantity is {quantityHistogram && (quantityHistogram.average)}
                      </p>
                    </div>

                    {/* Quantity Histogram */}
                    {loadingHistograms ? (
                      <div className="h-20 flex items-center justify-center">
                        <div className="animate-pulse bg-zinc-700 h-16 w-full rounded"></div>
                      </div>
                    ) : quantityHistogram ? (
                      <Histogram
                        data={quantityHistogram.counts}
                        bins={quantityHistogram.bins}
                        min={quantityHistogram.min}
                        max={quantityHistogram.max}
                        selectedRange={quantityRange}
                        colorStart="#7f1d1d"
                        colorEnd="#ef4444"
                      />
                    ) : (
                      <div className="h-20 flex items-center justify-center text-zinc-400">
                        No quantity data available
                      </div>
                    )}

                    <Slider
                      value={quantityRange}
                      min={quantityHistogram?.min || 0}
                      max={quantityHistogram?.max || maxQuantityValue}
                      step={1}
                      onValueChange={(value) => {
                        setQuantityRange(value as [number, number])
                        setPendingFilters((prev) => ({
                          ...prev,
                          minQuantity: value[0].toString(),
                          maxQuantity: value[1].toString(),
                        }))
                      }}
                      className="my-4"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-zinc-400 mb-1 block">Min Quantity</label>
                        <Spinbox
                            value={quantityRange[0]}
                            min={quantityHistogram?.min || 0}
                            max={quantityHistogram?.max || maxQuantityValue}
                            step={1}
                            onChange={(e) => {
                              const value = Number(e)
                              setPriceRange([value, quantityRange[0]])
                              setPendingFilters((prev) => ({
                                ...prev,
                                maxQuantity: value.toString(),
                              }))
                            }}
                         />
                        
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="text-sm text-zinc-400 mb-1 block">Max Quantity</label>
                          <Spinbox
                            value={quantityRange[1]}
                            min={quantityHistogram?.min || 0}
                            max={quantityHistogram?.max || maxQuantityValue}
                            step={1}
                            onChange={(e) => {
                              const value = Number(e)
                              setPriceRange([value, quantityRange[1]])
                              setPendingFilters((prev) => ({
                                ...prev,
                                minQuantity: value.toString(),
                              }))
                            }}
                         />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white border-0"
                    >
                      Reset Filter
                    </Button>
                    <Button
                      className="flex-1 bg-magic-red hover:bg-red-700 border-0"
                      onClick={() => {
                        setShowFilters(false)
                        setFilterTags(pendingFilterTags)
                        setFilters(pendingFilters)
                        setCurrentPage(1)
                      }}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Products grid */}
        <div className={`flex-1 overflow-y-auto ${isOverflowing ? "pl-6 pr-4" : "px-6"}`} ref={containerRef}>
          {loading ? (
            <LoadingComp />
          ) : products.length > 0 ? (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                cardsPerRow === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
              } gap-6`}
            >
              {products.slice(0, productsPerPage).map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <div className="text-2xl font-bold text-zinc-500 mb-4">No products found</div>
              <div className="text-zinc-400 mb-8">Try adjusting your search or filter criteria</div>
              {
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
                  {!showFilters && hasActiveFilters && (
                    <Button variant="outline" className="border-zinc-700 text-white" onClick={resetFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              }
            </div>
          )}

          {/* Pagination for overflow content */}
          {!isUpdateItems && products.length > 0 && isOverflowing && (
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
              containerRef={containerRef}
              isUpdateRows={isUpdateRows}
              setisUpdateRows={setisUpdateRows}
              isUpdateItems={isUpdateItems}
              setisUpdateItems={setisUpdateItems}
            />
          )}
        </div>

        {/* Pagination for non-overflow content */}
        {(!isUpdateItems || products.length <= cardsPerRow) && products.length > 0 && !isOverflowing && (
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
              containerRef={containerRef}
              isUpdateRows={isUpdateRows}
              setisUpdateRows={setisUpdateRows}
              isUpdateItems={isUpdateItems}
              setisUpdateItems={setisUpdateItems}
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
  containerRef: React.RefObject<HTMLDivElement | null>
  isUpdateRows: boolean
  setisUpdateRows: (val: boolean) => void
  isUpdateItems: boolean
  setisUpdateItems: (val: boolean) => void
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
  containerRef,
  isUpdateRows,
  setisUpdateRows,
  isUpdateItems,
  setisUpdateItems,
}: PaginationProps) {
  const [openCardPerRow, setOpenCardPerRow] = useState(false)
  // Keep track of the multiplier index when changing cards per row
  const handleCardsPerRowChange = (newCardsPerRow: number) => {
    // Calculate current multiplier
    const currentMultiplier = Math.round(productsPerPage / cardsPerRow)
    // Set new products per page maintaining the same multiplier
    setProductsPerPage(newCardsPerRow * currentMultiplier)
    setCardsPerRow(newCardsPerRow)
    paginate(1)
    if (newCardsPerRow != cardsPerRow) setisUpdateRows(true)
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    })
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
                    currentPage === totalPages ? "bg-red-600 hover:bg-red-300 border-red-600" : "border-zinc-700"
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
          <DropdownMenu open={openCardPerRow} onOpenChange={setOpenCardPerRow}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={openCardPerRow ? "outlineActive" : "outline"}
                className={`h-8 w-16 border-zinc-700 flex !justify-end items-center pr-2`}
              >
                {productsPerPage}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-950 border-zinc-800">
              {getItemsPerPageOptions().map((option) => (
                <DropdownMenuItem
                  key={option}
                  className={cn("cursor-pointer", productsPerPage === option && "bg-zinc-800")}
                  onClick={() => {
                    setProductsPerPage(option)
                    if (option != productsPerPage) {
                      setisUpdateItems(true)
                      setisUpdateRows(true)
                    }
                    paginate(1)
                  }}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
