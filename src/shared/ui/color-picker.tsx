import { cn } from "@/shared/lib/utils";
import * as React from "react";

const DEFAULT_COLORS = [
  "#EF4444", // red-500
  "#F97316", // orange-500
  "#F59E0B", // amber-500
  "#10B981", // emerald-500
  "#3B82F6", // blue-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#6B7280", // gray-500
];

interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (color: string) => void;
  colors?: string[];
}

export function ColorPicker({
  value,
  onChange,
  colors = DEFAULT_COLORS,
  className,
  ...props
}: ColorPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
            value === color ? "ring-2 ring-offset-2 ring-primary" : ""
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
}
