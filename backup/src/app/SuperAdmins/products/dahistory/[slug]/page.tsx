import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, ArrowDown, ArrowUp, Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingComp } from "@/components/loading-comp"
import Image from "next/image"
import { format } from "date-fns"

interface ProductMovement {
  id: string
  productID: number
  warehouseID: string | null
  movementType: "IN" | "OUT"
  quantity: number
  reason: string
  movedAt: string
  adminName?: string
  adminType?: string
}

interface ProductDetails {
  id: number
  name: string
  price: string
  quantity: number
  publisherName: string
  imageUrl: string
}

export default function ProductHistoryPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [movements, setMovements] = useState<ProductMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMovements, setFilteredMovements] = useState<ProductMovement[]>([])
  const [filterType, setFilterType] = useState<"ALL" | "IN" | "OUT">("ALL")
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })

  // Extract product ID from slug
  const productId = React.use(params).slug.split("&pid=")[1]?.split("&")[0]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch product details
        const productResponse = await fetch(`/api/products/${params.slug}`)
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product details")
        }
        const productData = await productResponse.json()
        setProduct(productData)

        // Fetch movement history
        const movementsResponse = await fetch(`/api/products/history/${productId}`)
        if (!movementsResponse.ok) {
          throw new Error("Failed to fetch movement history")
        }
        const movementsData = await movementsResponse.json()
        setMovements(movementsData.movements)
        setFilteredMovements(movementsData.movements)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchData()
    }
  }, [productId, params.slug])

  // Apply filters
  useEffect(() => {
    if (!movements.length) return

    let filtered = [...movements]

    // Apply movement type filter
    if (filterType !== "ALL") {
      filtered = filtered.filter((movement) => movement.movementType === filterType)
    }

    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start)
      filtered = filtered.filter((movement) => new Date(movement.movedAt) >= startDate)
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999) // End of the day
      filtered = filtered.filter((movement) => new Date(movement.movedAt) <= endDate)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (movement) =>
          movement.reason.toLowerCase().includes(query) ||
          (movement.warehouseID && movement.warehouseID.toLowerCase().includes(query)) ||
          (movement.adminName && movement.adminName.toLowerCase().includes(query)),
      )
    }

    setFilteredMovements(filtered)
  }, [movements, filterType, dateRange, searchQuery])

  if (loading) {
    return <LoadingComp />
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Product Not Found</h2>
          <p className="mt-2 text-zinc-400">The product you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4" onClick={() => router.push("/SuperAdmins/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <div className="px-6 pb-3 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </button>
        <h1 className="text-2xl font-bold">Product Movement History</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      {/* Product Info Card */}
      <div className="px-6 mb-6">
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 relative rounded-lg overflow-hidden border border-zinc-700">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                    <div className="text-sm">
                      <span className="text-zinc-400">Price:</span> <span className="font-medium">{product.price}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-zinc-400">Current Stock:</span>{" "}
                      <span className={`font-medium ${product.quantity === 0 ? "text-red-500" : ""}`}>
                        {product.quantity} units
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-zinc-400">Publisher:</span>{" "}
                      <span className="font-medium">{product.publisherName}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-zinc-400">Status:</span>{" "}
                      <span className={`font-medium ${product.quantity === 0 ? "text-red-500" : "text-green-500"}`}>
                        {product.quantity === 0 ? "Out of Stock" : "Available"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 pb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={filterType === "ALL" ? "default" : "outline"}
            className={filterType === "ALL" ? "bg-zinc-700" : "border-zinc-700"}
            onClick={() => setFilterType("ALL")}
          >
            All
          </Button>
          <Button
            variant={filterType === "IN" ? "default" : "outline"}
            className={filterType === "IN" ? "bg-green-600" : "border-zinc-700"}
            onClick={() => setFilterType("IN")}
          >
            <ArrowDown className="mr-1 h-4 w-4" />
            In
          </Button>
          <Button
            variant={filterType === "OUT" ? "default" : "outline"}
            className={filterType === "OUT" ? "bg-red-600" : "border-zinc-700"}
            onClick={() => setFilterType("OUT")}
          >
            <ArrowUp className="mr-1 h-4 w-4" />
            Out
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by reason or location..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-zinc-700 text-white" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Date Filter
          </Button>
        </div>
      </div>

      {/* Date Filter Panel */}
      {showFilters && (
        <div className="px-6 pb-4">
          <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Filter by Date Range</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Start Date</label>
                <Input
                  type="date"
                  className="bg-zinc-800 border-zinc-700"
                  value={dateRange.start}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">End Date</label>
                <Input
                  type="date"
                  className="bg-zinc-800 border-zinc-700"
                  value={dateRange.end}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <Button variant="outline" size="sm" className="mr-2" onClick={() => setDateRange({ start: "", end: "" })}>
                Clear
              </Button>
              <Button size="sm" onClick={() => setShowFilters(false)}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Movement History Table */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {filteredMovements.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
            <Package className="h-12 w-12 mx-auto text-zinc-700 mb-3" />
            <h3 className="text-lg font-medium text-zinc-400">No movement records found</h3>
            <p className="text-zinc-500 mt-1">
              {movements.length > 0
                ? "Try adjusting your filters to see more results."
                : "This product has no movement history yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-900">
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400 border-b border-zinc-800">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400 border-b border-zinc-800">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400 border-b border-zinc-800">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400 border-b border-zinc-800">
                    Warehouse Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400 border-b border-zinc-800">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400 border-b border-zinc-800">
                    Processed By
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((movement, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-zinc-900/50" : "bg-zinc-900"
                    } hover:bg-zinc-800 transition-colors`}
                  >
                    <td className="px-4 py-3 text-sm border-b border-zinc-800">
                      {format(new Date(movement.movedAt), "MMM d, yyyy h:mm a")}
                    </td>
                    <td className="px-4 py-3 text-sm border-b border-zinc-800">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          movement.movementType === "IN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {movement.movementType === "IN" ? (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        )}
                        {movement.movementType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm border-b border-zinc-800">{movement.quantity}</td>
                    <td className="px-4 py-3 text-sm border-b border-zinc-800">
                      {movement.warehouseID || "Not specified"}
                    </td>
                    <td className="px-4 py-3 text-sm border-b border-zinc-800">{movement.reason}</td>
                    <td className="px-4 py-3 text-sm border-b border-zinc-800">
                      {movement.adminName ? (
                        <div>
                          <div>{movement.adminName}</div>
                          <div className="text-xs text-zinc-500">{movement.adminType}</div>
                        </div>
                      ) : (
                        "System"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
