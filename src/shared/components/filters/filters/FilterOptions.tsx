import { ApiQueryFilters } from "@/shared/hooks/use-api-query";
import { FilterOption, Option, BaseData } from "@/shared/types/common";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { FilterDate } from "../FilterDate";
import { FilterSelect } from "../FilterSelect";
import { SearchableSelect, createSearchableSelectConfig } from "@/shared/ui/searchable-select";
import { Label } from "@/shared/ui/label";

interface FilterOptionsProps {
  groupedFilters: {
    search: FilterOption<any>[];
    select: FilterOption<any>[];
    date: FilterOption<any>[];
    searchableSelect: FilterOption<any>[];
  };
  filters: ApiQueryFilters;
  handleFilterChange: (id: string, value: string | Date | null | Option<any>[]) => void;
  handleSearchableSelectChange: (id: string, selected: Option<any>[] | null) => void;
}

export const FilterOptions = ({
  groupedFilters,
  filters,
  handleFilterChange,
  handleSearchableSelectChange,
}: FilterOptionsProps) => (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {/* Text Filters */}
    {groupedFilters.search.map((option) => (
      <div key={option.id} className="flex flex-col">
        <Label
          htmlFor={option.id}
          className="text-xs sm:text-sm font-medium mb-1"
        >
          {option.label}
        </Label>
        <Input
          id={option.id}
          type="text"
          placeholder={option.placeholder || `Enter ${option.label}...`}
          value={(filters[option.id] as string) || ""}
          onChange={(e) => handleFilterChange(option.id, e.target.value)}
          className="h-9"
        />
      </div>
    ))}

    {/* Select Filters */}
    {groupedFilters.select.map((option) => (
      <FilterSelect
        key={option.id}
        option={option}
        value={(filters[option.id] as string) || ""}
        onChange={(value) => handleFilterChange(option.id, value)}
      />
    ))}

    {/* Searchable Select Filters */}
    {groupedFilters.searchableSelect.length > 0 && (
      <div className="space-y-2">
        <div className="space-y-1">
          {groupedFilters.searchableSelect.map((option) => {
            const isMultiple = option.multiple === true;
            const filterValue = filters[option.id];

            // Convert filter value to Option[] format
            const value: Option<any>[] = isMultiple
              ? (Array.isArray(filterValue) ? filterValue as Option<any>[] : [])
              : (filterValue ? [{ value: String(filterValue), label: String(filterValue) }] : []);

            const config = createSearchableSelectConfig({
              dataSource: option.endpoint && option.queryKey ? {
                type: 'api' as const,
                endpoint: option.endpoint,
                queryKey: option.queryKey,
                transformData: option.transformData || ((data: any[]) =>
                  data.map((item: any & BaseData) => ({
                    value: item.id?.toString() || "",
                    label: item.name || item.label || "",
                    original: item,
                  }))),
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
              <div key={option.id} className="flex flex-col">
                <label
                  htmlFor={option.id}
                  className="text-xs sm:text-sm font-medium mb-1"
                >
                  {option.label}
                </label>
                <SearchableSelect.Root
                  config={config}
                  value={value}
                  onChange={(newValue) =>
                    handleSearchableSelectChange(option.id, newValue)
                  }
                >
                  <SearchableSelect.Trigger value={value} />
                  <SearchableSelect.Content />
                  {isMultiple && <SearchableSelect.SelectedTags />}
                </SearchableSelect.Root>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Date Filters */}
    {groupedFilters.date.map((option) => (
      <FilterDate
        key={option.id}
        option={option}
        value={(filters[option.id] as string) || null}
        onChange={(value) => handleFilterChange(option.id, value)}
      />
    ))}

  </div>
);
