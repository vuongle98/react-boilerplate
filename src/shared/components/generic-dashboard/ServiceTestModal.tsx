import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Separator } from "@/shared/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Database,
  Loader2,
  Network,
  Play,
  RefreshCw,
  Settings,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { GenericDashboardService } from "./DashboardService";

interface ServiceTestModalProps {
  service: any;
  isOpen: boolean;
  onClose: () => void;
}

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  responseTime?: number;
  error?: string;
}

export function ServiceTestModal({
  service,
  isOpen,
  onClose,
}: ServiceTestModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Service Testing - {service?.displayName}
          </DialogTitle>
          <DialogDescription>
            Test service connections and validate endpoints
          </DialogDescription>
        </DialogHeader>

        {service && <ServiceTestContent service={service} />}
      </DialogContent>
    </Dialog>
  );
}

// Import missing icons
import { Edit, Plus, Trash } from "lucide-react";

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  responseTime?: number;
  error?: string;
}

interface ServiceTestContentProps {
  service: any;
}

export function ServiceTestContent({ service }: ServiceTestContentProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    connection: TestResult | null;
    list: TestResult | null;
    create: TestResult | null;
    update: TestResult | null;
    delete: TestResult | null;
  }>({
    connection: null,
    list: null,
    create: null,
    update: null,
    delete: null,
  });

  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const runConnectionTest = async () => {
    if (!service) return;

    setIsTesting(true);
    try {
      const startTime = Date.now();
      const result = await GenericDashboardService.testServiceConnection(
        service.id
      );
      const responseTime = Date.now() - startTime;

      setTestResults((prev) => ({
        ...prev,
        connection: {
          success: result.success,
          message:
            result.message ||
            (result.success ? "Connection successful" : "Connection failed"),
          responseTime,
          data: result.data,
          error: result.error,
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        connection: {
          success: false,
          message: "Connection test failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    } finally {
      setIsTesting(false);
    }
  };

  const runEndpointTest = async (endpoint: string, method: string = "GET") => {
    if (!service) return;

    setSelectedTest(endpoint);
    try {
      const startTime = Date.now();
      const result = await GenericDashboardService.testServiceEndpoint(
        service.id,
        endpoint,
        method
      );
      const responseTime = Date.now() - startTime;

      setTestResults((prev) => ({
        ...prev,
        [endpoint]: {
          success: result.success,
          message:
            result.message ||
            (result.success
              ? `${method} ${endpoint} successful`
              : `${method} ${endpoint} failed`),
          responseTime,
          data: result.data,
          error: result.error,
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [endpoint]: {
          success: false,
          message: `${method} ${endpoint} failed`,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    } finally {
      setSelectedTest(null);
    }
  };

  const runAllTests = async () => {
    if (!service) return;

    setIsTesting(true);

    // Test connection first
    await runConnectionTest();

    // Then test endpoints
    const endpoints = [
      { key: "list", method: "GET" },
      { key: "create", method: "POST" },
      { key: "update", method: "PUT" },
      { key: "delete", method: "DELETE" },
    ];

    for (const { key, method } of endpoints) {
      await runEndpointTest(key, method);
    }

    setIsTesting(false);
  };

  const getTestStatusIcon = (result: TestResult | null) => {
    if (!result)
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    if (result.success)
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getTestStatusBadge = (result: TestResult | null) => {
    if (!result) return <Badge variant="secondary">Not tested</Badge>;
    if (result.success) return <Badge variant="default">Success</Badge>;
    return <Badge variant="destructive">Failed</Badge>;
  };

  const resetTests = () => {
    setTestResults({
      connection: null,
      list: null,
      create: null,
      update: null,
      delete: null,
    });
  };

  useEffect(() => {
    if (service) {
      resetTests();
    }
  }, [service]);

  if (!service) return null;

  const endpoints = [
    { key: "list", label: "List Endpoint", method: "GET", icon: Database },
    { key: "create", label: "Create Endpoint", method: "POST", icon: Plus },
    { key: "update", label: "Update Endpoint", method: "PUT", icon: Edit },
    { key: "delete", label: "Delete Endpoint", method: "DELETE", icon: Trash },
  ];

  return (
    <div className="space-y-6">
      {/* Service Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Service Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Base URL:</span>
              <p className="font-mono text-xs bg-muted p-2 rounded mt-1">
                {service.api?.baseUrl}
              </p>
            </div>
            <div>
              <span className="font-medium">Service ID:</span>
              <p className="font-mono text-xs bg-muted p-2 rounded mt-1">
                {service.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Test Results</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={resetTests}
            disabled={isTesting}
            iconLeft={<RefreshCw className="h-4 w-4" />}
          >
            Reset Tests
          </Button>
          <Button
            onClick={runAllTests}
            disabled={isTesting}
            className="gap-2"
            iconLeft={
              isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )
            }
          >
            Run All Tests
          </Button>
        </div>
      </div>

      {/* Connection Test */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Network className="h-4 w-4" />
              Connection Test
            </CardTitle>
            {getTestStatusBadge(testResults.connection)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTestStatusIcon(testResults.connection)}
              <span className="text-sm">
                {testResults.connection?.message ||
                  "Test connection to service"}
              </span>
              {testResults.connection?.responseTime && (
                <Badge variant="outline" className="text-xs">
                  {testResults.connection.responseTime}ms
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={runConnectionTest}
              disabled={isTesting}
              iconLeft={
                isTesting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )
              }
            >
              Test
            </Button>
          </div>
          {testResults.connection?.error && (
            <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
              <strong>Error:</strong> {testResults.connection.error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Endpoint Tests */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Endpoint Tests</h3>

        {endpoints.map(({ key, label, method, icon: Icon }) => (
          <Card key={key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                  <Badge variant="outline" className="text-xs ml-2">
                    {method}
                  </Badge>
                </CardTitle>
                {getTestStatusBadge(
                  testResults[key as keyof typeof testResults]
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTestStatusIcon(
                    testResults[key as keyof typeof testResults]
                  )}
                  <span className="text-sm font-mono">
                    {service.api?.endpoints?.[key] || `/${key}`}
                  </span>
                  {testResults[key as keyof typeof testResults]
                    ?.responseTime && (
                    <Badge variant="outline" className="text-xs">
                      {
                        testResults[key as keyof typeof testResults]
                          .responseTime
                      }
                      ms
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runEndpointTest(key, method)}
                  disabled={isTesting || selectedTest === key}
                  iconLeft={
                    selectedTest === key ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )
                  }
                >
                  Test
                </Button>
              </div>

              {/* Test Result Details */}
              {testResults[key as keyof typeof testResults] && (
                <div className="mt-4 space-y-2">
                  <Separator />
                  <div className="text-sm">
                    <strong>Response:</strong>
                    <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {JSON.stringify(
                        testResults[key as keyof typeof testResults]?.data ||
                          testResults[key as keyof typeof testResults]?.error,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {Object.values(testResults).filter((r) => r?.success).length}
              </div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {
                  Object.values(testResults).filter((r) => r && !r.success)
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {Object.values(testResults).filter((r) => !r).length}
              </div>
              <div className="text-sm text-muted-foreground">Not Tested</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {Object.values(testResults)
                  .filter((r) => r?.responseTime)
                  .reduce((sum, r) => sum + (r?.responseTime || 0), 0) /
                  Math.max(
                    1,
                    Object.values(testResults).filter((r) => r?.responseTime)
                      .length
                  )}{" "}
                | 0
              </div>
              <div className="text-sm text-muted-foreground">
                Avg Response (ms)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
