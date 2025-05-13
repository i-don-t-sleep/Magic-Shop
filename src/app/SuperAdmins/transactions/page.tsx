"use client"

import { useState, useEffect } from "react"
import { Filter, Search, Settings, Plus, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TransactionCard, type Transaction } from "@/components/transaction-card"
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

// Define the Refund type based on the schema
interface RefundData {
  id: number
  orderID: number
  userID: number
  refundAmount: number
  reason: string
  status: "requested" | "processing" | "refunded" | "rejected"
  requestedAt: string
  processedAt?: string
  approveBy?: number
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
  paymentMethod?: {
    type: string
    logo: string
  }
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [refunds, setRefunds] = useState<RefundData[]>([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRefund, setCurrentRefund] = useState<RefundData | null>(null)
  const [newRefund, setNewRefund] = useState<Partial<RefundData>>({
    orderID: 0,
    userID: 0,
    refundAmount: 0,
    reason: "",
    status: "requested",
  })

  // Fetch refunds, users, and orders on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, these would be API calls
        // For now, we'll use mock data
        const mockRefunds = [
          {
            id: 1,
            orderID: 1,
            userID: 1,
            refundAmount: 1500.0,
            reason: "Product damaged during shipping",
            status: "refunded",
            requestedAt: "2025-03-18T15:26:00",
            processedAt: "2025-03-19T10:15:00",
            approveBy: 5,
            user: {
              name: "Santipab Tongchan",
              avatar: "9d0c44febd0f539d6bdc2bac6ef8e6f2.png",
              location: "Surin",
              country: "Thailand",
            },
            product: {
              image: "cf27466446e6da568b1eae990514f787.png",
              quantity: 2,
            },
            paymentMethod: {
              type: "Mastercard",
              logo: "mastercard.png",
            },
          },
          {
            id: 2,
            orderID: 2,
            userID: 2,
            refundAmount: 2800.0,
            reason: "Wrong item received",
            status: "processing",
            requestedAt: "2025-03-17T12:40:00",
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
            paymentMethod: {
              type: "Prompt Pay",
              logo: "promptpay.png",
            },
          },
          {
            id: 3,
            orderID: 3,
            userID: 3,
            refundAmount: 12000.0,
            reason: "Changed mind",
            status: "rejected",
            requestedAt: "2025-03-16T11:15:00",
            processedAt: "2025-03-17T09:30:00",
            approveBy: 5,
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
            paymentMethod: {
              type: "Bitcoin",
              logo: "bitcoin.png",
            },
          },
          {
            id: 4,
            orderID: 4,
            userID: 4,
            refundAmount: 500.0,
            reason: "Item not as described",
            status: "requested",
            requestedAt: "2025-03-20T08:40:00",
            user: {
              name: "Remu",
              avatar: "64f86257b99f4965a1f087852cbf7016.png",
              location: "Tokyo",
              country: "Japan",
            },
            product: {
              image: "dcfbd4a80d735ed524c31123e084659c.png",
              quantity: 0,
            },
            paymentMethod: {
              type: "Mastercard",
              logo: "mastercard.png",
            },
          },
        ] as RefundData[]

        const mockUsers = [
          { id: 1, name: "Santipab Tongchan" },
          { id: 2, name: "Song Jin Woo" },
          { id: 3, name: "Kirito" },
          { id: 4, name: "Remu" },
          { id: 5, name: "Admin User" },
        ]

        const mockOrders = [
          { id: 1, userID: 1, totalPrice: 1500.0 },
          { id: 2, userID: 2, totalPrice: 2800.0 },
          { id: 3, userID: 3, totalPrice: 12000.0 },
          { id: 4, userID: 4, totalPrice: 500.0 },
        ]

        setRefunds(mockRefunds)
        setUsers(mockUsers)
        setOrders(mockOrders)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter refunds based on search query
  const filteredRefunds = refunds.filter(
    (refund) =>
      refund.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.paymentMethod?.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.reason.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle adding a new refund
  const handleAddRefund = async () => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll just update the state
      const newRefundWithId = {
        ...newRefund,
        id: refunds.length + 1,
        requestedAt: new Date().toISOString(),
        user: users.find((u) => u.id === newRefund.userID),
        product: {
          image: "dcfbd4a80d735ed524c31123e084659c.png",
          quantity: 1,
        },
        paymentMethod: {
          type: "Mastercard",
          logo: "mastercard.png",
        },
      } as RefundData

      setRefunds([...refunds, newRefundWithId])
      setIsAddDialogOpen(false)
      setNewRefund({
        orderID: 0,
        userID: 0,
        refundAmount: 0,
        reason: "",
        status: "requested",
      })
    } catch (error) {
      console.error("Error adding refund:", error)
    }
  }

  // Handle editing a refund
  const handleEditRefund = async () => {
    if (!currentRefund) return

    try {
      // In a real implementation, this would be an API call
      // For now, we'll just update the state
      const updatedRefunds = refunds.map((refund) =>
        refund.id === currentRefund.id
          ? {
              ...currentRefund,
              processedAt:
                currentRefund.status === "refunded" || currentRefund.status === "rejected"
                  ? new Date().toISOString()
                  : currentRefund.processedAt,
            }
          : refund,
      )

      setRefunds(updatedRefunds)
      setIsEditDialogOpen(false)
      setCurrentRefund(null)
    } catch (error) {
      console.error("Error updating refund:", error)
    }
  }

