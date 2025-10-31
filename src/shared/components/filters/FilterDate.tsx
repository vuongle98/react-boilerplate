import { format } from "date-fns";
import { Calendar } from "@/shared/ui/calendar";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";
import { CalendarIcon } from "lucide-react";
import { FilterOption } from "@/shared/types/common";

interface FilterDateProps {
  option: FilterOption;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const FilterDate = ({ option, value, onChange }: FilterDateProps) => {
  const dateValue = value ? new Date(value) : null;

  return (
    <div key={option.id} className="flex flex-col space-y-1">
      <label htmlFor={option.id} className="text-sm font-medium">
        {option.label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateValue && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? (
              format(dateValue, "PPP")
            ) : (
              <span>{option.placeholder || `Pick a date...`}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue || undefined}
            onSelect={(date) => {
              if (date) {
                onChange(format(date, "yyyy-MM-dd"));
              } else {
                onChange(null);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
