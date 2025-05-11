"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbClassName?: string
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, thumbClassName, children, ...props }, ref) => {
    // Get the value from props to determine if we need single or range slider
    const isRange =
      Array.isArray(props.value || props.defaultValue) && (props.value || (props.defaultValue as number[])).length === 2

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-700">
          <SliderPrimitive.Range className="absolute h-full bg-magic-red" />
        </SliderPrimitive.Track>

        {/* Single thumb */}
        {!isRange && (
          <SliderPrimitive.Thumb
            className={cn(
              "block h-5 w-5 rounded-full border-2 border-magic-red bg-background",
              "ring-offset-background transition-colors focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              thumbClassName,
            )}
          />
        )}

        {/* Range (two thumbs) */}
        {isRange && (
          <>
            <SliderPrimitive.Thumb
              index={0}
              className={cn(
                "block h-5 w-5 rounded-full border-2 border-magic-red bg-background",
                "ring-offset-background transition-colors focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                thumbClassName,
              )}
            />
            <SliderPrimitive.Thumb
              index={1}
              className={cn(
                "block h-5 w-5 rounded-full border-2 border-magic-red bg-background",
                "ring-offset-background transition-colors focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                thumbClassName,
              )}
            />
          </>
        )}

        {children}
      </SliderPrimitive.Root>
    )
  },
)
Slider.displayName = "Slider"

export { Slider }
