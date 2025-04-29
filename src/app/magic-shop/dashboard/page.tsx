"use client"
import { ChevronDown, Fullscreen, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"

export default function DashboardPage() {
  const [mapZoom, setMapZoom] = useState(1)

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* World Map */}
        <div className="lg:col-span-2 p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden h-full">
            <div className="relative h-full">
              <div className="absolute inset-0">
                <CustomWorldMap zoom={mapZoom} setZoom={setMapZoom} />
              </div>
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Button variant="outline" size="icon" className="bg-zinc-800/80 border-zinc-700 text-white">
                  <Fullscreen className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-zinc-800/80 border-zinc-700 text-white"
                  onClick={() => setMapZoom((prev) => Math.min(prev + 0.2, 3))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-zinc-800/80 border-zinc-700 text-white"
                  onClick={() => setMapZoom((prev) => Math.max(prev - 0.2, 0.5))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col gap-6">
          <StatsCard title="Orders Completed" value="7468" subtitle="in 30 days" />
          <StatsCard title="New Users" value="1269" subtitle="in 30 days" />
        </div>

        {/* Total Income Chart */}
        <div className="lg:col-span-2 p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
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

        {/* Product Status */}
        <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-medium mb-4">Product Status</h2>
              <ProductStatusList />
            </div>
          </div>
        </div>

        {/* Miniatures Chart */}
        <div className="lg:col-span-2 p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
          <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
            <div className="p-4 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-4xl font-bold">55%</div>
                  <div className="text-sm text-zinc-400">miniatures</div>
                </div>
                <MiniaturesPieChart />
              </div>
            </div>
            <div className="px-4 pb-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                <span className="text-sm">Books</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-800"></span>
                <span className="text-sm">Merch</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="text-sm">Miniatures</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px] h-full">
      <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden h-full">
        <div className="p-6 flex flex-col justify-center h-full">
          <h2 className="text-xl font-medium mb-2">{title}</h2>
          <div className="text-6xl font-bold mb-1">{value}</div>
          <div className="text-zinc-400">{subtitle}</div>
        </div>
      </div>
    </div>
  )
}

