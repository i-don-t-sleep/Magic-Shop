"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TagInputProps {
  placeholder?: string
  disabled?: boolean
  items?: { value: string; label: string }[]
  selectedItems?: string[]
  onItemSelect?: (item: string) => void
  onItemRemove?: (item: string) => void
  className?: string
  maxHeight?: string
}

export function TagInput({
  placeholder = "Select...",
  disabled = false,
  items = [],
  selectedItems = [],
  onItemSelect = () => {},
  onItemRemove = () => {},
  className,
  maxHeight = "200px",
}: TagInputProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // กรองตัวเลือกตามคำค้นและไม่รวมรายการที่เลือกแล้ว
  const filteredItems = React.useMemo(
    () =>
      items.filter(item => {
        const matchesQuery = item.label
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        const notSelected = !selectedItems.includes(item.value)
        return matchesQuery && notSelected
      }),
    [items, searchQuery, selectedItems]
  )

  // รีเซ็ต highlightedIndex เมื่อรายการเปลี่ยน
  React.useEffect(() => {
    setHighlightedIndex(filteredItems.length > 0 ? 0 : -1)
  }, [filteredItems])

  // จัดการ Arrow keys และ Enter, Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(idx =>
          idx < filteredItems.length - 1 ? idx + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(idx =>
          idx > 0 ? idx - 1 : filteredItems.length - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0) {
          const selected = filteredItems[highlightedIndex]
          onItemSelect(selected.value)
          setSearchQuery("")
        }
        break
      case "Escape":
        setOpen(false)
        break
    }
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 border rounded px-2 py-1",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        {selectedItems.map(value => {
          const item = items.find(i => i.value === value)
          if (!item) return null
          return (
            <span
              key={value}
              className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm"
            >
              {item.label}
              <button
                type="button"
                onClick={() => onItemRemove(value)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </span>
          )
        })}
        <input
          type="text"
          className="flex-1 min-w-[100px] border-none outline-none focus:ring-0 px-1 py-1"
          placeholder={placeholder}
          disabled={disabled}
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {open && filteredItems.length > 0 && (
        <ul
          className="absolute z-10 w-full mt-1 bg-white border rounded shadow overflow-auto"
          style={{ maxHeight }}
        >
          {filteredItems.map((item, idx) => (
            <li
              key={item.value}
              className={cn(
                "px-2 py-1 cursor-pointer",
                idx === highlightedIndex ? "bg-gray-200" : ""
              )}
              onMouseDown={() => {
                onItemSelect(item.value)
                setSearchQuery("")
              }}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}