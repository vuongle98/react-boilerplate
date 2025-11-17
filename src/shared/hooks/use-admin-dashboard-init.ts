import { useServiceConfigStore } from "@/shared/stores/service-config-store";
import { ServiceConfig } from "@/shared/types/admin-dashboard";
import { useEffect, useRef } from "react";
import { useServiceConfigs } from "./use-service-configs";

/**
 * Hook to initialize the admin dashboard system
 * Loads service configurations on app startup
 */
export function useAdminDashboardInit() {
  const { data: serviceConfigs, isLoading, error } = useServiceConfigs();
  const { setServiceConfigs } = useServiceConfigStore();
  const prevConfigsRef = useRef<ServiceConfig[] | null>(null);

  // Load service configurations into the store when data is available
  useEffect(() => {
    if (serviceConfigs && serviceConfigs.length > 0) {
      // Only update if configs have actually changed
      const prevConfigs = prevConfigsRef.current;
      const hasChanged =
        !prevConfigs ||
        prevConfigs.length !== serviceConfigs.length ||
        serviceConfigs.some(
          (config, index) =>
            !prevConfigs[index] || prevConfigs[index].code !== config.code
        );

      if (hasChanged) {
        setServiceConfigs(serviceConfigs);
        prevConfigsRef.current = serviceConfigs;
      }
    }
  }, [serviceConfigs]);

  return {
    isLoading,
    error,
    retry: () => {
      // The hook will automatically refetch when called again
      window.location.reload();
    },
  };
}
