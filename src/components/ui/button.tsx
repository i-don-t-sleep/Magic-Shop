import * as React from "react"

const buttonVariants = {
  variant: {
    default: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
    outline: "border border-zinc-700 bg-transparent hover:bg-zinc-800 hover:text-white",
    ghost: "hover:bg-zinc-800 hover:text-white",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  },
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = buttonVariants.variant[variant]
    const sizeClasses = buttonVariants.size[size]

    const allClasses = `inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses} ${sizeClasses} ${className || ""}`

    return <button className={allClasses} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
