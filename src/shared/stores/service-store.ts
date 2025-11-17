import LoggingService from "@/shared/services/LoggingService";
import { ServiceConfig, ServiceStore } from "@/shared/types/generic-dashboard";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Service store for managing registered services in the generic dashboard system
 * Uses Zustand for state management with persistence
 */
export const useServiceStore = create<ServiceStore>()(
  persist(
    (set, get) => ({
      // State
      services: {},
      isLoading: false,
      error: null,

      // Actions
      registerService: (config: ServiceConfig) => {
        set((state) => {
          LoggingService.info(
            "service-store",
            "register",
            `Registering service: ${config.id}`
          );
          return {
            services: { ...state.services, [config.id]: config },
            error: null,
          };
        });
      },

      unregisterService: (id: string) => {
        set((state) => {
          const { [id]: removed, ...rest } = state.services;
          if (removed) {
            LoggingService.info(
              "service-store",
              "unregister",
              `Unregistering service: ${id}`
            );
          } else {
            LoggingService.warn(
              "service-store",
              "unregister",
              `Service not found: ${id}`
            );
          }
          return {
            services: rest,
            error: null,
          };
        });
      },

      updateService: (id: string, updates: Partial<ServiceConfig>) => {
        set((state) => {
          const existingService = state.services[id];
          if (!existingService) {
            LoggingService.warn(
              "service-store",
              "update",
              `Service not found: ${id}`
            );
            return {
              error: `Service with id '${id}' not found`,
            };
          }

          LoggingService.info(
            "service-store",
            "update",
            `Updating service: ${id}`
          );
          return {
            services: {
              ...state.services,
              [id]: { ...existingService, ...updates },
            },
            error: null,
          };
        });
      },

      getService: (id: string) => {
        return get().services[id];
      },

      getAllServices: () => {
        return Object.values(get().services);
      },

      getServicesByCategory: (category: string) => {
        return Object.values(get().services).filter(
          (service) => service.category === category
        );
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
        if (error) {
          LoggingService.error("service-store", "error", error);
        }
      },

      clearAll: () => {
        LoggingService.info("service-store", "clear", "Clearing all services");
        set({
          services: {},
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: "service-store",
      // Only persist services, not loading/error states
      partialize: (state) => ({
        services: state.services,
      }),
    }
  )
);

/**
 * Service store hooks for specific operations
 */
export const useServiceActions = () => {
  const {
    registerService,
    unregisterService,
    updateService,
    getService,
    getAllServices,
    getServicesByCategory,
    setLoading,
    setError,
    clearAll,
  } = useServiceStore();

  return {
    registerService,
    unregisterService,
    updateService,
    getService,
    getAllServices,
    getServicesByCategory,
    setLoading,
    setError,
    clearAll,
  };
};

export const useServiceState = () => {
  const { services, isLoading, error } = useServiceStore();
  return { services, isLoading, error };
};

export const useServices = () => {
  const services = useServiceStore((state) => state.services);
  const getService = useServiceStore((state) => state.getService);
  const getAllServices = useServiceStore((state) => state.getAllServices);

  return {
    services,
    getService,
    getAllServices,
  };
};
