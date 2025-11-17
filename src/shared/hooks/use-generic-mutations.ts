import {
  useCreateMutation,
  useDeleteMutation,
  useUpdateMutation,
} from "@/shared/hooks/use-api-mutations";
import BaseApiService from "@/shared/services/BaseApiService";
import LoggingService from "@/shared/services/LoggingService";
import { useServiceStore } from "@/shared/stores/service-store";
import { ParsedServiceConfig } from "@/shared/types/admin-dashboard";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Generic mutations hook that works with any registered service
 * Can accept either a serviceId string or a ParsedServiceConfig object
 */
export function useGenericMutations(
  serviceInput: string | ParsedServiceConfig,
  options: {
    onSuccess?: (action: string, data?: any) => void;
    onError?: (action: string, error?: any) => void;
  } = {}
) {
  // Determine service config and ID
  const { service, serviceId, isParsedConfig } = useMemo(() => {
    if (typeof serviceInput === "string") {
      // Service ID provided, look up from store
      const svc = useServiceStore.getState().getService(serviceInput);
      return { service: svc, serviceId: serviceInput, isParsedConfig: false };
    } else {
      // ParsedServiceConfig provided directly
      return {
        service: null,
        serviceId: serviceInput.code,
        isParsedConfig: true,
        parsedConfig: serviceInput,
      };
    }
  }, [serviceInput]);

  // Memoize the mutations configuration
  const mutationsConfig = useMemo(() => {
    if (!isParsedConfig && !service) {
      LoggingService.warn(
        "useGenericMutations",
        "no-service",
        `Service not found: ${serviceId}`
      );
      return null;
    }

    let baseEndpoint: string;
    let queryKey: string[];

    if (isParsedConfig) {
      // Use operations from ParsedServiceConfig
      const config = serviceInput as ParsedServiceConfig;
      baseEndpoint = config.operations.list?.path || "";
      queryKey = ["admin-generic-data", config.code];
    } else {
      // Use endpoints from ServiceConfig
      baseEndpoint = `${service!.api.endpoints.list}`;
      queryKey = [serviceId];
    }

    LoggingService.debug(
      "useGenericMutations",
      "config",
      `Setting up mutations for service: ${serviceId}`,
      {
        baseEndpoint,
        isParsedConfig,
      }
    );

    return {
      baseEndpoint,
      queryKey,
      onSuccess: (action: string, data?: any) => {
        LoggingService.info(
          "useGenericMutations",
          "success",
          `${action} operation successful for service: ${serviceId}`
        );
        options.onSuccess?.(action, data);
      },
      onError: (action: string, error?: any) => {
        LoggingService.error(
          "useGenericMutations",
          "error",
          `${action} operation failed for service: ${serviceId}`,
          error
        );
        options.onError?.(action, error);
      },
    };
  }, [service, serviceId, options, isParsedConfig, serviceInput]);

  // Always call hooks at top level
  const createMutation = useCreateMutation({
    endpoint: isParsedConfig
      ? (serviceInput as ParsedServiceConfig).operations.create?.path || ""
      : mutationsConfig?.baseEndpoint || "",
    invalidateQueries: [mutationsConfig?.queryKey || [serviceId]],
    onSuccess: mutationsConfig?.onSuccess,
    onError: mutationsConfig?.onError,
  });

  const updateMutation = useUpdateMutation({
    endpoint: isParsedConfig
      ? (id: string | number) =>
          (serviceInput as ParsedServiceConfig).operations.update?.path.replace(
            "{id}",
            id.toString()
          ) || ""
      : (id: string | number) => `${mutationsConfig?.baseEndpoint || ""}/${id}`,
    invalidateQueries: [mutationsConfig?.queryKey || [serviceId]],
    onSuccess: mutationsConfig?.onSuccess,
    onError: mutationsConfig?.onError,
  });

  const deleteMutation = useDeleteMutation({
    endpoint: isParsedConfig
      ? (id: string | number) =>
          (serviceInput as ParsedServiceConfig).operations.delete?.path.replace(
            "{id}",
            id.toString()
          ) || ""
      : (id: string | number) => `${mutationsConfig?.baseEndpoint || ""}/${id}`,
    invalidateQueries: [mutationsConfig?.queryKey || [serviceId]],
    onSuccess: mutationsConfig?.onSuccess,
    onError: mutationsConfig?.onError,
  });

  // Wrap mutations with service-specific logic and feature checks
  const wrappedMutations = useMemo(() => {
    const configFeatures = isParsedConfig
      ? (serviceInput as ParsedServiceConfig).features
      : service?.features;

    if (!isParsedConfig && !service) {
      return {
        create: {
          mutate: () => {},
          mutateAsync: async () => null,
          isPending: false,
        },
        update: {
          mutate: () => {},
          mutateAsync: async () => null,
          isPending: false,
        },
        delete: {
          mutate: () => {},
          mutateAsync: async () => null,
          isPending: false,
        },
        isLoading: false,
      };
    }

    return {
      create: {
        ...createMutation,
        mutate: configFeatures?.create
          ? createMutation.mutate
          : () => {
              LoggingService.warn(
                "useGenericMutations",
                "permission-denied",
                `Create not allowed for service: ${serviceId}`
              );
            },
        mutateAsync: configFeatures?.create
          ? createMutation.mutateAsync
          : async () => {
              throw new Error(
                `Create operation not allowed for service: ${serviceId}`
              );
            },
      },
      update: {
        ...updateMutation,
        mutate: configFeatures?.update
          ? updateMutation.mutate
          : () => {
              LoggingService.warn(
                "useGenericMutations",
                "permission-denied",
                `Update not allowed for service: ${serviceId}`
              );
            },
        mutateAsync: configFeatures?.update
          ? updateMutation.mutateAsync
          : async () => {
              throw new Error(
                `Update operation not allowed for service: ${serviceId}`
              );
            },
      },
      delete: {
        ...deleteMutation,
        mutate: configFeatures?.delete
          ? deleteMutation.mutate
          : () => {
              LoggingService.warn(
                "useGenericMutations",
                "permission-denied",
                `Delete not allowed for service: ${serviceId}`
              );
            },
        mutateAsync: configFeatures?.delete
          ? deleteMutation.mutateAsync
          : async () => {
              throw new Error(
                `Delete operation not allowed for service: ${serviceId}`
              );
            },
      },
      isLoading:
        createMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending,
    };
  }, [
    createMutation,
    updateMutation,
    deleteMutation,
    service,
    serviceId,
    isParsedConfig,
    serviceInput,
  ]);

  return wrappedMutations;
}

