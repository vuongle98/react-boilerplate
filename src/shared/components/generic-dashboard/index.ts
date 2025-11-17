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
export { DashboardPage } from "./DashboardPage";
export { DashboardHeader } from "./DashboardHeader";
export { DataTableSection } from "./DataTableSection";
export { DashboardModals } from "./DashboardModals";
export { ItemDetailView } from "./ItemDetailView";
export { ServiceError } from "./ServiceError";

// Export service
export { GenericDashboardService } from "./DashboardService";

// Export service management components
export { ServiceConfigForm } from "./ServiceConfigForm";

// Export components
export { ServiceTestModal } from "./ServiceTestModal";

// Export admin service page components
export { AdminServicePage } from "./AdminServicePage";
export { AdminPageHeader } from "./AdminPageHeader";
export { AdminErrorState } from "./AdminErrorState";
export { AdminLoadingState } from "./AdminLoadingState";
export { ServicesGrid } from "./ServicesGrid";
export { AdminPagination } from "./AdminPagination";
export { AdminEmptyState } from "./AdminEmptyState";
export { AdminModals } from "./AdminModals";
export { AdminDataFilters } from "./AdminDataFilters";
