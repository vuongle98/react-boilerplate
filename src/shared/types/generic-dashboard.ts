// Service configuration types for the generic dashboard system
export interface ServiceField {
  key: string;
  label: string;
  type:
    | "text"
    | "number"
    | "boolean"
    | "select"
    | "date"
    | "textarea"
    | "email"
    | "url"
    | "password"
    | "file"
    | "rich-text"
    | "json"
    | "color"
    | "range"
    | "tel"
    | "time"
    | "datetime-local";
  required?: boolean;
  options?: { value: any; label: string; disabled?: boolean }[];
  validation?: {
    min?: number | string;
    max?: number | string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    step?: number;
    accept?: string; // For file inputs
    custom?: (value: any, allValues?: Record<string, any>) => string | boolean;
    async?: (
      value: any,
      allValues?: Record<string, any>
    ) => Promise<string | boolean>;
  };
  placeholder?: string;
  description?: string;
  defaultValue?: any;
  disabled?: boolean;
  readonly?: boolean;
  display?: {
    width?: number | string;
    sortable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
    hidden?: boolean;
    order?: number;
    group?: string;
    tooltip?: string;
  };
  dependencies?: {
    field: string;
    value: any;
    operator?:
      | "equals"
      | "not_equals"
      | "contains"
      | "not_contains"
      | "greater_than"
      | "less_than";
  }[];
  custom?: {
    component?: string; // Custom component name
    props?: Record<string, any>; // Additional props for custom components
    render?: (
      field: ServiceField,
      value: any,
      onChange: (value: any) => void
    ) => React.ReactNode;
  };
}

export interface ServiceApiConfig {
  baseUrl: string;
  endpoints: {
    list: string;
    create: string;
    update: string;
    delete: string;
    [key: string]: string; // For custom endpoints
  };
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface ServiceFeatures {
  create: boolean;
  update: boolean;
  delete: boolean;
  pagination: boolean;
  search: boolean;
  filters: boolean;
  export?: boolean | ExportFormat[];
  import?: boolean;
  bulkActions?: boolean;
  customActions?: ServiceCustomAction[];
  realTime?: boolean; // Enable real-time updates
  audit?: boolean; // Enable audit logging
  versioning?: boolean; // Enable record versioning
}

export interface ServiceCustomAction {
  id: string;
  label: string;
  icon?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  confirmMessage?: string;
  bulk?: boolean; // Can be used for bulk operations
  single?: boolean; // Can be used for single items
  permissions?: string[]; // Required permissions
  visible?: (
    item?: GenericDataItem,
    selectedItems?: GenericDataItem[]
  ) => boolean;
  handler?: (
    item?: GenericDataItem,
    selectedItems?: GenericDataItem[]
  ) => void | Promise<void>;
}

export interface ServiceConfig {
  id: string;
  code: string;
  displayName: string;
  description: string;
  icon?: string;
  category?: string;
  version?: string;
  api: ServiceApiConfig;
  fields: ServiceField[];
  features: ServiceFeatures;
  settings?: {
    defaultPageSize?: number;
    maxPageSize?: number;
    cacheTime?: number;
    staleTime?: number;
    debounceMs?: number;
  };
  permissions?: {
    create?: string[];
    update?: string[];
    delete?: string[];
    view?: string[];
  };
}

// Filter and search configuration
export interface ServiceFilters {
  [key: string]: any;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Service registration request
export interface ServiceRegistrationRequest {
  config: ServiceConfig;
  validate?: boolean;
  persist?: boolean;
}

// Service store state
export interface ServiceStoreState {
  services: Record<string, ServiceConfig>;
  isLoading: boolean;
  error: string | null;
}

// Service store actions
export interface ServiceStoreActions {
  registerService: (config: ServiceConfig) => void;
  unregisterService: (id: string) => void;
  updateService: (id: string, config: Partial<ServiceConfig>) => void;
  getService: (id: string) => ServiceConfig | undefined;
  getAllServices: () => ServiceConfig[];
  getServicesByCategory: (category: string) => ServiceConfig[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
}

export type ServiceStore = ServiceStoreState & ServiceStoreActions;

// Generic data response types
export interface GenericDataItem {
  id: string | number;
  [key: string]: any;
}

export interface GenericDataResponse {
  data: GenericDataItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Export format types
export type ExportFormat = "csv" | "json" | "excel";
