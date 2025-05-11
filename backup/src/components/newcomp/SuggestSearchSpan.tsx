/* ---------------- SuggestSearchSpan.tsx ---------------- */
"use client"

import { Fragment, useRef, useState, useEffect, Dispatch, SetStateAction } from "react"
import { Combobox, Transition } from "@headlessui/react"
import { Search, Check } from "lucide-react"
import { Input } from "@/components/ui/input"

/* ---------- base type ---------- */
export interface ComboboxItem {
  name: string
}

/* ---------- props ---------- */
export interface SuggestSearchSpanProps<T extends ComboboxItem> {
  items: T[]
  value: string
  setValue: Dispatch<SetStateAction<string>>
  placeholder?: string
  className?: string
  /** จำนวนรายการที่แสดงได้สูงสุดก่อนเลื่อนสกอร์ล (default = 3) */
  maxVisible?: number
  /** เปิด/ปิด suggestion dropdown (default = true) */
  enableSuggest?: boolean
}

/* ---------- component ---------- */
export default function SuggestSearchSpan<T extends ComboboxItem>({
  items,
  value,
  setValue,
  placeholder = "Search products...",
  className = "",
  maxVisible = 3,
  enableSuggest = true,
}: SuggestSearchSpanProps<T>) {
  const [query, setQuery] = useState(value)
  const rawRef = useRef(value)

  /* ---------- sync with external value (e.g. clear search) ---------- */
  useEffect(() => {
    rawRef.current = value
    setQuery(value)
  }, [value])

  /* --------- filter items by query --------- */
  const filtered =
    query === ""
      ? items
      : items.filter((item) =>
          item.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")),
        )

  /* --------- event handlers --------- */
  const handleSelect = (item: T | null) => {
    if (item) {
      rawRef.current = item.name
      setValue(item.name)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const txt = e.target.value
    rawRef.current = txt
    setQuery(txt)
    setValue(txt)
  }

  /* --------- derived style --------- */
  const maxHeightRem = maxVisible * 2.5 // ประมาณ 2.5rem ต่อหนึ่งรายการ

  /* --------- if suggestion disabled: plain input only --------- */
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

  /* --------- render with suggestion --------- */
  return (
    <div className={`relative ${className}`}>
      <Combobox value={null} onChange={handleSelect} nullable>
        {({ open }) => (
          <div className="w-full">
            {/* search field */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Combobox.Input
                as={Input}
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full pl-10 bg-zinc-900 border border-zinc-800 text-white focus:border-gray-300 focus-visible:ring-0"
                displayValue={() => rawRef.current}
                onChange={handleInputChange}
                placeholder={placeholder}
              />
            </div>

            {/* dropdown options (scrollable) */}
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
                {filtered.length === 0 && query !== "" ? (
                  <div className="cursor-default select-none py-2 pl-10 pr-4 text-white">Nothing found.</div>
                ) : (
                  filtered.map((item, idx) => {
                    const isSelected = value === item.name
                    return (
                      <Combobox.Option
                        key={`${item.name}-${idx}`}
                        value={item}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-magic-red text-white border-l-2 border-white" : "text-gray-400"
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
