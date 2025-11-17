import { queryClient } from "@/app/providers";
import {
  OperationsDefinition,
  ParsedServiceConfig,
  ServiceConfig,
} from "@/shared/types/admin-dashboard";
import { create } from "zustand";

interface ServiceConfigState {
  // Raw service configs from API
  serviceConfigs: ServiceConfig[];

  // Parsed service configs with JSON fields decoded
  parsedConfigs: Map<string, ParsedServiceConfig>;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setServiceConfigs: (configs: ServiceConfig[]) => void;
  addServiceConfig: (config: ServiceConfig) => void;
  updateServiceConfig: (config: ServiceConfig) => void;
  removeServiceConfig: (code: string) => void;
  getServiceConfig: (code: string) => ParsedServiceConfig | undefined;
  getAllServiceConfigs: () => ParsedServiceConfig[];
  refreshConfigs: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Mock service configurations for development
const getMockServiceConfigs = (): ServiceConfig[] => [
  {
    id: 1,
    code: "users",
    displayName: "User Management",
    description: "Manage system users and permissions",
    category: "system",
    api: {
      baseUrl: "http://localhost:8080/api/users",
      endpoints: {
        list: "/api/users",
        create: "/api/users",
        update: "/api/users/{id}",
        delete: "/api/users/{id}",
      },
    },
    fields: [
      {
        key: "id",
        label: "ID",
        type: "text",
        required: true,
        readonly: true,
        table: {
          visible: true,
          sortable: true,
          width: 80,
        },
        form: {
          visible: false,
        },
      },
      {
        key: "name",
        label: "Full Name",
        type: "text",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
        },
        table: {
          visible: true,
          sortable: true,
          searchable: true,
        },
        form: {
          visible: true,
          order: 1,
        },
      },
      {
        key: "email",
        label: "Email Address",
        type: "email",
        required: true,
        validation: {
          pattern: "^[^@]+@[^@]+\\.[^@]+$",
        },
        table: {
          visible: true,
          sortable: true,
          searchable: true,
        },
        form: {
          visible: true,
          order: 2,
        },
      },
      {
        key: "role",
        label: "Role",
        type: "select",
        required: true,
        options: [
          { value: "admin", label: "Administrator" },
          { value: "manager", label: "Manager" },
          { value: "user", label: "User" },
        ],
        table: {
          visible: true,
          sortable: true,
          filterable: true,
        },
        form: {
          visible: true,
          order: 3,
        },
      },
      {
        key: "active",
        label: "Active",
        type: "boolean",
        defaultValue: true,
        table: {
          visible: true,
          sortable: true,
          filterable: true,
          width: 100,
        },
        form: {
          visible: true,
          order: 4,
        },
      },
      {
        key: "createdAt",
        label: "Created At",
        type: "datetime",
        readonly: true,
        table: {
          visible: true,
          sortable: true,
          width: 150,
        },
        form: {
          visible: false,
        },
      },
    ],
    features: {
      create: true,
      delete: true,
      search: true,
      update: true,
      filters: true,
      pagination: true,
      bulkActions: false,
    },
    enabled: true,
    displayOrder: 1,
  },
  {
    id: 2,
    code: "products",
    displayName: "Product Catalog",
    description: "Manage products and inventory",
    category: "business",
    api: {
      baseUrl: "http://localhost:8080/api/products",
      endpoints: {
        list: "/api/products",
        create: "/api/products",
        update: "/api/products/{id}",
        delete: "/api/products/{id}",
      },
    },
    fields: [
      {
        key: "id",
        label: "Product ID",
        type: "text",
        required: true,
        readonly: true,
      },
      {
        key: "name",
        label: "Product Name",
        type: "text",
        required: true,
        validation: {
          minLength: 3,
          maxLength: 200,
        },
        table: {
          visible: true,
          sortable: true,
          searchable: true,
        },
        form: {
          visible: true,
          order: 1,
        },
      },
      {
        key: "price",
        label: "Price",
        type: "number",
        required: true,
        validation: {
          min: 0,
          step: 0.01,
        },
        table: {
          visible: true,
          sortable: true,
          width: 120,
        },
        form: {
          visible: true,
          order: 2,
        },
      },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "electronics", label: "Electronics" },
          { value: "clothing", label: "Clothing" },
          { value: "books", label: "Books" },
          { value: "home", label: "Home & Garden" },
        ],
        table: {
          visible: true,
          sortable: true,
          filterable: true,
        },
        form: {
          visible: true,
          order: 3,
        },
      },
      {
        key: "stock",
        label: "Stock",
        type: "number",
        required: true,
        validation: {
          min: 0,
        },
        table: {
          visible: true,
          sortable: true,
          width: 100,
        },
        form: {
          visible: true,
          order: 4,
        },
      },
      {
        key: "active",
        label: "Active",
        type: "boolean",
        defaultValue: true,
        table: {
          visible: true,
          sortable: true,
          filterable: true,
          width: 100,
        },
        form: {
          visible: true,
          order: 5,
        },
      },
    ],
    features: {
      create: true,
      delete: true,
      search: true,
      update: true,
      filters: true,
      pagination: true,
      bulkActions: false,
    },
    enabled: true,
    displayOrder: 2,
  },
];

