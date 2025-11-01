"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Shimmer effect is handled through Tailwind's animate-shimmer class

const progressVariants = cva(
  "relative overflow-hidden rounded-full transition-all",
  {
    variants: {
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
        xl: "h-4"
      },
      variant: {
        default: "bg-primary/20",
        success: "bg-green-200",
        warning: "bg-yellow-200",
        error: "bg-red-200",
        gradient: "bg-gradient-to-r from-primary/20 to-secondary/20"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-transform duration-500 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        error: "bg-red-500",
        gradient: "bg-gradient-to-r from-primary to-secondary"
      },
      animation: {
        default: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        spin: "animate-spin"
      }
    },
    defaultVariants: {
      variant: "default",
      animation: "default"
    }
  }
)

const Progress = React.forwardRef(({ 
  className, 
  value, 
  max = 100,
  size,
  variant,
  animation,
  showValue = false,
  formatValue = (value) => `${Math.round(value)}%`,
  ...props 
}, ref) => {
  const percentage = value != null ? (value / max) * 100 : 0
  
  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ size, variant }), className)}
        {...props}>
        <ProgressPrimitive.Indicator
          className={cn(
            indicatorVariants({ variant, animation }),
            "relative transition-transform duration-500 ease-out"
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}>
          {/* Animation is handled through Tailwind classes */}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="absolute right-0 -top-6 text-sm font-medium text-muted-foreground">
          {formatValue(value)}
        </span>
      )}
    </div>
  )
})

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
