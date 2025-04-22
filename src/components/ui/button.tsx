import * as React from "react"

const buttonVariants = {
  variant: {
    default: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
    outline: "text-white bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] hover:from-[#d10000] hover:to-red-500 hover:bg-gradient-to-b transition-all duration-100",
    ghost: "hover:text-white",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
    etc: "h-10 w-5",
  },
} as const

const buttonBorderVariants = {
  variant: {
    outline: "bg-gradient-to-b from-[#4E4E4E] to-[#323232] peer-hover:bg-none",
  },
  size: {
    outline: "relative p-[1px] rounded-xl",
  },
} as const

const transition_color_delay = 300

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = buttonVariants.variant[variant] ?? buttonVariants.variant.default
    const sizeClasses = buttonVariants.size[size] ?? buttonVariants.size.default

    const hasBorder =
      variant in buttonBorderVariants.variant &&
      variant in buttonBorderVariants.size

    const borderClass = buttonBorderVariants.variant[variant as keyof typeof buttonBorderVariants.variant] ?? ""
    const borderSizeClass = buttonBorderVariants.size[variant as keyof typeof buttonBorderVariants.size] ?? ""

    const button = (
      <button
        className={`
          ${hasBorder ? "peer" : ""}
          relative z-10 inline-flex items-center justify-center
          rounded-xl text-sm font-medium ring-offset-background
          transition-colors duration-${transition_color_delay} focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          ${variantClasses} ${sizeClasses} ${className || ""}
        `}
        ref={ref}
        {...props}
      />
    )

    if (hasBorder) {
      return (
        <div className={`${borderSizeClass} relative`}>
          {button}
          <div
            className={`
              absolute inset-0 rounded-xl p-[1px]
              ${borderClass}
              transition-all duration-${transition_color_delay}
              pointer-events-none
              z-0
            `}
          />
        </div>
      )
    }

    return button
  }
)

Button.displayName = "Button"
export { Button, buttonVariants }
