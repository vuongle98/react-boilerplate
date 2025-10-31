import React from "react";
import {
  SearchableSelectConfig,
  SearchableSelectRootProps,
} from "./searchable-select/types";
import {
  SearchableSelectRoot,
  SearchableSelectTrigger,
  SearchableSelectContent,
  SearchableSelectSelectedTags,
} from "./searchable-select/components";

// Compound component API
export const SearchableSelect = {
  Root: SearchableSelectRoot,
  Trigger: SearchableSelectTrigger,
  Content: SearchableSelectContent,
  SelectedTags: SearchableSelectSelectedTags,
};

// Helper function to create config
export function createSearchableSelectConfig<T>(
  config: Partial<SearchableSelectConfig<T>>
): SearchableSelectConfig<T> {
  return {
    dataSource: config.dataSource || { type: 'local', options: [] },
    ui: {
      placeholder: "Select an option",
      searchPlaceholder: "Search...",
      emptyMessage: "No results found",
      maxHeight: 350,
      showSelectedTags: false,
      showCheckboxes: true,
      ...config.ui,
    },
    behavior: {
      multiple: false,
      clearable: true,
      debounceMs: 300,
      ...config.behavior,
    },
  };
}
