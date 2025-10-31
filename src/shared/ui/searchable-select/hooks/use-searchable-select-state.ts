import { useEffect, useRef, useState } from "react";
import { Option } from "@/shared/types/common";

interface UseSearchableSelectStateProps<T> {
  value: Option<T>[] | null;
  onChange: (value: Option<T>[] | null) => void;
  multiple?: boolean;
  initialSearch?: string;
  onOpenChange?: (open: boolean) => void;
}

interface UseSearchableSelectStateReturn<T> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  handleSelect: (option: Option<T>) => void;
  handleClearAll: () => void;
  removeSelectedTag: (optionValue: string) => void;
}

export function useSearchableSelectState<T>({
  value,
  onChange,
  multiple = false,
  initialSearch = "",
  onOpenChange,
}: UseSearchableSelectStateProps<T>): UseSearchableSelectStateReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState<string>(initialSearch);
  const [page, setPage] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle dropdown open/close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);

    if (!open) {
      setSearch(""); // Clear search when dropdown closes
      setPage(0); // Reset pagination
    }
  };

  // Handle option selection
  const handleSelect = (option: Option<T>) => {
    if (!multiple) {
      onChange([option]);
      setIsOpen(false);
      return;
    }

    // Multiple selection logic
    const currentValues = Array.isArray(value) ? value : [];
    const isSelected = currentValues.some((o) => o?.value === option.value);

    const newValues = isSelected
      ? currentValues.filter((o) => o?.value !== option.value)
      : [...currentValues, option];

    onChange(newValues);
  };

  // Clear all selections
  const handleClearAll = () => {
    onChange(multiple ? [] : null);
  };

  // Remove specific tag (for multiple selection)
  const removeSelectedTag = (optionValue: string) => {
    if (!multiple || !Array.isArray(value)) return;
    onChange(value.filter((option) => option.value !== optionValue));
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen: handleOpenChange,
    search,
    setSearch,
    page,
    setPage,
    searchInputRef,
    scrollContainerRef,
    handleSelect,
    handleClearAll,
    removeSelectedTag,
  };
}
