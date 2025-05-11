// DemoTagInput.tsx
"use client"

import * as React from "react"
import {TagInputFixed, TagItem } from "@/components/ui/tag-input"  // ปรับ path ตามโครงสร้างโปรเจกต์คุณ

export type FilterOption = TagItem & {
  type: string
  typeLabel: string
  color: string
}

export const demoSuggestions: FilterOption[] = [
  { type: "category", typeLabel: "Category", value: "Rulebook", label: "RulebookRulebookRulebookRulebookRulebookRulebook", color: "#A78BFA" },
  { type: "category", typeLabel: "Category", value: "Miniature", label: "Miniature", color: "#A78BFA" },
  { type: "category", typeLabel: "Category", value: "Dice", label: "Dice", color: "#A78BFA" },
  { type: "category", typeLabel: "Category", value: "Game Aid", label: "Game Aid", color: "#A78BFA" },
  { type: "category", typeLabel: "Category", value: "Digital Content", label: "Digital Content", color: "#A78BFA" },
  { type: "category", typeLabel: "Category", value: "Merchandise", label: "Merchandise", color: "#A78BFA" },
  { type: "category", typeLabel: "Category", value: "Custom Content", label: "Custom Content", color: "#A78BFA" },
  { type: "category", typeLabel: "Category", value: "etc...", label: "etc...", color: "#A78BFA" },
  { type: "publisher", typeLabel: "Publisher", value: "Hoghle Coorporation ltd.", label: "Hoghle Coorporation ltd.", color: "#3B82F6" },
  { type: "publisher", typeLabel: "Publisher", value: "Wangshu corporation", label: "Wangshu corporation", color: "#3B82F6" },
  { type: "publisher", typeLabel: "Publisher", value: "Wonderland Illusion", label: "Wonderland Illusion", color: "#3B82F6" },
  { type: "status", typeLabel: "Status", value: "Available", label: "Available", color: "#10B981" },
  { type: "status", typeLabel: "Status", value: "Out of Stock", label: "Out of Stock", color: "#10B981" },
  { type: "sort", typeLabel: "Sort By", value: "price-asc", label: "Price: Low to High", color: "#6B7280" },
  { type: "sort", typeLabel: "Sort By", value: "price-desc", label: "Price: High to Low", color: "#6B7280" },
  { type: "sort", typeLabel: "Sort By", value: "quantity-asc", label: "Quantity: Low to High", color: "#6B7280" },
  { type: "sort", typeLabel: "Sort By", value: "quantity-desc", label: "Quantity: High to Low", color: "#6B7280" },
  { type: "sort", typeLabel: "Sort By", value: "id-desc", label: "Newest First", color: "#6B7280" },
  { type: "sort", typeLabel: "Sort By", value: "id-asc", label: "Oldest First", color: "#6B7280" },
]

export default function TagInputDemo() {
  const [selected, setSelected] = React.useState<string[]>([])
  return (
    <div className="p-4">
      <TagInputFixed
        items={demoSuggestions}
        selectedItems={selected}
        onItemSelect={val => setSelected(prev => [...prev, val])}
        onItemRemove={val => setSelected(prev => prev.filter(v => v !== val))}
        placeholder="Select options..."
        className=""
        //maxWidth="400px"
        fieldWidth="400px"
      />
      <div className="mt-4 text-sm text-gray-600">
        Selected: {selected.join(', ')}
    </div>
    </div>
  )
}