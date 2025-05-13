"use client"

import type React from "react"

import { useEffect } from "react"
import { useState, useRef, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Spinbox } from "@/components/ui/spinbox"
import ComboSearch from "@/components/newcomp/comboboxfixed"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { showSuccessToast, showErrorToast } from "@/components/notify/Toast"
import { ManageCategoriesModal } from "@/components/manage-categories-modal"
import { ManageWarehousesModal } from "@/components/manage-warehouses-modal"

interface Publisher {
  id: number
  name: string
  description?: string
  servicesFee?: number
  publisherWeb?: string
}

interface ExistingProduct {
  id: number
  name: string
  publisherName?: string
}

interface Warehouse {
  location: string
  capacity: number
}

interface ImageWithDescription {
  file: File
  previewUrl: string
  description: string
}

export default function AddProductMovementPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [selectedImages, setSelectedImages] = useState<ImageWithDescription[]>([])
  const [isNewProduct, setIsNewProduct] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<ExistingProduct[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openProductDropdown, setOpenProductDropdown] = useState(false)
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false)
  const [openPublisherDropdown, setOpenPublisherDropdown] = useState(false)
  const [openWarehouseDropdown, setOpenWarehouseDropdown] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null)

  const [movementReason, setMovementReason] = useState(isNewProduct ? "Initial stock" : "")
  const [movementQuantity, setMovementQuantity] = useState<number>(0)
  const [movementType, setMovementType] = useState<"IN" | "OUT">("IN")
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")

  // Update the state variables at the top of the component
  const [availableWarehouses, setAvailableWarehouses] = useState<Array<{ location: string; capacity: number }>>([])

  //----
  const [selectedWarehouse, setSelectedWarehouse] = useState<{ location: string; capacity: number } | null>(null)
  //--
  const [warehouseLocationForExist, setWarehouseLocationForExist] = useState("")
  const [availableWarehousesForExist, setAvailableWarehousesForExist] = useState<
    Array<{ location: string; capacity: number; label: string }>
  >([])

  //--
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState(false)
  const [newWarehouseLocation, setNewWarehouseLocation] = useState("")
  const [newWarehouseCapacity, setNewWarehouseCapacity] = useState("100")
  const [isAddingWarehouse, setIsAddingWarehouse] = useState(false)

  const [productWarehouse, setProductWarehouse] = useState<string | null>(null)

  // For add new modals
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newPublisherName, setNewPublisherName] = useState("")
  const [newPublisherUsername, setNewPublisherUsername] = useState("")
  const [newPublisherPassword, setNewPublisherPassword] = useState("")
  const [newPublisherServicesFee, setNewPublisherServicesFee] = useState("30.0")
  const [newPublisherDescription, setNewPublisherDescription] = useState("")
  const [newPublisherWeb, setNewPublisherWeb] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingPublisher, setIsAddingPublisher] = useState(false)

  const [existingProducts, setExistingProducts] = useState<ExistingProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ExistingProduct | null>(null)
  // Declare missing state variables
  const [productPrice, setProductPrice] = useState("")

  // For category combobox
  const [categoryItems, setCategoryItems] = useState<{ name: string }[]>([])
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<string>("")

  // For publisher combobox
  const [publisherItems, setPublisherItems] = useState<{ name: string }[]>([])
  const [selectedPublisherItem, setSelectedPublisherItem] = useState<string>("")

  // Add this near the top with other state variables
  const [isLoading, setIsLoading] = useState(true)

  // Add state for manage modals
  const [manageCategoriesModalOpen, setManageCategoriesModalOpen] = useState(false)
  const [manageWarehousesModalOpen, setManageWarehousesModalOpen] = useState(false)

  const [WarehouseList, setWarehouseList] = useState<Warehouse[]>([])

  // Update the fetchMetadata function to handle the warehouse data
  const fetchMetadata = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/products/movement/meta")
      const data = await res.json()
      if (data.success) {
        // Format category data for ComboSearch
        const formattedCategories = Array.isArray(data.categoryEnum)
          ? data.categoryEnum.map((cat: any) => (typeof cat === "string" ? { name: cat } : cat))
          : []
        setCategoryItems(formattedCategories)

        // Format publisher data for ComboSearch
        const formattedPublishers = Array.isArray(data.publishers)
          ? data.publishers.map((cat: any) => (typeof cat === "string" ? { name: cat } : cat))
          : []

        setPublisherItems(formattedPublishers)

        // Store available warehouses
        setAvailableWarehouses(data.availableWarehouses || [])

        // Extract just the locations for the dropdown
        const warehouseLocations = data.availableWarehouses?.map((wh: any) => wh.location) || []
        setAvailableWarehouses(data.availableWarehouses || [])
      } else {
        console.error("Failed to fetch metadata:", data.error || "Unknown error")
      }
    } catch (error) {
      console.error("Error fetching metadata:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetadata()
  }, [])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: ImageWithDescription[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newImages.push({
          file,
          previewUrl: URL.createObjectURL(file),
          description: "",
        })
      }
    })

    setSelectedImages((prev) => [...prev, ...newImages])
  }
  const updateImageDescription = (index: number, description: string) => {
    setSelectedImages((prev) => prev.map((img, i) => (i === index ? { ...img, description } : img)))
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev]
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].previewUrl)
      newImages.splice(index, 1)
      return newImages
    })
  }
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) return

    // Validate form
    if (isNewProduct) {
      if (!productName || !selectedCategoryItem || !selectedPublisherItem || !selectedWarehouse) {
        showErrorToast("Please fill in all required fields")
        return
      }

      if (movementQuantity <= 0) {
        showErrorToast("Quantity must be greater than 0")
        return
      }

      if (Number(productPrice) <= 0) {
        showErrorToast("Price must be greater than 0")
        return
      }
    } else {
      if (!selectedProduct || !movementReason || movementQuantity <= 0) {
        showErrorToast("Please fill in all required fields")
        return
      }
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()

      if (isNewProduct) {
        // Add new product data
        formData.append("name", productName)
        formData.append("description", productDescription)
        formData.append("price", productPrice)
        formData.append("category", selectedCategoryItem)
        formData.append("publisherName", selectedPublisherItem)
        formData.append("quantity", movementQuantity.toString())
        formData.append("reason", movementReason)

        if (selectedWarehouse) {
          formData.append("warehouseLocation", selectedWarehouse.location)
        }

        // Add images if any
        selectedImages.forEach((img, index) => {
          formData.append(`image${index}`, img.file)
          formData.append(`imageDescription${index}`, img.description)
        })
        for (const [key, value] of formData.entries()) {
  console.log(key, value)
}
        // Submit new product
        const response = await fetch("/api/products/movement/new", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (data.success) {
          router.push("/SuperAdmins/products")
        } else {
          showErrorToast(data.message || "Failed to add product")
        }
      } else {
        // Add movement to existing product
        formData.append("existingProductId", selectedProduct?.id.toString() || "")
        formData.append("quantity", movementQuantity.toString())
        formData.append("movementType", movementType)
        formData.append("reason", movementReason)

        if (warehouseLocationForExist) {
          formData.append("warehouseLocation", warehouseLocationForExist)
        }
        /*
        const debug = Array.from(formData.entries())
  .map(([key, value]) => `${key}: ${value instanceof File ? value.name : value}`)
  .join("\n")

alert(debug)*/
        // Submit movement
        const response = await fetch("/api/products/movement/add", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (data.success) {
          router.push("/SuperAdmins/products")
        } else {
          showErrorToast(data.message || "Failed to add movement")
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      showErrorToast("An error occurred while submitting the form")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchExistingProducts = async () => {
      try {
        const response = await fetch("/api/products?page=1&limit=5")
        const data = await response.json()
        if (data.success) {
          setExistingProducts(
            data.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              publisherName: p.publisherName,
            })),
          ) 
        }
      } catch (error) {
        console.error("Error fetching existing products:", error)
      }
    }

    fetchExistingProducts()
  }, [])

  // Fetch warehouse data when a product is selected
  useEffect(() => {
    if (selectedProduct?.id) {
      fetchCapacityWarehouse()
    }
  }, [selectedProduct])

  const fetchCapacityWarehouse = async () => {
    try {
      const response = await fetch(`/api/products/getWarehouse?productID=${selectedProduct?.id}`)
      const data = await response.json()
      
      if (data.success) {
        setWarehouseList(data.Warehouse)
        // Format warehouse data for ComboSearch
        const formattedWarehouses = data.Warehouse.map((wh: Warehouse) => ({
          location: wh.location,
          capacity: wh.capacity,
          label: `${wh.location} (Capacity: ${wh.capacity})`,
        }))
        setAvailableWarehousesForExist(formattedWarehouses)
        
      }
    } catch (error) {
      console.error("Error fetching warehouse data:", error)
    }
  }

  // Handle category updates
  const handleCategoriesUpdated = async () => {
    try {
      const response = await fetch("/api/products/categories")
      const data = await response.json()

      if (data.success) {
        const formattedCategories = data.categories.map((cat: string) => ({ name: cat }))
        setCategoryItems(formattedCategories)
      }
    } catch (error) {
      console.error("Error fetching updated categories:", error)
    }
  }

  // Handle warehouse updates
  const handleWarehousesUpdated = async () => {
    try {
      const response = await fetch("/api/warehouse")
      const data = await response.json()

      if (data.success) {
        setAvailableWarehouses(data.warehouses || [])
      }
    } catch (error) {
      console.error("Error fetching updated warehouses:", error)
    }
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
        <h1 className="text-2xl font-bold">{isNewProduct ? "Add New Product" : "Add Stock Movement"}</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-6">
              {/* Toggle between new product and existing product */}
              <div className="mb-6 flex justify-center">
                <div className="inline-flex rounded-md border border-zinc-700 p-1">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      isNewProduct ? "bg-red-600 text-white" : "bg-transparent text-zinc-400 hover:text-white"
                    }`}
                    onClick={() => setIsNewProduct(true)}
                  >
                    New Product
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      !isNewProduct ? "bg-red-600 text-white" : "bg-transparent text-zinc-400 hover:text-white"
                    }`}
                    onClick={() => setIsNewProduct(false)}
                  >
                    Existing Product
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {isNewProduct ? (
                  /* New Product Form */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="Enter product name"
                          className="bg-zinc-900 border-zinc-700"
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={productDescription}
                          onChange={(e) => setProductDescription(e.target.value)}
                          rows={4}
                          placeholder="Enter product description"
                          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm max-h-[81vh]"
                        />
                      </div>

                      <div>
                        <label htmlFor="price" className="block text-sm font-medium mb-1">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <span className="mr-2">$</span>
                          <Spinbox
                            value={Number(productPrice) || 0}
                            onChange={(value) => setProductPrice(value.toString())}
                            min={0}
                            max={10000000.99}
                            step={1}
                            decimalPoint={2}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label htmlFor="category" className="block text-sm font-medium">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs border-zinc-700 hover:bg-red-600 hover:text-white"
                            onClick={() => setManageCategoriesModalOpen(true)}
                          >
                            <Settings className="h-3 w-3 mr-1" /> Manage Categories
                          </Button>
                        </div>

                        <ComboSearch
                          items={categoryItems}
                          value={selectedCategoryItem}
                          setValue={setSelectedCategoryItem}
                          placeholder="Select category..."
                          className="w-full"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label htmlFor="publisherId" className="block text-sm font-medium">
                            Publisher <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <ComboSearch
                          items={publisherItems}
                          value={selectedPublisherItem}
                          setValue={setSelectedPublisherItem}
                          placeholder="Select publisher..."
                          className="w-full"
                        />
                      </div>
                      {/* Movement Info */}
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label htmlFor="warehouseLocation" className="block text-sm font-medium">
                              Warehouse Location <span className="text-red-500">*</span>
                            </label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs border-zinc-700 hover:bg-red-600 hover:text-white"
                              onClick={() => setManageWarehousesModalOpen(true)}
                            >
                              <Settings className="h-3 w-3 mr-1" /> Manage Warehouses
                            </Button>
                          </div>
                          <ComboSearch
                            items={availableWarehouses.map((w) => ({
                              name: `${w.location} (Capacity: ${w.capacity})`,
                            }))}
                            value={
                              selectedWarehouse?.location != null && selectedWarehouse?.capacity != null
                                ? `${selectedWarehouse.location}`
                                : ""
                            }
                            setValue={(valueAction: React.SetStateAction<string>) => {
                              // 1) ดึงสตริงเต็มที่ถูกเลือก
                              const fullName =
                                typeof valueAction === "function"
                                  ? (valueAction as (prev: string) => string)(
                                      selectedWarehouse ? `${selectedWarehouse.location}` : "",
                                    )
                                  : valueAction
                              // 2) แยกเอาเฉพาะ location ก่อน " ("
                              const match = fullName.match(/^(.+?)\s*\(/)
                              const locOnly = match ? match[1] : fullName

                              // 3) หา object warehouse โดยใช้ locOnly
                              const found = availableWarehouses.find((w) => w.location === locOnly) ?? null
                              // 4) ตั้ง state
                              setSelectedWarehouse(found)
                            }}
                            placeholder="Select available warehouse..."
                            className="w-full"
                          />
                          <p className="text-xs text-zinc-500 mt-1">
                            Format: zone-rack-shelf-pallet. (Ex: AA-03-04-700)
                          </p>
                        </div>
                      </div>

                      <div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            {/* Left: Label */}
                            <label htmlFor="quantity" className="text-sm font-medium">
                              Initial Quantity <span className="text-red-500">*</span>
                            </label>

                            {/* Right: Progress + Remain */}
                            <div className="flex-1 ml-4">
                              <div className="relative h-4 bg-zinc-700 rounded-full overflow-hidden">
                                {/* Fill */}
                                {(selectedWarehouse?.capacity ?? -1 !== -1) && (
                                  <div
                                    className="h-full bg-magic-red rounded-full transition-all duration-300"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        (movementQuantity / (selectedWarehouse?.capacity ?? -1)) * 100,
                                      )}%`,
                                    }}
                                  ></div>
                                )}
                                {/* Text overlay */}
                                <span className="absolute inset-0 flex items-center justify-end pr-3 text-xs text-zinc-200">
                                  {selectedWarehouse
                                    ? `Remain: ${selectedWarehouse.capacity - movementQuantity} (Used: ${Math.min(
                                        100,
                                        Math.round((movementQuantity / selectedWarehouse.capacity) * 100),
                                      )}%)`
                                    : "No warehouse selected"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Spinbox
                            id="QuantitdyInit"
                            value={movementQuantity}
                            onChange={setMovementQuantity}
                            decimalPoint={0}
                            min={0}
                            max={selectedWarehouse ? selectedWarehouse?.capacity : 0}
                            step={1}
                            className="w-full"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="reason" className="block text-sm font-medium mb-1">
                          Reason for Movement <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="reason"
                          placeholder="e.g. Initial stock, Restock, etc."
                          className="bg-zinc-900 border-zinc-700"
                          value={movementReason}
                          onChange={(e) => setMovementReason(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Product Images <span className="text-red-500">*</span>
                        </label>

                        <div
                          className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center cursor-pointer hover:border-zinc-500 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                          />

                          <Upload className="h-10 w-10 mx-auto text-zinc-500 mb-2" />
                          <p className="text-zinc-400">Click to upload or drag and drop</p>
                          <p className="text-xs text-zinc-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>

                      {selectedImages.length > 0 && (
                        <div className="space-y-2 h-full">
                          <label className="block text-sm font-medium">Selected Images ({selectedImages.length})</label>

                          <div className="space-y-4 max-h-[calc(150vh)] overflow-y-auto pr-2">
                            {selectedImages.map((img, index) => (
                              <div key={index} className="relative group border border-zinc-700 rounded-md p-3">
                                <div className="flex gap-3">
                                  <div className="w-24 h-24 relative rounded-md overflow-hidden border border-zinc-700 flex-shrink-0">
                                    <Image
                                      src={img.previewUrl || "/placeholder.svg"}
                                      alt={`Preview ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Image Description</label>
                                    <textarea
                                      className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                                      rows={3}
                                      placeholder="Describe this image..."
                                      value={img.description}
                                      onChange={(e) => updateImageDescription(index, e.target.value)}
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="absolute top-2 right-2 bg-red-600 rounded-full p-1"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}

                            <div
                              className="flex items-center justify-center border border-dashed border-zinc-700 rounded-md p-4 cursor-pointer hover:border-zinc-500 transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Plus className="h-6 w-6 text-zinc-500 mr-2" />
                              <span className="text-zinc-400">Add more images</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Existing Product Form */
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="existingProductId" className="block text-sm font-medium mb-1">
                        Select Product <span className="text-red-500">*</span>
                      </label>

                      <ComboSearch
                        items={existingProducts.map((w) => ({ name: w.name }))}
                        value={selectedProduct?.name ?? ""} // (1) รับรองว่าเป็น string เสมอ
                        setValue={(value) => {
                          const name = typeof value === "string" ? value : value(selectedProduct?.name ?? "")
                          const found = existingProducts.find((p) => p.name === name) ?? null
                          setSelectedProduct(found)
                          fetchCapacityWarehouse()
                        }}
                        placeholder="Select product..."
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          placeholder="0"
                          className="bg-zinc-900 border-zinc-700"
                          value={movementQuantity}
                          onChange={(e) => setMovementQuantity(Number.parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="movementType" className="block text-sm font-medium mb-1">
                          Movement Type <span className="text-red-500">*</span>
                        </label>
                        <div className="inline-flex rounded-md border border-zinc-700 p-1 w-full">
                          <button
                            type="button"
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                              movementType === "IN"
                                ? "bg-green-600 text-white"
                                : "bg-transparent text-zinc-400 hover:text-white"
                            }`}
                            onClick={() => setMovementType("IN")}
                          >
                            IN - Add to Stock
                          </button>
                          <button
                            type="button"
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                              movementType === "OUT"
                                ? "bg-red-600 text-white"
                                : "bg-transparent text-zinc-400 hover:text-white"
                            }`}
                            onClick={() => setMovementType("OUT")}
                          >
                            OUT - Remove from Stock
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="warehouseLocation" className="block text-sm font-medium mb-1">
                        Warehouse Location (Capacity : {availableWarehousesForExist.find(w => w.location === warehouseLocationForExist)?.capacity ?? "N/A"})
                        {productWarehouse && (
                          <span className="ml-2 text-xs text-zinc-400">(Current: {productWarehouse})</span>
                        )}
                      
                      </label>
                      <ComboSearch
                        items={availableWarehousesForExist.map((w) => ({
                          name: `${w.location} (Capacity: ${w.capacity})`,
                        }))}
                        value={warehouseLocationForExist}
                        setValue={(value) => {
                          // Extract just the location part before " (Capacity: "
                          const locationOnly =
                            typeof value === "string"
                              ? value.split(" (Capacity:")[0]
                              : value(warehouseLocationForExist).split(" (Capacity:")[0]
                          
                          setWarehouseLocationForExist(locationOnly)
                        }}
                        placeholder="Select available warehouse..."
                        className="w-full"
                      />
                      <p className="text-xs text-zinc-500 mt-1">
                        {productWarehouse
                          ? "Leave empty to keep current location, or select a new one."
                          : "Format: zone-rack-shelf-pallet. Leave empty if not storing in warehouse."}
                      </p>
                    </div>

                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium mb-1">
                        Reason for Movement <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="reason"
                        placeholder="e.g. Restock, Inventory adjustment, etc."
                        className="bg-zinc-900 border-zinc-700"
                        value={movementReason}
                        onChange={(e) => setMovementReason(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-zinc-800">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-zinc-700"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                    {isSubmitting
                      ? isNewProduct
                        ? "Adding Product..."
                        : "Adding Movement..."
                      : isNewProduct
                        ? "Add Product"
                        : "Add Movement"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Categories Modal */}
      <ManageCategoriesModal
        open={manageCategoriesModalOpen}
        onOpenChange={setManageCategoriesModalOpen}
        onCategoriesUpdated={handleCategoriesUpdated}
      />

      {/* Manage Warehouses Modal */}
      <ManageWarehousesModal
        open={manageWarehousesModalOpen}
        onOpenChange={setManageWarehousesModalOpen}
        onWarehousesUpdated={handleWarehousesUpdated}
      />
    </div>
  )
}
