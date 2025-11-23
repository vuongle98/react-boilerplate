import { FieldDefinition } from "@/shared/types/admin-dashboard";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import React from "react";

interface FieldRendererProps {
  field: FieldDefinition;
  value: any;
  error?: string;
  loading?: boolean;
  onChange: (field: FieldDefinition, value: any) => void;
  isFirstField?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  error,
  loading,
  onChange,
  isFirstField = false,
  inputRef,
}) => {
  // Get default placeholder for field
  const getDefaultPlaceholder = (field: FieldDefinition): string => {
    switch (field.type) {
      case "email":
        return `Enter ${field.label.toLowerCase()}`;
      case "password":
        return "Enter password";
      case "url":
        return "https://example.com";
      case "tel":
        return "+1 (555) 123-4567";
      case "number":
        return `Enter ${field.label.toLowerCase()}`;
      case "date":
        return "Select date";
      case "datetime":
        return "Select date and time";
      case "textarea":
        return `Enter ${field.label.toLowerCase()} details...`;
      case "json":
        return '{"key": "value"}';
      case "select":
        return `Select ${field.label.toLowerCase()}`;
      case "boolean":
        return ""; // No placeholder needed for checkboxes
      default:
        return `Enter ${field.label.toLowerCase()}`;
    }
  };

  const fieldProps = {
    id: field.key,
    placeholder: field.placeholder || getDefaultPlaceholder(field),
    disabled: field.readonly || loading,
    className: error ? "border-destructive" : "",
  };

  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "url":
    case "tel":
      return (
        <Input
          {...fieldProps}
          type={field.type}
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          ref={inputRef as React.RefObject<HTMLInputElement>}
        />
      );

    case "number":
      return (
        <Input
          {...fieldProps}
          type="number"
          value={value || ""}
          min={field.validation?.min}
          max={field.validation?.max}
          step={field.validation?.step}
          onChange={(e) =>
            onChange(field, e.target.valueAsNumber || e.target.value)
          }
          ref={inputRef as React.RefObject<HTMLInputElement>}
        />
      );

    case "textarea":
      return (
        <Textarea
          {...fieldProps}
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        />
      );

    case "boolean":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={field.key}
            checked={Boolean(value)}
            disabled={field.readonly || loading}
            onCheckedChange={(checked) => onChange(field, checked)}
          />
          <Label htmlFor={field.key} className="text-sm">
            {field.label}
          </Label>
        </div>
      );

    case "select":
      return (
        <Select
          value={value || ""}
          onValueChange={(newValue) => onChange(field, newValue)}
          disabled={field.readonly || loading}
        >
          <SelectTrigger className={error ? "border-destructive" : ""}>
            <SelectValue
              placeholder={field.placeholder || getDefaultPlaceholder(field)}
            />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem
                key={option.value}
                value={String(option.value)}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "date":
      return (
        <Input
          {...fieldProps}
          type="date"
          value={value ? new Date(value).toISOString().split("T")[0] : ""}
          onChange={(e) => onChange(field, e.target.value)}
          ref={inputRef as React.RefObject<HTMLInputElement>}
        />
      );

    case "datetime":
      return (
        <Input
          {...fieldProps}
          type="datetime-local"
          value={value ? new Date(value).toISOString().slice(0, 16) : ""}
          onChange={(e) => onChange(field, e.target.value)}
          ref={inputRef as React.RefObject<HTMLInputElement>}
        />
      );

    case "json":
      // For JSON fields, store as string and validate on submit
      const jsonValue =
        typeof value === "object" && value !== null
          ? JSON.stringify(value, null, 2)
          : value || "";

      return (
        <Textarea
          {...fieldProps}
          value={jsonValue}
          onChange={(e) => onChange(field, e.target.value)}
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        />
      );

    default:
      return (
        <Input
          {...fieldProps}
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          ref={inputRef as React.RefObject<HTMLInputElement>}
        />
      );
  }
};
