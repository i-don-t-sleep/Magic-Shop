import type React from "react"
import Link from "next/link"

export interface NavItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}

export function NavItem({ icon, label, href, active = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-2 py-2 rounded-[14] transition-colors ${
        active ? " bg-magic-red text-white " : "text-zinc-400 hover:text-white hover:bg-zinc-800"
      }`}
    >

      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
