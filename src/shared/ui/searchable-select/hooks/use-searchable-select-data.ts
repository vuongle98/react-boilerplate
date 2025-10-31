import { useEffect, useState } from "react";
import useApiQuery from "@/shared/hooks/use-api-query";
import { Option } from "@/shared/types/common";

interface UseSearchableSelectDataProps<T> {
  endpoint?: string;
  queryKey?: string | string[];
  options?: Option<T>[] | { value: string; label: string }[];
  transformData?: (data: T[]) => Option<T>[];
  search: string;
  page: number;
  onSearchChange?: (search: string) => void;
}

interface UseSearchableSelectDataReturn {
  allOptions: Option<any>[];
  isLoading: boolean;
  hasMore: boolean;
  isFetchingMore: boolean;
  loadMore: () => void;
}

export function useSearchableSelectData<T>({
  endpoint,
  queryKey,
  options: localOptions,
  transformData,
  search,
  page,
  onSearchChange,
}: UseSearchableSelectDataProps<T>): UseSearchableSelectDataReturn {
  const [allOptions, setAllOptions] = useState<Option<T>[]>([]);
  const [last, setLast] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Use local options if provided, otherwise use API
  const useLocalOptions = !!localOptions && !endpoint;

  // API query hook
  const {
    data: apiData = [],
    isLoading,
    setPage,
    page: currentPage,
    totalPages = 1,
    setSearch: apiSetSearch,
  } = endpoint && queryKey ? useApiQuery<T>({
    endpoint,
    queryKey: Array.isArray(queryKey) ? [...queryKey] : [queryKey],
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
  }) : {
    data: [],
    isLoading: false,
    setPage: () => {},
    page: 0,
    totalPages: 1,
    setSearch: () => {},
  };

  // Process and set options based on data source
  useEffect(() => {
    let pageOptions: Option<T>[] = [];

    if (useLocalOptions && localOptions) {
      // Filter local options by search
      pageOptions = localOptions
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
    } else if (transformData) {
      pageOptions = transformData(apiData);
      const isLast = typeof totalPages === "number" ? currentPage >= totalPages - 1 : true;
      setLast(isLast);
      setIsFetchingMore(false);
    } else if (apiData && Array.isArray(apiData)) {
      // Fallback for untransformed data
      const isLast = typeof totalPages === "number" ? currentPage >= totalPages - 1 : true;
      setLast(isLast);
      setIsFetchingMore(false);
    }

    // Merge API options with pagination
    if (!useLocalOptions) {
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
  }, [apiData, currentPage, totalPages, transformData, useLocalOptions, localOptions, search]);

  // Update API search when local search changes
  useEffect(() => {
    if (!useLocalOptions && apiSetSearch) {
      apiSetSearch(search);
    }
    onSearchChange?.(search);
  }, [search, apiSetSearch, useLocalOptions, onSearchChange]);

  const loadMore = () => {
    if (!last && !isFetchingMore) {
      setIsFetchingMore(true);
      setPage(currentPage + 1);
    }
  };

  return {
    allOptions,
    isLoading,
    hasMore: !last,
    isFetchingMore,
    loadMore,
  };
}
