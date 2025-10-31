import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { Toaster } from "@/shared/ui/toaster";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { ThemeProvider } from "./ThemeProvider";
import { AppInitializer } from "@/shared/components/layout/AppInitializer";
import { KeycloakProvider } from "@/features/auth/contexts/KeycloakContext";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { SettingsProvider } from "./SettingsProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "master",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "boilerplate-app",
};

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders wraps the application with all necessary context providers
 * in the correct order to ensure proper dependency injection
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <KeycloakProvider config={keycloakConfig}>
      <ThemeProvider defaultTheme="system">
        <AppInitializer>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <SettingsProvider>
                  <TooltipProvider>
                    {children}
                    <Toaster />
                    <Sonner />
                  </TooltipProvider>
                </SettingsProvider>
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </AppInitializer>
      </ThemeProvider>
    </KeycloakProvider>
  );
}

export { queryClient };

