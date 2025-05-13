"use client"

import { Fragment, useState, Dispatch, SetStateAction } from "react"
import { Combobox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"

/* ---------- base type (id removed) ---------- */
export interface ComboboxItem {
  name: string
}

/* ---------- props ---------- */
export interface SearchComboboxProps<T extends ComboboxItem> {
  items: T[]
  selected: T | undefined
  setSelected: Dispatch<SetStateAction<T | undefined>>
  placeholder?: string
  className?: string
}

/* ---------- component ---------- */
export default function SearchCombobox<T extends ComboboxItem>({
  items,
  selected,
  setSelected,
  placeholder = "Search...",
  className = "",
}: SearchComboboxProps<T>) {
  const [query, setQuery] = useState("")

  /* filter list by query */
  const filtered =
    query === ""
      ? items
      : items.filter((item) =>
          item.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")),
        )

  /* convert null → undefined */
  const handleChange = (value: T | null) => {
    setSelected(value ?? undefined)
  }

  return (
    <div className={`relative ${className}`}>
      <Combobox<T> value={selected} onChange={handleChange} nullable>
        {/* ---------- Input field ---------- */}
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0 bg-zinc-900 border-zinc-800 text-white"
            displayValue={(item?: T) => item?.name ?? ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </Combobox.Button>
        </div>

        {/* ---------- Dropdown list ---------- */}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
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
                  {({ active, selected: isSel }) => (
                    <>
                      <span className={`block truncate ${isSel ? "font-medium" : "font-normal"}`}>{item.name}</span>
                      {isSel && (
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
