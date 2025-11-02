import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { useIsMobile } from "@/shared/hooks/use-mobile"

import { cn } from "@/shared/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        // Base styles
        "flex items-center justify-center rounded-lg bg-muted text-muted-foreground",
        // Mobile: stacked layout with better spacing
        isMobile
          ? "flex-col h-auto p-2 gap-1"
          : "inline-flex h-10 p-1",
        className
      )}
      {...props}
    />
  );
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        // Base styles
        "flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        // Mobile: full width, larger touch targets, better spacing
        isMobile
          ? "w-full rounded-md px-4 py-2.5 text-sm min-h-[44px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm active:scale-[0.98]"
          : "inline-flex rounded-sm px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        // Focus styles
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
