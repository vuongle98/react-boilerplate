import { ApiQueryFilters } from "@/shared/hooks/use-api-query";
import { BaseData, Option } from "@/types/common";
import { format } from "date-fns";
import { useCallback, useState } from "react";

export const useFilterState = <T,>(
  filters: ApiQueryFilters,
  onChange: (filters: ApiQueryFilters) => void,
  onReset: () => void
) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const updateFilters = useCallback(
    (updater: ApiQueryFilters | ((currentFilters: ApiQueryFilters) => ApiQueryFilters)) => {
      let newFilters: ApiQueryFilters;

      if (typeof updater === 'function') {
        newFilters = updater(filters);
      } else {
        newFilters = updater;
      }

      onChange(newFilters);
    },
    [filters, onChange]
  );

  const handleReset = useCallback(() => {
    onReset();
    setActiveFilters([]);
  }, [onReset]);

  const handleFilterChange = useCallback(
    (id: string, value: string | Date | null | Option<T>[]) => {

      // Track active filters for UI display
      const hasValue = Boolean(value && (
        typeof value === "string" ? value.trim() !== "" :
        Array.isArray(value) ? value.length > 0 :
        value instanceof Date ? true : false
      ));

      setActiveFilters(prev =>
        hasValue
          ? prev.includes(id) ? prev : [...prev, id]
          : prev.filter(filterId => filterId !== id)
      );

      // Update filters by calling updateFilters with new object
      updateFilters(currentFilters => {
        let formattedValue: string | null = null;

        // Format different value types
        if (value instanceof Date) {
          formattedValue = format(value, "yyyy-MM-dd");
        } else if (Array.isArray(value)) {
          // Handle searchable-select multi-select values
          formattedValue = value.map((item: Option<T & BaseData>) => item.original?.id || item.value).join(",");
        } else if (typeof value === "string") {
          formattedValue = value;
        }

        return { ...currentFilters, [id]: formattedValue };
      });
    },
    [updateFilters]
  );

  const handleSearchableSelectChange = useCallback(
    (id: string, selected: Option<T>[] | null) => {
      if (!selected || selected.length === 0) {
        setActiveFilters(prev => prev.filter(filterId => filterId !== id));
        updateFilters(currentFilters => ({ ...currentFilters, [id]: null }));
        return;
      }

      // For single selection, return just the value
      if (selected.length === 1) {
        const item = selected[0];
        setActiveFilters(prev =>
          prev.includes(id) ? prev : [...prev, id]
        );
        updateFilters(currentFilters => ({ ...currentFilters, [id]: item.original?.id || item.value }));
        return;
      }

      // Handle multi-select values
      const values = selected.map((item: Option<T & BaseData>) =>
        item.original?.id || item.value
      );

      setActiveFilters(prev =>
        prev.includes(id) ? prev : [...prev, id]
      );

      updateFilters(currentFilters => ({ ...currentFilters, [id]: values }));
    },
    [updateFilters]
  );

  return {
    activeFilters,
    updateFilters,
    handleReset,
    handleFilterChange,
    handleSearchableSelectChange,
  };
};
