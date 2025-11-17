import { useCrudMutations } from "@/shared/hooks/use-api-mutations";
import { useApiQuery } from "@/shared/hooks/use-api-query";
import LoggingService from "@/shared/services/LoggingService";
import { useServiceStore } from "@/shared/stores/service-store";
import {
  GenericDataItem,
  ServiceConfig,
  ServiceFeatures,
  ServiceFilters,
} from "@/shared/types/generic-dashboard";
import { useMemo } from "react";

// Extended return type for useGenericData hook
export interface UseGenericDataResult {
  // Base query result properties
  data: GenericDataItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  filters: ServiceFilters;
  setFilters: (filters: ServiceFilters) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
  refresh: () => Promise<any>;
  forceRefresh: () => Promise<any>;
  isFetching: boolean;
  isPreviousData: boolean;
  isStale: boolean;

  // Extended service-specific properties
  service: ServiceConfig | null;
  features: ServiceFeatures | null;
  fields: any[] | null;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  hasPagination: boolean;
  hasFilters: boolean;
  hasSearch: boolean;
}

/**
 * Generic data fetching hook that works with any registered service
 * Reuses the existing useApiQuery infrastructure
 */
export function useGenericData(
  serviceId: string,
  initialFilters: ServiceFilters = {},
  options: {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
  } = {}
): UseGenericDataResult {
  const service = useServiceStore((state) => state.getService(serviceId));

  // Memoize the query configuration to prevent unnecessary re-renders
  const queryConfig = useMemo(() => {
    if (!service) {
      LoggingService.warn(
        "useGenericData",
        "no-service",
        `Service not found: ${serviceId}`
      );
      return null;
    }

    const endpoint = `${service.api.baseUrl}${service.api.endpoints.list}`;
    const queryKey = [serviceId];

    // Get default settings from service config
    const defaultPageSize = service.settings?.defaultPageSize ?? 10;
    const cacheTime = service.settings?.cacheTime ?? 300000; // 5 minutes
    const staleTime = service.settings?.staleTime ?? 30000; // 30 seconds
    const debounceMs = service.settings?.debounceMs ?? 300;

    LoggingService.debug(
      "useGenericData",
      "config",
      `Fetching data for service: ${serviceId}`,
      {
        endpoint,
        defaultPageSize,
        features: service.features,
      }
    );

    return {
      endpoint,
      queryKey,
      initialPageSize: defaultPageSize,
      initialFilters,
      persistFilters: true,
      persistKey: `${serviceId}-filters`,
      debounceMs,
      isPaginated: service.features.pagination,
      useCache: options.enabled ?? true, // Use useCache to control query execution
      cacheTime,
      staleTime,
    };
  }, [service, serviceId, initialFilters, options]);

  // Use the existing useApiQuery hook with the generic configuration
  const queryResult = useApiQuery<GenericDataItem>(
    queryConfig || {
      endpoint: "",
      queryKey: [serviceId],
      isPaginated: false,
      useCache: false, // Disable query when no service is configured
    }
  );

  // Add service-specific metadata to the result
  return useMemo((): UseGenericDataResult => {
    if (!service) {
      return {
        ...queryResult,
        service: null,
        features: null,
        fields: null,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        hasPagination: false,
        hasFilters: false,
        hasSearch: false,
        error: queryResult.error || new Error("Service not found"),
      } as unknown as UseGenericDataResult;
    }

    return {
      ...queryResult,
      service,
      features: service.features,
      fields: service.fields,
      // Add convenience methods
      canCreate: service.features.create,
      canUpdate: service.features.update,
      canDelete: service.features.delete,
      hasPagination: service.features.pagination,
      hasFilters: service.features.filters,
      hasSearch: service.features.search,
    } as unknown as UseGenericDataResult;
  }, [queryResult, service]);
}

/**
 * Hook for fetching a single item by ID from any service
 */
export function useGenericItem(
  serviceId: string,
  itemId: string | number,
  options: {
    enabled?: boolean;
  } = {}
) {
  const service = useServiceStore((state) => state.getService(serviceId));

  const queryConfig = useMemo(() => {
    if (!service || !itemId) {
      return null;
    }

    const endpoint = `${service.api.baseUrl}${service.api.endpoints.list}/${itemId}`;
    const queryKey = [serviceId, itemId.toString()];

    const cacheTime = service.settings?.cacheTime ?? 300000;
    const staleTime = service.settings?.staleTime ?? 30000;

    return {
      endpoint,
      queryKey,
      isPaginated: false,
      useCache: options.enabled ?? !!itemId, // Control with useCache, default to true if itemId exists
      cacheTime,
      staleTime,
    };
  }, [service, serviceId, itemId, options.enabled]);

  const queryResult = useApiQuery<GenericDataItem>(
    queryConfig || {
      endpoint: "",
      queryKey: [serviceId, itemId?.toString() || ""],
      isPaginated: false,
      useCache: false, // Disable when no config
    }
  );

  return useMemo(
    () => ({
      ...queryResult,
      service,
    }),
    [queryResult, service]
  );
}

/**
 * Hook for getting service configuration and metadata
 */
export function useServiceConfig(serviceId: string) {
  const service = useServiceStore((state) => state.getService(serviceId));
  const { isLoading, error } = useServiceStore((state) => ({
    isLoading: state.isLoading,
    error: state.error,
  }));

  return {
    service,
    isLoading,
    error,
    exists: !!service,
    // Convenience getters
    api: service?.api,
    fields: service?.fields || [],
    features: service?.features,
    settings: service?.settings,
  };
}

/**
 * Hook for fetching generic admin data with pagination and filters
 */
export function useAdminGenericData(
  serviceBaseUrl: string,
  serviceCode: string,
  filters: Record<string, any> = {}
) {
  return useApiQuery<GenericDataItem>({
    endpoint: `${serviceBaseUrl}/list`,
    queryKey: ["admin-generic-data", serviceCode],
    initialFilters: filters,
    persistFilters: true,
    persistKey: `${serviceCode}-filters`,
    isPaginated: true,
    useCache: true,
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  });
}

/**
 * Hook for generic admin CRUD mutations
 */
export function useAdminGenericMutations(
  serviceBaseUrl: string,
  serviceCode: string
) {
  return useCrudMutations<
    GenericDataItem,
    Record<string, any>,
    Record<string, any>
  >(`${serviceBaseUrl}`, ["admin-generic-data", serviceCode]);
}

/**
 * Hook for fetching a single generic admin item by ID
 */
export function useAdminGenericItem(
  serviceBaseUrl: string,
  serviceCode: string,
  id: string | number
) {
  return useApiQuery<GenericDataItem>({
    endpoint: `${serviceBaseUrl}/${id}`,
    queryKey: ["admin-generic-item", serviceCode, id.toString()],
    isPaginated: false,
    useCache: true,
  });
}
