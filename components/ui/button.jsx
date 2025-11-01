import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-primary/20 hover:shadow-xl",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:shadow-destructive/20 hover:shadow-xl",
        outline:
          "border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-lg",
        ghost: 
          "hover:bg-accent/10 hover:text-accent-foreground relative before:absolute before:inset-0 before:opacity-0 before:transition-opacity hover:before:opacity-100 before:bg-gradient-to-r before:from-accent/20 before:to-transparent before:-z-10",
        link: 
          "text-primary underline-offset-4 hover:underline decoration-wavy",
        gradient:
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl hover:opacity-90",
        glow:
          "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/50 animate-pulse",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-lg",
        xl: "h-14 rounded-lg px-10 text-xl",
        icon: "h-10 w-10 rounded-full",
        pill: "h-10 px-6 rounded-full",
      },
      animation: {
        none: "",
        bounce: "hover:animate-bounce",
        pulse: "hover:animate-pulse",
        wiggle: "hover:animate-wiggle",
        slideUp: "hover:-translate-y-1",
        glow: "hover:shadow-lg hover:shadow-primary/50",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  animation,
  asChild = false, 
  loading = false,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(
        buttonVariants({ variant, size, animation, className }),
        loading && "relative !text-transparent hover:!text-transparent !cursor-wait !pointer-events-none",
      )}
      disabled={loading || props.disabled}
      ref={ref}
      {...props}
    >
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      {props.children}
    </Comp>)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
