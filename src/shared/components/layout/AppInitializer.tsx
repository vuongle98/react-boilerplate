import { useKeycloak } from "@/features/auth/contexts/KeycloakContext";
import { LoadingSpinner } from "@/shared/components/loading";
import { useAdminDashboardInit } from "@/shared/hooks/use-admin-dashboard-init";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface AppInitializerProps {
  children: ReactNode;
}

// Separate component for admin dashboard initialization
function AdminDashboardInitializer({ children }: { children: ReactNode }) {
  const { isLoading: adminLoading, error: adminError } =
    useAdminDashboardInit();

  // Show loading screen during admin initialization
  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground">
            Initializing dashboard...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { login, isAuthenticated, isLoading, initializationFailed } =
    useKeycloak();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!isAuthenticated && !initializationFailed && !isLoading) {
          // Initialize Keycloak and wait for authentication
          await login();
        }
      } catch (error) {
        console.error("App initialization failed:", error);
        toast.error("Failed to initialize application");
      }
    };

    initializeApp();
  }, [isAuthenticated, initializationFailed, isLoading, login]);

  // Show loading screen during authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show error if authentication failed
  if (initializationFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="text-destructive text-center">
            <p className="font-medium">Authentication failed</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please try refreshing the page or contact support
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Once authenticated, initialize admin dashboard
  return <AdminDashboardInitializer>{children}</AdminDashboardInitializer>;
}
