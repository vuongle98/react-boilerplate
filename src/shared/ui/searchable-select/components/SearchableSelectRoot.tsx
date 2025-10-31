import React from "react";
import { Select } from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import { Option } from "@/shared/types/common";
import { SearchableSelectRootProps } from "../types";
import { useSearchableSelect } from "../hooks/use-searchable-select";

const SearchableSelectContext = React.createContext<ReturnType<typeof useSearchableSelect> | null>(null);

export function useSearchableSelectContext<T>() {
  const context = React.useContext(SearchableSelectContext);
  if (!context) {
    throw new Error('SearchableSelect compound components must be used within SearchableSelectRoot');
  }
  return context as ReturnType<typeof useSearchableSelect<T>>;
}

export function SearchableSelectRoot<T>({
  config,
  value,
  onChange,
  children,
}: SearchableSelectRootProps<T>) {
  const searchableSelect = useSearchableSelect(config, value, onChange);
  const { state, actions } = searchableSelect;

  return (
    <SearchableSelectContext.Provider value={searchableSelect}>
      <div className={cn("space-y-2", config.ui.className)}>
        <Select
          value={config.behavior.multiple ? undefined : (Array.isArray(value) && value[0]?.value) || ""}
          onValueChange={() => {}}
          disabled={config.ui.disabled}
          open={state.isOpen}
          onOpenChange={actions.setIsOpen}
        >
          {children}
        </Select>
      </div>
    </SearchableSelectContext.Provider>
  );
}
