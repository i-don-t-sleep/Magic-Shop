"use client"

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  ForwardedRef,
} from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Spinbox component: custom number input with increment/decrement buttons,
 * supporting configurable decimal precision typing and commit-on-enter/blur.
 */
export interface SpinboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  decimalPoint?: number      // number of decimal places, default 0
  className?: string
  inputClassName?: string
  buttonClassName?: string
}

const Spinbox = forwardRef(
  (
    {
      value,
      onChange,
      min = 0,
      max = 9999,
      step = 1,
      disabled = false,
      decimalPoint = 0,
      className,
      inputClassName,
      buttonClassName,
      ...props
    }: SpinboxProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    // Initialize local state with raw value string
    const [local, setLocal] = useState<string>(() => String(value))

    // Sync raw value into local on prop change
    useEffect(() => {
      setLocal(String(value))
    }, [value])

    // Format and clamp with configured precision
    const formatValue = (n: number) => {
      const clamped = Math.min(Math.max(n, min), max)
      return parseFloat(clamped.toFixed(decimalPoint))
    }

    // Increment/decrement preserving fractional part
    const stepDecimal = (dir: 1 | -1) => {
      const intPart = Math.trunc(value)
      const fracPart = parseFloat((value - intPart).toFixed(decimalPoint))
      const newVal = intPart + dir * step + fracPart
      return formatValue(newVal)
    }

    const commit = (valStr: string) => {
      // escape ให้ \\d กับ \\. เพื่อให้ได้ \d กับ \. ใน regex จริง
      const regex = new RegExp(`^-?\\d+(?:\\.\\d{1,${decimalPoint}})?$`);
      console.log(regex, valStr, regex.test(valStr.trim()));
    
      if (regex.test(valStr.trim())) {
        const parsed = parseFloat(valStr);
        onChange(formatValue(parsed));
      } else {
        setLocal(value.toFixed(decimalPoint));
      }
    };

    const handleIncrement = () => {
      if (disabled) return
      onChange(stepDecimal(1))
    }

    const handleDecrement = () => {
      if (disabled) return
      onChange(stepDecimal(-1))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocal(e.target.value)
    }

    const handleBlur = () => {
      if (!disabled) commit(local)
    }

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return
      if (e.key === "Enter") {
        commit(local)
        inputRef.current?.blur()
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        handleIncrement()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        handleDecrement()
      }
    }

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (disabled) return
      e.preventDefault()
      e.stopPropagation()
      e.deltaY < 0 ? handleIncrement() : handleDecrement()
    }

    return (
      <div
        ref={ref}
        /*onWheel={handleWheel}*/
        className={cn(
          "overscroll-none flex h-10 overflow-hidden rounded-md border bg-[#2a2a2a] border-zinc-600 text-white",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={local}
          /*onWheel={handleWheel}*/
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKey}
          disabled={disabled}
          className={cn(
            "w-full bg-zinc-900 px-3 py-2 text-left text-white border-none outline-none",
            inputClassName
          )}
          {...props}
        />
        <div className="flex flex-col border-l border-zinc-800">
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || value >= max}
            className={cn(
              "flex h-5 w-6 items-center justify-center transition-colors",
              value >= max
                ? "bg-zinc-900 cursor-not-allowed"
                : "bg-zinc-800 hover:bg-magic-red",
              buttonClassName
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
              "flex h-5 w-6 items-center justify-center transition-colors",
              value <= min
                ? "bg-zinc-900 cursor-not-allowed"
                : "bg-zinc-800 hover:bg-magic-red",
              buttonClassName
            )}
            tabIndex={-1}
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    )
  }
)

Spinbox.displayName = "Spinbox"
export { Spinbox }
