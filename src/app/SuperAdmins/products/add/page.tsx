"use client"

import { useState, useRef, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { showSuccessToast, showErrorToast, showLoadingToast } from "@/components/notify/Toast"
import Image from "next/image"

interface Publisher {
  id: number
  name: string
  description?: string
  servicesFee?: number
  publisherWeb?: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch publishers on component mount
  useState(() => {
    const fetchPublishers = async () => {
      try {
        const response = await fetch("/api/publishers")
        const data = await response.json()

        if (data.success) {
          setPublishers(data.publishers)
        } else {
          showErrorToast("Failed to load publishers")
        }
      } catch (error) {
        console.error("Error fetching publishers:", error)
        showErrorToast("Failed to load publishers")
      }
    }

    fetchPublishers()
  }, [])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Create preview URLs for the new images
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))

      setSelectedImages((prev) => [...prev, ...newFiles])
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index])

    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) return

    const form = e.currentTarget
    const formData = new FormData(form)

    // Add all selected images to formData
    formData.delete("images") // Remove any existing image field
    selectedImages.forEach((image) => {
      formData.append("images", image)
    })

    // Validate form
    const name = formData.get("name") as string
    const price = formData.get("price") as string
    const quantity = formData.get("quantity") as string
    const publisherId = formData.get("publisherId") as string

    if (!name || !price || !quantity || !publisherId) {
      showErrorToast("Please fill in all required fields")
      return
    }

    if (selectedImages.length === 0) {
      showErrorToast("Please upload at least one product image")
      return
    }

    try {
      setIsSubmitting(true)
      const loadingToast = showLoadingToast("Adding product...")

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        showSuccessToast("Product added successfully")
        router.push("/SuperAdmins/products")
      } else {
        showErrorToast(data.message || "Failed to add product")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      showErrorToast("An error occurred while adding the product")
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
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
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
                        name="description"
                        rows={4}
                        placeholder="Enter product description"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium mb-1">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input
                            id="price"
                            name="price"
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
                        <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          min="0"
                          placeholder="0"
                          className="bg-zinc-900 border-zinc-700"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="category"
                          name="category"
                          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Select category</option>
                          <option value="Rulebook">Rulebook</option>
                          <option value="Miniature">Miniature</option>
                          <option value="Dice">Dice</option>
                          <option value="Game Aid">Game Aid</option>
                          <option value="Digital Content">Digital Content</option>
                          <option value="Merchandise">Merchandise</option>
                          <option value="Custom Content">Custom Content</option>
                          <option value="etc...">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="publisherId" className="block text-sm font-medium mb-1">
                          Publisher <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="publisherId"
                          name="publisherId"
                          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Select publisher</option>
                          {publishers.map((publisher) => (
                            <option key={publisher.id} value={publisher.id}>
                              {publisher.name}
                              {publisher.servicesFee ? ` (Fee: ${publisher.servicesFee}%)` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Warehouse Section */}
                    <div>
                      <label htmlFor="warehouseLocation" className="block text-sm font-medium mb-1">
                        Warehouse Location
                      </label>
                      <Input
                        id="warehouseLocation"
                        name="warehouseLocation"
                        placeholder="zone-rack-shelf-pallet (e.g. A-01-02-03)"
                        className="bg-zinc-900 border-zinc-700"
                      />
                      <p className="text-xs text-zinc-500 mt-1">
                        Format: zone-rack-shelf-pallet. Leave empty if not storing in warehouse.
                      </p>
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
                          name="images"
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

                    {imagePreviewUrls.length > 0 && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Selected Images ({imagePreviewUrls.length})</label>

                        <div className="grid grid-cols-3 gap-3">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square relative rounded-md overflow-hidden border border-zinc-700">
                                <Image
                                  src={url || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}

                          <div
                            className="aspect-square flex items-center justify-center border border-dashed border-zinc-700 rounded-md cursor-pointer hover:border-zinc-500 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Plus className="h-8 w-8 text-zinc-500" />
                          </div>
                        </div>
                      </div>
                    )}
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
                    {isSubmitting ? "Adding Product..." : "Add Product"}
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
