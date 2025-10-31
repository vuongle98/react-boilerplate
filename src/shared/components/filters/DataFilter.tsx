import React, { useMemo } from "react";
import { ApiQueryFilters } from "@/shared/hooks/use-api-query";
import { FilterOption } from "@/shared/types/common";
import { cn } from "@/shared/lib/utils";
import {
  useFilterState,
  useFilterVisibility,
  FiltersContent,
  MobileFilters,
} from "./filters";

export interface DataFiltersProps<T> {
  filters: ApiQueryFilters;
  options?: FilterOption<T>[];
  className?: string;
  withSearch?: boolean;
  searchPlaceholder?: string;
  filtersTitle?: string;
  showToggle?: boolean;
  children?: React.ReactNode;

  // Filter change handlers
  onChange: (filters: ApiQueryFilters) => void;
  onReset: () => void;
}

// Main DataFilters component
function DataFilters<T>({
  filters,
  onChange,
  onReset,
  children,
  className = "",
  withSearch = true,
  searchPlaceholder = "Search...",
  filtersTitle = "Filters",
  showToggle = false,
  options = [],
}: DataFiltersProps<T>) {
  const {
    activeFilters,
    updateFilters,
    handleReset,
    handleFilterChange,
    handleSearchableSelectChange,
  } = useFilterState<T>(filters, onChange, onReset);

  const { isMobile, showFilters: settingsShowFilters, isOpen, setIsOpen, toggleFilters } =
    useFilterVisibility();

  // When showToggle is false, always show filters regardless of settings
  const showFilters = showToggle === false ? true : settingsShowFilters;

  // Get current search value
  const searchValue = (filters.search as string) || "";

  // Check if there are any active filters (excluding search)
  const hasActiveFilters = useMemo(
    () =>
      Object.entries(filters).some(
        ([key, value]) =>
          key !== "search" &&
          value !== "" &&
          value !== null &&
          value !== undefined
      ),
    [filters]
  );

  // Group filters by type for rendering
  const groupedFilters = useMemo(() => {
    const groups: Record<string, FilterOption<T>[]> = {
      search: [],
      select: [],
      date: [],
      searchableSelect: [],
    };

    options.forEach((option) => {
      const group = option.type === "text" ? "search" : option.type;
      if (group in groups) {
        groups[group]!.push(option);
      }
    });

    return groups as {
      search: FilterOption<T>[];
      select: FilterOption<T>[];
      date: FilterOption<T>[];
      searchableSelect: FilterOption<T>[];
    };
  }, [options]);

  const filtersContent = (
    <FiltersContent
      showFilters={showFilters}
      withSearch={withSearch}
      searchValue={searchValue}
      searchPlaceholder={searchPlaceholder}
      updateFilters={updateFilters}
      filters={filters}
      activeFilters={activeFilters}
      options={options}
      onRemove={(id) => handleFilterChange(id, "")}
      showToggle={showToggle}
      filtersTitle={filtersTitle}
      toggleFilters={toggleFilters}
      hasActiveFilters={hasActiveFilters}
      handleReset={handleReset}
      groupedFilters={groupedFilters}
      handleFilterChange={handleFilterChange}
      handleSearchableSelectChange={handleSearchableSelectChange}
    >
      {children}
    </FiltersContent>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {isMobile ? (
        <MobileFilters isOpen={isOpen} setIsOpen={setIsOpen}>
          {filtersContent}
        </MobileFilters>
      ) : (
        <div className="mb-6">{filtersContent}</div>
      )}
    </div>
  );
}

// Export as both default and named export for backward compatibility
const MemoizedDataFilters = React.memo(DataFilters);
export { MemoizedDataFilters as DataFilters };
export default MemoizedDataFilters;
