/* ---------------- SuggestInput.tsx ---------------- */
"use client"

import { Fragment, useRef, useState, Dispatch, SetStateAction, useEffect } from "react"
import { Combobox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"

/* ---------- base type (id removed) ---------- */
export interface ComboboxItem {
  name: string
}

/* ---------- props ---------- */
export interface SuggestInputProps<T extends ComboboxItem> {
  items: T[]
  value: string                       // string เท่านั้น
  setValue: Dispatch<SetStateAction<string>>
  placeholder?: string
  className?: string
  /** ปิด/เปิด suggestion dropdown (default true) */
  enableSuggest?: boolean
}

/* ---------- component ---------- */
export default function SuggestInput<T extends ComboboxItem>({
  items,
  value,
  setValue,
  placeholder = "Type something...",
  className = "",
  enableSuggest = true,
}: SuggestInputProps<T>) {
  const [query, setQuery] = useState(value)
  const rawRef = useRef(value)

  // sync external value (e.g., clear input)
  useEffect(() => {
    rawRef.current = value
    setQuery(value)
  }, [value])

  // filter list by query
  const filtered =
    query === ""
      ? items
      : items.filter((item) =>
          item.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")),
        )

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

  if (!enableSuggest) {
    return (
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full rounded-lg bg-zinc-900 border-zinc-800 text-white py-2 px-3 ${className}`}
      />
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Combobox value={null} onChange={handleSelect} nullable>
        {/* input */}
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0 bg-zinc-900 border-zinc-800 text-white"
            displayValue={() => rawRef.current}
            onChange={handleInputChange}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </Combobox.Button>
        </div>

        {/* dropdown */}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery(rawRef.current)}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filtered.length === 0 && query !== "" ? (
              <div className="cursor-default select-none px-4 py-2 text-white">Nothing found.</div>
            ) : (
              filtered.map((item, idx) => (
                <Combobox.Option
                  key={`${item.name}-${idx}`}
                  value={item}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-magic-red text-white" : "text-gray-400"
                    }`
                  }
                >
                  {() => (
                    <>
                      <span className="block truncate">{item.name}</span>
                      {value === item.name && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  )
}
