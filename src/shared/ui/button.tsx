import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, getFocusStyles, getInteractiveStyles } from "./utils"
import { getVariantClasses, componentTokens } from "./theme"

const buttonVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",

    // Interactive states
    getInteractiveStyles('scale'),

    // Focus styles
    getFocusStyles(),
  ],
  {
    variants: {
      variant: {
        primary: getVariantClasses.button.primary,
        secondary: getVariantClasses.button.secondary,
        ghost: getVariantClasses.button.ghost,
        danger: getVariantClasses.button.danger,
        success: getVariantClasses.button.success,
      },
      size: {
        xs: `h-7 px-2 text-xs ${componentTokens.button.padding.xs}`,
        sm: `h-8 px-3 text-sm ${componentTokens.button.padding.sm}`,
        md: `h-9 px-4 text-sm ${componentTokens.button.padding.md}`,
        lg: `h-11 px-6 text-base ${componentTokens.button.padding.lg}`,
        xl: `h-12 px-8 text-lg ${componentTokens.button.padding.xl}`,
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    iconLeft,
    iconRight,
    loading = false,
    loadingText,
    disabled,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        )}

        {!loading && iconLeft && (
          <span className="flex-shrink-0" aria-hidden="true">
            {iconLeft}
          </span>
        )}

        <span className={loading && !loadingText ? "sr-only" : ""}>
          {loading && loadingText ? loadingText : children}
        </span>

        {!loading && iconRight && (
          <span className="flex-shrink-0" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