/**
 * Hook for custom service actions
 */
export function useGenericCustomActions(serviceId: string) {
  const service = useServiceStore((state) => state.getService(serviceId));

  return useMemo(() => {
    if (!service?.features.customActions) {
      return {
        actions: [],
        hasCustomActions: false,
      };
    }

    return {
      actions: service.features.customActions,
      hasCustomActions: service.features.customActions.length > 0,
    };
  }, [service]);
}

/**
 * Hook for bulk operations on multiple items
 */
export function useGenericBulkActions(serviceInput: string | ParsedServiceConfig) {
  const queryClient = useQueryClient();
  // Determine service config and ID
  const { service, serviceId, isParsedConfig } = useMemo(() => {
    if (typeof serviceInput === "string") {
      // Service ID provided, look up from store
      const svc = useServiceStore.getState().getService(serviceInput);
      return { service: svc, serviceId: serviceInput, isParsedConfig: false };
    } else {
      // ParsedServiceConfig provided directly
      return {
        service: null,
        serviceId: serviceInput.code,
        isParsedConfig: true,
        parsedConfig: serviceInput,
      };
    }
  }, [serviceInput]);

  const bulkDelete = async (ids: (string | number)[]) => {
    const features = isParsedConfig
      ? (serviceInput as ParsedServiceConfig).features
      : service?.features;

    if (!features?.bulkActions || !features?.delete) {
      throw new Error(
        `Bulk operations not supported for service: ${serviceId}`
      );
    }

    LoggingService.info(
      "useGenericBulkActions",
      "bulk-delete",
      `Deleting ${ids.length} items from service: ${serviceId}`
    );

    if (isParsedConfig) {
      // Use BaseApiService directly for ParsedServiceConfig
      const config = serviceInput as ParsedServiceConfig;
      const endpoint = `${config.baseUrl}${config.operations.list.path}/bulk-delete`;
      await BaseApiService.post(endpoint, { ids });

      // Invalidate related caches using React Query
      queryClient.invalidateQueries({ queryKey: ["admin-generic-data", config.code] });
    } else {
      // Use legacy service approach
      const endpoint = `${service!.api.baseUrl}${service!.api.endpoints.list}/bulk-delete`;
      await BaseApiService.post(endpoint, { ids });

      // Invalidate related caches
      BaseApiService.clearCache(service!.api.endpoints.list);
    }
  };

  const bulkUpdate = async (
    ids: (string | number)[],
    updates: Record<string, any>
  ) => {
    const features = isParsedConfig
      ? (serviceInput as ParsedServiceConfig).features
      : service?.features;

    if (!features?.bulkActions || !features?.update) {
      throw new Error(
        `Bulk operations not supported for service: ${serviceId}`
      );
    }

    LoggingService.info(
      "useGenericBulkActions",
      "bulk-update",
      `Updating ${ids.length} items from service: ${serviceId}`
    );

    if (isParsedConfig) {
      // Use BaseApiService directly for ParsedServiceConfig
      const config = serviceInput as ParsedServiceConfig;
      const endpoint = `${config.baseUrl}${config.operations.list.path}/bulk-update`;
      await BaseApiService.put(endpoint, { ids, updates });

      // Invalidate related caches using React Query
      queryClient.invalidateQueries({ queryKey: ["admin-generic-data", config.code] });
    } else {
      // Use legacy service approach
      const endpoint = `${service!.api.baseUrl}${service!.api.endpoints.list}/bulk-update`;
      await BaseApiService.put(endpoint, { ids, updates });

      // Invalidate related caches
      BaseApiService.clearCache(service!.api.endpoints.list);
    }
  };

  const supportsBulkActions = isParsedConfig
    ? Boolean((serviceInput as ParsedServiceConfig).features?.bulkActions)
    : Boolean(service?.features.bulkActions);

  return {
    bulkDelete: supportsBulkActions ? bulkDelete : null,
    bulkUpdate: supportsBulkActions ? bulkUpdate : null,
    supportsBulkActions,
  };
}
