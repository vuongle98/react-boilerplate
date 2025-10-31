import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Search, X } from "lucide-react";

interface FilterSearchProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onClear: () => void;
  className?: string;
}

export const FilterSearch = ({
  value,
  placeholder = "Search...",
  onChange,
  onClear,
  className = "",
}: FilterSearchProps) => {
  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-8"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          onClick={onClear}
          type="button"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
