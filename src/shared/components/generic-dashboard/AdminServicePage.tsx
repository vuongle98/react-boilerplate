import { LoadingSpinner } from "@/shared/components/loading";
import {
  useCreateMutation,
  useUpdateMutation,
} from "@/shared/hooks/use-api-mutations";
import { useApiQuery } from "@/shared/hooks/use-api-query";
import { useDetailView } from "@/shared/hooks/use-detail-view";
import { ServiceConfig } from "@/shared/types/generic-dashboard";
import { Scale } from "@/shared/ui/animate";
import { Button } from "@/shared/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDataFilters } from "./AdminDataFilters";
import { AdminEmptyState } from "./AdminEmptyState";
import { AdminErrorState } from "./AdminErrorState";
import { AdminModals } from "./AdminModals";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminPagination } from "./AdminPagination";
import { GenericDashboardService } from "./DashboardService";
import { ServicesGrid } from "./ServicesGrid";

export function AdminServicePage() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceConfig | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Use detail view for editing services
  const {
    selectedItem: editingService,
    isModalOpen: isEditModalOpen,
    openDetail: openEditModal,
    closeModal: closeEditModal,
  } = useDetailView<ServiceConfig>({
    modalThreshold: 20, // Always use modal for service editing
  });

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form refs for modal submission
  const createFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  // Mutation for updating service configs
  const updateServiceMutation = useUpdateMutation({
    endpoint: (id) => `/api/service-config/${id}`,
    invalidateQueries: [["service-configs"]],
    successMessage: "Service updated successfully",
    errorMessage: "Failed to update service",
  });

  // Mutation for creating service configs
  const createServiceMutation = useCreateMutation({
    endpoint: "/api/service-config",
    invalidateQueries: [["service-configs"]],
    successMessage: "Service created successfully",
    errorMessage: "Failed to create service",
  });

  // Build query parameters based on service operations
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    // Add search if present
    if (searchTerm) {
      params.search = searchTerm;
    }

    // Add category filter if not "all"
    if (categoryFilter && categoryFilter !== "all") {
      params.category = categoryFilter;
    }

    return params;
  }, [searchTerm, categoryFilter]);

  // Fetch service configurations with pagination
  const {
    data: services,
    isLoading,
    isError,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setFilters: setQueryFilters,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    refresh,
    forceRefresh,
  } = useApiQuery<ServiceConfig>({
    endpoint: "/api/service-config",
    queryKey: ["service-configs"],
    initialPageSize: 6, // Show 6 services per page (fits 2 rows of 3)
    initialFilters: queryParams,
    persistFilters: true,
    persistKey: `${"admin-services"}-filters`,
    isPaginated: true,
    onError: (error) => {
      console.error("Failed to fetch service configurations:", error);
    },
  });

  // Sync queryParams with useApiQuery filters
  useEffect(() => {
    setQueryFilters(queryParams);
  }, [queryParams, setQueryFilters]);

  // Get unique categories for filter options
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      services.map((service) => service.category).filter(Boolean)
    );
    return Array.from(uniqueCategories).sort();
  }, [services]);

  // Register services in the store when data is loaded
  useEffect(() => {
    if (services && Array.isArray(services)) {
      for (const serviceConfig of services) {
        try {
          GenericDashboardService.registerService(serviceConfig, {
            validate: false, // Skip validation since we're loading from API
            persist: false, // Don't persist back to API
          });
        } catch (registerError) {
          console.warn(
            `Failed to register service ${serviceConfig.id}:`,
            registerError
          );
        }
      }
    }
  }, [services]);

  // Create new service
  const handleCreateService = async (serviceConfig: any) => {
    console.log("handleCreateService called with:", serviceConfig);
    try {
      console.log("Calling createServiceMutation.mutateAsync...");
      const result = await createServiceMutation.mutateAsync(serviceConfig);
      console.log("Create mutation result:", result);

      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create service:", error);
      // Error handling is done by the mutation hook, but let's also log it here
    }
  };

  // Edit existing service
  const handleEditService = async (serviceConfig: any) => {
    if (!editingServiceId) {
      console.error("No service ID available for editing");
      return;
    }

    try {
      await updateServiceMutation.mutateAsync({
        id: editingServiceId,
        ...serviceConfig,
      });

      closeEditModal();
      setEditingServiceId(null);
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error("Failed to edit service:", error);
    }
  };

  // Open edit modal
  const handleOpenEditModal = (serviceConfig: ServiceConfig) => {
    setEditingServiceId(serviceConfig.id);
    openEditModal(serviceConfig);
  };

  // Navigate to service dashboard
  const handleViewService = (serviceConfig: ServiceConfig) => {
    navigate(`/admin/${serviceConfig.code}`);
  };

  // Test service connection
  const handleTestService = (serviceConfig: ServiceConfig) => {
    setSelectedService(serviceConfig);
    setIsTestModalOpen(true);
  };

  return (
    <div className="page-container">
      <div className="section-spacing space-y-6">
        {/* Controls */}
        <AdminPageHeader
          isLoading={isLoading}
          servicesCount={services.length}
          onRefresh={forceRefresh}
          onCreate={() => setIsCreateModalOpen(true)}
        />

        {/* Data Filters */}
        {!isLoading && !isError && services.length > 0 && (
          <AdminDataFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />
        )}

        {/* Error State */}
        {isError && <AdminErrorState error={error} onRetry={refresh} />}

        {/* Loading State */}
        {isLoading && <LoadingSpinner size="lg" text="Loading services..." />}

        {/* Services Grid */}
        {!isLoading && !isError && (
          <Scale delay={100}>
            <ServicesGrid
              services={services}
              onViewService={handleViewService}
              onEditService={handleOpenEditModal}
              onTestService={handleTestService}
            />
          </Scale>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <AdminPagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onPageChange={setPage}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && services.length === 0 && (
          <AdminEmptyState
            onRefresh={forceRefresh}
            onCreate={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* Filtered Empty State */}
        {!isLoading &&
          !isError &&
          services.length === 0 &&
          (searchTerm || (categoryFilter && categoryFilter !== "all")) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">
                No Services Match Your Filters
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or clearing the filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}

        {/* Modals */}
        <AdminModals
          isCreateModalOpen={isCreateModalOpen}
          onCloseCreateModal={() => setIsCreateModalOpen(false)}
          onCreateService={handleCreateService}
          createFormRef={createFormRef}
          isEditModalOpen={isEditModalOpen}
          editingService={editingService}
          editingServiceId={editingServiceId}
          onCloseEditModal={() => {
            closeEditModal();
            setEditingServiceId(null);
          }}
          onEditService={handleEditService}
          editFormRef={editFormRef}
          isTestModalOpen={isTestModalOpen}
          selectedService={selectedService}
          onCloseTestModal={() => {
            setIsTestModalOpen(false);
            setSelectedService(null);
          }}
        />
      </div>
    </div>
  );
}
