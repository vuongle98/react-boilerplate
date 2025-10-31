import { FilterOption } from "@/types/common";
import { FilterBadge } from "../FilterBadge";

interface FilterBadgesProps {
  activeFilters: string[];
  options: FilterOption<any>[];
  onRemove: (id: string) => void;
}

export const FilterBadges = ({
  activeFilters,
  options,
  onRemove,
}: FilterBadgesProps) => (
  <div className="hidden md:flex items-center gap-1">
    {activeFilters.map((id) => {
      const option = options.find((opt) => opt.id === id);
      if (!option) return null;

      return (
        <FilterBadge
          key={id}
          label={option.label}
          onRemove={() => onRemove(id)}
        />
      );
    })}
  </div>
);
