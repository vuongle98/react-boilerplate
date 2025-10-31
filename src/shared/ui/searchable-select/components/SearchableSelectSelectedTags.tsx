import { Button } from "@/shared/ui/button";
import { Option } from "@/shared/types/common";
import { X } from "lucide-react";
import { SearchableSelectSelectedTagsProps } from "../types";
import { useSearchableSelectContext } from "./SearchableSelectRoot";

export function SearchableSelectSelectedTags<T>({
  multiple = false,
  showSelectedTags = false,
  clearable = true,
}: Omit<SearchableSelectSelectedTagsProps<T>, 'value' | 'onRemoveTag' | 'onClearAll'>) {
  const { state, actions } = useSearchableSelectContext<T>();

  if (!multiple || !showSelectedTags || !Array.isArray(state.value) || state.value.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {state.value.map((option) => (
        <div
          key={option.value}
          className="flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-xs"
        >
          <span>{option.label}</span>
          <button
            type="button"
            onClick={() => actions.removeSelectedTag(option.value)}
            className="ml-1 hover:text-destructive transition-colors"
            aria-label={`Remove ${option.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {clearable && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={actions.handleClearAll}
        >
          Clear All
        </Button>
      )}
    </div>
  );
}