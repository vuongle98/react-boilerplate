import EnhancedApiService from "@/shared/services/BaseApiService";
import { PaginatedData, PaginationOptions } from "@/shared/types/common";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDebounce from "./use-debounce";
import useLocalStorage from "./use-local-storage";

export interface ApiQueryFilters {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | unknown[]
    | readonly unknown[];
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface UseApiQueryProps<T> {
  endpoint: string;
  queryKey: QueryKey;
  initialPage?: number;
  initialPageSize?: number;
  initialFilters?: ApiQueryFilters;
  persistFilters?: boolean;
  persistKey?: string;
  debounceMs?: number;
  mockData?: PaginatedData<T>;
  onError?: (error: Error) => void;
  isPaginated?: boolean;
  useCache?: boolean;
  cacheTime?: number;
  staleTime?: number;
}

export function useApiQuery<T>({
  endpoint,
  queryKey,
  initialPage = 0,
  initialPageSize = 10,
  initialFilters = {},
  persistFilters = false,
  persistKey,
  debounceMs = 300,
  mockData,
  onError,
  isPaginated = true,
  useCache = true,
  cacheTime = 300000, // 5 minutes
  staleTime = 10000, // 10 seconds
}: UseApiQueryProps<T>) {
  const storageKey =
    persistKey || `filters-${endpoint?.replace(/\//g, "-") || "default"}`;
  const [filtersState, setFiltersState] =
    useState<ApiQueryFilters>(initialFilters);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [forceRefreshFlag, setForceRefreshFlag] = useState(false);
  const queryClient = useQueryClient();

  // Prevents multiple refetches
  const isInitialMount = useRef(true);

  // Use debounce for filter changes to prevent too many API calls
  const debouncedFilters = useDebounce(filtersState, debounceMs);

  // Load persisted filters from localStorage if enabled
  const [persistedFilters, setPersistedFilters] =
    useLocalStorage<ApiQueryFilters>(
      persistFilters ? storageKey : "",
      initialFilters
    );

  // Initialize filters from persisted if available
  useEffect(() => {
    if (
      persistFilters &&
      Object.keys(persistedFilters).length > 0 &&
      isInitialMount.current
    ) {
      setFiltersState(persistedFilters);
      isInitialMount.current = false;
    }
  }, [persistFilters, persistedFilters]);

  // Update persisted filters when filters change
  const setFilters = useCallback(
    (newFilters: ApiQueryFilters) => {
      // Only update and reset page if filters actually changed
      const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(filtersState);
      if (filtersChanged) {
        setFiltersState(newFilters);
        if (persistFilters) {
          setPersistedFilters(newFilters);
        }
        // Reset to first page when filters actually change
        setPage(0);
      }
    },
    [persistFilters, setPersistedFilters, filtersState]
  );

  // Helper to set search term
  const setSearch = useCallback(
    (searchTerm: string) => {
      setFilters({ ...filtersState, search: searchTerm });
    },
    [filtersState, setFilters]
  );

  // Reset filters to initial state
  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    if (persistFilters) {
      setPersistedFilters(initialFilters);
    }
    setPage(0);
  }, [initialFilters, persistFilters, setPersistedFilters]);

  // Convert filters to a stable object for query key and params
  const normalizedFilters = useMemo(() => {
    const result: Record<string, unknown> = {};
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        result[key] = value;
      }
    });
    return result;
  }, [debouncedFilters]);

  // Build a stable query key that includes all relevant parameters
  // Use JSON.stringify for deep comparison to prevent unnecessary query invalidations
  const stableQueryKey = useMemo(() => {
    const filterHash = JSON.stringify(normalizedFilters);
    const key = [
      ...queryKey,
      "page",
      page,
      "pageSize",
      pageSize,
      "filters",
      filterHash,
    ];
    return key as unknown as QueryKey;
  }, [queryKey, page, pageSize, JSON.stringify(normalizedFilters)]);

  // Convert filters to query params
  const buildQueryParams = useCallback(
    (currentFilters: ApiQueryFilters): PaginationOptions => {
      const params: PaginationOptions = {
        page,
        size: pageSize,
      };

      // Add valid filter values to query params
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          // Handle array values by joining with commas
          if (Array.isArray(value) && value.length > 0) {
            params[key] = value.join(",");
          } else {
            params[key] = value;
          }
        }
      });

      return params;
    },
    [page, pageSize]
  );

  // API query with pagination and filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...stableQueryKey, forceRefreshFlag], // Include forceRefreshFlag in query key to force refetch
    queryFn: async () => {
      try {
        const params = buildQueryParams(debouncedFilters);

        if (isPaginated) {
          const response = await EnhancedApiService.getPaginated<T>(
            endpoint,
            params,
            undefined,
            useCache,
            forceRefreshFlag // Use the forceRefreshFlag
          );
          return response;
        } else {
          // For non-paginated endpoints
          const response = await EnhancedApiService.get<T[]>(
            endpoint,
            params,
            undefined,
            "json",
            useCache,
            forceRefreshFlag // Use the forceRefreshFlag
          );
          // Convert to paginated format for consistency
          return {
            content: response,
            totalElements: response.length,
            totalPages: 1,
            number: 0,
            size: response.length,
          } as PaginatedData<T>;
        }
      } catch (err) {
        // Handle mock data for testing or development
        if (mockData) {
          console.warn("Using mock data for", endpoint);
          return mockData;
        }
        throw err;
      } finally {
        // Reset the flag after use
        if (forceRefreshFlag) {
          setForceRefreshFlag(false);
        }
      }
    },
    enabled: !!endpoint,
    gcTime: useCache ? cacheTime : 0,
    staleTime: useCache ? staleTime : 0,
    meta: {
      onError: onError,
    },
  });

  // Force refetch only when page or pageSize changes explicitly by user action
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  // Track previous filters to avoid unnecessary page resets
  const prevNormalizedFilters = useRef(normalizedFilters);

  // Reset to first page when filters actually change
  useEffect(() => {
    if (!isInitialMount.current && prevNormalizedFilters.current !== normalizedFilters) {
      setPage(0);
      prevNormalizedFilters.current = normalizedFilters;
    }
  }, [normalizedFilters]);

  // Total items count
  const totalItems = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;
  const isError = !!error;

  // Manual refresh function that invalidates cache and refetches
  const refresh = useCallback(async () => {
    if (useCache) {
      // Invalidate all queries with this base key
      await queryClient.invalidateQueries({ queryKey: [...queryKey] });
    }
    // Force a new fetch
    return refetch();
  }, [refetch, queryClient, queryKey, useCache]);

  // Force refresh function that removes cache and forces fresh API call
  const forceRefresh = useCallback(async () => {
    if (useCache) {
      // Remove all cached data for this query
      queryClient.removeQueries({ queryKey: [...queryKey] });
      // Also clear BaseApiService cache for this endpoint
      EnhancedApiService.clearCache(endpoint);
    }
    // Set flag to force refresh on next query
    setForceRefreshFlag(true);
  }, [queryClient, queryKey, useCache, endpoint]);

  return {
    data: data?.content || [],
    isLoading,
    isError,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    totalItems: totalItems,
    totalPages: totalPages,
    hasNextPage: (data?.number ?? 0) < (data?.totalPages ?? 0) - 1,
    hasPreviousPage: (data?.number ?? 0) > 0,
    filters: filtersState,
    setFilters,
    setSearch,
    resetFilters,
    refresh,
    forceRefresh,
    isFetching: isLoading,
    isPreviousData: false, // For compatibility with useInfiniteQuery
    isStale: false, // For compatibility with useInfiniteQuery
  };
}

export default useApiQuery;
