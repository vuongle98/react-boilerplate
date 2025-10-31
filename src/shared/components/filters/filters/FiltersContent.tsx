import React from "react";
import { ApiQueryFilters } from "@/shared/hooks/use-api-query";
import { FilterOption, Option } from "@/shared/types/common";
import { cn } from "@/shared/lib/utils";
import { SlideUp } from "@/shared/ui/animate";
import { FilterBadges } from "./FilterBadges";
import { FilterControls } from "./FilterControls";
import { FilterOptions } from "./FilterOptions";
import { SearchInput } from "./SearchInput";

interface FiltersContentProps {
  showFilters: boolean;
  withSearch: boolean;
  searchValue: string;
  searchPlaceholder: string;
  updateFilters: (filters: ApiQueryFilters) => void;
  filters: ApiQueryFilters;
  activeFilters: string[];
  options: FilterOption<any>[];
  onRemove: (id: string) => void;
  showToggle: boolean;
  filtersTitle: string;
  toggleFilters: () => void;
  hasActiveFilters: boolean;
  handleReset: () => void;
  groupedFilters: {
    search: FilterOption<any>[];
    select: FilterOption<any>[];
    date: FilterOption<any>[];
    searchableSelect: FilterOption<any>[];
  };
  handleFilterChange: (id: string, value: string | Date | null | Option<any>[]) => void;
  handleSearchableSelectChange: (id: string, selected: Option<any>[] | null) => void;
  children?: React.ReactNode;
}

function FiltersContent({
  showFilters,
  withSearch,
  searchValue,
  searchPlaceholder,
  updateFilters,
  filters,
  activeFilters,
  options,
  onRemove,
  showToggle,
  filtersTitle,
  toggleFilters,
  hasActiveFilters,
  handleReset,
  groupedFilters,
  handleFilterChange,
  handleSearchableSelectChange,
  children,
}: FiltersContentProps): React.ReactNode {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <SearchInput
        showFilters={showFilters}
        withSearch={withSearch}
        searchValue={searchValue}
        searchPlaceholder={searchPlaceholder}
        updateFilters={updateFilters}
        filters={filters}
      />

      <FilterBadges
        activeFilters={activeFilters}
        options={options}
        onRemove={onRemove}
      />

      <FilterControls
        showToggle={showToggle}
        filtersTitle={filtersTitle}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        hasActiveFilters={hasActiveFilters}
        handleReset={handleReset}
      />
    </div>

    {showFilters && (
      <SlideUp delay={100}>
        <div className="grid gap-4">
          {options && options.length > 0 ? (
            <FilterOptions
              groupedFilters={groupedFilters}
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleSearchableSelectChange={handleSearchableSelectChange}
            />
          ) : (
            children
          )}
        </div>
      </SlideUp>
    )}
  </>
  );
}

const MemoizedFiltersContent = React.memo(FiltersContent);
export { MemoizedFiltersContent as FiltersContent };
