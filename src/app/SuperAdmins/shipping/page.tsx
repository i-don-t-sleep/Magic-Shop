"use client"

import { useState, useEffect } from "react"
import { Filter, Search, Plus, Edit, Trash, Package, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type ShippingItem, ShippingCard } from "@/components/shipping-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { showSuccessToast, showErrorToast } from "@/components/notify/Toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Courier {
  id: number
  name: string
  api_key: string
  defaultFee: number
}

interface Address {
  id: number
  contactInfoId: number
  addressLine1: string
  addressLine2: string | null
  city: string
  country: string
  postalCode: string
  contactName?: string // From join with contactinfo
}

interface Order {
  id: number
  userID: number
  totalPrice: number
  orderStatus: string
  createdAt: string
  updatedAt: string
  notes: string | null
  userName?: string // From join with users
  productName?: string // From join with orderitems and products
}

interface ShippingRecord {
  parcel_number: string
  orderID: number | null
  shippingFee: number
  actualDeliveryDate: string | null
  sourceAddressID: number | null
  currentAddressID: number
  destinationAddressID: number | null
  courierID: number | null
  createdAt: string
  updatedAt: string
  order?: Order
  sourceAddress?: Address
  currentAddress?: Address
  destinationAddress?: Address
  courier?: Courier
}

