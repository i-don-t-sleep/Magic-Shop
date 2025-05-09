"use client"

import { useState, useRef, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { showSuccessToast, showErrorToast, showLoadingToast } from "@/components/notify/Toast"
import Image from "next/image"

export default function AddPublisherPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const removeLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
    }
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) return

    const form = e.currentTarget
    const formData = new FormData(form)

    // Add logo file to formData if exists
    if (logoFile) {
      formData.set("logo", logoFile)
    }

    // Validate form
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    if (!username || !password || !name) {
      showErrorToast("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      const loadingToast = showLoadingToast("Adding publisher...")

      const response = await fetch("/api/publishers", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        showSuccessToast("Publisher added successfully")
        router.push("/SuperAdmins/publishers")
      } else {
        showErrorToast(data.message || "Failed to add publisher")
      }
    } catch (error) {
      console.error("Error adding publisher:", error)
      showErrorToast("An error occurred while adding the publisher")
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
          Back to Publishers
        </button>
        <h1 className="text-2xl font-bold">Add New Publisher</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Publisher Details */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Publisher Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter publisher name"
                        className="bg-zinc-900 border-zinc-700"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="Enter username"
                          className="bg-zinc-900 border-zinc-700"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter password"
                          className="bg-zinc-900 border-zinc-700"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Enter publisher description"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="servicesFee" className="block text-sm font-medium mb-1">
                          Services Fee (%)
                        </label>
                        <Input
                          id="servicesFee"
                          name="servicesFee"
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="30.0"
                          defaultValue="30.0"
                          className="bg-zinc-900 border-zinc-700"
                        />
                      </div>

                      <div>
                        <label htmlFor="publisherWeb" className="block text-sm font-medium mb-1">
                          Website
                        </label>
                        <Input
                          id="publisherWeb"
                          name="publisherWeb"
                          placeholder="https://example.com"
                          className="bg-zinc-900 border-zinc-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Publisher Logo</label>

                      <div
                        className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center cursor-pointer hover:border-zinc-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          name="logo"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />

                        <Upload className="h-10 w-10 mx-auto text-zinc-500 mb-2" />
                        <p className="text-zinc-400">Click to upload or drag and drop</p>
                        <p className="text-xs text-zinc-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>

                    {logoPreview && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Logo Preview</label>

                        <div className="relative group w-48 h-48 mx-auto">
                          <div className="w-full h-full relative rounded-md overflow-hidden border border-zinc-700">
                            <Image
                              src={logoPreview || "/placeholder.svg"}
                              alt="Logo preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeLogo}
                          >
                            <X className="h-4 w-4" />
                          </button>
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
                    {isSubmitting ? "Adding Publisher..." : "Add Publisher"}
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
