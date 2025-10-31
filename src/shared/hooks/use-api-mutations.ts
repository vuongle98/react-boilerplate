import EnhancedApiService from "@/shared/services/BaseApiService";
import LoggingService from "@/shared/services/LoggingService";
import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

export interface MutationConfig {
  invalidateQueries?: string[][] | string[];
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}

export interface CreateMutationOptions<TData, TVariables> extends MutationConfig {
  endpoint: string;
  options?: UseMutationOptions<TData, unknown, TVariables>;
}

export interface UpdateMutationOptions<TData, TVariables> extends MutationConfig {
  endpoint: (id: string | number) => string;
  options?: UseMutationOptions<TData, unknown, TVariables & { id: string | number }>;
}

export interface DeleteMutationOptions extends MutationConfig {
  endpoint: (id: string | number) => string;
  options?: UseMutationOptions<void, unknown, string | number>;
}

/**
 * Hook for CREATE mutations (POST)
 * Automatically invalidates related queries and shows toast notifications
 */
export function useCreateMutation<TData = unknown, TVariables = unknown>({
  endpoint,
  invalidateQueries = [],
  showSuccessToast = true,
  showErrorToast = true,
  successMessage = "Created successfully",
  errorMessage = "Failed to create",
  onSuccess,
  onError,
  options,
}: CreateMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation<TData, unknown, TVariables>({
    mutationFn: async (data: TVariables) => {
      LoggingService.info("mutation", "create_started", `Creating resource at ${endpoint}`, { data });
      
      const response = await EnhancedApiService.post<TData>(endpoint, data);
      
      LoggingService.info("mutation", "create_success", `Successfully created resource at ${endpoint}`);
      return response;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach((queryKey) => {
          const key = Array.isArray(queryKey) ? queryKey : [queryKey];
          queryClient.invalidateQueries({ queryKey: key });
          LoggingService.info("mutation", "cache_invalidated", `Invalidated cache for ${key.join("/")}`);
        });
      }

      // Show success toast
      if (showSuccessToast) {
        toast.success(successMessage);
      }

      // Call custom success handler
      if (onSuccess) {
        onSuccess(data);
      }

      // Call options success handler
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      LoggingService.error("mutation", "create_failed", `Failed to create resource at ${endpoint}`, { error });

      // Show error toast
      if (showErrorToast) {
        toast.error(errorMessage);
      }

      // Call custom error handler
      if (onError) {
        onError(error);
      }

      // Call options error handler
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
}

/**
 * Hook for UPDATE mutations (PUT/PATCH)
 * Automatically invalidates related queries and shows toast notifications
 */
export function useUpdateMutation<TData = unknown, TVariables = unknown>({
  endpoint,
  invalidateQueries = [],
  showSuccessToast = true,
  showErrorToast = true,
  successMessage = "Updated successfully",
  errorMessage = "Failed to update",
  onSuccess,
  onError,
  options,
}: UpdateMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation<TData, unknown, TVariables & { id: string | number }>({
    mutationFn: async ({ id, ...data }: TVariables & { id: string | number }) => {
      const url = endpoint(id);
      LoggingService.info("mutation", "update_started", `Updating resource at ${url}`, { id, data });
      
      const response = await EnhancedApiService.put<TData>(url, data as TVariables);
      
      LoggingService.info("mutation", "update_success", `Successfully updated resource at ${url}`);
      return response;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach((queryKey) => {
          const key = Array.isArray(queryKey) ? queryKey : [queryKey];
          queryClient.invalidateQueries({ queryKey: key });
          LoggingService.info("mutation", "cache_invalidated", `Invalidated cache for ${key.join("/")}`);
        });
      }

      // Also invalidate specific item query
      queryClient.invalidateQueries({ queryKey: [endpoint(variables.id)] });

      // Show success toast
      if (showSuccessToast) {
        toast.success(successMessage);
      }

      // Call custom success handler
      if (onSuccess) {
        onSuccess(data);
      }

      // Call options success handler
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      LoggingService.error("mutation", "update_failed", `Failed to update resource`, { error });

      // Show error toast
      if (showErrorToast) {
        toast.error(errorMessage);
      }

      // Call custom error handler
      if (onError) {
        onError(error);
      }

      // Call options error handler
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
}

/**
 * Hook for DELETE mutations
 * Automatically invalidates related queries and shows toast notifications
 */
export function useDeleteMutation({
  endpoint,
  invalidateQueries = [],
  showSuccessToast = true,
  showErrorToast = true,
  successMessage = "Deleted successfully",
  errorMessage = "Failed to delete",
  onSuccess,
  onError,
  options,
}: DeleteMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string | number>({
    mutationFn: async (id: string | number) => {
      const url = endpoint(id);
      LoggingService.info("mutation", "delete_started", `Deleting resource at ${url}`, { id });
      
      await EnhancedApiService.delete(url);
      
      LoggingService.info("mutation", "delete_success", `Successfully deleted resource at ${url}`);
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach((queryKey) => {
          const key = Array.isArray(queryKey) ? queryKey : [queryKey];
          queryClient.invalidateQueries({ queryKey: key });
          LoggingService.info("mutation", "cache_invalidated", `Invalidated cache for ${key.join("/")}`);
        });
      }

      // Remove specific item from cache
      queryClient.removeQueries({ queryKey: [endpoint(variables)] });

      // Show success toast
      if (showSuccessToast) {
        toast.success(successMessage);
      }

      // Call custom success handler
      if (onSuccess) {
        onSuccess(data);
      }

      // Call options success handler
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      LoggingService.error("mutation", "delete_failed", `Failed to delete resource`, { error });

      // Show error toast
      if (showErrorToast) {
        toast.error(errorMessage);
      }

      // Call custom error handler
      if (onError) {
        onError(error);
      }

      // Call options error handler
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
}

/**
 * Combined hook that provides all CRUD mutations for a resource
 */
export function useCrudMutations<TData = unknown, TCreateVariables = unknown, TUpdateVariables = unknown>(
  baseEndpoint: string,
  queryKey: string | string[]
) {
  const invalidateQueries = [Array.isArray(queryKey) ? queryKey : [queryKey]];

  const createMutation = useCreateMutation<TData, TCreateVariables>({
    endpoint: baseEndpoint,
    invalidateQueries,
  });

  const updateMutation = useUpdateMutation<TData, TUpdateVariables>({
    endpoint: (id) => `${baseEndpoint}/${id}`,
    invalidateQueries,
  });

  const deleteMutation = useDeleteMutation({
    endpoint: (id) => `${baseEndpoint}/${id}`,
    invalidateQueries,
  });

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}

/**
 * Hook for custom cache invalidation
 */
export function useCacheInvalidation() {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(
    (queryKeys: string[][] | string[]) => {
      queryKeys.forEach((queryKey) => {
        const key = Array.isArray(queryKey) ? queryKey : [queryKey];
        queryClient.invalidateQueries({ queryKey: key });
        LoggingService.info("cache", "invalidated", `Invalidated cache for ${key.join("/")}`);
      });
    },
    [queryClient]
  );

  const removeQueries = useCallback(
    (queryKeys: string[][] | string[]) => {
      queryKeys.forEach((queryKey) => {
        const key = Array.isArray(queryKey) ? queryKey : [queryKey];
        queryClient.removeQueries({ queryKey: key });
        LoggingService.info("cache", "removed", `Removed cache for ${key.join("/")}`);
      });
    },
    [queryClient]
  );

  const clearAllCache = useCallback(() => {
    queryClient.clear();
    LoggingService.info("cache", "cleared", "Cleared all cache");
    toast.success("Cache cleared");
  }, [queryClient]);

  return {
    invalidateQueries,
    removeQueries,
    clearAllCache,
  };
}

