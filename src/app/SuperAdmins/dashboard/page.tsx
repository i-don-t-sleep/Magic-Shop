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
                <WorldMapWithSales zoom={mapZoom} setZoom={setMapZoom} />
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

// ===== COMPONENT: Stats Card =====
// Displays a key metric with title, value and subtitle
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

// ===== COMPONENT: World Map With Sales Data =====
// Interactive world map showing sales data by region
function WorldMapWithSales({ zoom, setZoom }) {
  // State for map interaction
  const mapContainerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [tooltip, setTooltip] = useState({ show: false, content: "", x: 0, y: 0 })

  // Sample sales data by region (country code: intensity value 0-1)
  const salesData = {
    NA: 0.9, // North America
    SA: 0.7, // South America
    EU: 0.8, // Europe
    AF: 0.5, // Africa
    AS: 0.85, // Asia
    OC: 0.6, // Oceania
  }

  // Function to get color based on intensity (0-1)
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
    <div
      ref={mapContainerRef}
      className="w-full h-full bg-[#161616] flex items-center justify-center relative overflow-hidden"
    >
      {/* Map SVG with pan and zoom */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 500"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: "center",
            transition: isDragging ? "none" : "transform 0.3s ease",
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Background grid */}
          <g stroke="#333" strokeWidth="0.5">
            {Array.from({ length: 18 }, (_, i) => (
              <line key={`lat-${i}`} x1="0" y1={i * 30} x2="1000" y2={i * 30} />
            ))}
            {Array.from({ length: 34 }, (_, i) => (
              <line key={`lon-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="540" />
            ))}
          </g>
          {/* World Map - Simplified continent shapes */}
          {/* North America */}
          <path
            d="M170,50 L135,125 L175,220 L270,170 L310,60 Z"
            fill={getColor(salesData.NA)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: `North America: ${Math.round(salesData.NA * 100)}% market share`,
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          {/* South America */}
          <path
            d="M235,230 L210,350 L270,430 L330,350 L290,230 Z"
            fill={getColor(salesData.SA)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: `South America: ${Math.round(salesData.SA * 100)}% market share`,
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          {/* Europe */}
          <path
            d="M420,60 L400,130 L480,150 L520,90 L490,60 Z"
            fill={getColor(salesData.EU)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: `Europe: ${Math.round(salesData.EU * 100)}% market share`,
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          {/* Africa */}
          <path
            d="M450,150 L420,280 L490,350 L550,280 L520,150 Z"
            fill={getColor(salesData.AF)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: `Africa: ${Math.round(salesData.AF * 100)}% market share`,
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          {/* Asia */}
          <path
            d="M550,60 L520,150 L650,200 L800,150 L750,60 Z"
            fill={getColor(salesData.AS)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: `Asia: ${Math.round(salesData.AS * 100)}% market share`,
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          {/* Australia/Oceania */}
          <path
            d="M750,250 L720,320 L800,350 L850,300 L820,250 Z"
            fill={getColor(salesData.OC)}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={(e) => {
              setTooltip({
                show: true,
                content: `Oceania: ${Math.round(salesData.OC * 100)}% market share`,
                x: e.clientX,
                y: e.clientY,
              })
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
          />
          {/* Major cities/markets as hotspots */}
          <circle cx="200" cy="120" r="8" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* New York */}
          <circle cx="150" cy="150" r="6" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* Chicago */}
          <circle cx="100" cy="130" r="7" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* Los Angeles */}
          <circle cx="450" cy="100" r="8" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* London */}
          <circle cx="480" cy="110" r="6" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* Paris */}
          <circle cx="510" cy="120" r="5" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* Berlin */}
          <circle cx="600" cy="150" r="8" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* Tokyo */}
          <circle cx="580" cy="180" r="7" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* Beijing */}
          <circle cx="550" cy="200" r="6" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* Delhi */}
          <circle cx="220" cy="300" r="5" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* São Paulo */}
          <circle cx="450" cy="250" r="5" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* Cairo */}
          <circle cx="750" cy="320" r="6" fill="#e8443c80" stroke="#e8443c" strokeWidth="1" /> {/* Sydney */}
        </svg>
      </div>

      {/* Map legend */}
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

      {/* Tooltip */}
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

// ===== COMPONENT: Income Chart =====
// Line chart showing income over time
function IncomeChart() {
  return (
    <div className="h-48 relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-zinc-500">
        <div>40k</div>
        <div>30k</div>
        <div>20k</div>
        <div>10k</div>
        <div>0</div>
      </div>

      {/* X-axis labels */}
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

      {/* Chart SVG */}
      <div className="absolute left-10 top-0 right-0 bottom-5">
        <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8443c" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e8443c" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area fill under the line */}
          <path
            d="M0,150 C50,140 100,160 150,140 C200,120 250,130 300,100 C350,70 400,90 450,80 C500,70 550,90 600,80 C650,70 700,90 750,70 L800,60 L800,200 L0,200 Z"
            fill="url(#incomeGradient)"
          />
          {/* Line chart */}
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

// ===== COMPONENT: Product Status List =====
// Shows availability status for products
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

// ===== COMPONENT: Miniatures Pie Chart =====
// Circular chart showing product category breakdown
function MiniaturesPieChart() {
  return (
    <svg className="w-full h-full" viewBox="0 0 100 100">
      {/* Background circle */}
      <circle cx="50" cy="50" r="45" fill="transparent" stroke="#4a1a1a" strokeWidth="10" />

      {/* Progress arc (55%) */}
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
