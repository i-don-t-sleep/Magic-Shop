"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinbox } from "@/components/ui/spinbox"
import {
  Edit,
  Trash,
  Plus,
  AlertCircle,
  Search,
  Package,
  ArrowRight,
  Warehouse,
  LayoutGrid,
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { showSuccessToast, showErrorToast } from "@/components/notify/Toast"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Unuse/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WarehouseType {
  id: number
  location: string
  capacity: number
  productID: number | null
  productName?: string
  movementCount?: number
}

interface Product {
  id: number
  name: string
  warehouseID: number | null
  warehouseName?: string
}

interface EditWarehouseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: WarehouseType | null
  onSave: (warehouse: { id: number; location: string; capacity: number }) => Promise<void>
}

function EditWarehouseDialog({ open, onOpenChange, warehouse, onSave }: EditWarehouseDialogProps) {
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState(100)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (warehouse) {
      setLocation(warehouse.location)
      setCapacity(warehouse.capacity)
    }
  }, [warehouse])

  const handleSave = async () => {
    if (!warehouse) return

    if (!location.trim()) {
      setError("Location is required")
      return
    }

    // Validate location format (zone-rack-shelf-pallet)
    const locationRegex = /^[A-Za-z0-9]+(-[A-Za-z0-9]+){3}$/
    if (!locationRegex.test(location.trim())) {
      setError("Invalid format: must be zone-rack-shelf-pallet (Ex: AA-03-04-304)")
      return
    }

    if (capacity <= 0) {
      setError("Capacity must be greater than 0")
      return
    }

    setSaving(true)
    setError(null)

    try {
      await onSave({
        id: warehouse.id,
        location: location.trim(),
        capacity,
      })
      onOpenChange(false)
    } catch (error: any) {
      setError(error.message || "Failed to save warehouse")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Edit Warehouse</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location <span className="text-red-500">*</span>
            </label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value.toUpperCase())}
              placeholder="ZONE-RACK-SHELF-PALLET (e.g. A-01-02-03)"
              className="bg-zinc-800 border-zinc-700 uppercase"
            />
            <p className="text-xs text-zinc-500">Format: zone-rack-shelf-pallet</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="capacity" className="text-sm font-medium">
              Capacity <span className="text-red-500">*</span>
            </label>
            <Spinbox
              id="capacity"
              value={capacity}
              onChange={(value) => setCapacity(value)}
              min={1}
              max={10000000}
              decimalPoint={0}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-700"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-red-600 hover:bg-red-700" disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface AddWarehouseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (warehouse: { location: string; capacity: number }) => Promise<void>
}

