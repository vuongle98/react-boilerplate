import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";

interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
}

export const FilterBadge = ({ label, onRemove }: FilterBadgeProps) => {
  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      {label}
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 ml-1"
        onClick={onRemove}
        type="button"
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
};
