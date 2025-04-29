"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Publisher {
  id: number
  name: string
  logo: string
}

interface Complaint {
  id: number
  userId: string
  issue: string
}

export default function PublishersPage() {
  const [publishers] = useState<Publisher[]>([
    { id: 1, name: "Hasbro", logo: "hasbro.png" },
    { id: 2, name: "Geekify", logo: "geekify.png" },
    { id: 3, name: "Inkarnate", logo: "inkarnate.png" },
  ])

  const [complaints] = useState<Complaint[]>([
    { id: 1, userId: "User#19845", issue: "Missing Product" },
    { id: 2, userId: "User#25786", issue: "Payment Failed" },
    { id: 3, userId: "User#86123", issue: "Shipping Failed" },
    { id: 4, userId: "User#34567", issue: "Missing Product" },
    { id: 5, userId: "User#45624", issue: "Defective Product" },
  ])

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2 p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden h-full">
            <div className="flex items-center justify-center h-full">
              <div className="text-2xl text-zinc-500">MOCK UP</div>
            </div>
          </div>
        </div>

        {/* Requests sidebar */}
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-medium mb-4">Requests</h2>
              <div className="space-y-4">
                {publishers.map((publisher) => (
                  <div key={publisher.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                        <Image
                          src={`/api/image?path=publishers/${publisher.logo}`}
                          alt={publisher.name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span>{publisher.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 rounded-full p-0">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Total Complaints Chart */}
        <div className="lg:col-span-2 p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Total Complaints</h2>
                <Button variant="outline" className="border-zinc-700 text-white h-8">
                  month <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <ComplaintsChart />
            </div>
          </div>
        </div>

        {/* Complaints Reports */}
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Complaints Reports</h2>
                <div className="text-xs text-zinc-400">Complaints</div>
              </div>
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
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
                          className="h-3 w-3"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <span>{complaint.userId}</span>
                    </div>
                    <span className="text-sm">{complaint.issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComplaintsChart() {
  return (
    <div className="h-48 relative">
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-zinc-500">
        <div>400</div>
        <div>300</div>
        <div>200</div>
        <div>100</div>
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
            <linearGradient id="complaintsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8443c" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e8443c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,180 C50,170 100,160 150,150 C200,140 250,130 300,80 C350,30 400,120 450,140 C500,160 550,100 600,120 C650,140 700,100 750,80 L800,100 L800,200 L0,200 Z"
            fill="url(#complaintsGradient)"
          />
          <path
            d="M0,180 C50,170 100,160 150,150 C200,140 250,130 300,80 C350,30 400,120 450,140 C500,160 550,100 600,120 C650,140 700,100 750,80 L800,100"
            fill="none"
            stroke="#e8443c"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  )
}
