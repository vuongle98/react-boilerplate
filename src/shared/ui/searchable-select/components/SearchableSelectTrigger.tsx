import { SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Option } from "@/shared/types/common";
import React, { useMemo, useRef } from "react";
import { SearchableSelectTriggerProps } from "../types";
import { useSearchableSelectContext } from "./SearchableSelectRoot";

export const SearchableSelectTrigger = React.memo(function SearchableSelectTrigger<T>({
  value,
  placeholder,
  disabled = false,
  multiple = false,
  options,
}: SearchableSelectTriggerProps<T>) {
  // Temporarily disabled to focus on infinite loop
  // console.log('🔄 SearchableSelectTrigger rendering', {
  //   placeholder,
  //   disabled,
  //   multiple,
  //   valueCount: Array.isArray(value) ? value.length : 0,
  //   hasOptions: !!options
  // });

  const { hook: { state }, config } = useSearchableSelectContext<T>();

  // Use placeholder from props or from config
  const finalPlaceholder = placeholder ?? config.ui.placeholder ?? "Select an option";

  // Use options from props or from context state
  const availableOptions = options || state.allOptions;

  // Stringify value for stable comparison
  const valueString = useMemo(() => JSON.stringify(value), [value]);

  const displayValue = useMemo((): string | null => {
    if (!Array.isArray(value) || value.length === 0) return null;

    if (multiple) {
      return `${value.length} selected`;
    }

    // For single selection
    const selectedValue = value[0];

    // If it's already an Option object, use its label
    if (typeof selectedValue === 'object' && selectedValue && 'label' in selectedValue) {
      return String(selectedValue.label);
    }

    // If it's a string, find the corresponding option label
    if (typeof selectedValue === 'string' && availableOptions) {
      const option = availableOptions.find((opt: any) =>
        opt && typeof opt === 'object' && opt.value === selectedValue
      );
      return option ? (typeof option === 'object' && 'label' in option ? String(option.label) : selectedValue) : selectedValue;
    }

    return String(selectedValue);
  }, [valueString, multiple, availableOptions.length]);

  return (
    <SelectTrigger className="w-full">
      <SelectValue placeholder={finalPlaceholder}>
        {displayValue}
      </SelectValue>
    </SelectTrigger>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if value or multiple changed
  const shouldNotRerender = (
    JSON.stringify(prevProps.value) === JSON.stringify(nextProps.value) &&
    prevProps.multiple === nextProps.multiple &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.placeholder === nextProps.placeholder
  );

  return shouldNotRerender;
}) as <T>(props: SearchableSelectTriggerProps<T>) => JSX.Element;