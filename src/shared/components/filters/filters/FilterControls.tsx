import { Button } from "@/shared/ui/button";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

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
        variant="outline"
        size="sm"
        onClick={toggleFilters}
        className="flex items-center gap-1 transition-all duration-200"
        type="button"
      >
        <Filter className="h-4 w-4 mr-1" />
        {filtersTitle}
        {showFilters ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </Button>
    )}

    {hasActiveFilters && (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="text-muted-foreground hover:text-primary transition-colors"
        type="button"
      >
        Reset
      </Button>
    )}
  </div>
);
