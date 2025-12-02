// Export types
export type {
  GenericDataItem,
  GenericDataResponse,
  ServiceApiConfig,
  ServiceConfig,
  ServiceCustomAction,
  ServiceFeatures,
  ServiceField,
  ServiceFilters,
  ServiceRegistrationRequest,
  ServiceStore,
} from "../../types/generic-dashboard";

// Export store
export {
  useServiceActions,
  useServices,
  useServiceState,
  useServiceStore,
} from "../../stores/service-store";

// Export hooks with types
export {
  useGenericData,
  useGenericItem,
  useServiceConfig,
  type UseGenericDataResult,
} from "../../hooks/use-generic-data";

export {
  useGenericBulkActions,
  useGenericCustomActions,
  useGenericMutations,
} from "../../hooks/use-generic-mutations";

// Export main components
export { DashboardHeader } from "./DashboardHeader";
export { DashboardModals } from "./DashboardModals";
export { DashboardPage } from "./DashboardPage";
export { DataTableSection } from "./DataTableSection";
export { ItemDetailView } from "./ItemDetailView";
export { ServiceError } from "./ServiceError";

// Export form components
export { FieldRenderer } from "./FieldRenderer";
export { FormActions } from "./FormActions";
export { FormField } from "./FormField";
export { FormRenderer } from "./FormRenderer";

// Export service
export { GenericDashboardService } from "./DashboardService";

// Export service management components
export { ServiceConfigForm } from "./ServiceConfigForm";

// Export components
export { ServiceTestModal } from "./ServiceTestModal";

// Export admin service page components
export { AdminDataFilters } from "./AdminDataFilters";
export { AdminEmptyState } from "./AdminEmptyState";
export { AdminErrorState } from "./AdminErrorState";
export { AdminModals } from "./AdminModals";
export { AdminPageHeader } from "./AdminPageHeader";
export { AdminPagination } from "./AdminPagination";
export { AdminServicePage } from "./AdminServicePage";
export { ServicesGrid } from "./ServicesGrid";
