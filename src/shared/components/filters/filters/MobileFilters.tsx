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
    <div className="p-4 flex items-center justify-between">
      <h3 className="text-sm font-medium">Filters</h3>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <FilterIcon className="h-3.5 w-3.5 mr-1.5" />
          {isOpen ? "Hide Filters" : "Show Filters"}
        </Button>
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent className="px-4 pb-4">
      {children}
    </CollapsibleContent>
  </Collapsible>
);
