import { SearchableSelect, createSearchableSelectConfig } from "@/shared/ui/searchable-select";
import { Option } from "@/shared/types/common";

interface FilterSearchableSelectProps<T> {
  option: any;
  value: any[] | string;
  onChange: (value: any[] | string | null) => void;
}

export const FilterSearchableSelect = <T,>({
  option,
  value,
  onChange,
}: FilterSearchableSelectProps<T>) => {
  const isMultiple = option.multiple !== false; // Default to true for backward compatibility

  // Convert legacy value format to Option[] format
  const convertValueToOptions = (val: any[] | string): Option<any>[] | null => {
    if (!val) return null;
    if (Array.isArray(val)) {
      return val.filter(Boolean).map(v => ({ value: v.toString(), label: v.toString() }));
    }
    return [{ value: val.toString(), label: val.toString() }];
  };

  // Convert Option[] back to legacy format
  const convertOptionsToValue = (options: Option<any>[] | null): any[] | string | null => {
    if (!options || options.length === 0) return null;
    if (isMultiple) {
      return options.map(opt => opt.value);
    }
    return options[0]?.value || null;
  };

  const config = createSearchableSelectConfig({
    dataSource: option.endpoint && option.queryKey ? {
      type: 'api' as const,
      endpoint: option.endpoint,
      queryKey: option.queryKey,
      transformData: option.transformData || ((data: any[]) => {
        if (!Array.isArray(data)) return [];
        return data.map(
          (
            item: T & {
              id?: string | number;
              name?: string;
              label?: string;
            }
          ) => ({
            value: item.id?.toString() || "",
            label: item.name || item.label || "",
            original: item,
          })
        );
      }),
    } : {
      type: 'local' as const,
      options: option.options || [],
    },
    ui: {
      placeholder: option.placeholder || `Select ${option.label}...`,
      searchPlaceholder: `Search ${option.label}...`,
    },
    behavior: {
      multiple: isMultiple,
    },
  });

  return (
    <div key={option.id} className="flex flex-col space-y-1">
      <label htmlFor={option.id} className="text-sm font-medium">
        {option.label}
      </label>
      <SearchableSelect.Root
        config={config}
        value={convertValueToOptions(value)}
        onChange={(newValue) => {
          onChange(convertOptionsToValue(newValue));
        }}
      >
        <SearchableSelect.Trigger value={convertValueToOptions(value)} />
        <SearchableSelect.Content />
        {isMultiple && <SearchableSelect.SelectedTags />}
      </SearchableSelect.Root>
    </div>
  );
};
