import { MoreVertical } from "lucide-react"
import * as React from "react"

const buttonVariants = {
  variant: {
    default: "bg-gray-500 text-white hover:bg-magic-red focus-visible:outline-red-600 rounded-xl duration-100",
    outline: "text-white bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] hover:from-gray-700 hover:to-gray-500 hover:bg-gradient-to-b transition-all duration-100 rounded-xl",
    outlineActive: "text-white bg-gradient-to-b from-[#e8443c] to-[#9f0802] transition-all duration-100 rounded-xl",
    outlineWithOut: "text-white bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] hover:from-[#d10000] hover:to-red-500 hover:bg-gradient-to-b transition-all duration-100 rounded-xl",
    moreVert: "text-white bg-magic-iron-1 hover:bg-gray-800 transition-all duration-10 rounded-sm",
    ghost: "hover:text-white",
    ClickButton: "text-white bg-[#373737] hover:bg-red-600 transition-all duration-10 rounded-sm",
    ClickOutButton: "text-white bg-[#a20000] hover:bg-[#e70000] transition-all duration-10 rounded-sm",
    outStock: "bg-magic-red rounded-sm hover:bg-gray-800 transition-all duration-10",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
    etc: "h-7 w-7 rounded-md",
  },
} as const

const buttonBorderVariants = {
  variant: {
    outline: "bg-gradient-to-b from-[#4E4E4E] to-[#323232] peer-hover:bg-none rounded-xl",
    outlineActive: "bg-gradient-to-b from-[#4E4E4E] to-[#e64e48] peer-hover:bg-none rounded-xl",
    moreVert: "bg-gradient-to-b from-[#4E4E4E] to-[#323232] rounded-sm",
    ClickButton: "bg-gradient-to-b from-[#4E4E4E] to-[#323232] rounded-sm",
    outStock: "bg-[#E8443C] rounded-sm",
  },
  size: {
    outline: "p-[1px] rounded-xl",
    outlineActive: "p-[1px] rounded-xl",
    moreVert: "p-[1px] rounded-sm",
    ClickButton: "p-[1px] rounded-xl",
    outStock: "p-[1px] rounded-xl",
  },
} as const

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
        className={`select-none
          ${hasBorder ? "peer" : ""}
          relative z-5 inline-flex items-center justify-center
          text-sm font-medium ring-offset-background
          transition-colors focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-20
          ${variantClasses} ${sizeClasses} ${className || ""}
        `}
        ref={ref}
        {...props}
      />
    )

    if (hasBorder) {
      return (
        <div className={`inline-flex items-center justify-center ${borderSizeClass} w-fit h-fit relative`}>
          {button}
          <div
            className={`
              absolute inset-0
              ${borderClass}
              transition-all
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
