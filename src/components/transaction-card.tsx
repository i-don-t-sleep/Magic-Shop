import { Check, Clock, Filter, Search, Settings, X } from "lucide-react"
import Image from "next/image"

export interface Transaction {
  id: number
  productImage: string
  quantity: number
  client: {
    name: string
    avatar: string
    location: string
    country: string
  }
  paymentMethod: {
    type: string
    logo: string
  }
  status: "Complete" | "Pending" | "Failed"
  isRefund?: boolean
  date: string
}

export function TransactionCard({ transaction }: { transaction: Transaction }) {
    const getStatusIcon = (status: string) => {
      switch (status) {
        case "Complete":
          return (
            <div className="bg-green-500 rounded-full p-2">
              <Check className="h-6 w-6 text-white" />
            </div>
          )
        case "Pending":
          return (
            <div className="bg-yellow-500 rounded-full p-2">
              <Clock className="h-6 w-6 text-white" />
            </div>
          )
        case "Failed":
          return (
            <div className="bg-red-500 rounded-full p-2">
              <X className="h-6 w-6 text-white" />
            </div>
          )
        default:
          return null
      }
    }
  
    return (
      <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
        <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Product Image */}
              <div className="w-24 h-24 relative">
                <Image
                  src={`/api/image?path=products/${transaction.productImage}`}
                  alt="Product"
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
  
              {/* Quantity */}
              <div className="flex flex-col items-center">
                <span className="text-zinc-400 text-sm">Quantity</span>
                <span className="text-3xl font-bold">{transaction.quantity}</span>
              </div>
  
              {/* Client Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={`/api/image?path=users/${transaction.client.avatar}`}
                    alt={transaction.client.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Client</div>
                  <div className="font-medium">{transaction.client.name}</div>
                  <div className="flex items-center text-xs text-zinc-400">
                    <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full mr-1"></span>
                    {transaction.client.location}, {transaction.client.country}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Payment Method */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <Image
                  src={`/api/image?path=transactions/method/${transaction.paymentMethod.logo}`}
                  alt={transaction.paymentMethod.type}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-sm text-zinc-400">{transaction.isRefund ? "Pay back Method" : "Payment Method"}</div>
                <div className="font-medium text-xl">{transaction.paymentMethod.type}</div>
              </div>
            </div>
  
            {/* Status */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-zinc-400">{transaction.status}</div>
              {getStatusIcon(transaction.status)}
              <div className="text-xs text-zinc-400">{transaction.date}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  