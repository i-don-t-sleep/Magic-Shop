"use client"

import type React from "react"

import { useEffect } from "react"
import { useState, useRef, type FormEvent, type ChangeEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload, X, Plus, Settings, Trash, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Spinbox } from "@/components/ui/spinbox"
import ComboSearch from "@/components/newcomp/comboboxfixed"
import { showErrorToast, showSuccessToast } from "@/components/notify/Toast"
import { ManageCategoriesModal } from "@/components/manage-categories-modal"
import { ManageWarehousesModal } from "@/components/manage-warehouses-modal"
import { LoadingComp } from "@/components/loading-comp"

interface Publisher {
  id: number
  name: string
  description?: string
  servicesFee?: number
  publisherWeb?: string
}

interface ProductImage {
  id: number
  name: string
  description: string
  url?: string
}

interface Warehouse {
  id: number
  location: string
  capacity: number
}

interface ImageWithDescription {
  file: File
  previewUrl: string
  description: string
}

interface ProductData {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  status: string
  category: string
  publisherName: string
  publisherId: number
  images: ProductImage[]
  warehouse: Warehouse | null
}

export default function EditProductPage() {
  const router = useRouter()
  const { slug } = useParams() as { slug: string }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Product data
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productPrice, setProductPrice] = useState("")

  // Category and publisher
  const [categoryItems, setCategoryItems] = useState<{ name: string }[]>([])
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<string>("")
  const [publisherItems, setPublisherItems] = useState<{ name: string }[]>([])
  const [selectedPublisherItem, setSelectedPublisherItem] = useState<string>("")

  // Warehouse
  const [availableWarehouses, setAvailableWarehouses] = useState<Array<{ location: string; capacity: number }>>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState<{ location: string; capacity: number } | null>(null)

  // Images
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([])
  const [newImages, setNewImages] = useState<ImageWithDescription[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Modals
  const [manageCategoriesModalOpen, setManageCategoriesModalOpen] = useState(false)
  const [manageWarehousesModalOpen, setManageWarehousesModalOpen] = useState(false)

  // Fetch product data and metadata
  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch product details
        const response = await fetch(`/api/products/edit/`+slug)
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch product details")
        }

        const product = data.product

        // Set product data
        setProductData(product)
        setProductName(product.name)
        setProductDescription(product.description || "")
        setProductPrice(product.price.toString())
        setSelectedCategoryItem(product.category)
        setSelectedPublisherItem(product.publisherName)

        // Set warehouse data if exists
        if (product.warehouse) {
          setSelectedWarehouse({
            location: product.warehouse.location,
            capacity: product.warehouse.capacity,
          })
        }

        // Set images with URLs
        const images = product.images.map((img: any) => ({
          ...img,
          url: `/api/blob/productimages/${img.id}`,
        }))
        setExistingImages(images)

        // Fetch metadata (categories, publishers, warehouses)
        await fetchMetadata()
      } catch (error: any) {
        console.error("Error fetching product:", error)
        setError(error.message || "Failed to load product data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [slug])

  const fetchMetadata = async () => {
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
      } else {
        console.error("Failed to fetch metadata:", data.error || "Unknown error")
      }
    } catch (error) {
      console.error("Error fetching metadata:", error)
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newUploadedImages: ImageWithDescription[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newUploadedImages.push({
          file,
          previewUrl: URL.createObjectURL(file),
          description: "",
        })
      }
    })

    setNewImages((prev) => [...prev, ...newUploadedImages])
  }

  const updateNewImageDescription = (index: number, description: string) => {
    setNewImages((prev) => prev.map((img, i) => (i === index ? { ...img, description } : img)))
  }

  const updateExistingImageDescription = (id: number, description: string) => {
    setExistingImages((prev) => prev.map((img) => (img.id === id ? { ...img, description } : img)))
  }

  const removeNewImage = (index: number) => {
    setNewImages((prev) => {
      const newImages = [...prev]
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].previewUrl)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const markExistingImageForDeletion = (id: number) => {
    setImagesToDelete((prev) => [...prev, id])
  }

  const unmarkExistingImageForDeletion = (id: number) => {
    setImagesToDelete((prev) => prev.filter((imgId) => imgId !== id))
  }

  const isImageMarkedForDeletion = (id: number) => {
    return imagesToDelete.includes(id)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) return

    // Validate form
    if (!productName || !selectedCategoryItem || !selectedPublisherItem) {
      showErrorToast("Please fill in all required fields")
      return
    }

    if (Number(productPrice) <= 0) {
      showErrorToast("Price must be greater than 0")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // Add product data
      formData.append("name", productName)
      formData.append("description", productDescription)
      formData.append("price", productPrice)
      formData.append("category", selectedCategoryItem)
      formData.append("publisherName", selectedPublisherItem)

      // Add warehouse data if selected
      if (selectedWarehouse) {
        formData.append("warehouseLocation", selectedWarehouse.location)
        formData.append("warehouseCapacity", selectedWarehouse.capacity.toString())
      }

      // Add images to delete
      if (imagesToDelete.length > 0) {
        formData.append("deleteImages", JSON.stringify(imagesToDelete))
      }

      // Add existing image descriptions
      existingImages.forEach((img) => {
        if (!isImageMarkedForDeletion(img.id)) {
          formData.append(`imageDescription${img.id}`, img.description)
        }
      })

      // Add new images
      newImages.forEach((img, index) => {
        formData.append(`newImage${index}`, img.file)
        formData.append(`newImageDescription${index}`, img.description)
      })

      if (!productData) {
        showErrorToast("Product data not loaded")
        return
      }
      // Add productId
      formData.append("productId", productData.id.toString())

      // Submit update
      const response = await fetch(`/api/products/edit/`+slug, {
        method: "PUT",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        showSuccessToast("Product updated successfully")
        router.push("/SuperAdmins/products")
      } else {
        showErrorToast(data.message || "Failed to update product")
      }
    } catch (error: any) {
      console.error("Error updating product:", error)
      showErrorToast("An error occurred while updating the product")
    } finally {
      setIsSubmitting(false)
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

  if (isLoading) {
    return <LoadingComp />
  }

  if (error) {
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
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-500 mb-4">Error Loading Product</h2>
            <p className="text-zinc-400 mb-6">{error}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
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
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="warehouseLocation" className="block text-sm font-medium">
                          Warehouse Location
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
                          // 1) Get the full selected string
                          const fullName =
                            typeof valueAction === "function"
                              ? (valueAction as (prev: string) => string)(
                                  selectedWarehouse ? `${selectedWarehouse.location}` : "",
                                )
                              : valueAction
                          // 2) Extract just the location before " ("
                          const match = fullName.match(/^(.+?)\s*\(/)
                          const locOnly = match ? match[1] : fullName

                          // 3) Find the warehouse object using locOnly
                          const found = availableWarehouses.find((w) => w.location === locOnly) ?? null
                          // 4) Set state
                          setSelectedWarehouse(found)
                        }}
                        placeholder="Select available warehouse..."
                        className="w-full"
                      />
                      <p className="text-xs text-zinc-500 mt-1">Format: zone-rack-shelf-pallet. (Ex: AA-03-04-700)</p>
                    </div>

                    {productData && (
                      <div className="p-4 bg-zinc-800/50 rounded-md border border-zinc-700">
                        <h3 className="text-sm font-medium mb-2">Product Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-zinc-400">ID:</span> <span>{productData.id}</span>
                          </div>
                          <div>
                            <span className="text-zinc-400">Status:</span>{" "}
                            <span className={productData.status === "Available" ? "text-green-500" : "text-red-500"}>
                              {productData.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-400">Quantity:</span> <span>{productData.quantity}</span>
                          </div>
                          <div>
                            <span className="text-zinc-400">Images:</span>{" "}
                            <span>{existingImages.length - imagesToDelete.length}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Management Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Product Images</label>

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

                    <div className="space-y-2 h-full">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium">
                          Existing Images ({existingImages.length - imagesToDelete.length}/{existingImages.length})
                        </label>
                        {imagesToDelete.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs border-zinc-700 hover:bg-green-600 hover:text-white"
                            onClick={() => setImagesToDelete([])}
                          >
                            Restore All
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4 max-h-[calc(150vh)] overflow-y-auto pr-2">
                        {existingImages.map((img) => (
                          <div
                            key={img.id}
                            className={`relative group border border-zinc-700 rounded-md p-3 ${
                              isImageMarkedForDeletion(img.id) ? "opacity-50 bg-red-900/20" : ""
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className="w-24 h-24 relative rounded-md overflow-hidden border border-zinc-700 flex-shrink-0">
                                <Image
                                  src={img.url || "/placeholder.svg"}
                                  alt={img.name}
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
                                  onChange={(e) => updateExistingImageDescription(img.id, e.target.value)}
                                  disabled={isImageMarkedForDeletion(img.id)}
                                />
                              </div>
                            </div>

                            {isImageMarkedForDeletion(img.id) ? (
                              <Button
                                type="button"
                                className="absolute top-2 right-2 bg-green-600 rounded-full p-1"
                                onClick={() => unmarkExistingImageForDeletion(img.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                className="absolute top-2 right-2 bg-red-600 rounded-full p-1"
                                onClick={() => markExistingImageForDeletion(img.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}

                        {newImages.length > 0 && (
                          <div className="mt-6">
                            <label className="block text-sm font-medium mb-2">New Images ({newImages.length})</label>

                            {newImages.map((img, index) => (
                              <div key={index} className="relative group border border-zinc-700 rounded-md p-3 mb-4">
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
                                      onChange={(e) => updateNewImageDescription(index, e.target.value)}
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="absolute top-2 right-2 bg-red-600 rounded-full p-1"
                                  onClick={() => removeNewImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div
                          className="flex items-center justify-center border border-dashed border-zinc-700 rounded-md p-4 cursor-pointer hover:border-zinc-500 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Plus className="h-6 w-6 text-zinc-500 mr-2" />
                          <span className="text-zinc-400">Add more images</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
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
