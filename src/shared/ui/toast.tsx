import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { useTheme } from "@/app/providers/ThemeProvider"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col gap-2 sm:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 pr-10 shadow-xl backdrop-blur-sm transition-all duration-300 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full",
  {
    variants: {
      variant: {
        default: "border-border/50 bg-background/95 text-foreground",
        destructive: "border-red-500/30 bg-red-50/90 text-red-800 dark:bg-red-950/90 dark:text-red-200 dark:border-red-800/50",
        success: "border-green-500/30 bg-green-50/90 text-green-800 dark:bg-green-950/90 dark:text-green-200 dark:border-green-800/50",
        warning: "border-orange-500/30 bg-orange-50/90 text-orange-800 dark:bg-orange-950/90 dark:text-orange-200 dark:border-orange-800/50",
        info: "border-blue-500/30 bg-blue-50/90 text-blue-800 dark:bg-blue-950/90 dark:text-blue-200 dark:border-blue-800/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant = "default", ...props }, ref) => {
  const { glassEffect } = useTheme();

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-300 mt-0.5 flex-shrink-0" />;
      case "destructive":
        return <AlertCircle className="h-5 w-5 text-red-700 dark:text-red-300 mt-0.5 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-700 dark:text-orange-300 mt-0.5 flex-shrink-0" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-700 dark:text-blue-300 mt-0.5 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getVariantClasses = () => {
    const baseClasses = "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 pr-10 shadow-xl backdrop-blur-sm transition-all duration-300 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full";

    switch (variant) {
      case "destructive":
        return `${baseClasses} border-red-500/30 bg-red-50/90 text-red-800 dark:bg-red-950/90 dark:text-red-200 dark:border-red-800/50`;
      case "success":
        return `${baseClasses} border-green-500/30 bg-green-50/90 text-green-800 dark:bg-green-950/90 dark:text-green-200 dark:border-green-800/50`;
      case "warning":
        return `${baseClasses} border-orange-500/30 bg-orange-50/90 text-orange-800 dark:bg-orange-950/90 dark:text-orange-200 dark:border-orange-800/50`;
      case "info":
        return `${baseClasses} border-blue-500/30 bg-blue-50/90 text-blue-800 dark:bg-blue-950/90 dark:text-blue-200 dark:border-blue-800/50`;
      default:
        return `${baseClasses} border-border/50 bg-background/95 text-foreground`;
    }
  };

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        getVariantClasses(),
        glassEffect && "backdrop-blur-md",
        className
      )}
      {...props}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        {props.children}
      </div>
    </ToastPrimitives.Root>
  );
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/80 px-3 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-background hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-1.5 text-foreground/70 opacity-70 transition-all duration-200 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring/50 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-80 leading-relaxed", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
