"use client"

import { useEffect } from "react"
import { useState, useRef, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Plus, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { showSuccessToast, showErrorToast, showLoadingToast } from "@/components/notify/Toast"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

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

interface Category {
  value: string
  label: string
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
  const [existingProducts, setExistingProducts] = useState<ExistingProduct[]>([])
  const [selectedImages, setSelectedImages] = useState<ImageWithDescription[]>([])
  const [isNewProduct, setIsNewProduct] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<ExistingProduct[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<ExistingProduct | null>(null)
  const [openProductDropdown, setOpenProductDropdown] = useState(false)
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false)
  const [openPublisherDropdown, setOpenPublisherDropdown] = useState(false)
  const [openWarehouseDropdown, setOpenWarehouseDropdown] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null)
  const [warehouseLocation, setWarehouseLocation] = useState("")
  const [movementReason, setMovementReason] = useState(isNewProduct ? "Initial stock" : "")
  const [movementQuantity, setMovementQuantity] = useState<number>(1)
  const [movementType, setMovementType] = useState<"IN" | "OUT">("IN")
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [warehouseLocations, setWarehouseLocations] = useState<string[]>([])
  const [availableWarehouses, setAvailableWarehouses] = useState<string[]>([])
  const [productWarehouse, setProductWarehouse] = useState<string | null>(null)

  // Categories list
  const categories: Category[] = [
    { value: "Rulebook", label: "Rulebook" },
    { value: "Miniature", label: "Miniature" },
    { value: "Dice", label: "Dice" },
    { value: "Game Aid", label: "Game Aid" },
    { value: "Digital Content", label: "Digital Content" },
    { value: "Merchandise", label: "Merchandise" },
    { value: "Custom Content", label: "Custom Content" },
    { value: "etc...", label: "Other" },
  ]

  // Fetch publishers and existing products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch publishers
        const publishersResponse = await fetch("/api/publishers")
        const publishersData = await publishersResponse.json()

        if (publishersData.success) {
          setPublishers(publishersData.publishers)
        } else {
          showErrorToast("Failed to load publishers")
        }

        // Fetch existing products
        const productsResponse = await fetch("/api/products/list")
        const productsData = await productsResponse.json()

        if (productsData.success) {
          setExistingProducts(productsData.products)
          setFilteredProducts(productsData.products)
        } else {
          showErrorToast("Failed to load existing products")
        }

        // Fetch available warehouse locations
        fetchAvailableWarehouses()
      } catch (error) {
        console.error("Error fetching data:", error)
        showErrorToast("Failed to load required data")
      }
    }

    fetchData()
  }, [])

  // Fetch available warehouse locations
  const fetchAvailableWarehouses = async () => {
    try {
      const response = await fetch("/api/products/warehouse/available")
      const data = await response.json()

      if (data.success) {
        setAvailableWarehouses(data.locations || [])

        // Add some example warehouse locations if none are available
        if (!data.locations || data.locations.length === 0) {
          setAvailableWarehouses(["A-01-01-01", "A-01-02-01", "B-02-03-01", "B-03-01-02", "C-05-02-04", "D-01-01-01"])
        }
      }
    } catch (error) {
      console.error("Error fetching available warehouses:", error)
    }
  }

  // Reset movement reason when switching between new and existing product
  useEffect(() => {
    setMovementReason(isNewProduct ? "Initial stock" : "")
  }, [isNewProduct])

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(existingProducts)
    } else {
      const filtered = existingProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, existingProducts])

  // Fetch product's warehouse location when a product is selected
  useEffect(() => {
    if (selectedProduct) {
      const fetchProductWarehouse = async () => {
        try {
          const response = await fetch(`/api/products/warehouse/${selectedProduct.id}`)
          const data = await response.json()

          if (data.success && data.location) {
            setProductWarehouse(data.location)

            // Add to warehouse locations if not already there
            setWarehouseLocations((prev) => (prev.includes(data.location) ? prev : [...prev, data.location]))
          } else {
            setProductWarehouse(null)
          }
        } catch (error) {
          console.error("Error fetching product warehouse:", error)
          setProductWarehouse(null)
        }
      }

      fetchProductWarehouse()
    } else {
      setProductWarehouse(null)
    }
  }, [selectedProduct])

  // Update warehouse locations when available warehouses change
  useEffect(() => {
    // Combine available warehouses with any product warehouse
    const allLocations = [...availableWarehouses]
    if (productWarehouse && !allLocations.includes(productWarehouse)) {
      allLocations.push(productWarehouse)
    }
    setWarehouseLocations(allLocations)
  }, [availableWarehouses, productWarehouse])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Create preview URLs for the new images
      const newImages = newFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        description: "",
      }))

      setSelectedImages((prev) => [...prev, ...newImages])
    }
  }

  const updateImageDescription = (index: number, description: string) => {
    setSelectedImages((prev) => prev.map((img, i) => (i === index ? { ...img, description } : img)))
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(selectedImages[index].previewUrl)

    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) return

    // Validate form
    if (isNewProduct) {
      if (!productName.trim()) {
        showErrorToast("Product name is required")
        return
      }
      if (!productPrice || isNaN(Number.parseFloat(productPrice)) || Number.parseFloat(productPrice) <= 0) {
        showErrorToast("Valid product price is required")
        return
      }
      if (!selectedCategory) {
        showErrorToast("Product category is required")
        return
      }
      if (!selectedPublisher) {
        showErrorToast("Publisher is required")
        return
      }
      if (selectedImages.length === 0) {
        showErrorToast("Please upload at least one product image")
        return
      }
    } else {
      if (!selectedProduct) {
        showErrorToast("Please select a product")
        return
      }
    }

    if (!movementQuantity || movementQuantity <= 0) {
      showErrorToast("Quantity must be greater than 0")
      return
    }

    if (!movementReason.trim()) {
      showErrorToast("Please provide a reason for this movement")
      return
    }

    try {
      setIsSubmitting(true)
      const loadingToast = showLoadingToast(isNewProduct ? "Adding new product..." : "Adding stock movement...")

      // Create FormData
      const formData = new FormData()

      if (isNewProduct) {
        formData.append("name", productName)
        formData.append("description", productDescription)
        formData.append("price", productPrice)
        formData.append("category", selectedCategory)
        formData.append("publisherId", selectedPublisher?.id.toString() || "")

        // Add images with descriptions
        selectedImages.forEach((img, index) => {
          formData.append(`images`, img.file)
          formData.append(`imageDescriptions[${index}]`, img.description)
        })
      } else {
        formData.append("existingProductId", selectedProduct?.id.toString() || "")
      }

      // Common fields for both new and existing products
      formData.append("quantity", movementQuantity.toString())
      formData.append("reason", movementReason)
      formData.append("warehouseLocation", warehouseLocation)

      if (!isNewProduct) {
        formData.append("movementType", movementType)
      }

      // Set the form action based on whether we're creating a new product or adding to existing
      const endpoint = isNewProduct ? "/api/products/movement/new" : "/api/products/movement/add"

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        showSuccessToast(isNewProduct ? "Product added successfully" : "Stock movement added successfully")
        router.push("/SuperAdmins/products")
      } else {
        showErrorToast(data.message || "Failed to process request")
      }
    } catch (error) {
      console.error("Error:", error)
      showErrorToast("An error occurred while processing your request")
    } finally {
      setIsSubmitting(false)
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
                          required
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
                          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="price" className="block text-sm font-medium mb-1">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input
                            id="price"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="bg-zinc-900 border-zinc-700 pl-8"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <Popover open={openCategoryDropdown} onOpenChange={setOpenCategoryDropdown}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCategoryDropdown}
                              className="w-full justify-between bg-zinc-900 border-zinc-700 text-left font-normal"
                            >
                              {selectedCategory
                                ? categories.find((category) => category.value === selectedCategory)?.label
                                : "Select category..."}
                              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-zinc-950 border-zinc-800">
                            <Command className="bg-zinc-950">
                              <CommandInput placeholder="Search category..." className="h-9 bg-zinc-900" />
                              <CommandEmpty className="text-zinc-400">No category found.</CommandEmpty>
                              <CommandGroup className="bg-zinc-950">
                                {categories.map((category) => (
                                  <CommandItem
                                    key={category.value}
                                    value={category.value}
                                    onSelect={(currentValue) => {
                                      setSelectedCategory(currentValue)
                                      setOpenCategoryDropdown(false)
                                    }}
                                    className="aria-selected:bg-zinc-800"
                                  >
                                    {category.label}
                                    <Check
                                      className={`ml-auto h-4 w-4 ${
                                        selectedCategory === category.value ? "opacity-100" : "opacity-0"
                                      }`}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label htmlFor="publisherId" className="block text-sm font-medium mb-1">
                          Publisher <span className="text-red-500">*</span>
                        </label>
                        <Popover open={openPublisherDropdown} onOpenChange={setOpenPublisherDropdown}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openPublisherDropdown}
                              className="w-full justify-between bg-zinc-900 border-zinc-700 text-left font-normal"
                            >
                              {selectedPublisher
                                ? `${selectedPublisher.name}${
                                    selectedPublisher.servicesFee ? ` (Fee: ${selectedPublisher.servicesFee}%)` : ""
                                  }`
                                : "Select publisher..."}
                              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-zinc-950 border-zinc-800">
                            <Command className="bg-zinc-950">
                              <CommandInput placeholder="Search publisher..." className="h-9 bg-zinc-900" />
                              <CommandEmpty className="text-zinc-400">No publisher found.</CommandEmpty>
                              <CommandList className="bg-zinc-950">
                                <CommandGroup>
                                  {publishers.map((publisher) => (
                                    <CommandItem
                                      key={publisher.id}
                                      value={publisher.name}
                                      onSelect={() => {
                                        setSelectedPublisher(publisher)
                                        setOpenPublisherDropdown(false)
                                      }}
                                      className="aria-selected:bg-zinc-800"
                                    >
                                      {publisher.name}
                                      {publisher.servicesFee ? ` (Fee: ${publisher.servicesFee}%)` : ""}
                                      <Check
                                        className={`ml-auto h-4 w-4 ${
                                          selectedPublisher?.id === publisher.id ? "opacity-100" : "opacity-0"
                                        }`}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Movement Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                            Initial Quantity <span className="text-red-500">*</span>
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
                          <label htmlFor="warehouseLocation" className="block text-sm font-medium mb-1">
                            Warehouse Location
                          </label>
                          <Popover open={openWarehouseDropdown} onOpenChange={setOpenWarehouseDropdown}>
                            <PopoverTrigger asChild>
                              <div className="relative">
                                <Input
                                  id="warehouseLocation"
                                  placeholder="zone-rack-shelf-pallet (e.g. A-01-02-03)"
                                  className="bg-zinc-900 border-zinc-700 pr-10"
                                  value={warehouseLocation}
                                  onChange={(e) => setWarehouseLocation(e.target.value)}
                                  onClick={() => setOpenWarehouseDropdown(true)}
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 bg-zinc-950 border-zinc-800">
                              <Command className="bg-zinc-950">
                                <CommandInput
                                  placeholder="Search warehouse locations..."
                                  className="h-9 bg-zinc-900"
                                  value={warehouseLocation}
                                  onValueChange={setWarehouseLocation}
                                />
                                <CommandEmpty className="text-zinc-400">
                                  <div className="p-2 text-center">
                                    <p className="text-sm text-zinc-400">No matching locations found.</p>
                                    <p className="text-xs text-zinc-500 mt-1">
                                      Enter a new location in format: zone-rack-shelf-pallet
                                    </p>
                                  </div>
                                </CommandEmpty>
                                <CommandGroup heading="Available Locations" className="text-zinc-400">
                                  {availableWarehouses.map((location) => (
                                    <CommandItem
                                      key={location}
                                      onSelect={() => {
                                        setWarehouseLocation(location)
                                        setOpenWarehouseDropdown(false)
                                      }}
                                      className="aria-selected:bg-zinc-800"
                                    >
                                      {location}
                                      <Check
                                        className={`ml-auto h-4 w-4 ${
                                          warehouseLocation === location ? "opacity-100" : "opacity-0"
                                        }`}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <p className="text-xs text-zinc-500 mt-1">
                            Format: zone-rack-shelf-pallet. Leave empty if not storing in warehouse.
                          </p>
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
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Selected Images ({selectedImages.length})</label>

                          <div className="space-y-4">
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
                      <Popover open={openProductDropdown} onOpenChange={setOpenProductDropdown}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openProductDropdown}
                            className="w-full justify-between bg-zinc-900 border-zinc-700 text-left font-normal"
                          >
                            {selectedProduct ? selectedProduct.name : "Search and select a product..."}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-zinc-950 border-zinc-800">
                          <Command className="bg-zinc-950">
                            <CommandInput
                              placeholder="Search products..."
                              className="h-9 bg-zinc-900"
                              value={searchTerm}
                              onValueChange={setSearchTerm}
                            />
                            <CommandEmpty className="text-zinc-400">No products found.</CommandEmpty>
                            <CommandList className="bg-zinc-950">
                              <CommandGroup>
                                {filteredProducts.map((product) => (
                                  <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() => {
                                      setSelectedProduct(product)
                                      setOpenProductDropdown(false)
                                    }}
                                    className="aria-selected:bg-zinc-800"
                                  >
                                    <div className="flex flex-col">
                                      <span>{product.name}</span>
                                      {product.publisherName && (
                                        <span className="text-xs text-zinc-400">
                                          Publisher: {product.publisherName}
                                        </span>
                                      )}
                                    </div>
                                    <Check
                                      className={`ml-auto h-4 w-4 ${
                                        selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                                      }`}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                        Warehouse Location
                        {productWarehouse && (
                          <span className="ml-2 text-xs text-zinc-400">(Current: {productWarehouse})</span>
                        )}
                      </label>
                      <Popover open={openWarehouseDropdown} onOpenChange={setOpenWarehouseDropdown}>
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <Input
                              id="warehouseLocation"
                              placeholder="zone-rack-shelf-pallet (e.g. A-01-02-03)"
                              className="bg-zinc-900 border-zinc-700 pr-10"
                              value={warehouseLocation}
                              onChange={(e) => setWarehouseLocation(e.target.value)}
                              onClick={() => setOpenWarehouseDropdown(true)}
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-zinc-950 border-zinc-800">
                          <Command className="bg-zinc-950">
                            <CommandInput
                              placeholder="Search warehouse locations..."
                              className="h-9 bg-zinc-900"
                              value={warehouseLocation}
                              onValueChange={setWarehouseLocation}
                            />
                            <CommandEmpty className="text-zinc-400">
                              <div className="p-2 text-center">
                                <p className="text-sm text-zinc-400">No matching locations found.</p>
                                <p className="text-xs text-zinc-500 mt-1">
                                  Enter a new location in format: zone-rack-shelf-pallet
                                </p>
                              </div>
                            </CommandEmpty>
                            {productWarehouse && (
                              <CommandGroup heading="Current Location" className="text-zinc-400">
                                <CommandItem
                                  onSelect={() => {
                                    setWarehouseLocation(productWarehouse)
                                    setOpenWarehouseDropdown(false)
                                  }}
                                  className="aria-selected:bg-zinc-800"
                                >
                                  {productWarehouse}
                                  <Check
                                    className={`ml-auto h-4 w-4 ${
                                      warehouseLocation === productWarehouse ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                </CommandItem>
                              </CommandGroup>
                            )}
                            <CommandGroup heading="Available Locations" className="text-zinc-400">
                              {availableWarehouses.map((location) => (
                                <CommandItem
                                  key={location}
                                  onSelect={() => {
                                    setWarehouseLocation(location)
                                    setOpenWarehouseDropdown(false)
                                  }}
                                  className="aria-selected:bg-zinc-800"
                                >
                                  {location}
                                  <Check
                                    className={`ml-auto h-4 w-4 ${
                                      warehouseLocation === location ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
    </div>
  )
}
