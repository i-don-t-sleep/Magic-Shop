"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type TagInputProps = {
  value: string[]
  onChange: (value: string[]) => void
  suggestions?: string[]
  placeholder?: string
  className?: string
  allowNewTags?: boolean
  maxTags?: number
  disabled?: boolean
}

export function TagInput({
  value = [],
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  className,
  allowNewTags = true,
  maxTags,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Filter suggestions based on input value and exclude already selected tags
  const filteredSuggestions = React.useMemo(() => {
    return suggestions.filter(
      (suggestion) => suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(suggestion),
    )
  }, [suggestions, inputValue, value])

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !value.includes(trimmedTag) && (!maxTags || value.length < maxTags)) {
      onChange([...value, trimmedTag])
    }
    setInputValue("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeTag = (index: number) => {
    const newTags = [...value]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault()
      if (allowNewTags) {
        addTag(inputValue)
      } else if (filteredSuggestions.length > 0) {
        addTag(filteredSuggestions[0])
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    } else if (e.key === "ArrowDown" && showSuggestions && filteredSuggestions.length > 0) {
      e.preventDefault()
      const suggestionsList = document.querySelector(".tag-suggestions")
      const firstItem = suggestionsList?.querySelector("div") as HTMLElement
      if (firstItem) firstItem.focus()
    }
  }

  const handleSuggestionKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, suggestion: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag(suggestion)
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      inputRef.current?.focus()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const nextSibling = e.currentTarget.nextElementSibling as HTMLElement
      if (nextSibling) nextSibling.focus()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prevSibling = e.currentTarget.previousElementSibling as HTMLElement
      if (prevSibling) {
        prevSibling.focus()
      } else {
        inputRef.current?.focus()
      }
    }
  }

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md min-h-10 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
          disabled ? "bg-muted cursor-not-allowed" : "bg-white",
        )}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <div key={index} className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-500 rounded-full">
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(index)
                }}
                className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-600"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            if (e.target.value) {
              setShowSuggestions(true)
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-grow bg-transparent outline-none min-w-[120px]"
          disabled={disabled || (maxTags !== undefined && value.length >= maxTags)}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg tag-suggestions max-h-60">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => addTag(suggestion)}
              onKeyDown={(e) => handleSuggestionKeyDown(e, suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              tabIndex={0}
              role="option"
              aria-selected="false"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
