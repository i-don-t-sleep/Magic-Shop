"use client"

import { Fragment, useRef, useState, useEffect, Dispatch, SetStateAction } from "react"
import { Combobox, Transition } from "@headlessui/react"
import { Search, Check } from "lucide-react"
import { Input } from "@/components/ui/input"

/**
 * Base type for items shown in suggestions
 */
export interface ComboboxItem {
  name: string
}

/**
 * Props for SuggestSearchSpan component
 */
export interface SuggestSearchSpanProps<T extends ComboboxItem> {
  /** List of suggestion items */
  items?: T[]  // allow undefined, default to []
  /** Controlled value of input */
  value: string
  /** Setter for controlled value */
  setValue: Dispatch<SetStateAction<string>>
  /** Placeholder text */
  placeholder?: string
  /** Additional container class names */
  className?: string
  /** Max number of visible suggestions before scroll (default = 3) */
  maxVisible?: number
  /** Enable suggestion dropdown (default = true) */
  enableSuggest?: boolean
}

/**
 * ComboSearch: Combobox input with optional suggestion dropdown
 */
export default function ComboSearch<T extends ComboboxItem>({
  items = [],
  value,
  setValue,
  placeholder = "Search products...",
  className = "",
  maxVisible = 3,
  enableSuggest = true,
}: SuggestSearchSpanProps<T>) {
  const [query, setQuery] = useState(value)
  const rawRef = useRef(value)

  // Sync internal query when external value changes (e.g., clearing search)
  useEffect(() => {
    rawRef.current = value
    setQuery(value)
  }, [value])

  // Normalize query for matching
  const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, "")

  // Filter items safely, guarding against missing names
  const filtered =
    normalizedQuery === ""
      ? items
      : items.filter((item) => {
          const name = item.name || ""
          const normalizedName = name.toLowerCase().replace(/\s+/g, "")
          return normalizedName.includes(normalizedQuery)
        })

  // Handler when an item is selected
  const handleSelect = (item: T | null) => {
    if (item) {
      //const locOnly = item.name.split(' (')[0]
      rawRef.current = item.name
      setValue(item.name)
    }
  }

  // Handler when input text changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const txt = e.target.value
    rawRef.current = txt
    setQuery(txt)
    setValue(txt)
  }




  // Calculate dropdown max-height in rem
  const maxHeightRem = maxVisible * 2.5

  // If suggestions disabled, render plain input
  if (!enableSuggest) {
    return (
      <div className={`relative ${className}`}>        
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full pl-10 bg-zinc-900 border border-zinc-800 text-white focus:border-white focus-visible:ring-0"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
        />
      </div>
    )
  }

  // Render input with suggestion dropdown
  return (
    <div className={`relative ${className}`}>      
      <Combobox value={null} onChange={handleSelect} by="name" immediate>
        {({ open }) => (
          <div className="w-full">
            {/* Search input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Combobox.Input
                as={Input}
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full pl-10 bg-zinc-900 border border-zinc-800 text-white focus:border-gray-300 focus-visible:ring-0"
                displayValue={() => value} /*rawRef.current*/
                onChange={handleInputChange}
                placeholder={placeholder}
              />
            </div>

            {/* Dropdown suggestion list */}
            <Transition
              show={open && enableSuggest}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery(rawRef.current)}
            >
              <Combobox.Options
                className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-zinc-800 py-1 text-base shadow-lg ring-1 ring-black/50 focus:outline-none sm:text-sm"
                style={{ maxHeight: `${maxHeightRem}rem` }}
              >
                {filtered.length === 0 ? (
                  <div className="cursor-default select-none py-2 pl-10 pr-4 text-white">
                    Nothing found.
                  </div>
                ) : (
                  filtered.map((item, idx) => {
                    const isSelected = value === item.name
                    return (
                      <Combobox.Option
                        key={`${item.name}-${idx}`}
                        value={item}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-magic-red text-white border-l-2 border-white"
                              : "text-gray-400"
                          }`
                        }
                      >
                        {() => (
                          <>
                            <span className="block truncate">{item.name}</span>
                            {isSelected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    )
                  })
                )}
              </Combobox.Options>
            </Transition>
          </div>
        )}
      </Combobox>
    </div>
  )
}
