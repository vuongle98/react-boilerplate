import { Button } from "@/shared/ui/button";
import { FilterIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";

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
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium">Filters</h3>
      <CollapsibleTrigger asChild>
        <Button variant="secondary" size="sm" className="flex items-center" title={isOpen ? "Hide Filters" : "Show Filters"}>
          <FilterIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:text-sm">{isOpen ? "Hide Filters" : "Show Filters"}</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent className="pb-4">
      {children}
    </CollapsibleContent>
  </Collapsible>
);
