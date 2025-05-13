"use client"

import { useState, useEffect } from "react"
import { Filter, Search, Settings, ChevronLeft, ChevronRight, Plus, Trash, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type Order, OrderCard } from "@/components/order-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

// Define the Order type based on the schema
interface OrderData {
  id: number
  userID: number
  totalPrice: number
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunding" | "Refunded"
  createdAt: string
  updatedAt: string
  notes: string
  // Additional fields for UI display
  user?: {
    name: string
    avatar: string
    location: string
    country: string
  }
  product?: {
    image: string
    quantity: number
  }
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null)
  const [newOrder, setNewOrder] = useState<Partial<OrderData>>({
    userID: 0,
    totalPrice: 0,
    orderStatus: "Pending",
    notes: "",
  })

  const ordersPerPage = 5

  // Fetch orders, users, and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, these would be API calls
        // For now, we'll use mock data
        const mockOrders = [
          {
            id: 1,
            userID: 1,
            totalPrice: 1500.0,
            orderStatus: "Processing",
            createdAt: "2025-03-18T15:26:00",
            updatedAt: "2025-03-18T15:26:00",
            notes: "Express delivery requested",
            user: {
              name: "Santipab Tongchan",
              avatar: "9d0c44febd0f539d6bdc2bac6ef8e6f2.png",
              location: "Surin",
              country: "Thailand",
            },
            product: {
              image: "dcfbd4a80d735ed524c31123e084659c.png",
              quantity: 2,
            },
          },
          {
            id: 2,
            userID: 2,
            totalPrice: 2800.0,
            orderStatus: "Pending",
            createdAt: "2025-03-17T12:40:00",
            updatedAt: "2025-03-17T12:40:00",
            notes: "Gift wrapping",
            user: {
              name: "Song Jin Woo",
              avatar: "5861e0f46ef92ca30b2e3bf5f3412863.png",
              location: "Pakchong, Korat",
              country: "Thailand",
            },
            product: {
              image: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
              quantity: 4,
            },
          },
          {
            id: 3,
            userID: 3,
            totalPrice: 12000.0,
            orderStatus: "Cancelled",
            createdAt: "2025-03-16T11:15:00",
            updatedAt: "2025-03-16T11:15:00",
            notes: "Customer cancelled",
            user: {
              name: "Kirito",
              avatar: "15e79c509e5a3a3b09117fd3dd960f70.png",
              location: "Pracha Uthit, Bang Mod",
              country: "Thailand",
            },
            product: {
              image: "2c4c88e9ecc12670d82aece0ec209b09.png",
              quantity: 20,
            },
          },
          {
            id: 4,
            userID: 4,
            totalPrice: 0.0,
            orderStatus: "Refunded",
            createdAt: "2025-03-20T08:40:00",
            updatedAt: "2025-03-20T08:40:00",
            notes: "Product damaged during shipping",
            user: {
              name: "Remu",
              avatar: "5da204754376289f2469c71ad69b2fd99411d5b0.jpg",
              location: "Tokyo",
              country: "Japan",
            },
            product: {
              image: "f9657989f2f325adb5a1a578f97643ab.png",
              quantity: 0,
            },
          },
        ] as OrderData[]

        const mockUsers = [
          { id: 1, name: "Santipab Tongchan" },
          { id: 2, name: "Song Jin Woo" },
          { id: 3, name: "Kirito" },
          { id: 4, name: "Remu" },
        ]

        const mockProducts = [
          { id: 1, name: "D&D Player's Handbook", price: 750.0 },
          { id: 2, name: "Dungeon Master's Guide", price: 700.0 },
          { id: 3, name: "Monster Manual", price: 600.0 },
        ]

        setOrders(mockOrders)
        setUsers(mockUsers)
        setProducts(mockProducts)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.notes?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  // Handle adding a new order
  const handleAddOrder = async () => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll just update the state
      const newOrderWithId = {
        ...newOrder,
        id: orders.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: users.find((u) => u.id === newOrder.userID),
        product: {
          image: "dcfbd4a80d735ed524c31123e084659c.png",
          quantity: 1,
        },
      } as OrderData

      setOrders([...orders, newOrderWithId])
      setIsAddDialogOpen(false)
      setNewOrder({
        userID: 0,
        totalPrice: 0,
        orderStatus: "Pending",
        notes: "",
      })
    } catch (error) {
      console.error("Error adding order:", error)
    }
  }

  // Handle editing an order
  const handleEditOrder = async () => {
    if (!currentOrder) return

    try {
      // In a real implementation, this would be an API call
      // For now, we'll just update the state
      const updatedOrders = orders.map((order) =>
        order.id === currentOrder.id ? { ...currentOrder, updatedAt: new Date().toISOString() } : order,
      )

      setOrders(updatedOrders)
      setIsEditDialogOpen(false)
      setCurrentOrder(null)
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  // Handle deleting an order
  const handleDeleteOrder = async () => {
    if (!currentOrder) return

    try {
      // In a real implementation, this would be an API call
      // For now, we'll just update the state
      const updatedOrders = orders.filter((order) => order.id !== currentOrder.id)

      setOrders(updatedOrders)
      setIsDeleteDialogOpen(false)
      setCurrentOrder(null)
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  // Convert OrderData to Order type for OrderCard component
  const convertToOrderCardType = (orderData: OrderData): Order => {
    return {
      id: orderData.id,
      productImage: orderData.product?.image || "",
      quantity: orderData.product?.quantity || 0,
      client: {
        name: orderData.user?.name || "Unknown",
        avatar: orderData.user?.avatar || "",
        location: orderData.user?.location || "",
        country: orderData.user?.country || "",
      },
      status: orderData.orderStatus as any,
      date: new Date(orderData.createdAt).toLocaleString("th-TH"),
    }
  }

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      {/* Header with search and filters */}
      <div className="px-6 pb-3 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search orders..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset page when searching
              }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-zinc-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
              <DialogHeader>
                <DialogTitle>Add New Order</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user" className="text-right">
                    User
                  </Label>
                  <Select
                    onValueChange={(value) => setNewOrder({ ...newOrder, userID: Number.parseInt(value) })}
                    defaultValue={newOrder.userID?.toString() || ""}
                  >
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Total Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newOrder.totalPrice || ""}
                    onChange={(e) => setNewOrder({ ...newOrder, totalPrice: Number.parseFloat(e.target.value) })}
                    className="col-span-3 bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) => setNewOrder({ ...newOrder, orderStatus: value as any })}
                    defaultValue={newOrder.orderStatus}
                  >
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Refunding">Refunding</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={newOrder.notes || ""}
                    onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                    className="col-span-3 bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-zinc-700">
                  Cancel
                </Button>
                <Button onClick={handleAddOrder} className="bg-red-600 hover:bg-red-700">
                  Add Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="border-zinc-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-zinc-700 text-white p-2">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="space-y-4">
          {currentOrders.map((order) => (
            <div key={order.id} className="relative group">
              <OrderCard order={convertToOrderCardType(order)} />

              {/* Hover actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                  onClick={() => {
                    setCurrentOrder(order)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-zinc-800 border-zinc-700 hover:bg-red-900"
                  onClick={() => {
                    setCurrentOrder(order)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {currentOrders.length === 0 && !loading && (
            <div className="text-center py-10 text-zinc-400">
              No orders found. Try adjusting your search or add a new order.
            </div>
          )}

          {loading && <div className="text-center py-10 text-zinc-400">Loading orders...</div>}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {currentOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-user" className="text-right">
                  User
                </Label>
                <Select
                  value={currentOrder.userID.toString()}
                  onValueChange={(value) => setCurrentOrder({ ...currentOrder, userID: Number.parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Total Price
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={currentOrder.totalPrice}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, totalPrice: Number.parseFloat(e.target.value) })}
                  className="col-span-3 bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={currentOrder.orderStatus}
                  onValueChange={(value) => setCurrentOrder({ ...currentOrder, orderStatus: value as any })}
                >
                  <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Refunding">Refunding</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  value={currentOrder.notes || ""}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, notes: e.target.value })}
                  className="col-span-3 bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-zinc-700">
              Cancel
            </Button>
            <Button onClick={handleEditOrder} className="bg-red-600 hover:bg-red-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 text-white border-zinc-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This action cannot be undone. This will permanently delete the order
              {currentOrder && ` #${currentOrder.id}`} and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer Pagination */}
      <div className="relative w-full">
        {filteredOrders.length > ordersPerPage && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50">
            <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-full">
              <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-full overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1b1b1b]/90 backdrop-blur-sm">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-zinc-700 hover:bg-magic-red hover:text-white transition-colors"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {[...Array(totalPages)].map((_, index) => {
                    const number = index + 1
                    return (
                      <Button
                        key={number}
                        variant={currentPage === number ? "default" : "outline"}
                        className={`h-10 w-10 rounded-full p-0 ${
                          currentPage === number ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                        } transition-colors`}
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-zinc-700 hover:bg-magic-red hover:text-white transition-colors"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
