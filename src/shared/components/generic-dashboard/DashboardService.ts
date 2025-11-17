import BaseApiService from "@/shared/services/BaseApiService";
import { useServiceStore } from "@/shared/stores/service-store";
import { ServiceConfig } from "@/shared/types/generic-dashboard";

export interface ServiceTestResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  responseTime?: number;
}

export class GenericDashboardService {
  /**
   * Register a new service configuration
   */
  static async registerService(
    config: ServiceConfig,
    options: {
      validate?: boolean;
      persist?: boolean;
    } = {}
  ): Promise<void> {
    const { validate = true, persist = false } = options;

    // Validate configuration if requested
    if (validate) {
      await this.validateServiceConfig(config);
    }

    // Register in store
    useServiceStore.getState().registerService(config);

    // Persist to backend if requested
    if (persist) {
      await BaseApiService.post("/api/service-config", config);
    }
  }

  /**
   * Update an existing service configuration
   */
  static async updateService(
    serviceId: string,
    config: Partial<ServiceConfig>
  ): Promise<void> {
    const store = useServiceStore.getState();
    const existingService = store.getService(serviceId);

    if (!existingService) {
      throw new Error(`Service ${serviceId} not found`);
    }

    const updatedConfig = { ...existingService, ...config };
    await this.validateServiceConfig(updatedConfig);

    store.updateService(serviceId, updatedConfig);
  }

  /**
   * Unregister a service
   */
  static async unregisterService(serviceId: string): Promise<void> {
    useServiceStore.getState().unregisterService(serviceId);
  }

  /**
   * Validate a service configuration
   */
  static async validateServiceConfig(config: ServiceConfig): Promise<void> {
    const errors: string[] = [];

    // Basic validation
    if (!config.code) errors.push("Service Code is required");
    if (!config.displayName) errors.push("Display name is required");
    if (!config.fields || config.fields.length === 0)
      errors.push("At least one field is required");

    // API validation
    if (!config.api?.baseUrl) errors.push("API base URL is required");
    if (!config.api?.endpoints?.list) errors.push("List endpoint is required");
    if (!config.api?.endpoints?.create)
      errors.push("Create endpoint is required");
    if (!config.api?.endpoints?.update)
      errors.push("Update endpoint is required");
    if (!config.api?.endpoints?.delete)
      errors.push("Delete endpoint is required");

    // Field validation
    config.fields?.forEach((field, index) => {
      if (!field.key) errors.push(`Field ${index + 1}: Key is required`);
      if (!field.label) errors.push(`Field ${index + 1}: Label is required`);
      if (!field.type) errors.push(`Field ${index + 1}: Type is required`);
    });

    if (errors.length > 0) {
      throw new Error(
        `Service configuration validation failed:\n${errors.join("\n")}`
      );
    }
  }

  /**
   * Test service connection
   */
  static async testServiceConnection(
    serviceId: string
  ): Promise<ServiceTestResult> {
    const service = useServiceStore.getState().getService(serviceId);
    if (!service) {
      return {
        success: false,
        message: "Service not found",
        error: `Service ${serviceId} is not registered`,
      };
    }

    try {
      const startTime = Date.now();

      // Try to connect to the service base URL using BaseApiService
      const response = await BaseApiService.get(
        `${service.api.baseUrl}/health`
      );

      const responseTime = Date.now() - startTime;

      return {
        success: true,
        message: "Service connection successful",
        responseTime,
        data: response,
      };
    } catch (error: any) {
      // If /health endpoint doesn't exist, try a basic connection test
      try {
        const startTime = Date.now();
        // Try to get the base URL directly
        const response = await BaseApiService.get(service.api.baseUrl);
        const responseTime = Date.now() - startTime;

        return {
          success: true,
          message: "Service connection successful",
          responseTime,
          data: response,
        };
      } catch (fallbackError: any) {
        return {
          success: false,
          message: "Connection failed",
          error:
            error?.message ||
            error?.response?.data?.message ||
            fallbackError?.message ||
            fallbackError?.response?.data?.message ||
            "Unknown connection error",
        };
      }
    }
  }