export const useServiceConfigStore = create<ServiceConfigState>((set, get) => ({
  serviceConfigs: [],
  parsedConfigs: new Map(),
  isLoading: false,
  error: null,

  setServiceConfigs: (configs) => {
    const parsedMap = new Map<string, ParsedServiceConfig>();

    // If no configs provided, use mock configs for development
    const configsToProcess =
      configs.length > 0 ? configs : getMockServiceConfigs();

    configsToProcess.forEach((config) => {
      try {
        // Derive operations from API endpoints
        const operations: OperationsDefinition = {};

        if (config.api?.endpoints) {
          if (config.api.endpoints.list) {
            operations.list = {
              method: "GET",
              path: config.api.endpoints.list,
            };
          }
          if (config.api.endpoints.create) {
            operations.create = {
              method: "POST",
              path: config.api.endpoints.create,
              body: "object",
            };
          }
          if (config.api.endpoints.update) {
            operations.update = {
              method: "PUT",
              path: config.api.endpoints.update,
              body: "object",
            };
          }
          if (config.api.endpoints.delete) {
            operations.delete = {
              method: "DELETE",
              path: config.api.endpoints.delete,
            };
          }
        }

        const parsed: ParsedServiceConfig = {
          ...config,
          operations,
          baseUrl: config.api?.baseUrl || "",
        };
        parsedMap.set(config.code, parsed);
      } catch (error) {
        console.error(`Failed to parse service config ${config.code}:`, error);
      }
    });

    set({
      serviceConfigs: configsToProcess,
      parsedConfigs: parsedMap,
    });
  },

  addServiceConfig: (config) => {
    set((state) => ({
      serviceConfigs: [...state.serviceConfigs, config],
    }));
    // Trigger re-parsing
    get().setServiceConfigs(get().serviceConfigs);
  },

  updateServiceConfig: (config) => {
    set((state) => ({
      serviceConfigs: state.serviceConfigs.map((c) =>
        c.code === config.code ? config : c
      ),
    }));
    // Trigger re-parsing
    get().setServiceConfigs(get().serviceConfigs);
  },

  removeServiceConfig: (code) => {
    set((state) => ({
      serviceConfigs: state.serviceConfigs.filter((c) => c.code !== code),
      parsedConfigs: new Map(state.parsedConfigs), // Create new map reference
    }));
    get().parsedConfigs.delete(code);
  },

  getServiceConfig: (code) => {
    return get().parsedConfigs.get(code);
  },

  getAllServiceConfigs: () => {
    return Array.from(get().parsedConfigs.values())
      .filter((config) => config.enabled)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  refreshConfigs: async () => {
    try {
      set({ isLoading: true, error: null });
      await queryClient.invalidateQueries({ queryKey: ["service-configs"] });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to refresh configs",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
