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

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? "..." : metrics?.totalServices ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? "..." : metrics?.activeEndpoints ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">All healthy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                API Calls Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading
                  ? "..."
                  : (metrics?.apiCallsToday ?? 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading
                  ? "..."
                  : `${Math.round(metrics?.averageResponseTimeMs ?? 0)}ms`}
              </div>
              <p className="text-xs text-muted-foreground">Within SLA</p>
            </CardContent>
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
