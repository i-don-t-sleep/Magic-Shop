"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, Clock, Filter, Search, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Transaction {
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

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      productImage: "cf27466446e6da568b1eae990514f787.png",
      quantity: 2,
      client: {
        name: "Santipab Tongchan",
        avatar: "9d0c44febd0f539d6bdc2bac6ef8e6f2.png",
        location: "Surin",
        country: "Thailand",
      },
      paymentMethod: {
        type: "Mastercard",
        logo: "mastercard.png",
      },
      status: "Complete",
      date: "18/3/2025 15:26 น.",
    },
    {
      id: 2,
      productImage: "036c70a2a0fc58eb24a89b0d7c4dcdab.png",
      quantity: 4,
      client: {
        name: "Song Jin Woo",
        avatar: "5861e0f46ef92ca30b2e3bf5f3412863.png",
        location: "Pakchong, Korat",
        country: "Thailand",
      },
      paymentMethod: {
        type: "Propmt Pay",
        logo: "promptpay.png",
      },
      status: "Pending",
      date: "17/3/2025 12:40 น.",
    },
    {
      id: 3,
      productImage: "2c4c88e9ecc12670d82aece0ec209b09.png",
      quantity: 20,
      client: {
        name: "Kirito",
        avatar: "15e79c509e5a3a3b09117fd3dd960f70.png",
        location: "Pracha Uthit, Bang Mod",
        country: "Thailand",
      },
      paymentMethod: {
        type: "Bitcoin",
        logo: "bitcoin.png",
      },
      status: "Failed",
      date: "16/3/2025 11:15 น.",
    },
    {
      id: 4,
      productImage: "dcfbd4a80d735ed524c31123e084659c.png",
      quantity: 0,
      client: {
        name: "Remu",
        avatar: "64f86257b99f4965a1f087852cbf7016.png",
        location: "Tokyo",
        country: "Japan",
      },
      paymentMethod: {
        type: "Mastercard",
        logo: "mastercard.png",
      },
      status: "Complete",
      isRefund: true,
      date: "20/3/2025 08:40 น.",
    },
  ])

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.paymentMethod.type.toLowerCase().includes(searchQuery.toLowerCase()),
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
          {filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TransactionCard({ transaction }: { transaction: Transaction }) {
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
                src={`/api/image?path=payment/${transaction.paymentMethod.logo}`}
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
