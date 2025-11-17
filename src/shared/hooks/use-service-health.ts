import { useApiData } from "@/shared/hooks/use-api-data";
import { ServiceConfig } from "@/shared/types/generic-dashboard";

interface ServiceHealthResult {
  success: boolean;
  message: string;
  responseTime?: number;
  error?: string;
}

/**
 * Hook to check service connection health
 */
export function useServiceHealth(service: ServiceConfig | null) {
  return useApiData<ServiceHealthResult>({
    endpoint: service ? `${service.api.baseUrl}/health` : "",
    queryKey: service
      ? ["service-health", service.id.toString()]
      : ["service-health"],
    enabled: !!service,
    transform: (response: any) => {
      // Transform the response to match our expected format
      return {
        success: response.status === "ok" || response.healthy === true,
        message:
          response.message ||
          (response.status === "ok"
            ? "Service is healthy"
            : "Service health check failed"),
        responseTime: response.responseTime,
        error: response.error,
      };
    },
    onError: (error) => {
      return {
        success: false,
        message: "Connection failed",
        error:
          error instanceof Error ? error.message : "Unknown connection error",
      };
    },
  });
}

/**
 * Hook to test a specific service endpoint
 */
export function useServiceEndpointTest(
  service: ServiceConfig | null,
  endpointKey: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET"
) {
  const operations = service
    ? JSON.parse(
        service.api.endpoints ? JSON.stringify(service.api.endpoints) : "{}"
      )
    : {};
  const operation = operations[endpointKey];

  if (!operation || !service) {
    return {
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      refetch: () => {},
      refresh: () => Promise.resolve(),
      forceRefresh: () => Promise.resolve(),
      setParams: () => {},
    };
  }

  // Build the endpoint URL
  let url = `${service.api.baseUrl}${operation}`;

  // For methods that need an ID, append a test ID
  if (["PUT", "DELETE"].includes(method)) {
    url = url.replace(":id", "1");
  }

  return useApiData({
    endpoint: url,
    queryKey: [
      "service-endpoint-test",
      service.id.toString(),
      endpointKey,
      method,
    ],
    enabled: !!service && !!operation,
    transform: (response: any) => ({
      success: true,
      message: `${method} ${operation} successful`,
      data: response,
      responseTime: 0, // We don't track response time in this hook
    }),
    onError: (error) => ({
      success: false,
      message: `${method} ${operation} failed`,
      error: error instanceof Error ? error.message : "Unknown error",
    }),
  });
}

/**
 * Hook to test multiple services' health status
 */
export function useServiceHealthBatch(services: ServiceConfig[]) {
  // This would need to be implemented as a custom solution since use-api-data
  // doesn't support multiple concurrent requests easily.
  // For now, we'll keep the existing implementation but could be refactored later.
  return {
    testAll: async () => {
      const results: Record<string, ServiceHealthResult> = {};

      for (const service of services) {
        try {
          // Use a simple fetch for batch operations (could be optimized later)
          const response = await fetch(`${service.api.baseUrl}/health`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(5000),
          });

          if (response.ok) {
            results[service.id] = {
              success: true,
              message: "Service is healthy",
              responseTime: 0,
            };
          } else {
            results[service.id] = {
              success: false,
              message: `HTTP ${response.status}`,
              error: `HTTP ${response.status}: ${response.statusText}`,
            };
          }
        } catch (error) {
          results[service.id] = {
            success: false,
            message: "Connection failed",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }

      return results;
    },
  };
}