  // Handle deleting a refund
  const handleDeleteRefund = async () => {
    if (!currentRefund) return

    try {
      // In a real implementation, this would be an API call
      // For now, we'll just update the state
      const updatedRefunds = refunds.filter((refund) => refund.id !== currentRefund.id)

      setRefunds(updatedRefunds)
      setIsDeleteDialogOpen(false)
      setCurrentRefund(null)
    } catch (error) {
      console.error("Error deleting refund:", error)
    }
  }

  // Convert RefundData to Transaction type for TransactionCard component
  const convertToTransactionCardType = (refundData: RefundData): Transaction => {
    return {
      id: refundData.id,
      productImage: refundData.product?.image || "",
      quantity: refundData.product?.quantity || 0,
      client: {
        name: refundData.user?.name || "Unknown",
        avatar: refundData.user?.avatar || "",
        location: refundData.user?.location || "",
        country: refundData.user?.country || "",
      },
      paymentMethod: {
        type: refundData.paymentMethod?.type || "Unknown",
        logo: refundData.paymentMethod?.logo || "",
      },
      status:
        refundData.status === "refunded"
          ? "Complete"
          : refundData.status === "processing"
            ? "Pending"
            : refundData.status === "rejected"
              ? "Failed"
              : "Pending",
      isRefund: true,
      date: new Date(refundData.requestedAt).toLocaleString("th-TH"),
    }
  }

  // Get status label for display
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "requested":
        return "Requested"
      case "processing":
        return "Processing"
      case "refunded":
        return "Refunded"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <div className="px-6 pb-3 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search refunds..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-zinc-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Refund
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
              <DialogHeader>
                <DialogTitle>Add New Refund</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="order" className="text-right">
                    Order
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const orderId = Number.parseInt(value)
                      const order = orders.find((o) => o.id === orderId)
                      setNewRefund({
                        ...newRefund,
                        orderID: orderId,
                        userID: order?.userID || 0,
                        refundAmount: order?.totalPrice || 0,
                      })
                    }}
                    defaultValue={newRefund.orderID?.toString() || ""}
                  >
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select an order" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.id.toString()}>
                          Order #{order.id} - ${order.totalPrice.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Refund Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newRefund.refundAmount || ""}
                    onChange={(e) => setNewRefund({ ...newRefund, refundAmount: Number.parseFloat(e.target.value) })}
                    className="col-span-3 bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) => setNewRefund({ ...newRefund, status: value as any })}
                    defaultValue={newRefund.status}
                  >
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">
                    Reason
                  </Label>
                  <Textarea
                    id="reason"
                    value={newRefund.reason || ""}
                    onChange={(e) => setNewRefund({ ...newRefund, reason: e.target.value })}
                    className="col-span-3 bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-zinc-700">
                  Cancel
                </Button>
                <Button onClick={handleAddRefund} className="bg-red-600 hover:bg-red-700">
                  Add Refund
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

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="space-y-4">
          {filteredRefunds.map((refund) => (
            <div key={refund.id} className="relative group">
              <TransactionCard transaction={convertToTransactionCardType(refund)} />

              {/* Hover actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                  onClick={() => {
                    setCurrentRefund(refund)
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
                    setCurrentRefund(refund)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {filteredRefunds.length === 0 && !loading && (
            <div className="text-center py-10 text-zinc-400">
              No refunds found. Try adjusting your search or add a new refund.
            </div>
          )}

          {loading && <div className="text-center py-10 text-zinc-400">Loading refunds...</div>}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>Edit Refund</DialogTitle>
          </DialogHeader>
          {currentRefund && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-order" className="text-right">
                  Order
                </Label>
                <Select
                  value={currentRefund.orderID.toString()}
                  onValueChange={(value) => {
                    const orderId = Number.parseInt(value)
                    const order = orders.find((o) => o.id === orderId)
                    setCurrentRefund({
                      ...currentRefund,
                      orderID: orderId,
                      userID: order?.userID || currentRefund.userID,
                    })
                  }}
                >
                  <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select an order" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id.toString()}>
                        Order #{order.id} - ${order.totalPrice.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-amount" className="text-right">
                  Refund Amount
                </Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={currentRefund.refundAmount}
                  onChange={(e) =>
                    setCurrentRefund({ ...currentRefund, refundAmount: Number.parseFloat(e.target.value) })
                  }
                  className="col-span-3 bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={currentRefund.status}
                  onValueChange={(value) => setCurrentRefund({ ...currentRefund, status: value as any })}
                >
                  <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="requested">Requested</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-reason" className="text-right">
                  Reason
                </Label>
                <Textarea
                  id="edit-reason"
                  value={currentRefund.reason || ""}
                  onChange={(e) => setCurrentRefund({ ...currentRefund, reason: e.target.value })}
                  className="col-span-3 bg-zinc-800 border-zinc-700"
                />
              </div>
              {(currentRefund.status === "refunded" || currentRefund.status === "rejected") && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-approver" className="text-right">
                    Approved By
                  </Label>
                  <Select
                    value={currentRefund.approveBy?.toString() || ""}
                    onValueChange={(value) => setCurrentRefund({ ...currentRefund, approveBy: Number.parseInt(value) })}
                  >
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select an approver" />
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
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-zinc-700">
              Cancel
            </Button>
            <Button onClick={handleEditRefund} className="bg-red-600 hover:bg-red-700">
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
              This action cannot be undone. This will permanently delete the refund
              {currentRefund && ` #${currentRefund.id}`} and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRefund} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
