/* ---------------- spinbox.tsx ---------------- */
"use client"

import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Spinbox component: custom number input with increment/decrement buttons
 */
export interface SpinboxProps
  // Omit default onChange to define custom signature
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  inputClassName?: string
  buttonClassName?: string
}

const Spinbox = React.forwardRef<HTMLDivElement, SpinboxProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 9999,
      step = 1,
      disabled = false,
      className,
      inputClassName,
      buttonClassName,
      ...props
    },
    ref,
  ) => {
    const handleIncrement = () => {
      if (disabled) return
      const newValue = Math.min(value + step, max)
      onChange(newValue)
    }

    const handleDecrement = () => {
      if (disabled) return
      const newValue = Math.max(value - step, min)
      onChange(newValue)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return
      const parsed = Number.parseFloat(e.target.value)
      if (isNaN(parsed)) return
      const clamped = Math.min(Math.max(parsed, min), max)
      onChange(clamped)
    }

    const handleBlur = () => {
      const clamped = Math.min(Math.max(value, min), max)
      if (clamped !== value) onChange(clamped)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-10 overflow-hidden rounded-md border bg-[#2a2a2a] border-zinc-800 text-white",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <input
          type="number"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            "w-full bg-zinc-900 px-3 py-2 text-left text-white border-none outline-none",
            "[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            inputClassName,
          )}
          {...props}
        />
        <div className="flex flex-col border-l  border-zinc-800">
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || value >= max}
            className={cn(
              `flex h-5 w-6 items-center justify-center ${value == max ?'bg-zinc-900 cursor-not-allowed':'bg-zinc-800 hover:bg-magic-red'} transition-colors`,
              disabled && "cursor-not-allowed",
              buttonClassName,
            )}
            tabIndex={-1}
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || value <= min}
            className={cn(
              `flex h-5 w-6 items-center justify-center ${value == min ?'bg-zinc-900 cursor-not-allowed':'bg-zinc-800 hover:bg-magic-red'}  transition-colors`,
              disabled && "cursor-not-allowed",
              buttonClassName,
            )}
            tabIndex={-1}
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    )
  },
)

Spinbox.displayName = "Spinbox"

export { Spinbox }
