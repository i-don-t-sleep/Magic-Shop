"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { TagInputFixed, type TagItem } from "@/components/ui/tag-input"
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, -1])
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, -1])
  const [maxPriceValue, setMaxPriceValue] = useState(1000)
  const [maxQuantityValue, setMaxQuantityValue] = useState(100)
  const [defaultSort, setdefaultSort] = useState("id-desc")
  const [BINS, setBINS] = useState(80)

  // Selected filter tags
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([])

  // Pending filter tags (for the filter dialog)
  const [pendingFilterTags, setPendingFilterTags] = useState<string[]>([])

  // Flag to prevent infinite loops when updating price/quantity tags
  const [isUpdatingPriceTags, setIsUpdatingPriceTags] = useState(false)
  const [isUpdatingQuantityTags, setIsUpdatingQuantityTags] = useState(false)

  // Histogram data
  const [priceHistogram, setPriceHistogram] = useState<HistogramData | null>(null)
  const [quantityHistogram, setQuantityHistogram] = useState<HistogramData | null>(null)
  const [loadingHistograms, setLoadingHistograms] = useState(false)

  // ฟังก์ชันสำหรับปัดเศษให้เป็นจำนวนเต็ม
  const roundToInteger = (num: number): number => {
    return Math.round(num)
  }

  // Create a unified list of all filter options
  const allFilterOptions = useMemo(() => {
  const sortOptions = [
    { value: "sort:price-asc", label: "Price: Low to High", type: "sort", typeLabel: "Sort By", color: "#be123c" },
    { value: "sort:price-desc", label: "Price: High to Low", type: "sort", typeLabel: "Sort By", color: "#be123c" },
    { value: "sort:quantity-asc", label: "Quantity: Low to High", type: "sort", typeLabel: "Sort By", color: "#be123c" },
    { value: "sort:quantity-desc", label: "Quantity: High to Low", type: "sort", typeLabel: "Sort By", color: "#be123c" },
    { value: "sort:id-desc", label: "Newest First", type: "sort", typeLabel: "Sort By", color: "#be123c" },
    { value: "sort:id-asc", label: "Oldest First", type: "sort", typeLabel: "Sort By", color: "#be123c" },
  ].filter(option => option.value !== `sort:${defaultSort}`)  // ลบตัวที่ตรงกับ defaultSort

  return [
    ...categoryEnum.map((category) => ({
      value: `category:${category}`,
      label: category,
      type: "category",
      typeLabel: "Category",
      color: "#4f46e5",
    })),
    ...publisherNames.map((publisher) => ({
      value: `publisher:${publisher}`,
      label: publisher,
      type: "publisher",
      typeLabel: "Publisher",
      color: "#0891b2",
    })),
    ...statusEnum.map((status) => ({
      value: `status:${status}`,
      label: status,
      type: "status",
      typeLabel: "Status",
      color: "#059669",
    })),
    ...sortOptions, // รวมที่เหลือ
  ] as TagItem[]
}, [categoryEnum, publisherNames, statusEnum, defaultSort])

  // Helper function to extract filter values from tags
  const extractFiltersFromTags = (tags: string[]): FilterState => {
    const filters: FilterState = {
      categories: [],
      publishers: [],
      minPrice: "0.00",
      maxPrice: "",
      minQuantity: "0",
      maxQuantity: "",
      statuses: [],
      sort: defaultSort, // Default sort
    }

    tags.forEach((tag) => {
      const [type, value] = tag.split(":")

      switch (type) {
        case "category":
          filters.categories.push(value)
          break
        case "publisher":
          filters.publishers.push(value)
          break
        case "status":
          filters.statuses.push(value)
          break
        case "sort":
          filters.sort = value
          break
        case "price-min":
          filters.minPrice = value
          break
        case "price-max":
          filters.maxPrice = value
          break
        case "quantity-min":
          filters.minQuantity = value
          break
        case "quantity-max":
          filters.maxQuantity = value
          break
      }
    })

    return filters
  }

  // Update price range tags
  useEffect(() => {
    if (showFilters && !isUpdatingPriceTags && priceHistogram) {
      setIsUpdatingPriceTags(true)

      // Get current price min/max tags
      const currentMinTag = pendingFilterTags.find((tag) => tag.startsWith("price-min:"))
      const currentMaxTag = pendingFilterTags.find((tag) => tag.startsWith("price-max:"))

      // Get current values from tags
      const currentMinValue = currentMinTag ? Number(currentMinTag.split(":")[1]) : null
      const currentMaxValue = currentMaxTag ? Number(currentMaxTag.split(":")[1]) : null

      // Only update tags if the slider values are different from current tag values
      const needsMinUpdate =
        priceRange[0] >= priceHistogram.min && (currentMinValue === null || priceRange[0] !== currentMinValue)

      const needsMaxUpdate =
        priceRange[1] <= priceHistogram.max && (currentMaxValue === null || priceRange[1] !== currentMaxValue)

      if (needsMinUpdate || needsMaxUpdate) {
        // Remove existing price tags
        const tagsWithoutPrice = pendingFilterTags.filter(
          (tag) => !tag.startsWith("price-min:") && !tag.startsWith("price-max:"),
        )

        // Add new price tags if values are set
        const newTags = [...tagsWithoutPrice]

        if (needsMinUpdate) {
          newTags.push(`price-min:${priceRange[0]}`)
        }

        if (needsMaxUpdate) {
          newTags.push(`price-max:${priceRange[1]}`)
        }

        setPendingFilterTags(newTags)
      }

      setIsUpdatingPriceTags(false)
    }
  }, [priceRange, priceHistogram, showFilters])

  // Update quantity range tags
  useEffect(() => {
    if (showFilters && !isUpdatingQuantityTags && quantityHistogram) {
      setIsUpdatingQuantityTags(true)

      // Get current quantity min/max tags
      const currentMinTag = pendingFilterTags.find((tag) => tag.startsWith("quantity-min:"))
      const currentMaxTag = pendingFilterTags.find((tag) => tag.startsWith("quantity-max:"))

      // Get current values from tags
      const currentMinValue = currentMinTag ? Number(currentMinTag.split(":")[1]) : null
      const currentMaxValue = currentMaxTag ? Number(currentMaxTag.split(":")[1]) : null

      // Only update tags if the slider values are different from current tag values
      const needsMinUpdate =
        quantityRange[0] > quantityHistogram.min && (currentMinValue === null || quantityRange[0] !== currentMinValue)

      const needsMaxUpdate =
        quantityRange[1] < quantityHistogram.max && (currentMaxValue === null || quantityRange[1] !== currentMaxValue)

      if (needsMinUpdate || needsMaxUpdate) {
        // Remove existing quantity tags
        const tagsWithoutQuantity = pendingFilterTags.filter(
          (tag) => !tag.startsWith("quantity-min:") && !tag.startsWith("quantity-max:"),
        )

        // Add new quantity tags if values are set
        const newTags = [...tagsWithoutQuantity]

        if (needsMinUpdate) {
          newTags.push(`quantity-min:${quantityRange[0]}`)
        }

        if (needsMaxUpdate) {
          newTags.push(`quantity-max:${quantityRange[1]}`)
        }

        setPendingFilterTags(newTags)
      }

      setIsUpdatingQuantityTags(false)
    }
  }, [quantityRange, quantityHistogram, showFilters])

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
      setPriceRange([data.minPrice, data.maxPrice || 1000])
      setQuantityRange([data.minQuantity, data.maxQuantity || 100])
    } else {
      console.error("Failed to fetch metadata")
    }
  }

  const fetchHistograms = async () => {
    setLoadingHistograms(true)
    try {
      // Fetch price histogram
      const priceRes = await fetch(`/api/products/histogram?field=price&bins=${BINS}`)
      const priceData = await priceRes.json()

      if (priceData.success) {
        setPriceHistogram(priceData.histogram)
        // Update price range with actual min/max from data
        setPriceRange([priceData.histogram.min, priceData.histogram.max])
      }

      // Fetch quantity histogram
      const quantityRes = await fetch(`/api/products/histogram?field=quantity&bins=${BINS}`)
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
    sort: "id-desc",
  })

  // Update filters when selected tags change
  useEffect(() => {
    const newFilters = extractFiltersFromTags(selectedFilterTags)
    setFilters(newFilters)
  }, [selectedFilterTags])

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

    // Reset ranges to histogram min/max
    if (priceHistogram) {
      setPriceRange([priceHistogram.min, priceHistogram.max])
    }

    if (quantityHistogram) {
      setQuantityRange([quantityHistogram.min, quantityHistogram.max])
    }
  }

  // Apply filters
  const applyFilters = () => {
    setSelectedFilterTags(pendingFilterTags)
    setShowFilters(false)
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
      console.log(data)
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
  }, [cardsPerRow, IsFirstfetch, productsPerPage])

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Check if any filters are active
  const hasActiveFilters = selectedFilterTags.length > 0

  // Initialize pending filters when opening the filter dialog
  useEffect(() => {
    if (showFilters) {
      setPendingFilterTags(selectedFilterTags)
    }
  }, [showFilters, selectedFilterTags])

  // Handle adding a filter tag
  const handleAddFilterTag = (value: string) => {
    // For sort tags, remove any existing sort tag first
    if (value.startsWith("sort:")) {
      const newTags = pendingFilterTags.filter((tag) => !tag.startsWith("sort:"))
      setPendingFilterTags([...newTags, value])
    } else {
      setPendingFilterTags([...pendingFilterTags, value])
    }
  }

  // Handle removing a filter tag
  const handleRemoveFilterTag = (value: string) => {
    setPendingFilterTags(pendingFilterTags.filter((tag) => tag !== value))

    // Reset price/quantity ranges if those tags are removed
    if (value.startsWith("price-min:") && priceHistogram) {
      setPriceRange([priceHistogram.min, priceRange[1]])
    } else if (value.startsWith("price-max:") && priceHistogram) {
      setPriceRange([priceRange[0], priceHistogram.max])
    } else if (value.startsWith("quantity-min:") && quantityHistogram) {
      setQuantityRange([quantityHistogram.min, quantityRange[1]])
    } else if (value.startsWith("quantity-max:") && quantityHistogram) {
      setQuantityRange([quantityRange[0], quantityHistogram.max])
    }
  }

  // แก้ไขส่วนของ handler functions ใน ProductsPage component เพื่อให้ Spinbox อัพเดทค่า Slider

  // แก้ไขฟังก์ชัน handleMinPriceChange
  const handleMinPriceChange = (newMin: number) => {

    if (newMin === priceRange[0]) return

    // อัพเดทค่า priceRange โดยตรง
    setPriceRange([newMin, priceRange[1]])

    // อัพเดทค่า tag ด้วย
    const tagsWithoutMinPrice = pendingFilterTags.filter((tag) => !tag.startsWith("price-min:"))

    if (priceHistogram && newMin > priceHistogram.min) {
      setPendingFilterTags([...tagsWithoutMinPrice, `price-min:${newMin}`])
    } else {
      setPendingFilterTags(tagsWithoutMinPrice)
    }
  }

  // แก้ไขฟังก์ชัน handleMaxPriceChange
  const handleMaxPriceChange = (newMax: number) => {
    // ปัดเศษให้เป็นจำนวนเต็ม

    if (newMax === priceRange[1]) return

    // อัพเดทค่า priceRange โดยตรง
    setPriceRange([priceRange[0], newMax])

    // อัพเดทค่า tag ด้วย
    const tagsWithoutMaxPrice = pendingFilterTags.filter((tag) => !tag.startsWith("price-max:"))

    if (priceHistogram && newMax < priceHistogram.max) {
      setPendingFilterTags([...tagsWithoutMaxPrice, `price-max:${newMax}`])
    } else {
      setPendingFilterTags(tagsWithoutMaxPrice)
    }
  }

  // แก้ไขฟังก์ชัน handleMinQtyChange
  const handleMinQtyChange = (newMin: number) => {
    // ปัดเศษให้เป็นจำนวนเต็ม
    newMin = roundToInteger(newMin)

    if (newMin === quantityRange[0]) return

    // อัพเดทค่า quantityRange โดยตรง
    setQuantityRange([newMin, quantityRange[1]])

    // อัพเดทค่า tag ด้วย
    const tagsWithoutMinQty = pendingFilterTags.filter((tag) => !tag.startsWith("quantity-min:"))

    if (quantityHistogram && newMin > quantityHistogram.min) {
      setPendingFilterTags([...tagsWithoutMinQty, `quantity-min:${newMin}`])
    } else {
      setPendingFilterTags(tagsWithoutMinQty)
    }
  }

  // แก้ไขฟังก์ชัน handleMaxQtyChange
  const handleMaxQtyChange = (newMax: number) => {
    // ปัดเศษให้เป็นจำนวนเต็ม
    newMax = roundToInteger(newMax)

    if (newMax === quantityRange[1]) return

    // อัพเดทค่า quantityRange โดยตรง
    setQuantityRange([quantityRange[0], newMax])

    // อัพเดทค่า tag ด้วย
    const tagsWithoutMaxQty = pendingFilterTags.filter((tag) => !tag.startsWith("quantity-max:"))

    if (quantityHistogram && newMax < quantityHistogram.max) {
      setPendingFilterTags([...tagsWithoutMaxQty, `quantity-max:${newMax}`])
    } else {
      setPendingFilterTags(tagsWithoutMaxQty)
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
              }}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter
              {hasActiveFilters && (
                <span className="ml-2 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {selectedFilterTags.length}
                </span>
              )}
            </Button>
            <Link href="/SuperAdmins/products/add/">
              <Button variant="outline" className="border-zinc-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Dialog */}
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogContent className="sm:max-w-[500px] bg-zinc-800 border-zinc-700 p-0 overflow-hidden">
            <ScrollArea className="max-h-[90vh] ">
              <div className="p-6">
                <DialogHeader className="mb-6 flex items-center justify-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-0.5 bg-white rounded-full"></div>
                    <div className="w-4 h-0.5 bg-white rounded-full"></div>
                    <div className="w-6 h-0.5 bg-white rounded-full"></div>
                  </div>
                  <DialogTitle className="text-3xl font-semibold text-white">Filter Products</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Unified Tag Input for all filters */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-white">Filters</h3>
                    <TagInputFixed
                      items={allFilterOptions}
                      selectedItems={pendingFilterTags}
                      onItemSelect={handleAddFilterTag}
                      onItemRemove={handleRemoveFilterTag}
                      placeholder="Add filters..."
                      fieldWidth="100%"
                      width="100%" // Make dropdown width match the input width
                    />
                  </div>

                  {/* Price Range */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium text-white">Price Range</h3>
                      <p className="text-zinc-400 text-sm">
                        The average price is ${priceHistogram?.average.toFixed(2) || "loading..."}
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
                        // ปัดเศษให้เป็นจำนวนเต็ม
                        const roundedValue: [number, number] = [value[0], value[1]]
                        setPriceRange(roundedValue)
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
                          decimalPoint={2} 
                          onChange={handleMinPriceChange}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-bold pr-1"></div>
                        <div className="flex-1">
                          <label className="text-sm text-zinc-400 mb-1 block">Max Price</label>
                          <Spinbox
                            value={priceRange[1]}
                            min={priceHistogram?.min || 0}
                            max={priceHistogram?.max || maxPriceValue}
                            step={1}
                            decimalPoint={2} 
                            onChange={handleMaxPriceChange}
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
                        The average quantity is {quantityHistogram?.average.toFixed(0) || "loading..."}
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
                        // ปัดเศษให้เป็นจำนวนเต็ม
                        const roundedValue: [number, number] = [value[0], value[1]]
                        setQuantityRange(roundedValue)
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
                          onChange={handleMinQtyChange}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-bold text-white pr-1"></div>
                        <div className="flex-1">
                          <label className="text-sm text-zinc-400 mb-1 block">Max Quantity</label>
                          <Spinbox
                            value={quantityRange[1]}
                            min={quantityHistogram?.min || 0}
                            max={quantityHistogram?.max || maxQuantityValue}
                            step={1}
                            onChange={handleMaxQtyChange}
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
                    <Button className="flex-1 bg-magic-red hover:bg-red-700 border-0" onClick={applyFilters}>
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
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
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-white"
                      onClick={() => {
                        setSelectedFilterTags([])
                        if (priceHistogram) {
                          setPriceRange([priceHistogram.min, priceHistogram.max])
                        }
                        if (quantityHistogram) {
                          setQuantityRange([quantityHistogram.min, quantityHistogram.max])
                        }
                      }}
                    >
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
