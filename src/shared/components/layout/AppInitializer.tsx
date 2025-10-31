import { LoadingSpinner } from "@/shared/components/loading";
import { useKeycloak } from "@/features/auth/contexts/KeycloakContext";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { login, isAuthenticated, isLoading, initializationFailed } =
    useKeycloak();
  const [initializationComplete, setInitializationComplete] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!isAuthenticated && !initializationFailed && !isLoading) {
          // Initialize Keycloak and wait for authentication
          await login();
        }

        if (isAuthenticated) {
          // Mark initialization as complete
          setInitializationComplete(true);
        }
      } catch (error) {
        console.error("App initialization failed:", error);
        toast.error("Failed to initialize application");
      }
    };

    initializeApp();
  }, [isAuthenticated, initializationFailed, isLoading, login]);

  // Show loading screen until fully initialized
  if (!initializationComplete || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <div className="text-sm text-muted-foreground">
            {isLoading ? "Initializing..." : "Loading application..."}
          </div>
        </div>
      </div>
    );
  }

  // Show fallback for authentication failures
  if (initializationFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">
            Authentication Unavailable
          </h2>
          <p className="text-muted-foreground">
            Please configure Keycloak to enable authentication.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
