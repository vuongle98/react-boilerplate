import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, getFocusStyles } from "./utils"
import { getVariantClasses, componentTokens } from "./theme"

const inputVariants = cva(
  [
    // Base styles
    "flex w-full rounded-lg border text-sm ring-offset-background",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    "placeholder:text-neutral-500",
    "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",

    // Focus styles
    getFocusStyles(),

    // Transitions
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: getVariantClasses.input.default,
        error: getVariantClasses.input.error,
      },
      size: {
        sm: `h-8 px-3 py-1 text-sm ${componentTokens.input.padding.sm}`,
        md: `h-9 px-3 py-2 text-sm ${componentTokens.input.padding.md}`,
        lg: `h-11 px-4 py-3 text-base ${componentTokens.input.padding.lg}`,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string
  helperText?: string
  error?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant,
    size,
    type = "text",
    label,
    helperText,
    error,
    startAdornment,
    endAdornment,
    id,
    value,
    ...props
  }, ref) => {
    const inputId = id || React.useId()
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined

    const hasError = Boolean(error)
    const inputVariant = hasError ? "error" : variant

    // Ensure value is never null to prevent React warnings
    const safeValue = value === null ? "" : value

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {startAdornment && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {startAdornment}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              inputVariants({ variant: inputVariant, size, className }),
              startAdornment && "pl-10",
              endAdornment && "pr-10"
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={cn(errorId, helperId)}
            value={safeValue}
            {...props}
          />

          {endAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {endAdornment}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm text-destructive-600 dark:text-destructive-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={helperId}
            className="text-sm text-neutral-600 dark:text-neutral-400"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input, inputVariants }
