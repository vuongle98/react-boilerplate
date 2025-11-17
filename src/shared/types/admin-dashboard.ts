// Generic Admin Dashboard Types
import React from "react";

export interface ServiceConfig {
  id: number;
  code: string;
  displayName: string;
  description?: string;
  category: string;
  api: {
    baseUrl: string;
    endpoints: {
      list?: string;
      create?: string;
      delete?: string;
      update?: string;
      [key: string]: string | undefined;
    };
  };
  fields: FieldDefinition[];
  features: {
    create: boolean;
    delete: boolean;
    search: boolean;
    update: boolean;
    filters: boolean;
    pagination: boolean;
    bulkActions: boolean;
  };
  customTableComponent?: any;
  customFormComponent?: any;
  customDetailComponent?: any;
  enabled?: boolean;
  displayOrder?: number;
}

// Parsed operation configuration
export interface OperationConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  params?: Record<string, string>; // Parameter types (string, number, boolean)
  body?: 'object' | 'form-data'; // Body type for POST/PUT
}

// Operations definition parsed from operationsJson
export interface OperationsDefinition {
  list?: OperationConfig;
  get?: OperationConfig;
  create?: OperationConfig;
  update?: OperationConfig;
  delete?: OperationConfig;
  [key: string]: OperationConfig | undefined;
}

// Field display configuration
export interface FieldDisplayConfig {
  visible: boolean;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  width?: number | string;
  render?: (value: any, item: GenericDataItem) => React.ReactNode;
}

// Form field configuration
export interface FieldFormConfig {
  visible: boolean;
  order?: number;
  placeholder?: string;
  helpText?: string;
}

// Field validation configuration
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  custom?: (value: any, allValues?: Record<string, any>) => string | boolean;
}

// Individual field definition
export interface FieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'email' | 'password' | 'url' | 'tel' | 'date' | 'datetime' | 'file' | 'json';
  required?: boolean;
  readonly?: boolean;
  defaultValue?: any;
  placeholder?: string;
  description?: string;
  validation?: FieldValidation;
  options?: { value: any; label: string; disabled?: boolean }[];
  table?: FieldDisplayConfig;
  form?: FieldFormConfig;
  detail?: FieldDisplayConfig;
}

// Parsed fields configuration from fieldsJson
export type FieldsDefinition = FieldDefinition[];

// API response for paginated data
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Generic data item
export interface GenericDataItem {
  id: string | number;
  [key: string]: any;
}

// Component registry for custom overrides
export interface ComponentRegistry {
  [componentName: string]: React.ComponentType<any>;
}

// Service configuration with parsed operations from API endpoints
export interface ParsedServiceConfig extends Omit<ServiceConfig, 'api'> {
  operations: OperationsDefinition;
  baseUrl: string;  // Extracted from api.baseUrl
}
