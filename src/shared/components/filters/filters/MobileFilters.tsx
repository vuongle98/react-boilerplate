import { Button } from "@/shared/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import { FilterIcon } from "lucide-react";

interface MobileFiltersProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export const MobileFilters = ({
  isOpen,
  setIsOpen,
  children,
}: MobileFiltersProps) => (
  <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
    {!isOpen && (
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Filters</h3>
        <CollapsibleTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center"
            title="Show Filters"
          >
            <FilterIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:text-sm">
              Show Filters
            </span>
          </Button>
        </CollapsibleTrigger>
      </div>
    )}
    <CollapsibleContent className="pb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Filters</h3>
        <CollapsibleTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center"
            title="Hide Filters"
          >
            <FilterIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:text-sm">
              Hide Filters
            </span>
          </Button>
        </CollapsibleTrigger>
      </div>
      {children}
    </CollapsibleContent>
  </Collapsible>
);
