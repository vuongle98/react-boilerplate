import { Button } from "@/shared/ui/button";
import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";

interface FilterControlsProps {
  showToggle: boolean;
  filtersTitle: string;
  showFilters: boolean;
  toggleFilters: () => void;
  hasActiveFilters: boolean;
  handleReset: () => void;
}

export const FilterControls = ({
  showToggle,
  filtersTitle,
  showFilters,
  toggleFilters,
  hasActiveFilters,
  handleReset,
}: FilterControlsProps) => (
  <div className="flex items-center gap-2 ml-auto">
    {showToggle && (
      <Button
        variant="secondary"
        size="sm"
        onClick={toggleFilters}
        className="flex items-center gap-1 transition-all duration-200 min-w-0"
        type="button"
        title={filtersTitle}
        iconLeft={showToggle ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      >
        <span className="sr-only sm:not-sr-only sm:text-sm">{filtersTitle}</span>
      </Button>
    )}

    {hasActiveFilters && (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="text-muted-foreground hover:text-primary transition-colors"
        type="button"
        title="Reset filters"
        iconLeft={<RotateCcw className="h-4 w-4" />}
      >
        <span className="sr-only sm:not-sr-only sm:text-sm">Reset filters</span>
      </Button>
    )}
  </div>
);
