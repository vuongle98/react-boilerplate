import { useEffect, useRef, useState } from "react";
import useApiQuery from "@/shared/hooks/use-api-query";
import {
  SearchableSelectConfig,
  UseSearchableSelectReturn,
  SearchableSelectState,
  ApiDataSourceConfig,
  LocalDataSourceConfig
} from "../types";
import { Option } from "@/shared/types";

export function useSearchableSelect<T>(
  config: SearchableSelectConfig<T>,
  value: Option<T>[] | null,
  onChange: (value: Option<T>[] | null) => void
): UseSearchableSelectReturn<T> {
  const { dataSource, behavior, ui } = config;
  const { multiple = false, initialSearch = "", onOpenChange, onSearch } = behavior;

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState<string>(initialSearch);
  const [page, setPage] = useState(0);
  const [allOptions, setAllOptions] = useState<Option<T>[]>([]);
  const [last, setLast] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Data fetching logic
  const isLocalDataSource = dataSource.type === 'local';
  const isApiDataSource = dataSource.type === 'api';

  // API query for remote data
  const {
    data: apiData = [],
    isLoading,
    setPage: apiSetPage,
    page: currentPage,
    totalPages = 1,
    setSearch: apiSetSearch,
  } = isApiDataSource ? useApiQuery<T>({
    endpoint: dataSource.endpoint,
    queryKey: Array.isArray(dataSource.queryKey) ? [...dataSource.queryKey] : [dataSource.queryKey],
    initialPage: 0,
    initialPageSize: dataSource.pageSize || 10,
    mockData: {
      content: [],
      totalElements: 0,
      totalPages: 1,
      number: 0,
      size: 1000,
    },
    debounceMs: behavior.debounceMs || 300,
  }) : {
    data: [],
    isLoading: false,
    setPage: () => {},
    page: 0,
    totalPages: 1,
    setSearch: () => {},
  };

  // Process options based on data source
  useEffect(() => {
    let pageOptions: Option<T>[] = [];

    if (isLocalDataSource) {
      const localConfig = dataSource as LocalDataSourceConfig<T>;
      // Filter local options by search
      pageOptions = localConfig.options
        .filter((opt) => {
          if (!search) return true;
          const label = typeof opt === 'object' && 'label' in opt ? String(opt.label) : String(opt);
          return label.toLowerCase().includes(search.toLowerCase());
        })
        .map((opt) => {
          if (typeof opt === 'object' && 'value' in opt && 'label' in opt) {
            return opt as Option<T>;
          }
          return opt as Option<T>;
        });

      setAllOptions(pageOptions);
      setLast(true);
      setIsFetchingMore(false);
    } else if (isApiDataSource) {
      const apiConfig = dataSource as ApiDataSourceConfig<T>;
      if (apiConfig.transformData) {
        pageOptions = apiConfig.transformData(apiData);
      } else if (apiData && Array.isArray(apiData)) {
        // Fallback for untransformed data - assume it's already Option<T>[]
        pageOptions = apiData as Option<T>[];
      }

      const isLast = typeof totalPages === "number" ? currentPage >= totalPages - 1 : true;
      setLast(isLast);
      setIsFetchingMore(false);

      // Merge API options with pagination
      setAllOptions((prev) => {
        if (currentPage === 0) {
          return pageOptions;
        }

        const existingIds = new Set(prev.map((item) => item.value));
        const newOptions = pageOptions.filter(
          (item) => !existingIds.has(item.value)
        );

        return [...prev, ...newOptions];
      });
    }
  }, [apiData, currentPage, totalPages, dataSource, search, isLocalDataSource, isApiDataSource]);

  // Update API search when local search changes
  useEffect(() => {
    if (isApiDataSource && apiSetSearch) {
      apiSetSearch(search);
    }
    onSearch?.(search);
  }, [search, apiSetSearch, isApiDataSource, onSearch]);

  // Handle dropdown open/close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);

    if (!open) {
      setSearch(""); // Clear search when dropdown closes
      setPage(0); // Reset pagination
    }
  };

  // Handle option selection
  const handleSelect = (option: Option<T>) => {
    if (!multiple) {
      onChange([option]);
      setIsOpen(false);
      return;
    }

    // Multiple selection logic
    const currentValues = Array.isArray(value) ? value : [];
    const isSelected = currentValues.some((o) => o?.value === option.value);

    const newValues = isSelected
      ? currentValues.filter((o) => o?.value !== option.value)
      : [...currentValues, option];

    onChange(newValues);
  };

  // Clear all selections
  const handleClearAll = () => {
    onChange(multiple ? [] : null);
  };

  // Remove specific tag (for multiple selection)
  const removeSelectedTag = (optionValue: string) => {
    if (!multiple || !Array.isArray(value)) return;
    onChange(value.filter((option) => option.value !== optionValue));
  };

  const loadMore = () => {
    if (!last && !isFetchingMore) {
      setIsFetchingMore(true);
      setPage(currentPage + 1);
      apiSetPage?.(currentPage + 1);
    }
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const state: SearchableSelectState<T> = {
    value,
    isOpen,
    search,
    page,
    isLoading,
    hasMore: !last,
    isFetchingMore,
    allOptions,
  };

  const actions = {
    setIsOpen: handleOpenChange,
    setSearch,
    setPage,
    handleSelect,
    handleClearAll,
    removeSelectedTag,
    loadMore,
  };

  const refs = {
    searchInputRef,
    scrollContainerRef,
  };

  return {
    state,
    actions,
    refs,
  };
}
