import { useApiQuery } from "@/shared/hooks/use-api-query";
import { ServiceConfig } from "@/shared/types/admin-dashboard";

/**
 * Hook to load service configurations from the API
 */
export function useServiceConfigs() {
  return useApiQuery<ServiceConfig>({
    endpoint: "/api/service-config",
    queryKey: ["service-configs"],
    initialPageSize: 100, // Load all configs at once
    isPaginated: true, // We'll handle pagination manually to get all configs
    onError: (error) => {
      console.error("Failed to load service configs:", error);
    },
  });
}
