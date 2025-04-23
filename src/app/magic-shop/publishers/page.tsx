"use client"

import { useState } from "react"

export default function publishersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Body searchQuery={searchQuery}  setSearchQuery={setSearchQuery}/>
    </div>
  )
}

export function Header({
  searchQuery,
  setSearchQuery,
  classN = 'px-6 pb-3',
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  classN?: string
}) {
  return (
    <main className={`${classN}`}>
      ...
    </main>
  )
}

export function Body({
  searchQuery,
  setSearchQuery,
  classN = 'px-6 pb-3',
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  classN?: string
}) {
  return (
    <main className={`${classN}`}>
      publishers
    </main>
  )
}