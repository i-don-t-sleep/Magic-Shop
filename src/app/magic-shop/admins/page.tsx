"use client"

import { useState } from "react"

export default function reviewsPage() {
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
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
}) {
  return (
    <main>
      ...
    </main>
  )
}

export function Body({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
}) {
  return (
    <main>
      admin
    </main>
  )
}
