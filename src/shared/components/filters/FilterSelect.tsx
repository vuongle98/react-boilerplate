import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { FilterOption } from "@/shared/types/common";

interface FilterSelectProps {
  option: FilterOption;
  value: string;
  onChange: (value: string) => void;
}

export const FilterSelect = ({
  option,
  value,
  onChange,
}: FilterSelectProps) => {
  return (
    <div key={option.id} className="flex flex-col space-y-1">
      <label htmlFor={option.id} className="text-sm font-medium">
        {option.label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={option.id} className="w-full">
          <SelectValue
            placeholder={option.placeholder || `Select ${option.label}...`}
          />
        </SelectTrigger>
        <SelectContent>
          {option.options?.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
