import React from "react";
import { Select } from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import { Option } from "@/shared/types/common";
import { SearchableSelectRootProps } from "../types";
import { useSearchableSelect } from "../hooks/use-searchable-select";

const SearchableSelectContext = React.createContext<{
  hook: ReturnType<typeof useSearchableSelect>;
  config: any;
} | null>(null);

export function useSearchableSelectContext<T>() {
  const context = React.useContext(SearchableSelectContext);
  if (!context) {
    throw new Error('SearchableSelect compound components must be used within SearchableSelectRoot');
  }
  return context as {
    hook: ReturnType<typeof useSearchableSelect<T>>;
    config: any;
  };
}

export const SearchableSelectRoot = React.memo(function SearchableSelectRoot<T>({
  config,
  value,
  onChange,
  children,
}: SearchableSelectRootProps<T>) {
  // Temporarily disabled to focus on infinite loop
  // console.log('🔄 SearchableSelectRoot rendering', {
  //   dataSourceType: config?.dataSource?.type,
  //   valueCount: Array.isArray(value) ? value.length : 0,
  //   hasChildren: !!children
  // });

  const searchableSelect = useSearchableSelect(config, value, onChange);

  // Don't memoize context - React.memo on Root is sufficient
  // Memoizing with hook dependency causes re-creation on every render anyway
  const contextValue = {
    hook: searchableSelect,
    config,
  };

  const { state, actions } = searchableSelect;

  return (
    <SearchableSelectContext.Provider value={contextValue}>
      <div className={cn("space-y-2", config.ui.className)}>
        <Select
          value={config.behavior.multiple ? undefined : (Array.isArray(value) && value[0]?.value) || ""}
          onValueChange={() => { }}
          disabled={config.ui.disabled}
          open={state.isOpen}
          onOpenChange={actions.setIsOpen}
        >
          {children}
        </Select>
      </div>
    </SearchableSelectContext.Provider>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  // Only re-render if value actually changed or config references changed
  const valueChanged = JSON.stringify(prevProps.value) !== JSON.stringify(nextProps.value);
  const configChanged = prevProps.config !== nextProps.config;
  const onChangeChanged = prevProps.onChange !== nextProps.onChange;

  return !valueChanged && !configChanged && !onChangeChanged;
}) as <T>(props: SearchableSelectRootProps<T>) => JSX.Element;
