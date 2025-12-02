import { Button } from "@/shared/ui/button";
import { Option } from "@/shared/types/common";
import { X } from "lucide-react";
import React, { useCallback, useMemo, useRef } from "react";
import { SearchableSelectSelectedTagsProps } from "../types";
import { useSearchableSelectContext } from "./SearchableSelectRoot";

// Memoized Tag component
const Tag = React.memo(function Tag({
  option,
  onRemove
}: {
  option: Option<any>;
  onRemove: (value: string) => void;
}) {
  // Temporarily disabled to focus on infinite loop
  // console.log('🔄 Tag rendering', {
  //   optionValue: option.value,
  //   optionLabel: option.label
  // });

  const handleRemove = useCallback(() => {
    onRemove(option.value);
  }, [option.value, onRemove]);

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-sm font-medium border border-primary/20 hover:bg-primary/15 transition-colors"
    >
      <span>{option.label}</span>
      <button
        type="button"
        onClick={handleRemove}
        className="ml-0.5 hover:text-destructive transition-colors rounded-sm hover:bg-destructive/10 p-0.5"
        aria-label={`Remove ${option.label}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
  const shouldNotRerender = prevProps.option.value === nextProps.option.value;

  if (!shouldNotRerender) {
    console.log('🔄 Tag props changed, re-rendering:', {
      prevValue: prevProps.option.value,
      nextValue: nextProps.option.value
    });
  }

  return shouldNotRerender;
});

export const SearchableSelectSelectedTags = React.memo(function SearchableSelectSelectedTags<T>({
  multiple = false,
  showSelectedTags = false,
  clearable = true,
}: Omit<SearchableSelectSelectedTagsProps<T>, 'value' | 'onRemoveTag' | 'onClearAll'>) {
  // Temporarily disabled to focus on infinite loop
  // console.log('🔄 SearchableSelectSelectedTags rendering', {
  //   multiple,
  //   showSelectedTags,
  //   clearable
  // });

  const { hook: { state, actions }, config } = useSearchableSelectContext<T>();

  // Use showSelectedTags from props or from config
  const finalShowSelectedTags = showSelectedTags ?? config.ui.showSelectedTags ?? false;

  // Stable action references
  const removeTagRef = useRef(actions.removeSelectedTag);
  const clearAllRef = useRef(actions.handleClearAll);

  removeTagRef.current = actions.removeSelectedTag;
  clearAllRef.current = actions.handleClearAll;

  const stableRemoveTag = useCallback((value: string) => {
    removeTagRef.current(value);
  }, []);

  const stableClearAll = useCallback(() => {
    clearAllRef.current();
  }, []);

  // Memoized selected tags - stable dependencies
  const selectedTags = useMemo(() => {
    if (!multiple || !finalShowSelectedTags || !Array.isArray(state.value) || state.value.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {state.value.map((option) => (
          <Tag
            key={option.value}
            option={option}
            onRemove={stableRemoveTag}
          />
        ))}

        {clearable && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={stableClearAll}
          >
            Clear All
          </Button>
        )}
      </div>
    );
  }, [multiple, finalShowSelectedTags, state.value, clearable, stableRemoveTag, stableClearAll]);

  return selectedTags;
}, (prevProps, nextProps) => {
  // Only re-render if props actually changed
  const multipleChanged = prevProps.multiple !== nextProps.multiple;
  const showSelectedTagsChanged = prevProps.showSelectedTags !== nextProps.showSelectedTags;
  const clearableChanged = prevProps.clearable !== nextProps.clearable;

  const shouldNotRerender = !multipleChanged && !showSelectedTagsChanged && !clearableChanged;

  if (!shouldNotRerender) {
    console.log('🔄 SearchableSelectSelectedTags props changed, re-rendering:', {
      multipleChanged,
      showSelectedTagsChanged,
      clearableChanged
    });
  }

  return shouldNotRerender;
}) as <T>(props: Omit<SearchableSelectSelectedTagsProps<T>, 'value' | 'onRemoveTag' | 'onClearAll'>) => JSX.Element | null;