import { SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Option } from "@/shared/types/common";
import { SearchableSelectTriggerProps } from "../types";
import { useSearchableSelectContext } from "./SearchableSelectRoot";

export function SearchableSelectTrigger<T>({
  value,
  placeholder = "Select an option",
  disabled = false,
  multiple = false,
  options,
}: SearchableSelectTriggerProps<T>) {
  const { state, actions } = useSearchableSelectContext<T>();

  const getDisplayValue = (): string | null => {
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
    if (typeof selectedValue === 'string' && options) {
      const option = options.find((opt: any) =>
        opt && typeof opt === 'object' && opt.value === selectedValue
      );
      return option ? (typeof option === 'object' && 'label' in option ? String(option.label) : selectedValue) : selectedValue;
    }

    return String(selectedValue);
  };

  return (
    <SelectTrigger className="w-full">
      <SelectValue placeholder={placeholder}>
        {getDisplayValue()}
      </SelectValue>
    </SelectTrigger>
  );
}