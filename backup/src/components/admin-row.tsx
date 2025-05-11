"use client"

import { MapPin, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface AdminRowProps {
  id: number
  name: string
  email: string
  location: string
  joined: string
  status: "Online" | "Offline"
  isSelected: boolean
  onSelect: (id: number) => void
}

export function AdminRow({ id, name, email, location, joined, status, isSelected, onSelect }: AdminRowProps) {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50">
      <td className="p-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
            checked={isSelected}
            onChange={() => onSelect(id)}
          />
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
            {name.charAt(0)}
          </div>
          <span>{name}</span>
        </div>
      </td>
      <td className="p-4">{email}</td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-zinc-400" />
          <span>{location}</span>
        </div>
      </td>
      <td className="p-4">{joined}</td>
      <td className="p-4">
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === "Online" ? "bg-green-400/10 text-green-400" : "bg-zinc-400/10 text-zinc-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === "Online" ? "bg-green-400" : "bg-zinc-400"}`}
          ></span>
          {status}
        </div>
      </td>
      <td className="p-4 text-center">
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </td>
    </tr>
  )
}
