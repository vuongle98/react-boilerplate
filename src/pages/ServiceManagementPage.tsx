import { AdminServicePage } from "@/shared/components/generic-dashboard";
import { useApiData } from "@/shared/hooks/use-api-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

interface MetricsResponse {
  totalServices: number;
  activeEndpoints: number;
  apiCallsToday: number;
  averageResponseTimeMs: number;
}

/**
 * Developer dashboard page - shows API service management for developers
 * This demonstrates embedding the ApiServiceDemo within a larger dashboard layout
 */
export function ServiceManagementPage() {
  const { data: metrics, isLoading: metricsLoading } =
    useApiData<MetricsResponse>({
      endpoint: "/api/metrics",
      queryKey: "metrics",
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Service Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your application's services and APIs
          </p>
        </div>

        {/* Stats Cards - Compact Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Services */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Services
                </p>
                <p className="text-2xl font-bold">
                  {metricsLoading ? "..." : metrics?.totalServices ?? 0}
                </p>
              </div>
            </div>
          </Card>

          {/* Active Endpoints */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Endpoints
                </p>
                <p className="text-2xl font-bold">
                  {metricsLoading ? "..." : metrics?.activeEndpoints ?? 0}
                </p>
              </div>
            </div>
          </Card>

          {/* API Calls Today */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  API Calls Today
                </p>
                <p className="text-2xl font-bold">
                  {metricsLoading
                    ? "..."
                    : (metrics?.apiCallsToday ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Avg Response Time */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Response Time
                </p>
                <p className="text-2xl font-bold">
                  {metricsLoading
                    ? "..."
                    : `${Math.round(metrics?.averageResponseTimeMs ?? 0)}ms`}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Service Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>Service Management</CardTitle>
            <CardDescription>
              Dynamically load and manage your API services from the backend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminServicePage />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
