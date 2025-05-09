"use client"

import { useState } from "react"
import { Filter, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TransactionCard, type Transaction } from "@/components/transaction-card"

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
