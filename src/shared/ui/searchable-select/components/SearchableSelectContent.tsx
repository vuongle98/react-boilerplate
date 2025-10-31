import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectGroup } from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import { Option } from "@/shared/types/common";
import { Loader2, Search, X } from "lucide-react";
import React from "react";
import { SearchableSelectContentProps } from "../types";
import { useSearchableSelectContext } from "./SearchableSelectRoot";

export function SearchableSelectContent<T>({
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  maxHeight = 350,
  showCheckboxes = true,
}: Omit<SearchableSelectContentProps<T>, 'options' | 'value' | 'search' | 'onSearchChange' | 'isLoading' | 'hasMore' | 'isFetchingMore' | 'onLoadMore' | 'onSelect' | 'multiple'>) {
  const { state, actions, refs } = useSearchableSelectContext<T>();

  // Enhanced scroll detection
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollThreshold = 50;

    if (
      scrollHeight - scrollTop - clientHeight < scrollThreshold &&
      state.hasMore &&
      !state.isFetchingMore
    ) {
      actions.loadMore();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setSearch(e.target.value);
    actions.setPage(0); // Reset to first page on search
  };

  const handleClearSearch = () => {
    actions.setSearch("");
    refs.searchInputRef.current?.focus();
  };

  return (
    <SelectContent className="p-0">
      {/* Search Input */}
      <div className="sticky top-0 z-10 p-2 bg-background border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={refs.searchInputRef}
            value={state.search}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
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
        className="py-1"
        style={{ maxHeight }}
        onScroll={handleScroll}
      >
        {state.allOptions && state.allOptions.length > 0 ? (
          state.allOptions.map((option) => {
            const isSelected = Array.isArray(state.value) && state.value.some(
              (o) => {
                if (typeof o === 'string') {
                  return o === option.value;
                }
                return o?.value === option.value;
              }
            );

            return (
              <div
                key={option.value}
                className={cn(
                  "cursor-pointer px-3 py-2 my-1 hover:bg-accent rounded-md",
                  isSelected ? "bg-primary/10" : ""
                )}
                onClick={() => actions.handleSelect(option)}
              >
                {showCheckboxes ? (
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className="flex h-4 w-4 items-center justify-center rounded border border-primary cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.handleSelect(option);
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
          })
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
}