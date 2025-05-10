/* ---------------- Slider.tsx (Radix Range Slider) ---------------- */
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

/**
 * Wrapper component over Radix `Slider`, auto-rendering the correct number of thumbs.
 * –   If `value` / `defaultValue` length === 1 → single thumb
 * –   If length === 2          → range slider (min–max)
 *
 * Prop API เหมือน Radix ตรง ๆ เพิ่ม `thumbClassName` เผื่อปรับสไตล์เป็นรายตัว
 */
export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbClassName?: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, thumbClassName, children, ...props }, ref) => {
  // figure out how many thumbs we need (1 by default)
  const thumbCount = React.useMemo(() => {
    const val = (props.value ?? props.defaultValue) as number[] | undefined
    return Array.isArray(val) ? val.length : 1
  }, [props.value, props.defaultValue])

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-700">
        <SliderPrimitive.Range className="absolute h-full bg-magic-red" />
      </SliderPrimitive.Track>

      {/* Render thumbs dynamically */}
      {Array.from({ length: thumbCount }).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            "block h-5 w-5 rounded-full border-2 border-magic-red bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            thumbClassName,
          )}
        />
      ))}

      {children}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = "Slider"

export { Slider }
