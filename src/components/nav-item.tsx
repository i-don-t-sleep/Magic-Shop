import type React from "react"

export interface NavItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}

export function NavItem({ icon, label, onClick, active = false }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-6 py-2 rounded-[14] transition-colors ${
        active ? " bg-magic-red text-black " : "text-zinc-10 hover:bg-zinc-700"
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  )
}
