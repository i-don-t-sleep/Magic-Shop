"use client"

import { useState } from "react"
import { ChevronDown, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HotSale {
  id: number
  rank: number
  name: string
  amount: number
}

export default function ReportsPage() {
  const [hotSales] = useState<HotSale[]>([
    { id: 1, rank: 1, name: "2024 Dungeon Master's guide", amount: 20184 },
    { id: 2, rank: 2, name: "2024 Player's Handbook Digital...", amount: 14502 },
    { id: 3, rank: 3, name: "Quest from the infinity stairc...", amount: 10230 },
    { id: 4, rank: 4, name: "Vecna: Eve of Ruin Digital", amount: 8769 },
    { id: 5, rank: 5, name: "D&D Campaign Case: Crea...", amount: 5450 },
    { id: 6, rank: 6, name: "D&D Expansion Gift Set Digit...", amount: 1256 },
  ])

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <div className="px-6 pb-3 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button variant="outline" className="border-zinc-700 text-white">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Income Chart */}
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Total income</h2>
                <Button variant="outline" className="border-zinc-700 text-white h-8">
                  month <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <IncomeChart />
            </div>
          </div>
        </div>

        {/* Hot Sales */}
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Hot Sales</h2>
                <div className="text-xs text-zinc-400">Purchase amount</div>
              </div>
              <div className="space-y-4">
                {hotSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-zinc-400">{sale.rank}.</span>
                      <span>{sale.name}</span>
                    </div>
                    <span className="text-sm">{sale.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="lg:col-span-2 flex justify-end">
          <Button variant="outline" className="border-zinc-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Download .csv
          </Button>
        </div>
      </div>
    </div>
  )
}

function IncomeChart() {
  return (
    <div className="h-48 relative">
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-zinc-500">
        <div>40k</div>
        <div>30k</div>
        <div>20k</div>
        <div>10k</div>
        <div>0</div>
      </div>
      <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs text-zinc-500">
        <div>Jan</div>
        <div>Feb</div>
        <div>Mar</div>
        <div>Apr</div>
        <div>May</div>
        <div>Jul</div>
        <div>Jun</div>
        <div>Aug</div>
        <div>Sep</div>
        <div>Oct</div>
        <div>Nov</div>
        <div>Dec</div>
      </div>
      <div className="absolute left-10 top-0 right-0 bottom-5">
        <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8443c" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e8443c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,150 C50,140 100,160 150,140 C200,120 250,130 300,100 C350,70 400,90 450,80 C500,70 550,90 600,80 C650,70 700,90 750,70 L800,60 L800,200 L0,200 Z"
            fill="url(#incomeGradient)"
          />
          <path
            d="M0,150 C50,140 100,160 150,140 C200,120 250,130 300,100 C350,70 400,90 450,80 C500,70 550,90 600,80 C650,70 700,90 750,70 L800,60"
            fill="none"
            stroke="#e8443c"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  )
}
