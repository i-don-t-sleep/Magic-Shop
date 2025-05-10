"use client"

import { useState } from "react"
import SearchCombobox, {ComboboxItem} from "@/components/newcomp/comboboxfixed"

interface Person extends ComboboxItem {
  emailx: string
}

const people: Person[] = [
  { id: 1, name: "Wade Cooper", emailx: "wade@example.com" },
  { id: 2, name: "WadeCoopervz", emailx: "wade@example.com" },
  // …อื่น ๆ…
]

export default function Page() {
  // ⭐ initial state เป็น undefined
  const [selected, setSelected] = useState<Person | undefined>(undefined)

  return (
    <main className="flex h-screen items-start justify-center pt-16">
      <SearchCombobox<Person>
        items={people}
        selected={selected}
        setSelected={setSelected}
        placeholder="Search..."
        className="w-72"
      />

      {selected && (
        <div className="ml-6 mt-2 rounded-md border p-4">
          <p className="text-sm">
            <strong>Name:</strong> {selected.name}
          </p>
          <p className="text-sm">
            <strong>Email:</strong> {selected.emailx}
          </p>
        </div>
      )}
    </main>
  )
}
