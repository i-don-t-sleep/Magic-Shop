"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface NavItemProps {
  icon: ReactNode
  label: string
  href?: string
  onClick?: () => void
  collapsed?: boolean
}

export function NavItem({ icon, label, href, onClick, collapsed = false }: NavItemProps) {
  const pathname = usePathname()
  const isActive = href ? pathname.startsWith(href) : false

  const className = cn(
    "w-full text-left flex items-center transition-colors rounded-[14]",
    collapsed ? "justify-center px-2 py-2" : "gap-3 px-6 py-2",
    isActive ? "bg-magic-red text-black" : "text-zinc-10 hover:bg-zinc-700",
  )

  const content = (
    <>
      <span className="w-5 h-5">{icon}</span>
      {!collapsed && <span className="text-sm">{label}</span>}
    </>
  )

  const element = href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  )

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{element}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return element
}
