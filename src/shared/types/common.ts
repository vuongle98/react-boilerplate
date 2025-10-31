export interface BaseData {
  id: string | number;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PaginatedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  pageable?: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last?: boolean;
  numberOfElements?: number;
  first?: boolean;
  empty?: boolean;
  sort?: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
}

export interface PaginationOptions {
  page?: number;
  size?: number;
  sort?: string;
  [key: string]: unknown; // Allow arbitrary filter parameters
}

export type ThemeMode = "light" | "dark";

export interface AppSettings {
  theme: ThemeMode;
  compactMode: boolean;
  autoSave: boolean;
  notifications: boolean;
}

// Base FilterOption interface
export interface BaseFilterOption {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  color?: string;
  [key: string]: any; // Allow additional properties
}

// Generic version of FilterOption with type parameter
export interface Option<T> {
  value: string;
  label: React.ReactNode;
  original?: T;
  disabled?: boolean;
}

export interface FilterOption<T = any> extends Omit<BaseFilterOption, "value"> {
  // value: T;
  disabled?: boolean;
  description?: string;
}

export interface FilterGroup {
  id: string;
  label?: string;
  options: FilterOption<string>[];
  activeValue: string;
  onValueChange: (value: string) => void;
  renderOption?: (option: FilterOption<string>) => React.ReactNode;
}

export interface SearchConfig {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  showIcon?: boolean;
  className?: string;
}

export interface GridConfig {
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: number | { x?: number; y?: number };
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}