export default function ShippingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [shippingItems, setShippingItems] = useState<ShippingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add/Edit shipping dialog
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentShipping, setCurrentShipping] = useState<ShippingRecord | null>(null)

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [shippingToDelete, setShippingToDelete] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState<Partial<ShippingRecord>>({
    parcel_number: "",
    orderID: null,
    shippingFee: 0,
    sourceAddressID: null,
    currentAddressID: 0,
    destinationAddressID: null,
    courierID: null,
  })

  // Reference data
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // Fetch shipping data
  useEffect(() => {
    fetchShippingData()
    fetchReferenceData()
  }, [])

 
  const fetchShippingData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/shipping?page=1&limit=50")
      const data = await res.json()
      if (data.success) {
        // แปลงข้อมูลให้เป็น ShippingItem ตามที่ ShippingCard ใช้
        const mapped: ShippingItem[] = data.shipping.map((item: any) => ({
          id: item.parcel_number,
          productImage: "/api/blob/productimages/"+item.productImage,
          productTitle: item.productName,
          client: {
            name: item.userName,
            avatar: "/api/blob/users/"+item.userName,
            location: item.destinationCity,
            country: item.destinationCountry,
          },
          status: item.actualDeliveryDate ? "Delivered" : "In Transit",
          estimatedTime: item.actualDeliveryDate
            ? new Date(item.actualDeliveryDate).toLocaleDateString("th-TH")
            : "Unknown",
          origin: {
            country: item.sourceCountry,
            city: item.sourceCity,
          },
          destination: {
            country: item.destinationCountry,
            city: item.destinationCity,
          },
          trackingSteps: 7,
          currentStep: item.actualDeliveryDate ? 7 : 4, // ปรับตาม logic จริง
        }))
        setShippingItems(mapped)
      } else {
        setError("Failed to fetch shipping data")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to load shipping data")
    } finally {
      setLoading(false)
    }
  }

  const fetchReferenceData = async () => {
    try {
      const [couriersRes, addressesRes, ordersRes] = await Promise.all([
        fetch("/api/shipping/couriers"),
        fetch("/api/shipping/addresses"),
        fetch("/api/shipping/orders"),
      ])

      const [couriersData, addressesData, ordersData] = await Promise.all([
        couriersRes.json(),
        addressesRes.json(),
        ordersRes.json(),
      ])

      if (couriersData.success) setCouriers(couriersData.couriers)
      if (addressesData.success) setAddresses(addressesData.addresses)
      if (ordersData.success) setOrders(ordersData.orders)
    } catch (error) {
      console.error("Error fetching reference data:", error)
      showErrorToast("Failed to load reference data")
    }
  }

  const handleAddShipping = () => {
    setIsEditing(false)
    setCurrentShipping(null)
    setFormData({
      parcel_number: "",
      orderID: null,
      shippingFee: 0,
      sourceAddressID: null,
      currentAddressID: 0,
      destinationAddressID: null,
      courierID: null,
    })
    setShippingDialogOpen(true)
  }

  const handleEditShipping = (parcelNumber: string) => {
    // In a real app, you would fetch the shipping record by parcel number
    // For now, we'll just set a mock record
    const mockShippingRecord: ShippingRecord = {
      parcel_number: parcelNumber,
      orderID: 1,
      shippingFee: 50.0,
      actualDeliveryDate: null,
      sourceAddressID: 1,
      currentAddressID: 1,
      destinationAddressID: 2,
      courierID: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setIsEditing(true)
    setCurrentShipping(mockShippingRecord)
    setFormData(mockShippingRecord)
    setShippingDialogOpen(true)
  }

  const handleDeleteShipping = (parcelNumber: string) => {
    setShippingToDelete(parcelNumber)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteShipping = async () => {
    if (!shippingToDelete) return

    try {
      // In a real app, you would call an API to delete the shipping record
      // For now, we'll just show a success message
      showSuccessToast(`Shipping record ${shippingToDelete} deleted successfully`)

      // Update the UI by removing the deleted item
      setShippingItems(shippingItems.filter((item) => item.id.toString() !== shippingToDelete))
    } catch (err) {
      console.error("Error deleting shipping record:", err)
      showErrorToast("Failed to delete shipping record")
    } finally {
      setDeleteDialogOpen(false)
      setShippingToDelete(null)
    }
  }

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmitShipping = async () => {
    try {
      // Validate form data
      if (!formData.parcel_number) {
        showErrorToast("Parcel number is required")
        return
      }

      if (!formData.currentAddressID) {
        showErrorToast("Current address is required")
        return
      }

      // In a real app, you would call an API to save the shipping record
      // For now, we'll just show a success message
      if (isEditing) {
        showSuccessToast(`Shipping record ${formData.parcel_number} updated successfully`)
      } else {
        showSuccessToast(`Shipping record ${formData.parcel_number} created successfully`)
      }

      // Close the dialog
      setShippingDialogOpen(false)

      // Refresh the shipping data
      fetchShippingData()
    } catch (err) {
      console.error("Error saving shipping record:", err)
      showErrorToast("Failed to save shipping record")
    }
  }

  const filteredItems = shippingItems.filter(
    (item) =>
      item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <div className="px-6 pb-3 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search items..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="border-zinc-700 text-white" onClick={fetchShippingData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button variant="outline" className="border-zinc-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <Button className="bg-red-600 hover:bg-red-700" onClick={handleAddShipping}>
            <Plus className="h-4 w-4 mr-2" />
            Add Shipping
          </Button>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/30 border border-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-zinc-600" />
            <p className="text-lg font-medium mb-1">No shipping items found</p>
            <p className="text-sm">Try adjusting your search or add a new shipping record</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative group">
                <ShippingCard item={item} />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 bg-zinc-800/80 border-zinc-700 hover:bg-zinc-700"
                    onClick={() => handleEditShipping(item.id.toString())}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 bg-zinc-800/80 border-zinc-700 hover:bg-red-900/80 text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteShipping(item.id.toString())}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Shipping Dialog */}
      <Dialog open={shippingDialogOpen} onOpenChange={setShippingDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Shipping Record" : "Add New Shipping Record"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="parcel_number" className="text-sm font-medium">
                Parcel Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="parcel_number"
                value={formData.parcel_number || ""}
                onChange={(e) => handleFormChange("parcel_number", e.target.value)}
                placeholder="Enter parcel tracking number"
                className="bg-zinc-800 border-zinc-700"
                disabled={isEditing} // Can't change parcel number when editing
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="orderID" className="text-sm font-medium">
                Order
              </label>
              <Select
                value={formData.orderID?.toString() || ""}
                onValueChange={(value) => handleFormChange("orderID", value ? Number.parseInt(value) : null)}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select an order" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="none">None</SelectItem>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={order.id.toString()}>
                      #{order.id} - {order.userName} - {order.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="courierID" className="text-sm font-medium">
                Courier
              </label>
              <Select
                value={formData.courierID?.toString() || ""}
                onValueChange={(value) => handleFormChange("courierID", value ? Number.parseInt(value) : null)}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select a courier" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="none">None</SelectItem>
                  {couriers.map((courier) => (
                    <SelectItem key={courier.id} value={courier.id.toString()}>
                      {courier.name} (${typeof courier.defaultFee === "number" ? courier.defaultFee.toFixed(2) : "N/A"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="shippingFee" className="text-sm font-medium">
                Shipping Fee (฿)
              </label>
              <Input
                id="shippingFee"
                type="number"
                min="0"
                step="0.01"
                value={formData.shippingFee || 0}
                onChange={(e) => handleFormChange("shippingFee", Number.parseFloat(e.target.value))}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sourceAddressID" className="text-sm font-medium">
                Source Address
              </label>
              <Select
                value={formData.sourceAddressID?.toString() || ""}
                onValueChange={(value) => handleFormChange("sourceAddressID", value ? Number.parseInt(value) : null)}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select source address" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="none">None</SelectItem>
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id.toString()}>
                      {address.contactName} - {address.addressLine1}, {address.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="currentAddressID" className="text-sm font-medium">
                Current Address <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.currentAddressID?.toString() || ""}
                onValueChange={(value) => handleFormChange("currentAddressID", Number.parseInt(value))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select current address" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id.toString()}>
                      {address.contactName} - {address.addressLine1}, {address.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="destinationAddressID" className="text-sm font-medium">
                Destination Address
              </label>
              <Select
                value={formData.destinationAddressID?.toString() || ""}
                onValueChange={(value) =>
                  handleFormChange("destinationAddressID", value ? Number.parseInt(value) : null)
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select destination address" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="none">None</SelectItem>
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id.toString()}>
                      {address.contactName} - {address.addressLine1}, {address.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isEditing && (
              <div className="space-y-2">
                <label htmlFor="actualDeliveryDate" className="text-sm font-medium">
                  Actual Delivery Date
                </label>
                <Input
                  id="actualDeliveryDate"
                  type="datetime-local"
                  value={
                    formData.actualDeliveryDate ? new Date(formData.actualDeliveryDate).toISOString().slice(0, 16) : ""
                  }
                  onChange={(e) =>
                    handleFormChange(
                      "actualDeliveryDate",
                      e.target.value ? new Date(e.target.value).toISOString() : null,
                    )
                  }
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShippingDialogOpen(false)} className="border-zinc-700">
              Cancel
            </Button>
            <Button onClick={handleSubmitShipping} className="bg-red-600 hover:bg-red-700">
              {isEditing ? "Update" : "Create"} Shipping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shipping Record</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this shipping record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDeleteShipping}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
