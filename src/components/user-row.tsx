"use client"

import { Button } from "@/components/ui/button"

export interface UserRowProps {
  id: number
  name: string
  email: string
  location: string
  joined: string
  frequency: number
  isSelected: boolean
  onToggleSelect: (id: number) => void
}

export function UserRow({ id, name, email, location, joined, frequency, isSelected, onToggleSelect }: UserRowProps) {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50">
      <td className="p-4">
        <input
          type="checkbox"
          className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
          checked={isSelected}
          onChange={() => onToggleSelect(id)}
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">{name.charAt(0)}</div>
          <span>{name}</span>
        </div>
      </td>
      <td className="p-4">{email}</td>
      <td className="p-4">
        <div className="flex items-center">
          <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full mr-2"></span>
          {location}
        </div>
      </td>
      <td className="p-4">{joined}</td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full rounded-full" style={{ width: `${frequency}%` }}></div>
          </div>
          <span className="text-sm">{frequency}%</span>
        </div>
      </td>
      <td className="p-4 text-center">
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </Button>
      </td>
    </tr>
  )
}
