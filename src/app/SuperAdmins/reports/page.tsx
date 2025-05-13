"use client"

import { useState, useEffect } from "react"
import { Download, Calendar, RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define types based on the schema
interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  categoryId: number
  status: "Available" | "Out of Stock"
  publisherID: number
  category?: {
    name: string
  }
}

interface OrderSummary {
  id: number
  totalPrice: number
  orderStatus: string
  createdAt: string
  product: {
    name: string
    quantity: number
  }
}

interface CategorySales {
  categoryId: number
  categoryName: string
  totalSales: number
  percentage: number
}

interface MonthlySales {
  month: string
  sales: number
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [reportType, setReportType] = useState("sales")
  const [hotSales, setHotSales] = useState<Product[]>([])
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([])
  const [categorySales, setCategorySales] = useState<CategorySales[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [averageOrderValue, setAverageOrderValue] = useState(0)
  const [revenueChange, setRevenueChange] = useState(0)
  const [ordersChange, setOrdersChange] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("csv")

  // Fetch report data on component mount and when timeRange changes
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true)
      try {
        // In a real implementation, these would be API calls with the timeRange parameter
        // For now, we'll use mock data

        // Mock hot sales data
        const mockHotSales = [
          { id: 1, name: "2024 Dungeon Master's guide", price: 1200, quantity: 168, totalSales: 20184 },
          { id: 2, name: "2024 Player's Handbook Digital...", price: 950, quantity: 153, totalSales: 14502 },
          { id: 3, name: "Quest from the infinity stairc...", price: 850, quantity: 120, totalSales: 10230 },
          { id: 4, name: "Vecna: Eve of Ruin Digital", price: 1100, quantity: 80, totalSales: 8769 },
          { id: 5, name: "D&D Campaign Case: Crea...", price: 1090, quantity: 50, totalSales: 5450 },
          { id: 6, name: "D&D Expansion Gift Set Digit...", price: 1256, quantity: 10, totalSales: 1256 },
        ] as any[]

        // Mock monthly sales data
        const mockMonthlySales = [
          { month: "Jan", sales: 15000 },
          { month: "Feb", sales: 18000 },
          { month: "Mar", sales: 22000 },
          { month: "Apr", sales: 25000 },
          { month: "May", sales: 30000 },
          { month: "Jun", sales: 28000 },
          { month: "Jul", sales: 32000 },
          { month: "Aug", sales: 35000 },
          { month: "Sep", sales: 38000 },
          { month: "Oct", sales: 40000 },
          { month: "Nov", sales: 42000 },
          { month: "Dec", sales: 45000 },
        ]

        // Mock category sales data
        const mockCategorySales = [
          { categoryId: 1, categoryName: "Core Rulebooks", totalSales: 45000, percentage: 35 },
          { categoryId: 2, categoryName: "Adventures", totalSales: 30000, percentage: 25 },
          { categoryId: 3, categoryName: "Accessories", totalSales: 20000, percentage: 15 },
          { categoryId: 4, categoryName: "Digital Content", totalSales: 15000, percentage: 12 },
          { categoryId: 5, categoryName: "Miniatures", totalSales: 10000, percentage: 8 },
          { categoryId: 6, categoryName: "Other", totalSales: 5000, percentage: 5 },
        ]

        // Mock summary data
        const mockTotalRevenue = 125000
        const mockTotalOrders = 850
        const mockAverageOrderValue = mockTotalRevenue / mockTotalOrders
        const mockRevenueChange = 12.5 // percentage
        const mockOrdersChange = 8.2 // percentage

        setHotSales(mockHotSales)
        setMonthlySales(mockMonthlySales)
        setCategorySales(mockCategorySales)
        setTotalRevenue(mockTotalRevenue)
        setTotalOrders(mockTotalOrders)
        setAverageOrderValue(mockAverageOrderValue)
        setRevenueChange(mockRevenueChange)
        setOrdersChange(mockOrdersChange)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching report data:", error)
        setLoading(false)
      }
    }

    fetchReportData()
  }, [timeRange])

  // Handle export report
  const handleExportReport = () => {
    // In a real implementation, this would call an API to generate and download the report
    console.log(`Exporting ${reportType} report as ${exportFormat}`)
    setIsExportDialogOpen(false)

    // Mock download - in a real app, this would trigger a file download
    alert(
      `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported as ${exportFormat.toUpperCase()}`,
    )
  }

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <div className="px-6 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Reports</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-zinc-700 text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
          <Button variant="outline" className="border-zinc-700 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-zinc-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
            <DialogHeader>
              <DialogTitle>Export Report</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Report Type</h3>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="products">Product Report</SelectItem>
                    <SelectItem value="categories">Category Report</SelectItem>
                    <SelectItem value="refunds">Refund Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Format</h3>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)} className="border-zinc-700">
                Cancel
              </Button>
              <Button onClick={handleExportReport} className="bg-red-600 hover:bg-red-700">
                Export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-6 pb-6 overflow-y-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-zinc-900 border-zinc-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Total Revenue Card */}
              <Card className="bg-zinc-900 border-zinc-700 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-zinc-400">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
                  <div className={`flex items-center mt-2 ${revenueChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {revenueChange >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    <span>
                      {Math.abs(revenueChange)}% from previous {timeRange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Total Orders Card */}
              <Card className="bg-zinc-900 border-zinc-700 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-zinc-400">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalOrders.toLocaleString()}</div>
                  <div className={`flex items-center mt-2 ${ordersChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {ordersChange >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    <span>
                      {Math.abs(ordersChange)}% from previous {timeRange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Average Order Value Card */}
              <Card className="bg-zinc-900 border-zinc-700 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-zinc-400">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${averageOrderValue.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Income Chart */}
              <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
                <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-medium">Total income</h2>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[120px] h-8 border-zinc-700 text-white">
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <IncomeChart data={monthlySales} />
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
                      {hotSales.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-zinc-400">{index + 1}.</span>
                            <span>{product.name}</span>
                          </div>
                          <span className="text-sm">{product.totalSales?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px] lg:col-span-2">
                <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-medium">Sales by Category</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {categorySales.map((category) => (
                        <div key={category.categoryId} className="flex flex-col">
                          <div className="flex justify-between mb-2">
                            <span>{category.categoryName}</span>
                            <span className="text-zinc-400">{category.percentage}%</span>
                          </div>
                          <div className="w-full bg-zinc-800 rounded-full h-2.5">
                            <div
                              className="bg-red-600 h-2.5 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          <span className="mt-1 text-sm text-zinc-400">${category.totalSales.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
              <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Sales Over Time</h2>
                  </div>
                  <IncomeChart data={monthlySales} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
              <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Top Selling Products</h2>
                  </div>
                  <div className="space-y-4">
                    {hotSales.map((product, index) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm bg-zinc-800 w-6 h-6 rounded-full flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div>
                            <div>{product.name}</div>
                            <div className="text-sm text-zinc-400">
                              ${product.price.toFixed(2)} • {product.quantity} in stock
                            </div>
                          </div>
                        </div>
                        <span className="font-medium">${product.totalSales?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
              <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Sales by Category</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {categorySales.map((category) => (
                      <div
                        key={category.categoryId}
                        className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg"
                      >
                        <div>
                          <div>{category.categoryName}</div>
                          <div className="w-full bg-zinc-800 rounded-full h-2.5 mt-2 max-w-xs">
                            <div
                              className="bg-red-600 h-2.5 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${category.totalSales.toLocaleString()}</div>
                          <div className="text-sm text-zinc-400">{category.percentage}% of total</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Refunds Tab */}
          <TabsContent value="refunds">
            <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
              <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Refund Analysis</h2>
                  </div>
                  <div className="text-center py-10 text-zinc-400">Refund data will be displayed here.</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function IncomeChart({ data = [] }) {
  // Calculate the maximum value for scaling
  const maxValue = Math.max(...data.map((item) => item.sales))

  return (
    <div className="h-48 relative">
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-zinc-500">
        <div>{Math.round(maxValue / 1000)}k</div>
        <div>{Math.round((maxValue * 0.75) / 1000)}k</div>
        <div>{Math.round((maxValue * 0.5) / 1000)}k</div>
        <div>{Math.round((maxValue * 0.25) / 1000)}k</div>
        <div>0</div>
      </div>
      <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs text-zinc-500">
        {data.map((item, index) => (
          <div key={index}>{item.month}</div>
        ))}
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
            d={`M0,${200 - ((data[0]?.sales / maxValue) * 180 || 0)} ${data
              .map((item, index) => {
                const x = index * (800 / (data.length - 1))
                const y = 200 - (item.sales / maxValue) * 180
                return `L${x},${y}`
              })
              .join(" ")} L800,${200 - ((data[data.length - 1]?.sales / maxValue) * 180 || 0)} L800,200 L0,200 Z`}
            fill="url(#incomeGradient)"
          />
          <path
            d={`M0,${200 - ((data[0]?.sales / maxValue) * 180 || 0)} ${data
              .map((item, index) => {
                const x = index * (800 / (data.length - 1))
                const y = 200 - (item.sales / maxValue) * 180
                return `L${x},${y}`
              })
              .join(" ")}`}
            fill="none"
            stroke="#e8443c"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  )
}
