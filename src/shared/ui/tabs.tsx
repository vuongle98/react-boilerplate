import { useIsMobile } from "@/shared/hooks/use-mobile";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

const Tabs = TabsPrimitive.Root;

// Context to pass iconOnly state to TabsTrigger
const TabsContext = React.createContext<{ iconOnly?: boolean }>({});

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  iconOnly?: boolean;
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, iconOnly, ...props }, ref) => {
  const isMobile = useIsMobile();
  const shouldShowIconOnly = iconOnly || isMobile;

  return (
    <TabsContext.Provider value={{ iconOnly: shouldShowIconOnly }}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          // Base styles
          "flex items-center justify-center rounded-lg bg-muted text-muted-foreground",
          // Mobile or iconOnly: horizontal layout with compact spacing
          shouldShowIconOnly ? "inline-flex h-10 p-1 gap-1" : "inline-flex h-10 p-1",
          className
        )}
        {...props}
      />
    </TabsContext.Provider>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  icon?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, icon, ...props }, ref) => {
  const { iconOnly } = React.useContext(TabsContext);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        // Base styles
        "flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        // Icon only mode: compact square buttons
        iconOnly
          ? "rounded-md p-2 min-w-[40px] h-[32px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          : "inline-flex rounded-sm px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        // Focus styles
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {icon && <span className={cn(iconOnly && "w-4 h-4")}>{icon}</span>}
      {!iconOnly && children}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

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
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
