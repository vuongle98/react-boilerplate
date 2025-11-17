import { useServiceConfigStore } from "@/shared/stores/service-config-store";
import { ParsedServiceConfig } from "@/shared/types/admin-dashboard";

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  order: number;
  enabled: boolean;
}

/**
 * Hook for dynamic menu generation from service configurations
 */
export function useDynamicMenu(): MenuItem[] {
  const { getAllServiceConfigs } = useServiceConfigStore();

  // Convert service configs to menu items
  const serviceConfigs = getAllServiceConfigs();

  const menuItems: MenuItem[] = serviceConfigs.map(
    (config: ParsedServiceConfig) => ({
      id: config.code,
      label: config.displayName,
      path: `/admin/${config.code}`,
      icon: config.customTableComponent ? "⚙️" : "📊", // Custom icon for custom components
      order: config.displayOrder,
      enabled: config.enabled,
    })
  );

  return menuItems.sort((a, b) => a.order - b.order);
}

/**
 * Hook to get a specific service config by code
 */
export function useServiceConfig(
  code: string
): ParsedServiceConfig | undefined {
  const { getServiceConfig } = useServiceConfigStore();

  return getServiceConfig(code);
}
