import useApiQuery from "@/shared/hooks/use-api-query";
import { Option } from "@/shared/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ApiDataSourceConfig,
  LocalDataSourceConfig,
  SearchableSelectConfig,
  SearchableSelectState,
  UseSearchableSelectReturn,
} from "../types";

export function useSearchableSelect<T>(
  config: SearchableSelectConfig<T>,
  value: Option<T>[] | null,
  onChange: (value: Option<T>[] | null) => void
): UseSearchableSelectReturn<T> {
  // Only log when data source type changes
  const prevDataSourceType = useRef<string>();
  const currentDataSourceType = config?.dataSource?.type;

  if (prevDataSourceType.current !== currentDataSourceType) {
    console.log('🔄 useSearchableSelect dataSource changed:', currentDataSourceType);
    prevDataSourceType.current = currentDataSourceType;
  }

  const { dataSource, behavior, ui } = config;
  const {
    multiple = false,
    initialSearch = "",
    onOpenChange,
    onSearch,
  } = behavior;

  // Refs for stable references
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef(onSearch);
  const onOpenChangeRef = useRef(onOpenChange);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const onSearchDebounceRef = useRef<NodeJS.Timeout>();
  
  // Store transform function in ref to prevent re-renders
  const transformDataRef = useRef<((data: T[]) => Option<T>[]) | undefined>();
  
  // Store debounceMs in ref to prevent config recreations
  const debounceMsRef = useRef(behavior.debounceMs || 300);
  useEffect(() => {
    debounceMsRef.current = behavior.debounceMs || 300;
  }, [behavior.debounceMs]);
  
  // Update refs when callbacks change (without triggering re-renders)
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);
  
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState<string>(initialSearch);
  const [page, setPage] = useState(0);
  const [allOptions, setAllOptions] = useState<Option<T>[]>([]);
  const [last, setLast] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Debounced search for API calls
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

  // Data fetching logic
  const isLocalDataSource = dataSource.type === "local";
  const isApiDataSource = dataSource.type === "api";

  // Extract API config values immediately to prevent object reference issues
  const apiEndpoint = isApiDataSource ? (dataSource as ApiDataSourceConfig<T>).endpoint : "";
  const apiQueryKey = isApiDataSource ? (dataSource as ApiDataSourceConfig<T>).queryKey : [];
  const apiPageSize = isApiDataSource ? (dataSource as ApiDataSourceConfig<T>).pageSize || 10 : 10;
  const apiTransformData = isApiDataSource ? (dataSource as ApiDataSourceConfig<T>).transformData : undefined;
  
  // Use stable debounceMs value
  const debounceMs = debounceMsRef.current;

  // Store transform function in ref
  useEffect(() => {
    if (isApiDataSource) {
      transformDataRef.current = apiTransformData;
    }
  }, [isApiDataSource, apiTransformData]);

  // Stable query key string to prevent recreations
  const queryKeyString = useMemo(() => 
    Array.isArray(apiQueryKey) ? apiQueryKey.join(',') : String(apiQueryKey),
    [JSON.stringify(apiQueryKey)]
  );

  // Memoized API config - fully stabilized
  const apiConfig = useMemo(() => {
    if (!isApiDataSource) return null;
    
    return {
      endpoint: apiEndpoint,
      queryKey: Array.isArray(apiQueryKey) ? apiQueryKey : [apiQueryKey],
      initialPage: 0,
      initialPageSize: apiPageSize,
      mockData: {
        content: [],
        totalElements: 0,
        totalPages: 1,
        number: 0,
        size: 1000,
      },
      debounceMs,
    };
  }, [isApiDataSource, apiEndpoint, queryKeyString, apiPageSize, debounceMs]);
  
  // Debounce search updates for API calls - optimized
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, debounceMsRef.current);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search]);

  // ALWAYS call useApiQuery (Rules of Hooks) but disable it when not needed
  const apiQueryResult = useApiQuery<T>(
    apiConfig || {
      endpoint: "",
      queryKey: ["disabled"],
      initialPage: 0,
      initialPageSize: 10,
      mockData: {
        content: [],
        totalElements: 0,
        totalPages: 1,
        number: 0,
        size: 1000,
      },
      debounceMs: 300,
    }
  );

  // Use API query result values directly but store functions in refs
  const apiData = isApiDataSource ? apiQueryResult.data : [];
  const isLoading = isApiDataSource ? apiQueryResult.isLoading : false;
  const currentPage = isApiDataSource ? apiQueryResult.page : 0;
  const totalPages = isApiDataSource ? apiQueryResult.totalPages : 1;

  // Store functions in refs to prevent dependency changes
  const apiSetPageRef = useRef(apiQueryResult.setPage);
  const apiSetSearchRef = useRef(apiQueryResult.setSearch);

  apiSetPageRef.current = apiQueryResult.setPage;
  apiSetSearchRef.current = apiQueryResult.setSearch;

  const apiSetPage = isApiDataSource ? apiSetPageRef.current : undefined;
  const apiSetSearch = isApiDataSource ? apiSetSearchRef.current : undefined;

  // Extract local options to prevent object reference issues
  const localOptionsRaw = isLocalDataSource ? (dataSource as LocalDataSourceConfig<T>).options : [];
  
  // Memoize local options separately to avoid recalculation
  const localOptions = useMemo(() => {
    if (!isLocalDataSource) return [];
    
    return localOptionsRaw.map((opt) => {
      if (typeof opt === "object" && "value" in opt && "label" in opt) {
        return opt as Option<T>;
      }
      return opt as Option<T>;
    });
  }, [isLocalDataSource, localOptionsRaw.length]);

  // Memoized filtered local options - optimized with stable dependencies
  const filteredLocalOptions = useMemo(() => {
    if (!isLocalDataSource || localOptions.length === 0) return [];

    // Fast path: return all options if no search
    if (!search) return localOptions;

    // Optimized filtering with cached lowercase search
    const searchLower = search.toLowerCase();
    return localOptions.filter((opt) => {
      const label = String(opt.label);
      return label.toLowerCase().includes(searchLower);
    });
  }, [localOptions, search, isLocalDataSource]);

  // Process local options - separated for better performance
  useEffect(() => {
    if (isLocalDataSource) {
      setAllOptions(filteredLocalOptions);
      setLast(true);
      setIsFetchingMore(false);
    }
  }, [isLocalDataSource, filteredLocalOptions]);

  // Process API data - separated and optimized
  useEffect(() => {
    if (!isApiDataSource || !apiData) return;

    let pageOptions: Option<T>[] = [];

    // Use ref for transform function to avoid re-renders
    if (transformDataRef.current) {
      pageOptions = transformDataRef.current(apiData);
    } else if (Array.isArray(apiData)) {
      // Fallback for untransformed data - assume it's already Option<T>[]
      pageOptions = apiData as Option<T>[];
    }

    const isLast =
      typeof totalPages === "number" ? currentPage >= totalPages - 1 : true;
    setLast(isLast);
    setIsFetchingMore(false);

    // Merge API options with pagination
    setAllOptions((prev) => {
      if (currentPage === 0) {
        return pageOptions;
      }

      // Use Set for O(1) lookup performance
      const existingIds = new Set(prev.map((item) => item.value));
      const newOptions = pageOptions.filter((item) => !existingIds.has(item.value));

      return [...prev, ...newOptions];
    });
  }, [isApiDataSource, apiData, currentPage, totalPages]);

  // Update API search when debounced search changes - optimized
  useEffect(() => {
    if (isApiDataSource && apiSetSearchRef.current && debouncedSearch !== undefined) {
      apiSetSearchRef.current(debouncedSearch);
    }
  }, [debouncedSearch, isApiDataSource]);

  // Call onSearch callback with debouncing to avoid excessive calls
  useEffect(() => {
    if (onSearchDebounceRef.current) {
      clearTimeout(onSearchDebounceRef.current);
    }

    onSearchDebounceRef.current = setTimeout(() => {
      onSearchRef.current?.(search);
    }, debounceMsRef.current);

    return () => {
      if (onSearchDebounceRef.current) {
        clearTimeout(onSearchDebounceRef.current);
      }
    };
  }, [search]);

  // Handle dropdown open/close - stable callback
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    onOpenChangeRef.current?.(open);

    if (!open) {
      setSearch(""); // Clear search when dropdown closes
      setPage(0); // Reset pagination
    }
  }, []);

  // Store onChange in ref to make callbacks more stable
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Handle option selection - optimized with stable dependencies
  const handleSelect = useCallback(
    (option: Option<T>) => {
      if (!multiple) {
        onChangeRef.current([option]);
        setIsOpen(false);
        return;
      }

      // Multiple selection logic
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.some((o) => o?.value === option.value);

      const newValues = isSelected
        ? currentValues.filter((o) => o?.value !== option.value)
        : [...currentValues, option];

      onChangeRef.current(newValues);
    },
    [value, multiple]
  );

  // Clear all selections - stable callback
  const handleClearAll = useCallback(() => {
    onChangeRef.current(multiple ? [] : null);
  }, [multiple]);

  // Remove specific tag (for multiple selection) - optimized
  const removeSelectedTag = useCallback(
    (optionValue: string) => {
      if (!multiple || !Array.isArray(value)) return;
      onChangeRef.current(value.filter((option) => option.value !== optionValue));
    },
    [value, multiple]
  );

  // Load more with stable dependencies
  const loadMore = useCallback(() => {
    if (!last && !isFetchingMore) {
      setIsFetchingMore(true);
      const nextPage = currentPage + 1;
      setPage(nextPage);
      apiSetPageRef.current?.(nextPage);
    }
  }, [last, isFetchingMore, currentPage]);

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