function AddWarehouseDialog({ open, onOpenChange, onAdd }: AddWarehouseDialogProps) {
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState(100)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setLocation("")
      setCapacity(100)
      setError(null)
    }
  }, [open])

  const handleAdd = async () => {
    if (!location.trim()) {
      setError("Location is required")
      return
    }

    // Validate location format (zone-rack-shelf-pallet)
    const locationRegex = /^[A-Za-z0-9]+(-[A-Za-z0-9]+){3}$/
    if (!locationRegex.test(location.trim())) {
      setError("Invalid format: must be zone-rack-shelf-pallet (Ex: AA-03-04-304)")
      return
    }

    if (capacity <= 0) {
      setError("Capacity must be greater than 0")
      return
    }

    setSaving(true)
    setError(null)

    try {
      await onAdd({
        location: location.trim(),
        capacity,
      })
      onOpenChange(false)
    } catch (error: any) {
      setError(error.message || "Failed to add warehouse")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Add New Warehouse</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="newLocation" className="text-sm font-medium">
              Location <span className="text-red-500">*</span>
            </label>
            <Input
              id="newLocation"
              value={location}
              onChange={(e) => setLocation(e.target.value.toUpperCase())}
              placeholder="ZONE-RACK-SHELF-PALLET (e.g. A-01-02-03)"
              className="bg-zinc-800 border-zinc-700 uppercase"
            />
            <p className="text-xs text-zinc-500">Format: zone-rack-shelf-pallet</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="newCapacity" className="text-sm font-medium">
              Capacity <span className="text-red-500">*</span>
            </label>
            <Spinbox
              id="newCapacity"
              value={capacity}
              onChange={(value) => setCapacity(value)}
              min={1}
              max={10000000}
              decimalPoint={0}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-700"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleAdd} className="bg-red-600 hover:bg-red-700" disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              "Add Warehouse"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ReassignProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: WarehouseType | null
  availableWarehouses: WarehouseType[]
  onReassign: (warehouseId: number | null) => Promise<void>
}

function ReassignProductDialog({
  open,
  onOpenChange,
  warehouse,
  availableWarehouses,
  onReassign,
}: ReassignProductDialogProps) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("null")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setSelectedWarehouseId("null")
      setError(null)
    }
  }, [open])

  const handleReassign = async () => {
    setSaving(true)
    setError(null)

    try {
      const newWarehouseId = selectedWarehouseId === "null" ? null : Number.parseInt(selectedWarehouseId)
      await onReassign(newWarehouseId)
      onOpenChange(false)
    } catch (error: any) {
      setError(error.message || "Failed to reassign product")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Reassign Product</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4 py-4">
          {warehouse && warehouse.productName && (
            <div className="p-3 bg-zinc-800 rounded-md">
              <p className="text-sm text-zinc-400">Current Assignment:</p>
              <div className="flex items-center mt-1">
                <Package className="h-5 w-5 text-green-400 mr-2" />
                <span className="font-medium text-green-400">{warehouse.productName}</span>
                <ArrowRight className="mx-2 h-4 w-4 text-zinc-500" />
                <Warehouse className="h-5 w-5 text-blue-400 mr-2" />
                <span className="font-mono text-blue-400">{warehouse.location}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="newWarehouse" className="text-sm font-medium">
              New Warehouse Location
            </label>
            <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select a new warehouse" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="bg-zinc-900 border-zinc-700 min-w-[200px]">
                <SelectItem value="null" className="text-yellow-400">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    No Warehouse (Unassigned)
                  </div>
                </SelectItem>
                {availableWarehouses.map((w) => (
                  <SelectItem key={w.location} value={w.id + ""} className="font-mono">
                    {w.location} (Capacity: {w.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedWarehouseId === "null" && (
              <p className="text-xs text-yellow-500 mt-1 flex items-start">
                <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                Warning: Product will have no assigned warehouse location
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-700"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleReassign} className="bg-red-600 hover:bg-red-700" disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Reassigning...
              </>
            ) : (
              "Reassign Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface GenerateWarehousesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (warehouses: { location: string; capacity: number }[]) => Promise<void>
}

function GenerateWarehousesDialog({ open, onOpenChange, onGenerate }: GenerateWarehousesDialogProps) {
  // Pattern format: XX-NNN-AA-BBB
  const [pattern, setPattern] = useState<string[]>(["A", "01", "01", "001"])
  const [patternTypes, setPatternTypes] = useState<string[]>(["alpha", "numeric", "numeric", "numeric"])
  const [count, setCount] = useState(10)
  const [capacity, setCapacity] = useState(100)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewLocations, setPreviewLocations] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (open) {
      setPattern(["A", "01", "01", "001"])
      setPatternTypes(["alpha", "numeric", "numeric", "numeric"])
      setCount(10)
      setCapacity(100)
      setError(null)
      setShowPreview(false)
      generatePreview(["A", "01", "01", "001"], ["alpha", "numeric", "numeric", "numeric"], 10)
    }
  }, [open])

  const handlePatternChange = (index: number, value: string) => {
    const newPattern = [...pattern]
    newPattern[index] = value
    setPattern(newPattern)
    generatePreview(newPattern, patternTypes, count)
  }

  const handlePatternTypeChange = (index: number, type: string) => {
    const newPatternTypes = [...patternTypes]
    newPatternTypes[index] = type
    setPatternTypes(newPatternTypes)

    // Update pattern value based on type
    const newPattern = [...pattern]
    if (type === "alpha" && /^\d+$/.test(pattern[index])) {
      // If switching from numeric to alpha, convert to letter
      newPattern[index] = "A"
    } else if (type === "numeric" && /^[A-Za-z]+$/.test(pattern[index])) {
      // If switching from alpha to numeric, convert to number
      newPattern[index] = "01"
    }
    // Keep the existing value when switching to fixed
    setPattern(newPattern)

    generatePreview(newPattern, newPatternTypes, count)
  }

  const incrementPattern = (pattern: string[], patternTypes: string[], index: number = pattern.length - 1): boolean => {
    if (index < 0) return false // Can't increment anymore

    const segment = pattern[index]
    const type = patternTypes[index]

    // Skip fixed segments and try to increment the previous segment instead
    if (type === "fixed") {
      return incrementPattern(pattern, patternTypes, index - 1)
    } else if (type === "alpha") {
      // Handle alphabetic increment (A->B->C...Z->AA->AB...)
      const chars = segment.split("")
      let i = chars.length - 1
      let carry = true

      while (i >= 0 && carry) {
        if (chars[i] === "Z") {
          chars[i] = "A"
          carry = true
        } else {
          chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1)
          carry = false
        }
        i--
      }

      if (carry) {
        chars.unshift("A") // Add a new 'A' at the beginning
      }

      pattern[index] = chars.join("")
      return true
    } else if (type === "numeric") {
      // Handle numeric increment with leading zeros
      const leadingZeros = segment.match(/^0*/)?.[0].length || 0
      const numValue = Number.parseInt(segment, 10) + 1
      const maxValue = Math.pow(10, segment.length) - 1

      if (numValue <= maxValue) {
        pattern[index] = numValue.toString().padStart(segment.length, "0")
        return true
      } else {
        // Try to increment the previous segment
        if (incrementPattern(pattern, patternTypes, index - 1)) {
          // Reset this segment to its minimum value
          pattern[index] = "0".repeat(leadingZeros) + "1"
          return true
        }
        return false
      }
    }

    return false
  }

  const generatePreview = (currentPattern: string[], currentPatternTypes: string[], currentCount: number) => {
    const locations: string[] = []
    const patternCopy = [...currentPattern]

    for (let i = 0; i < currentCount; i++) {
      locations.push(patternCopy.join("-"))

      // Increment for next location
      if (i < currentCount - 1) {
        incrementPattern(patternCopy, currentPatternTypes)
      }
    }

    setPreviewLocations(locations)
  }

  const handleCountChange = (newCount: number) => {
    setCount(newCount)
    generatePreview(pattern, patternTypes, newCount)
  }

  const handleGenerate = async () => {
    if (count <= 0) {
      setError("Number of warehouses must be greater than 0")
      return
    }

    if (capacity <= 0) {
      setError("Capacity must be greater than 0")
      return
    }

    // Validate all locations
    for (const location of previewLocations) {
      const locationRegex = /^[A-Za-z0-9]+(-[A-Za-z0-9]+){3}$/
      if (!locationRegex.test(location)) {
        setError(`Invalid location format: ${location}`)
        return
      }
    }

    setGenerating(true)
    setError(null)

    try {
      const warehouses = previewLocations.map((location) => ({
        location,
        capacity,
      }))

      await onGenerate(warehouses)
      onOpenChange(false)
    } catch (error: any) {
      setError(error.message || "Failed to generate warehouses")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate Warehouses</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Location Pattern</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Define the pattern for warehouse locations. Each segment can be alphabetic (A, B, C...) or numeric (01,
                02, 03...).
              </p>

              <div className="grid grid-cols-4 gap-3">
                {pattern.map((segment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-zinc-400">Segment {index + 1}</label>
                      <Select
                        value={patternTypes[index]}
                        onValueChange={(value) => handlePatternTypeChange(index, value)}
                      >
                        <SelectTrigger className="h-7 text-xs bg-zinc-800 border-zinc-700 w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="bg-zinc-900 border-zinc-700 min-w-[80px]"
                        >
                          <SelectItem value="alpha">Alpha</SelectItem>
                          <SelectItem value="numeric">Numeric</SelectItem>
                          <SelectItem value="fixed">Fixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      value={segment}
                      onChange={(e) => handlePatternChange(index, e.target.value.toUpperCase())}
                      className={`bg-zinc-800 border-zinc-700 uppercase ${patternTypes[index] === "fixed" ? "border-green-600 border-2" : ""}`}
                      placeholder={
                        patternTypes[index] === "alpha" ? "A" : patternTypes[index] === "numeric" ? "01" : "FIXED"
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-zinc-800 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Example Format:</h4>
                  <span className="font-mono text-green-400">{pattern.join("-")}</span>
                </div>
                <p className="text-xs text-zinc-400">
                  This will generate locations like: {pattern.join("-")}, {previewLocations[1] || "..."},{" "}
                  {previewLocations[2] || "..."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Warehouses</label>
                <Spinbox
                  value={count}
                  onChange={handleCountChange}
                  min={1}
                  max={1000}
                  decimalPoint={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity (for all warehouses)</label>
                <Spinbox
                  value={capacity}
                  onChange={setCapacity}
                  min={1}
                  max={10000000}
                  decimalPoint={0}
                  step={100}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Preview</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-zinc-700 text-xs"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                  {showPreview ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                </Button>
              </div>

              {showPreview && (
                <div className="border border-zinc-800 rounded-md overflow-hidden mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                        <TableHead className="w-[80px]">#</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Capacity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewLocations.slice(0, 5).map((location, index) => (
                        <TableRow key={index} className="hover:bg-zinc-800/50 border-zinc-800">
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-mono">{location}</TableCell>
                          <TableCell className="text-right">{capacity.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {previewLocations.length > 5 && (
                        <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                          <TableCell colSpan={3} className="text-center py-2 text-zinc-500">
                            ... and {previewLocations.length - 5} more warehouses
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex items-center mt-2 text-xs text-zinc-400">
                <Info className="h-3 w-3 mr-1" />
                Will generate {count} warehouses with the pattern {pattern.join("-")}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6 pt-4 border-t border-zinc-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-700"
            disabled={generating}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleGenerate} className="bg-red-600 hover:bg-red-700" disabled={generating}>
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <LayoutGrid className="h-4 w-4 mr-2" />
                Generate {count} Warehouses
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface UnassignedProductsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  warehouses: WarehouseType[]
  onAssign: (productId: number, warehouseId: number) => Promise<void>
  onRefresh: () => Promise<void>
}

function UnassignedProductsDialog({
  open,
  onOpenChange,
  products,
  warehouses,
  onAssign,
  onRefresh,
}: UnassignedProductsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [assigning, setAssigning] = useState<number | null>(null)
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<Record<number, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (open) {
      setSearchQuery("")
      setSelectedWarehouseId({})
      setError(null)
    }
  }, [open])

  const filteredProducts =
    searchQuery.trim() === ""
      ? products
      : products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAssign = async (productId: number) => {
    if (!selectedWarehouseId[productId]) {
      setError("Please select a warehouse")
      return
    }

    setAssigning(productId)
    setError(null)

    try {
      await onAssign(productId, selectedWarehouseId[productId])

      // Remove the assigned product from the list
      const newSelectedWarehouseId = { ...selectedWarehouseId }
      delete newSelectedWarehouseId[productId]
      setSelectedWarehouseId(newSelectedWarehouseId)

      // Show success message
      showSuccessToast("Product assigned to warehouse successfully")
    } catch (error: any) {
      setError(error.message || "Failed to assign product to warehouse")
    } finally {
      setAssigning(null)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }

  const availableWarehouses = warehouses.filter((w) => w.productID === null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle>Unassigned Products</DialogTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-zinc-700"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </DialogHeader>

        <div className="mb-4">
          <div className="relative">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-800 border-zinc-700"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <ScrollArea className="flex-1 pr-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              {products.length === 0 ? (
                <>
                  <Package className="h-12 w-12 mx-auto mb-3 text-zinc-600" />
                  <p className="text-lg font-medium mb-1">No Unassigned Products</p>
                  <p className="text-sm">All products have warehouse locations assigned</p>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 mx-auto mb-3 text-zinc-600" />
                  <p>No products match your search</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4 h-[350px]">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border border-zinc-800 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-white">{product.name}</h4>
                        <p className="text-xs text-yellow-500 flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          No warehouse assigned
                        </p>
                      </div>
                    </div>

                    <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                      ID: {product.id}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1">
                      <Select
                        value={selectedWarehouseId[product.id]?.toString() || ""}
                        onValueChange={(value) =>
                          setSelectedWarehouseId({
                            ...selectedWarehouseId,
                            [product.id]: Number.parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                          <SelectValue placeholder="Select a warehouse" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="bg-zinc-900 border-zinc-700 min-w-[200px]"
                        >
                          {availableWarehouses.length === 0 ? (
                            <div className="p-2 text-center text-zinc-500 text-sm">No available warehouses</div>
                          ) : (
                            availableWarehouses.map((w) => (
                              <SelectItem key={w.id} value={w.id + ""} className="font-mono">
                                {w.location} (Capacity: {w.capacity})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAssign(product.id)}
                      disabled={
                        !selectedWarehouseId[product.id] || assigning === product.id || availableWarehouses.length === 0
                      }
                      className="bg-green-600 hover:bg-green-700 min-w-[100px]"
                    >
                      {assigning === product.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Assigning...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Assign
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-6 pt-4 border-t border-zinc-800">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ManageWarehousesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWarehousesUpdated?: () => void
}

export function ManageWarehousesModal({ open, onOpenChange, onWarehousesUpdated }: ManageWarehousesModalProps) {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([])
  const [filteredWarehouses, setFilteredWarehouses] = useState<WarehouseType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // 1. Add pagination state variables to the ManageWarehousesModal component
  // Add these state variables after the existing state declarations
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [warehouseToEdit, setWarehouseToEdit] = useState<WarehouseType | null>(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [warehouseToDelete, setWarehouseToDelete] = useState<WarehouseType | null>(null)

  const [reassignDialogOpen, setReassignDialogOpen] = useState(false)
  const [warehouseToReassign, setWarehouseToReassign] = useState<WarehouseType | null>(null)

  const [unassignedDialogOpen, setUnassignedDialogOpen] = useState(false)
  const [unassignedProducts, setUnassignedProducts] = useState<Product[]>([])
  const [loadingUnassigned, setLoadingUnassigned] = useState(false)

  // Fetch warehouses when modal opens
  useEffect(() => {
    if (open) {
      fetchWarehouses()
    }
  }, [open])

  // 3. Add useEffect to refetch when page or limit changes
  // Add this useEffect after the existing useEffect for open state
  useEffect(() => {
    if (open) {
      fetchWarehouses()
    }
  }, [page, limit, open])

  // Filter warehouses when search query or active tab changes
  useEffect(() => {
    let filtered = warehouses

    // Filter by tab
    if (activeTab === "assigned") {
      filtered = filtered.filter((w) => w.productID !== null)
    } else if (activeTab === "available") {
      filtered = filtered.filter((w) => w.productID === null)
    }

    // Filter by search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (warehouse) =>
          warehouse.location.toLowerCase().includes(query) ||
          (warehouse.productName && warehouse.productName.toLowerCase().includes(query)),
      )
    }

    setFilteredWarehouses(filtered)
  }, [searchQuery, warehouses, activeTab])

  // 2. Update the fetchWarehouses function to include pagination
  // Replace the existing fetchWarehouses function with this one
  const fetchWarehouses = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/products/warehouses?page=${page}&limit=${limit}`)
      const data = await response.json()

      if (data.success) {
        setWarehouses(data.warehouses)
        setFilteredWarehouses(data.warehouses)
        setTotal(data.total)
      } else {
        setError(data.message || "Failed to fetch warehouses")
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error)
      setError("An error occurred while fetching warehouses")
    } finally {
      setLoading(false)
    }
  }

  const fetchUnassignedProducts = async () => {
    setLoadingUnassigned(true)
    try {
      const response = await fetch("/api/products/unassigned")
      const data = await response.json()

      if (data.success) {
        setUnassignedProducts(data.products)
      } else {
        showErrorToast(data.message || "Failed to fetch unassigned products")
      }
    } catch (error) {
      console.error("Error fetching unassigned products:", error)
      showErrorToast("An error occurred while fetching unassigned products")
    } finally {
      setLoadingUnassigned(false)
    }
  }

  const handleEditWarehouse = (warehouse: WarehouseType) => {
    setWarehouseToEdit(warehouse)
    setEditDialogOpen(true)
  }

  const handleDeleteWarehouse = (warehouse: WarehouseType) => {
    setWarehouseToDelete(warehouse)
    setDeleteConfirmOpen(true)
  }

  const handleReassignProduct = (warehouse: WarehouseType) => {
    if (warehouse.productID) {
      setWarehouseToReassign(warehouse)
      setReassignDialogOpen(true)
    }
  }

  const saveEditedWarehouse = async (editedWarehouse: { id: number; location: string; capacity: number }) => {
    try {
      const response = await fetch("/api/products/warehouses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedWarehouse),
      })

      const data = await response.json()

      if (data.success) {
        setWarehouses(
          warehouses.map((w) =>
            w.id === editedWarehouse.id
              ? { ...w, location: editedWarehouse.location, capacity: editedWarehouse.capacity }
              : w,
          ),
        )
        showSuccessToast("Warehouse updated successfully")
        if (onWarehousesUpdated) {
          onWarehousesUpdated()
        }
      } else {
        throw new Error(data.message || "Failed to update warehouse")
      }
    } catch (error: any) {
      console.error("Error updating warehouse:", error)
      throw error
    }
  }

  const addNewWarehouse = async (newWarehouse: { location: string; capacity: number }) => {
    try {
      const response = await fetch("/api/products/warehouses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWarehouse),
      })

      const data = await response.json()

      if (data.success) {
        // Refetch warehouses to get the new one with its ID
        await fetchWarehouses()
        showSuccessToast("Warehouse added successfully")
        if (onWarehousesUpdated) {
          onWarehousesUpdated()
        }
      } else {
        throw new Error(data.error || "Failed to add warehouse")
      }
    } catch (error: any) {
      console.error("Error adding warehouse:", error)
      throw error
    }
  }

  const generateWarehouses = async (newWarehouses: { location: string; capacity: number }[]) => {
    try {
      const response = await fetch("/api/products/warehouses/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ warehouses: newWarehouses }),
      })

      const data = await response.json()

      if (data.success) {
        // Refetch warehouses to get the new ones with their IDs
        await fetchWarehouses()
        showSuccessToast(`${newWarehouses.length} warehouses generated successfully`)
        if (onWarehousesUpdated) {
          onWarehousesUpdated()
        }
      } else {
        throw new Error(data.error || "Failed to generate warehouses")
      }
    } catch (error: any) {
      console.error("Error generating warehouses:", error)
      throw error
    }
  }

  const confirmDeleteWarehouse = async () => {
    if (!warehouseToDelete) return

    try {
      const response = await fetch(`/api/products/warehouses?id=${warehouseToDelete.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setWarehouses(warehouses.filter((w) => w.id !== warehouseToDelete.id))
        showSuccessToast("Warehouse deleted successfully")
        if (onWarehousesUpdated) {
          onWarehousesUpdated()
        }
      } else {
        showErrorToast(data.message || "Failed to delete warehouse")
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error)
      showErrorToast("An error occurred while deleting the warehouse")
    } finally {
      setDeleteConfirmOpen(false)
      setWarehouseToDelete(null)
    }
  }

  const reassignProduct = async (newWarehouseId: number | null) => {
    if (!warehouseToReassign || !warehouseToReassign.productID) return

    try {
      const response = await fetch(`/api/products/reassign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: warehouseToReassign.productID,
          oldWarehouseId: warehouseToReassign.id,
          newWarehouseId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setWarehouses(
          warehouses.map((w) => {
            if (w.id === warehouseToReassign.id) {
              // Clear the product from the old warehouse
              return { ...w, productID: null, productName: undefined }
            } else if (newWarehouseId !== null && w.id === newWarehouseId) {
              // Assign the product to the new warehouse
              return {
                ...w,
                productID: warehouseToReassign.productID,
                productName: warehouseToReassign.productName,
              }
            }
            return w
          }),
        )

        showSuccessToast("Product reassigned successfully")
        if (onWarehousesUpdated) {
          onWarehousesUpdated()
        }
      } else {
        throw new Error(data.message || "Failed to reassign product")
      }
    } catch (error: any) {
      console.error("Error reassigning product:", error)
      throw error
    }
  }

  const assignProductToWarehouse = async (productId: number, warehouseId: number) => {
    try {
      const response = await fetch(`/api/products/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          warehouseId,
        }),
      })
      
      const data = await response.json()
      if (data.success) {
        // Update local state
        await fetchWarehouses()
        await fetchUnassignedProducts()

        if (onWarehousesUpdated) {
          onWarehousesUpdated()
        }
        return true
      } else {
        throw new Error(data.message || "Failed to assign product")
      }
    } catch (error: any) {
      console.error("Error assigning product:", error)
      throw error
    }
  }

  const handleShowUnassigned = async () => {
    await fetchUnassignedProducts()
    setUnassignedDialogOpen(true)
  }

  // Get available warehouses for reassignment
  const getAvailableWarehouses = () => {
    return warehouses.filter((w) => w.productID === null && (!warehouseToReassign || w.id !== warehouseToReassign.id))
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Manage Warehouses</DialogTitle>
          </DialogHeader>
          <div>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Input
                    placeholder="Search warehouses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-zinc-800 border-zinc-700"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                  <TabsList className="bg-zinc-800">
                    <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="assigned" className="data-[state=active]:bg-zinc-700">
                      Assigned
                    </TabsTrigger>
                    <TabsTrigger value="available" className="data-[state=active]:bg-zinc-700">
                      Available
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-zinc-700 text-white"
                  onClick={() => setGenerateDialogOpen(true)}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Generate
                </Button>

                <Button onClick={() => setAddDialogOpen(true)} className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Warehouse
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 py-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="border border-zinc-800 rounded-md overflow-hidden">
                <div className="h-[350px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-zinc-900 z-10">
                      <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                        <TableHead className="w-[200px]">Location</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWarehouses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                            {searchQuery ? "No warehouses match your search" : "No warehouses found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredWarehouses.map((warehouse) => (
                          <TableRow key={warehouse.location} className="hover:bg-zinc-800/50 border-zinc-800">
                            <TableCell className="font-mono">{warehouse.location}</TableCell>
                            <TableCell>{warehouse.capacity.toLocaleString()}</TableCell>
                            <TableCell>
                              {warehouse.productName ? (
                                <div className="flex items-center">
                                  <span className="text-green-400">{warehouse.productName}</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleReassignProduct(warehouse)}
                                          className="h-6 w-6 p-0 ml-2 text-blue-500 hover:text-blue-400 hover:bg-blue-900/20"
                                        >
                                          <ArrowRight className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Reassign product</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              ) : (
                                <span className="text-zinc-500">None</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {warehouse.movementCount ? (
                                <span className="text-blue-400">{warehouse.movementCount} movements</span>
                              ) : (
                                <span className="text-zinc-500">Unused</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditWarehouse(warehouse)}
                                  className="h-10 w-10 p-0 text-blue-500 hover:text-blue-400 hover:bg-blue-900/20"
                                  title="Edit warehouse"
                                >
                                  <Edit className="h-10 w-10" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteWarehouse(warehouse)}
                                  className="h-10 w-10 p-0 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                                  title="Delete warehouse"
                                >
                                  <Trash className="h-10 w-10" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          {/* 4. Add pagination controls to the DialogFooter */}
          {/* Replace the existing DialogFooter with this one */}
          {/* Add this before the closing </Dialog> tag */}
          <DialogFooter className="pt-4 border-t border-zinc-800">
            <div className="mr-auto">
              <Button variant="outline" className="border-zinc-700 text-white" onClick={handleShowUnassigned}>
                <Package className="h-4 w-4 mr-1" />
                Unassigned Products
              </Button>
            </div>

            <div className="flex items-center gap-4 mr-auto ml-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">Rows per page:</span>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    setLimit(Number(value))
                    setPage(1) // Reset to first page when changing limit
                  }}
                >
                  <SelectTrigger className="h-8 w-20 bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5} className="bg-zinc-900 border-zinc-700 min-w-[80px]">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-zinc-700"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: Math.min(5, Math.ceil(total / limit)) }, (_, i) => {
                  const pageNumber = i + 1
                  const isCurrentPage = pageNumber === page
                  const isInRange = pageNumber <= Math.ceil(total / limit)

                  return (
                    <Button
                      key={i}
                      variant={isCurrentPage ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 p-0 ${isCurrentPage ? "bg-red-600 hover:bg-red-700" : "border-zinc-700"}`}
                      onClick={() => setPage(pageNumber)}
                      disabled={!isInRange}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}

                {Math.ceil(total / limit) > 5 && (
                  <>
                    <span className="text-zinc-500">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-zinc-700"
                      onClick={() => setPage(Math.ceil(total / limit))}
                    >
                      {Math.ceil(total / limit)}
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-zinc-700"
                  onClick={() => setPage(Math.min(Math.ceil(total / limit), page + 1))}
                  disabled={page >= Math.ceil(total / limit)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-zinc-400">
                {warehouses.length > 0
                  ? `${(page - 1) * limit + 1}-${Math.min(page * limit, total)} of ${total}`
                  : `0 of ${total}`}
              </div>
            </div>

            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditWarehouseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        warehouse={warehouseToEdit}
        onSave={saveEditedWarehouse}
      />

      <AddWarehouseDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={addNewWarehouse} />

      <GenerateWarehousesDialog
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        onGenerate={generateWarehouses}
      />

      <ReassignProductDialog
        open={reassignDialogOpen}
        onOpenChange={setReassignDialogOpen}
        warehouse={warehouseToReassign}
        availableWarehouses={getAvailableWarehouses()}
        onReassign={reassignProduct}
      />

      <UnassignedProductsDialog
        open={unassignedDialogOpen}
        onOpenChange={setUnassignedDialogOpen}
        products={unassignedProducts}
        warehouses={warehouses}
        onAssign={async (productId, warehouseId) => {
          await assignProductToWarehouse(productId, warehouseId)
        }}
        onRefresh={fetchUnassignedProducts}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Warehouse</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {warehouseToDelete?.productID ? (
                <>
                  <p className="mb-2">
                    This warehouse contains the product{" "}
                    <span className="text-green-400 font-medium">{warehouseToDelete?.productName}</span>.
                  </p>
                  <p>
                    If you delete this warehouse, the product will be unassigned and will need to be manually reassigned
                    to another warehouse.
                  </p>
                </>
              ) : (
                <>
                  Are you sure you want to delete the warehouse at location "{warehouseToDelete?.location}"? This action
                  cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDeleteWarehouse}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
