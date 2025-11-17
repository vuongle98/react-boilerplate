import { useApiQuery } from "@/shared/hooks/use-api-query";
import { useDetailView } from "@/shared/hooks/use-detail-view";
import { useServiceConfig } from "@/shared/hooks/use-dynamic-menu";
import {
  useGenericBulkActions,
  useGenericMutations,
} from "@/shared/hooks/use-generic-mutations";
import { GenericDataItem } from "@/shared/types/admin-dashboard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardModals } from "./DashboardModals";
import { DataTableSection } from "./DataTableSection";
import { ServiceError } from "./ServiceError";
import { TableRenderer } from "./TableRenderer";

export function DashboardPage() {
  const { serviceCode } = useParams<{ serviceCode: string }>();
  const navigate = useNavigate();

  // State management
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Modal states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingItem, setDeletingItem] = useState<GenericDataItem | null>(
    null
  );

  // Get service configuration
  const serviceConfig = useServiceConfig(serviceCode!);

  // Validate service config structure before using hooks that depend on it
  if (!serviceConfig) {
    return (
      <ServiceError
        type="not-found"
        serviceCode={serviceCode}
        onBack={() => navigate("/admin")}
      />
    );
  }

  if (
    !serviceConfig.fields ||
    !Array.isArray(serviceConfig.fields) ||
    serviceConfig.fields.length === 0
  ) {
    return (
      <ServiceError
        type="invalid-config"
        serviceCode={serviceCode}
        onBack={() => navigate("/admin")}
      />
    );
  }

  if (!serviceConfig.displayName || !serviceConfig.operations) {
    return (
      <ServiceError
        type="incomplete-config"
        serviceCode={serviceCode}
        onBack={() => navigate("/admin")}
      />
    );
  }

  if (!serviceConfig.operations.list || !serviceConfig.operations.list.path) {
    return (
      <ServiceError
        type="invalid-operations"
        serviceCode={serviceCode}
        onBack={() => navigate("/admin")}
      />
    );
  }

  if (!serviceConfig.baseUrl) {
    return (
      <ServiceError
        type="missing-base-url"
        serviceCode={serviceCode}
        onBack={() => navigate("/admin")}
      />
    );
  }

  // Use detail view for viewing items
  const {
    selectedItem: viewingItem,
    isModalOpen: showViewModal,
    openDetail: openViewModal,
    closeModal: closeViewModal,
  } = useDetailView<GenericDataItem>({
    modalThreshold: 20, // Always use modal for viewing
  });

  // Use detail view for editing items
  const {
    selectedItem: editingItem,
    isModalOpen: showEditForm,
    openDetail: openEditModal,
    closeModal: closeEditModal,
  } = useDetailView<GenericDataItem>({
    modalThreshold: 20, // Always use modal for editing
  });

  // Form refs for modal submission
  const editFormRef = useRef<HTMLFormElement>(null);
  const createFormRef = useRef<HTMLFormElement>(null);

  // Build query parameters based on service operations
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    console.log(searchTerm);

    // Add search if present
    if (searchTerm) {
      params.search = searchTerm;
    }

    // Add filters
    Object.assign(params, filters);

    return params;
  }, [serviceConfig, searchTerm, filters]);

  // Fetch data with pagination and filters
  const {
    data: items,
    isLoading,
    page,
    pageSize: currentPageSize,
    setPage,
    setPageSize,
    totalItems,
    totalPages,
    filters: currentFilters,
    setFilters: setQueryFilters,
    resetFilters,
    refresh,
    forceRefresh,
  } = useApiQuery<GenericDataItem>({
    endpoint: `${serviceConfig.operations.list.path}`,
    queryKey: ["admin-generic-data", serviceConfig.code],
    initialPage: 0,
    initialFilters: queryParams,
    persistFilters: true,
    persistKey: `${serviceConfig.code}-filters`,
    debounceMs: 500, // Debounce search/filter changes by 500ms
    isPaginated: true,
    useCache: true,
    staleTime: 0,
    cacheTime: 0,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Sync queryParams with useApiQuery filters
  useEffect(() => {
    setQueryFilters(queryParams);
  }, [queryParams, setQueryFilters]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
    },
    [setPageSize]
  );

  // Mutations
  const {
    create,
    update,
    delete: deleteMutation,
    isLoading: isMutating,
  } = useGenericMutations(serviceConfig, {
    onSuccess: (action, data) => {
      console.log(`${action} successful:`, data);
    },
    onError: (action, error) => {
      console.error(`${action} failed:`, error);
    },
  });

  // Bulk Actions
  const { bulkDelete, bulkUpdate, supportsBulkActions } =
    useGenericBulkActions(serviceConfig);

  // Handle create
  const handleCreate = useCallback(
    async (formData: Record<string, any>) => {
      console.log(formData);
      if (!serviceConfig.operations.create) return;

      try {
        await create.mutateAsync(formData);
        setShowCreateForm(false);
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to create item"
        );
      }
    },
    [create, serviceConfig]
  );

  // Handle update
  const handleUpdate = useCallback(
    async (formData: Record<string, any>) => {
      if (!serviceConfig.operations.update || !editingItem) return;

      try {
        await update.mutateAsync({ ...formData, id: editingItem.id });
        closeEditModal();
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to update item"
        );
      }
    },
    [update, serviceConfig, editingItem, closeEditModal]
  );

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!serviceConfig.operations.delete || !deletingItem) return;

    try {
      await deleteMutation.mutateAsync(deletingItem.id);
      setDeletingItem(null);
    } catch (err) {
      console.error("Failed to delete item:", err);
      // Could show error dialog here
    }
  }, [deleteMutation, serviceConfig, deletingItem]);

  // Handle bulk delete
  const handleBulkDelete = useCallback(
    async (items: GenericDataItem[]) => {
      if (!bulkDelete) return;

      try {
        await bulkDelete(items.map((item) => item.id));
        toast.success(`Successfully deleted ${items.length} items`);
      } catch (err) {
        console.error("Failed to bulk delete items:", err);
        toast.error("Failed to delete selected items");
      }
    },
    [bulkDelete]
  );

  // Handle bulk update
  const handleBulkUpdate = useCallback(
    async (items: GenericDataItem[], updates: Record<string, any>) => {
      if (!bulkUpdate) return;

      try {
        await bulkUpdate(
          items.map((item) => item.id),
          updates
        );
        toast.success(`Successfully updated ${items.length} items`);
      } catch (err) {
        console.error("Failed to bulk update items:", err);
        toast.error("Failed to update selected items");
      }
    },
    [bulkUpdate]
  );

  // Check permissions
  const canCreate = serviceConfig.fields.some(
    (field) => field.form?.visible !== false
  );
  const canEdit = canCreate;
  const canDelete = Boolean(serviceConfig.operations.delete);

  // Use custom table component if available
  const TableComponent = serviceConfig.customTableComponent || TableRenderer;

  return (
    <div className="page-container">
      <div className="section-spacing space-y-6">
        {/* Header */}
        <DashboardHeader
          displayName={serviceConfig.displayName}
          description={serviceConfig.description}
          isLoading={isLoading}
          canCreate={canCreate}
          onRefresh={forceRefresh}
          onCreate={() => setShowCreateForm(true)}
        />

        {/* Main Content */}
        <DataTableSection
          displayName={serviceConfig.displayName}
          items={items}
          fields={serviceConfig.fields}
          loading={isLoading}
          page={page}
          pageSize={currentPageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          searchTerm={searchTerm}
          filters={filters}
          canEdit={canEdit}
          canDelete={canDelete}
          supportsBulkActions={supportsBulkActions}
          customTableComponent={TableComponent}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearchChange={setSearchTerm}
          onFiltersChange={(newFilters) => setFilters(newFilters)}
          onView={(item) => {
            openViewModal(item);
          }}
          onEdit={(item) => {
            openEditModal(item);
          }}
          onDelete={(item) => {
            setDeletingItem(item);
            setShowDeleteDialog(true);
          }}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
        />

        {/* Modals */}
        <DashboardModals
          displayName={serviceConfig.displayName}
          fields={serviceConfig.fields}
          showCreateForm={showCreateForm}
          onCloseCreateForm={() => setShowCreateForm(false)}
          onCreateSubmit={handleCreate}
          createFormRef={createFormRef}
          showEditForm={showEditForm}
          editingItem={editingItem}
          onCloseEditForm={closeEditModal}
          onEditSubmit={handleUpdate}
          editFormRef={editFormRef}
          showViewModal={showViewModal}
          viewingItem={viewingItem}
          onCloseViewModal={closeViewModal}
          showDeleteDialog={showDeleteDialog}
          deletingItem={deletingItem}
          onCloseDeleteDialog={() => {
            setShowDeleteDialog(false);
            if (!showDeleteDialog) setDeletingItem(null);
          }}
          onConfirmDelete={handleDelete}
        />
      </div>
    </div>
  );
}
