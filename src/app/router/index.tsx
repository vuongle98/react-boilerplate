import { Outlet, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import NotFound from "@/shared/components/navigation/NotFound";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Home } from "@/pages/Home";
import { BotsPage } from "@/pages/BotsPage";
import { ComponentsDemo } from "@/pages/ComponentsDemo";

/**
 * AppRouter defines all application routes
 * Separates public and protected routes with appropriate layouts
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        element={
          <PublicLayout>
            <Outlet />
          </PublicLayout>
        }
      >
        <Route path="/public" element={<Home />} />
      </Route>

      {/* Protected routes - Wrapped in a single ProtectedRoute */}
      <Route
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Outlet />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/bots" element={<BotsPage />} />
        <Route path="/components" element={<ComponentsDemo />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

