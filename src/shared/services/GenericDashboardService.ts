import EnhancedApiService from "@/shared/services/BaseApiService";
import LoggingService from "@/shared/services/LoggingService";
import { useServiceStore } from "@/shared/stores/service-store";
import {
  ServiceConfig,
  ServiceRegistrationRequest,
} from "@/shared/types/generic-dashboard";

/**
 * Service for managing service registration and validation
 */
class GenericDashboardService {
  /**
   * Register a new service in the system
   */
  async registerService(
    request: ServiceRegistrationRequest
  ): Promise<{ success: boolean; serviceId?: number; error?: string }> {
    try {
      const { config, validate = true, persist = true } = request;

      LoggingService.info(
        "GenericDashboardService",
        "register",
        `Registering service: ${config.id}`
      );

      // Validate the service configuration
      if (validate) {
        const validation = this.validateServiceConfig(config);
        if (!validation.valid) {
          const error = `Service validation failed: ${validation.errors.join(
            ", "
          )}`;
          LoggingService.error(
            "GenericDashboardService",
            "validation-failed",
            error
          );
          return { success: false, error };
        }
      }

      // Register in the store
      useServiceStore.getState().registerService(config);

      // Optionally persist to backend
      if (persist) {
        try {
          await this.persistServiceConfig(config);
          LoggingService.info(
            "GenericDashboardService",
            "persist",
            `Service persisted: ${config.id}`
          );
        } catch (persistError) {
          LoggingService.warn(
            "GenericDashboardService",
            "persist-failed",
            `Failed to persist service: ${config.id}`,
            persistError
          );
          // Don't fail the registration if persistence fails
        }
      }

      LoggingService.info(
        "GenericDashboardService",
        "success",
        `Service registered successfully: ${config.id}`
      );
      return { success: true, serviceId: config.id };
    } catch (error) {
      const errorMessage = `Failed to register service: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      LoggingService.error(
        "GenericDashboardService",
        "register-failed",
        errorMessage,
        error
      );
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Unregister a service from the system
   */
  async unregisterService(
    serviceId: string,
    persist = true
  ): Promise<{ success: boolean; error?: string }> {
    try {
      LoggingService.info(
        "GenericDashboardService",
        "unregister",
        `Unregistering service: ${serviceId}`
      );

      // Check if service exists
      const service = useServiceStore.getState().getService(serviceId);
      if (!service) {
        const error = `Service not found: ${serviceId}`;
        LoggingService.warn("GenericDashboardService", "not-found", error);
        return { success: false, error };
      }

      // Unregister from store
      useServiceStore.getState().unregisterService(serviceId);

      // Optionally remove from backend
      if (persist) {
        try {
          await this.deleteServiceConfig(serviceId);
          LoggingService.info(
            "GenericDashboardService",
            "persist-delete",
            `Service deleted from persistence: ${serviceId}`
          );
        } catch (persistError) {
          LoggingService.warn(
            "GenericDashboardService",
            "persist-delete-failed",
            `Failed to delete service from persistence: ${serviceId}`,
            persistError
          );
        }
      }

      LoggingService.info(
        "GenericDashboardService",
        "success",
        `Service unregistered successfully: ${serviceId}`
      );
      return { success: true };
    } catch (error) {
      const errorMessage = `Failed to unregister service: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      LoggingService.error(
        "GenericDashboardService",
        "unregister-failed",
        errorMessage,
        error
      );
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Validate a service configuration
   */
  validateServiceConfig(config: ServiceConfig): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Required fields validation
    if (!config.code?.trim()) {
      errors.push("Service code is required");
    }

    if (!config.displayName?.trim()) {
      errors.push("Service display name is required");
    }

    if (!config.api?.baseUrl?.trim()) {
      errors.push("API base URL is required");
    }

    if (!config.api?.endpoints?.list?.trim()) {
      errors.push("API list endpoint is required");
    }

    if (!config.api?.endpoints?.create?.trim()) {
      errors.push("API create endpoint is required");
    }

    if (!config.api?.endpoints?.update?.trim()) {
      errors.push("API update endpoint is required");
    }

    if (!config.api?.endpoints?.delete?.trim()) {
      errors.push("API delete endpoint is required");
    }

    // Fields validation
    if (
      !config.fields ||
      !Array.isArray(config.fields) ||
      config.fields.length === 0
    ) {
      errors.push("At least one field must be defined");
    } else {
      config.fields.forEach((field, index) => {
        if (!field.key?.trim()) {
          errors.push(`Field ${index + 1}: key is required`);
        }
        if (!field.label?.trim()) {
          errors.push(`Field ${index + 1}: label is required`);
        }
        if (!field.type) {
          errors.push(`Field ${index + 1}: type is required`);
        }
      });
    }

    // Features validation
    if (!config.features) {
      errors.push("Service features must be defined");
    }

    // Check for duplicate field keys
    if (config.fields) {
      const fieldKeys = config.fields.map((f) => f.key);
      const duplicateKeys = fieldKeys.filter(
        (key, index) => fieldKeys.indexOf(key) !== index
      );
      if (duplicateKeys.length > 0) {
        errors.push(`Duplicate field keys found: ${duplicateKeys.join(", ")}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get all registered services
   */
  getRegisteredServices() {
    return useServiceStore.getState().getAllServices();
  }

  /**
   * Get a specific service by ID
   */
  getService(serviceId: string) {
    return useServiceStore.getState().getService(serviceId);
  }

  /**
   * Persist service configuration to backend
   */
  private async persistServiceConfig(config: ServiceConfig): Promise<void> {
    const endpoint = "/api/v1/services";
    await EnhancedApiService.post(endpoint, config);
  }

  /**
   * Delete service configuration from backend
   */
  private async deleteServiceConfig(serviceId: string): Promise<void> {
    const endpoint = `/api/v1/services/${serviceId}`;
    await EnhancedApiService.delete(endpoint);
  }

  /**
   * Load services from backend on app initialization
   */
  async loadServicesFromBackend(): Promise<void> {
    try {
      LoggingService.info(
        "GenericDashboardService",
        "load",
        "Loading services from backend"
      );

      const endpoint = "/api/v1/services";
      const response: { services: ServiceConfig[] } =
        await EnhancedApiService.get(endpoint);

      if (response.services) {
        const store = useServiceStore.getState();
        response.services.forEach((service) => {
          store.registerService(service);
        });

        LoggingService.info(
          "GenericDashboardService",
          "load",
          `Loaded ${response.services.length} services from backend`
        );
      }
    } catch (error) {
      LoggingService.warn(
        "GenericDashboardService",
        "load-failed",
        "Failed to load services from backend",
        error
      );
      // Don't throw error - app should still work with local services
    }
  }

  /**
   * Test service connectivity
   */
  async testServiceConnection(
    serviceId: string
  ): Promise<{ success: boolean; error?: string; responseTime?: number }> {
    const service = this.getService(serviceId);
    if (!service) {
      return { success: false, error: "Service not found" };
    }

    const startTime = Date.now();

    try {
      // Test the list endpoint
      const endpoint = `${service.api.baseUrl}${service.api.endpoints.list}`;
      await EnhancedApiService.get(endpoint);

      const responseTime = Date.now() - startTime;
      LoggingService.info(
        "GenericDashboardService",
        "test-connection",
        `Service ${serviceId} is reachable (${responseTime}ms)`
      );

      return { success: true, responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      LoggingService.error(
        "GenericDashboardService",
        "test-connection-failed",
        `Service ${serviceId} connection failed: ${errorMessage}`
      );

      return { success: false, error: errorMessage, responseTime };
    }
  }
}

// Export singleton instance
const genericDashboardService = new GenericDashboardService();
export default genericDashboardService;

// Export for testing purposes
export { GenericDashboardService };