  /**
   * Test a specific service endpoint
   */
  static async testServiceEndpoint(
    serviceId: string,
    endpointKey: string,
    method: string = "GET"
  ): Promise<ServiceTestResult> {
    const service = useServiceStore.getState().getService(serviceId);
    if (!service) {
      return {
        success: false,
        message: "Service not found",
        error: `Service ${serviceId} is not registered`,
      };
    }

    const endpoint = service.api.endpoints?.[endpointKey];
    if (!endpoint) {
      return {
        success: false,
        message: "Endpoint not configured",
        error: `Endpoint ${endpointKey} is not configured for service ${serviceId}`,
      };
    }

    const startTime = Date.now();
    try {
      const url = `${endpoint}`;

      let response: any;
      let responseTime: number;

      // Use BaseApiService instead of direct fetch
      if (method === "GET") {
        response = await BaseApiService.get(url);
        responseTime = Date.now() - startTime;
        return {
          success: true,
          message: `${method} ${endpoint} successful`,
          responseTime,
          data: response,
        };
      } else if (method === "POST") {
        const sampleData = this.generateSampleData(service.fields);
        response = await BaseApiService.post(url, sampleData);
        responseTime = Date.now() - startTime;
        return {
          success: true,
          message: `${method} ${endpoint} successful`,
          responseTime,
          data: response,
        };
      } else if (method === "PUT") {
        const finalUrl = url.replace("{id}", "1");
        const sampleData = this.generateSampleData(service.fields);
        response = await BaseApiService.put(finalUrl, sampleData);
        responseTime = Date.now() - startTime;
        return {
          success: true,
          message: `${method} ${endpoint} successful`,
          responseTime,
          data: response,
        };
      } else if (method === "DELETE") {
        const finalUrl = url.replace("{id}", "1");
        response = await BaseApiService.delete(finalUrl);
        responseTime = Date.now() - startTime;
        return {
          success: true,
          message: `${method} ${endpoint} successful`,
          responseTime,
          data: response,
        };
      } else {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }
    } catch (error: any) {
      return {
        success: false,
        message: `${method} ${endpoint} failed`,
        error:
          error?.message || error?.response?.data?.message || "Unknown error",
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Generate sample data for testing based on field definitions
   */
  private static generateSampleData(fields: any[]): Record<string, any> {
    const sampleData: Record<string, any> = {};

    fields.forEach((field) => {
      switch (field.type) {
        case "text":
        case "textarea":
        case "email":
        case "url":
          sampleData[field.key] = `Sample ${field.label}`;
          break;
        case "number":
          sampleData[field.key] = 42;
          break;
        case "boolean":
          sampleData[field.key] = true;
          break;
        case "date":
          sampleData[field.key] = new Date().toISOString().split("T")[0];
          break;
        case "select":
          sampleData[field.key] = field.options?.[0]?.value || "sample";
          break;
        default:
          sampleData[field.key] = `Sample ${field.label}`;
      }
    });

    return sampleData;
  }

  /**
   * Get service health status
   */
  static async getServiceHealth(serviceId: string): Promise<{
    status: "healthy" | "unhealthy" | "unknown";
    lastChecked: Date;
    responseTime?: number;
    error?: string;
  }> {
    const testResult = await this.testServiceConnection(serviceId);

    return {
      status: testResult.success ? "healthy" : "unhealthy",
      lastChecked: new Date(),
      responseTime: testResult.responseTime,
      error: testResult.error,
    };
  }

  /**
   * Get all services health status
   */
  static async getAllServicesHealth(): Promise<
    Record<
      string,
      {
        status: "healthy" | "unhealthy" | "unknown";
        lastChecked: Date;
        responseTime?: number;
        error?: string;
      }
    >
  > {
    const services = useServiceStore.getState().getAllServices();
    const health: Record<string, any> = {};

    for (const service of services) {
      health[service.id] = await this.getServiceHealth(service.id);
    }

    return health;
  }
}
