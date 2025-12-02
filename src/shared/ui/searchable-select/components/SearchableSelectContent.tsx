import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectGroup } from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import { Option } from "@/shared/types/common";
import { Loader2, Search, X } from "lucide-react";
import React, { useCallback, useMemo, useRef } from "react";
import { SearchableSelectContentProps } from "../types";
import { useSearchableSelectContext } from "./SearchableSelectRoot";

// Memoized option component to prevent re-renders
const OptionItem = React.memo(function OptionItem<T>({
  option,
  isSelected,
  showCheckboxes,
  onSelect
}: {
  option: Option<T>;
  isSelected: boolean;
  showCheckboxes: boolean;
  onSelect: (option: Option<T>) => void;
}) {
  // Temporarily disabled to focus on infinite loop
  // console.log('🔄 OptionItem rendering', {
  //   optionValue: option.value,
  //   optionLabel: option.label,
  //   isSelected,
  //   showCheckboxes
  // });

  const handleClick = useCallback(() => {
    onSelect(option);
  }, [option, onSelect]);

  return (
    <div
      className={cn(
        "cursor-pointer px-3 py-2 my-1 hover:bg-accent rounded-md transition-colors",
        isSelected ? "bg-primary/10" : ""
      )}
      onClick={handleClick}
    >
      {showCheckboxes ? (
        <div className="flex items-center gap-2 w-full">
          <div
            className="flex h-4 w-4 items-center justify-center rounded border border-primary cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            role="checkbox"
            aria-checked={isSelected}
          >
            {isSelected && (
              <div className="h-2 w-2 bg-primary rounded-full" />
            )}
          </div>
          <div className="flex-1">{option.label}</div>
        </div>
      ) : (
        <div className="flex items-center gap-2 w-full">
          {isSelected && (
            <div className="h-4 w-4 text-primary">✓</div>
          )}
          <div className="flex-1">{option.label}</div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if selection state or option changed
  const shouldNotRerender = (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.option.value === nextProps.option.value &&
    prevProps.showCheckboxes === nextProps.showCheckboxes
  );

  return shouldNotRerender;
});

export const SearchableSelectContent = React.memo(function SearchableSelectContent<T>({
  searchPlaceholder,
  emptyMessage = "No results found",
  maxHeight = 350,
  showCheckboxes = true,
}: Omit<SearchableSelectContentProps<T>, 'options' | 'value' | 'search' | 'onSearchChange' | 'isLoading' | 'hasMore' | 'isFetchingMore' | 'onLoadMore' | 'onSelect' | 'multiple'>) {
  // Temporarily disabled to focus on infinite loop
  // console.log('🔄 SearchableSelectContent rendering', {
  //   searchPlaceholder,
  //   maxHeight,
  //   showCheckboxes,
  //   emptyMessage
  // });

  const { hook: { state, actions, refs }, config } = useSearchableSelectContext<T>();

  // Use searchPlaceholder from props or from config
  const finalSearchPlaceholder = searchPlaceholder ?? config.ui.searchPlaceholder ?? "Search...";

  // Memoized selected values set for O(1) lookup
  const selectedValuesSet = useMemo(() => {
    if (!Array.isArray(state.value)) return new Set<string>();
    return new Set(state.value.map(item => item?.value));
  }, [state.value]);

  // Stable handleSelect reference
  const handleSelectRef = useRef(actions.handleSelect);
  handleSelectRef.current = actions.handleSelect;

  const stableHandleSelect = useCallback((option: Option<T>) => {
    handleSelectRef.current(option);
  }, []);

  // Memoized options list - only recreate when options or selection changes
  const optionsList = useMemo(() => {
    if (!state.allOptions || state.allOptions.length === 0) return null;

    return state.allOptions.map((option) => {
      const isSelected = selectedValuesSet.has(option.value);

      return (
        <OptionItem
          key={option.value}
          option={option}
          isSelected={isSelected}
          showCheckboxes={showCheckboxes}
          onSelect={stableHandleSelect}
        />
      );
    });
  }, [state.allOptions, selectedValuesSet, showCheckboxes, stableHandleSelect]);

  // Stable action references
  const loadMoreRef = useRef(actions.loadMore);
  const setSearchRef = useRef(actions.setSearch);
  const setPageRef = useRef(actions.setPage);

  loadMoreRef.current = actions.loadMore;
  setSearchRef.current = actions.setSearch;
  setPageRef.current = actions.setPage;

  // Enhanced scroll detection - memoized
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollThreshold = 50;

    if (
      scrollHeight - scrollTop - clientHeight < scrollThreshold &&
      state.hasMore &&
      !state.isFetchingMore
    ) {
      loadMoreRef.current();
    }
  }, [state.hasMore, state.isFetchingMore]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRef.current(e.target.value);
    setPageRef.current(0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchRef.current("");
    refs.searchInputRef.current?.focus();
  }, [refs.searchInputRef]);

  return (
    <SelectContent className="p-0 overflow-hidden">
      {/* Search Input */}
      <div className="sticky top-0 z-20 p-2 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={refs.searchInputRef}
            value={state.search}
            onChange={handleSearchChange}
            placeholder={finalSearchPlaceholder}
            className="pl-8 h-9 w-full"
          />
          {state.search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Options List */}
      <SelectGroup
        ref={refs.scrollContainerRef}
        className="py-1 overflow-y-auto"
        style={{ maxHeight }}
        onScroll={handleScroll}
      >
        {optionsList ? (
          optionsList
        ) : (
          <div className="py-2 px-3 text-sm text-muted-foreground text-center">
            {state.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              emptyMessage
            )}
          </div>
        )}

        {/* Loading indicator for pagination */}
        {state.isFetchingMore && (
          <div className="py-2 px-3 text-center">
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          </div>
        )}
      </SelectGroup>
    </SelectContent>
  );
}) as <T>(props: Omit<SearchableSelectContentProps<T>, 'options' | 'value' | 'search' | 'onSearchChange' | 'isLoading' | 'hasMore' | 'isFetchingMore' | 'onLoadMore' | 'onSelect' | 'multiple'>) => JSX.Element;