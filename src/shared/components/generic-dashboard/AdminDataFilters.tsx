import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Search, X } from "lucide-react";

interface AdminDataFiltersProps {
  searchTerm: string;
  onSearchChange: (search: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export function AdminDataFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
}: AdminDataFiltersProps) {
  const hasFilters = searchTerm || (categoryFilter && categoryFilter !== "all");

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange("all");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-muted/30 p-4 rounded-lg border">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => onSearchChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter || "all"} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
