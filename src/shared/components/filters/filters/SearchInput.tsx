import { ApiQueryFilters } from "@/shared/hooks/use-api-query";
import { FilterSearch } from "../FilterSearch";

interface SearchInputProps {
  showFilters: boolean;
  withSearch: boolean;
  searchValue: string;
  searchPlaceholder: string;
  updateFilters: (filters: ApiQueryFilters) => void;
  filters: ApiQueryFilters;
}

export const SearchInput = ({
  showFilters,
  withSearch,
  searchValue,
  searchPlaceholder,
  updateFilters,
  filters,
}: SearchInputProps) => {
  if (showFilters || !withSearch) return null;

  return (
    <FilterSearch
      value={searchValue}
      placeholder={searchPlaceholder}
      onChange={(value) => {
        const newFilters = { ...filters, search: value };
        updateFilters(newFilters);
      }}
      onClear={() => {
        const newFilters = { ...filters, search: "" };
        updateFilters(newFilters);
      }}
    />
  );
};