function CustomWorldMap({ zoom, setZoom }) {
  const svgRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [tooltip, setTooltip] = useState({ show: false, content: "", x: 0, y: 0 })

  // Sample sales data for different regions
  const regionData = [
    { id: "north-america", name: "North America", intensity: 0.9, cx: 200, cy: 180 },
    { id: "south-america", name: "South America", intensity: 0.7, cx: 300, cy: 350 },
    { id: "europe", name: "Europe", intensity: 0.8, cx: 480, cy: 170 },
    { id: "africa", name: "Africa", intensity: 0.5, cx: 480, cy: 300 },
    { id: "asia", name: "Asia", intensity: 0.85, cx: 650, cy: 200 },
    { id: "oceania", name: "Oceania", intensity: 0.6, cx: 750, cy: 380 },
  ]

  // Function to get color based on intensity
  const getColor = (intensity) => {
    // Create a color scale from dark red to bright red
    const minColor = [74, 26, 26] // #4a1a1a
    const maxColor = [232, 68, 60] // #e8443c

    const r = Math.round(minColor[0] + (maxColor[0] - minColor[0]) * intensity)
    const g = Math.round(minColor[1] + (maxColor[1] - minColor[1]) * intensity)
    const b = Math.round(minColor[2] + (maxColor[2] - minColor[2]) * intensity)

    return `rgb(${r}, ${g}, ${b})`
  }

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (e.button !== 0) return // Only left mouse button
    setIsDragging(true)
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    })
  }

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startPosition])

  return (
    <div className="w-full h-full bg-zinc-900 flex items-center justify-center relative overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 960 540"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Grid lines */}
        <g stroke="#333" strokeWidth="0.5">
          {Array.from({ length: 18 }, (_, i) => (
            <line key={`lat-${i}`} x1="0" y1={i * 30} x2="960" y2={i * 30} />
          ))}
          {Array.from({ length: 32 }, (_, i) => (
            <line key={`lon-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="540" />
          ))}
        </g>

        {/* World regions */}
        <g>
          {/* Simplified continent shapes */}
          <path
            d="M150,120 C180,100 220,110 250,130 C280,150 300,180 320,160 C340,140 360,130 380,150 C400,170 420,150 440,130 L440,250 L150,250 Z"
            fill={getColor(0.9)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: "North America: 90% market share",
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          <path
            d="M250,260 C270,280 290,300 270,330 C250,360 230,380 250,400 C270,420 290,410 310,430 L310,480 L200,480 L200,260 Z"
            fill={getColor(0.7)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: "South America: 70% market share",
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          <path
            d="M450,120 C470,100 490,110 510,130 C530,150 550,140 570,120 L570,220 L450,220 Z"
            fill={getColor(0.8)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: "Europe: 80% market share",
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          <path
            d="M450,230 C470,250 490,270 510,290 C530,310 550,330 570,350 C590,370 610,390 630,410 L450,410 Z"
            fill={getColor(0.5)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: "Africa: 50% market share",
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          <path
            d="M580,120 C600,100 620,110 640,130 C660,150 680,170 700,150 C720,130 740,110 760,130 C780,150 800,170 820,150 L820,300 L580,300 Z"
            fill={getColor(0.85)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: "Asia: 85% market share",
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          <path
            d="M700,320 C720,340 740,360 760,340 C780,320 800,340 820,360 C840,380 860,400 880,380 L880,450 L700,450 Z"
            fill={getColor(0.6)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: "Oceania: 60% market share",
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
        </g>

        {/* Hot spots for major markets */}
        {regionData.map((region) => (
          <circle
            key={region.id}
            cx={region.cx}
            cy={region.cy}
            r={15 * region.intensity}
            fill={`${getColor(region.intensity)}80`} // Add transparency
            stroke={getColor(region.intensity)}
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: `${region.name}: ${Math.round(region.intensity * 100)}% market share`,
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
        ))}
      </svg>

      <div className="absolute bottom-4 left-4 bg-zinc-800/80 rounded px-3 py-2">
        <div className="text-xs text-zinc-400 mb-1">Market Share</div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#4a1a1a]"></div>
          <div className="text-xs">Low</div>
          <div className="w-12 h-1 bg-gradient-to-r from-[#4a1a1a] to-[#e8443c] mx-1"></div>
          <div className="w-3 h-3 rounded-full bg-[#e8443c]"></div>
          <div className="text-xs">High</div>
        </div>
      </div>

      {tooltip.show && (
        <div
          className="absolute bg-zinc-800 text-white px-2 py-1 rounded text-xs pointer-events-none z-10"
          style={{
            left: tooltip.x - 100,
            top: tooltip.y - 80,
            minWidth: "120px",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}

function IncomeChart() {
  // This would be replaced with a real chart library like recharts
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

function ProductStatusList() {
  const products = [
    { name: "2024 Dungeon Master's guide", status: "Available" },
    { name: "2024 Player's Handbook Digital...", status: "Available" },
    { name: "Quest from the infinity stairc...", status: "OOS" },
    { name: "Vecna: Eve of Ruin Digital", status: "Available" },
    { name: "D&D Campaign Case: Crea...", status: "OOS" },
    { name: "D&D Expansion Gift Set Digit...", status: "OOS" },
  ]

  return (
    <div className="space-y-3">
      {products.map((product, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="text-sm truncate">{product.name}</div>
          <div
            className={`flex items-center gap-2 ${product.status === "Available" ? "text-green-500" : "text-red-500"}`}
          >
            <div className={`w-2 h-2 rounded-full ${product.status === "Available" ? "bg-green-500" : "bg-red-500"}`} />
            <div className="text-xs">{product.status}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MiniaturesPieChart() {
  return (
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="transparent" stroke="#4a1a1a" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        stroke="#e8443c"
        strokeWidth="10"
        strokeDasharray="282.6"
        strokeDashoffset="127.17" // 55% of 282.6 = 155.43, so 282.6 - 155.43 = 127.17
        transform="rotate(-90 50 50)"
      />
    </svg>
  )
}
