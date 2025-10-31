import { Option } from "@/shared/types/common";

// Base configuration for the SearchableSelect component
export interface SearchableSelectConfig<T = any> {
  // Data source configuration
  dataSource: DataSourceConfig<T>;

  // UI Configuration
  ui: UIConfig;

  // Behavior configuration
  behavior: BehaviorConfig;
}

// Data source types
export type DataSourceType = 'api' | 'local';

export interface BaseDataSourceConfig<T> {
  type: DataSourceType;
}

export interface ApiDataSourceConfig<T> extends BaseDataSourceConfig<T> {
  type: 'api';
  endpoint: string;
  queryKey: string | string[];
  transformData?: (data: T[]) => Option<T>[];
  pageSize?: number;
}

export interface LocalDataSourceConfig<T> extends BaseDataSourceConfig<T> {
  type: 'local';
  options: Option<T>[] | { value: string; label: string }[];
}

export type DataSourceConfig<T> = ApiDataSourceConfig<T> | LocalDataSourceConfig<T>;

// UI Configuration
export interface UIConfig {
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  maxHeight?: number;
  showSelectedTags?: boolean;
  showCheckboxes?: boolean;
  disabled?: boolean;
}

// Behavior Configuration
export interface BehaviorConfig {
  multiple?: boolean;
  clearable?: boolean;
  initialSearch?: string;
  debounceMs?: number;

  // Callbacks
  onSearch?: (search: string) => void;
  onOpenChange?: (open: boolean) => void;
}

// Internal state types
export interface SearchableSelectState<T = any> {
  value: Option<T>[] | null;
  isOpen: boolean;
  search: string;
  page: number;
  isLoading: boolean;
  hasMore: boolean;
  isFetchingMore: boolean;
  allOptions: Option<T>[];
}

// Component props types
export interface SearchableSelectRootProps<T = any> {
  config: SearchableSelectConfig<T>;
  value: Option<T>[] | null;
  onChange: (value: Option<T>[] | null) => void;
  children?: React.ReactNode;
}

export interface SearchableSelectTriggerProps<T = any> {
  value: Option<T>[] | null;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  options?: Option<T>[];
}

export interface SearchableSelectContentProps<T = any> {
  options: Option<T>[];
  value: Option<T>[] | null;
  search: string;
  onSearchChange: (search: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxHeight?: number;
  showCheckboxes?: boolean;
  multiple?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
  onSelect: (option: Option<T>) => void;
}

export interface SearchableSelectSelectedTagsProps<T = any> {
  value: Option<T>[] | null;
  multiple?: boolean;
  showSelectedTags?: boolean;
  clearable?: boolean;
  onRemoveTag: (optionValue: string) => void;
  onClearAll: () => void;
}

// Hook return types
export interface UseSearchableSelectReturn<T> {
  state: SearchableSelectState<T>;
  actions: {
    setIsOpen: (open: boolean) => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    handleSelect: (option: Option<T>) => void;
    handleClearAll: () => void;
    removeSelectedTag: (optionValue: string) => void;
    loadMore: () => void;
  };
  refs: {
    searchInputRef: React.RefObject<HTMLInputElement>;
    scrollContainerRef: React.RefObject<HTMLDivElement>;
  };
}
