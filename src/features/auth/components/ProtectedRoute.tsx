import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";

interface AppRole {
  role: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: AppRole[];
  fallback?: React.ReactNode;
}

export const ProtectedRoute = ({
  children,
  requiredRoles = [],
  fallback,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required roles
  // if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
  //   // Show fallback UI if provided, otherwise redirect to unauthorized page
  //   if (fallback) {
  //     return <>{fallback}</>;
  //   }
  //   return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  // }

  // User is authenticated and has required roles
  return <>{children}</>;
};

