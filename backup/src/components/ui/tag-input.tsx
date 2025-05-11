"use client"

import type React from "react"
import { useState, useRef, useMemo, useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Combobox, Transition } from "@headlessui/react"

// Base type for TagInputFixed items
export type TagItem = {
  value: string
  label: string
  type?: string
  typeLabel?: string
  color?: string
}

interface TagInputFixedProps {
  placeholder?: string
  disabled?: boolean
  items: TagItem[]
  selectedItems: string[]
  onItemSelect: (item: string) => void
  onItemRemove: (item: string) => void
  className?: string
  divClassName?: string
  maxHeight?: string
  width?: string // dropdown max width
  fieldWidth?: string // input field width
}

export function TagInputFixed({
  placeholder = "Select...",
  disabled = false,
  items,
  selectedItems,
  onItemSelect,
  onItemRemove,
  className = "",
  divClassName = "",
  maxHeight = "200px",
  width = "auto",
  fieldWidth = "300px",
}: TagInputFixedProps) {
  const [query, setQuery] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Filter items
  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          it.label.toLowerCase().includes(query.toLowerCase()) &&
          (Array.isArray(selectedItems) ? !selectedItems.includes(it.value) : true),
      ),
    [items, query, selectedItems],
  )

  // Group by typeLabel
  type Group = { typeLabel: string; items: TagItem[] }
  const groups: Group[] = useMemo(() => {
    const map = new Map<string, TagItem[]>()
    filtered.forEach((item) => {
      const key = item.typeLabel || ""
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    })
    return Array.from(map.entries()).map(([typeLabel, items]) => ({ typeLabel, items }))
  }, [filtered])

  // Add tags
  const handleChange = (value: string | string[]) => {
    const vals = Array.isArray(value) ? value : [value]
    vals.forEach((v) => {
      if (!selectedItems.includes(v)) onItemSelect(v)
    })
    setQuery("")
    setOpen(false)
  }

  // Remove tag
  const handleRemove = (v: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onItemRemove(v)
    setOpen(false)
  }

  // Key handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("")
      setOpen(false)
      inputRef.current?.blur()
    } else if (e.key === "Backspace" && !query && selectedItems.length) {
      onItemRemove(selectedItems[selectedItems.length - 1])
      e.preventDefault()
    }
  }

  // Input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
  }

  // Toggle dropdown on input click/focus
  const toggleOpen = () => {
    setOpen((o) => !o)
    if (open) setQuery("")
  }

  return (
    <div className={cn(divClassName)} style={{ width: fieldWidth }} ref={containerRef}>
      <Combobox as="div" value={selectedItems} onChange={handleChange} multiple disabled={disabled} immediate>
        <div className="relative">
          <div
            className={cn(
              "flex flex-wrap items-center gap-1 border rounded px-2 py-1 focus-within:ring-2 focus-within:ring-ring",
              "bg-zinc-700 border border-zinc-800",
              disabled && "opacity-50 pointer-events-none",
              className,
            )}
            onClick={() => inputRef.current?.focus()}
          >
            {Array.isArray(selectedItems) &&
              selectedItems.map((val) => {
                const tag = items.find((it) => it.value === val)
                return (
                  tag && (
                    <span
                      key={val}
                      style={{ backgroundColor: tag.color }}
                      className="inline-flex items-center rounded px-2 py-1 text-sm text-white truncate"
                    >
                      {tag.label}
                      <button onClick={(e) => handleRemove(val, e)} className="ml-1 focus:outline-none">
                        <X size={16} />
                      </button>
                    </span>
                  )
                )
              })}
            <Combobox.Input
              ref={inputRef}
              className="flex-1 min-w-[120px] border-none outline-none focus:ring-0 px-1 py-1 text-white bg-transparent"
              placeholder={placeholder}
              displayValue={() => query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onClick={() => {
                setQuery("")
                setOpen(true)
              }}
            />
          </div>

          <Transition
            show={open && filtered.length > 0}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Combobox.Options
              className="absolute z-[9999] mt-1 max-h-60 overflow-auto rounded-md bg-zinc-900 border border-zinc-800 text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              style={{ width: width === "auto" ? "100%" : width, maxHeight }}
            >
              {groups.map((grp, i) => (
                <div key={i} className="px-1 py-1">
                  {grp.typeLabel && <div className="px-2 py-1 text-sm font-medium text-gray-500">{grp.typeLabel}</div>}
                  {grp.items.map((item) => (
                    <Combobox.Option
                      key={item.value}
                      value={item.value}
                      className={({ active }) =>
                        cn("cursor-pointer select-none px-2 py-1 flex items-start rounded", active && "bg-gray-700")
                      }
                    >
                      {({ active }) => (
                        <>
                          {item.color && (
                            <span
                              className="flex-shrink-0 h-2 w-2 rounded-full inline-block mr-3 mt-2"
                              style={{ backgroundColor: item.color }}
                            />
                          )}
                          <span className="whitespace-normal break-all">{item.label}</span>
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </div>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
