import Image from "next/image"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

// Order status types
export type OrderStatus = "Processing" | "Pending" | "Cancelled" | "Refunded" | "Complete"

// Order interface
export interface Order {
  id: number
  productImage: string
  quantity: number
  client: {
    name: string
    avatar: string
    location: string
    country: string
  }
  status: OrderStatus
  date: string
}

export function OrderCard({ order }: { order: Order }) {
  // Order status types
  type OrderStatus = "Processing" | "Pending" | "Cancelled" | "Refunded" | "Complete"

  // Order interface
  interface Order {
    id: number
    productImage: string
    quantity: number
    client: {
      name: string
      avatar: string
      location: string
      country: string
    }
    status: OrderStatus
    date: string
  }

  // Get status icon based on order status
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Processing":
        return (
          <div className="bg-blue-500 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </div>
        )
      case "Pending":
        return (
          <div className="bg-yellow-500 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        )
      case "Cancelled":
        return (
          <div className="bg-red-500 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )
      case "Refunded":
        return (
          <div className="bg-gray-500 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
              <path d="M12 3v6" />
            </svg>
          </div>
        )
      case "Complete":
        return (
          <div className="bg-green-500 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
      <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
        <div className="p-4 flex items-center justify-between relative">
          {/* More options button (top right) */}
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="icon" className="text-zinc-400 h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </Button>
          </div>

          <div className="flex items-center gap-6 flex-1">
            {/* Product Image */}
            <div className="w-24 h-24 relative">
              <Image
                src={`/api/image?path=products/${order.productImage}`}
                alt="Product"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col items-center">
              <span className="text-zinc-400 text-sm">Quantity</span>
              <span className="text-3xl font-bold">{order.quantity}</span>
            </div>

            {/* Client Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                <Image
                  src={`/api/image?path=users/${order.client.avatar}`}
                  alt={order.client.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm text-zinc-400">Client</div>
                <div className="font-medium">{order.client.name}</div>
                <div className="flex items-center text-xs text-zinc-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 mr-1"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {order.client.location}, {order.client.country}
                </div>
              </div>
            </div>
          </div>

          {/* Call button */}
          <div className="mx-4">
            <Button variant="outline" size="icon" className="rounded-full border-zinc-700 h-12 w-12">
              <Phone className="h-5 w-5" />
            </Button>
          </div>

          {/* Status */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-zinc-400">Status</div>
            {getStatusIcon(order.status)}
            <div className="text-xl font-medium">{order.status}</div>
            <div className="text-xs text-zinc-400">{order.date}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
