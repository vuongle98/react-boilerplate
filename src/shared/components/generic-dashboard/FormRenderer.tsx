import {
  FieldDefinition,
  FieldsDefinition,
  GenericDataItem,
} from "@/shared/types/admin-dashboard";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
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
import { AlertCircle, Save, X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface FormRendererProps {
  fields: FieldsDefinition;
  initialData?: Partial<GenericDataItem>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
  submitLabel?: string;
  title?: string;
  showActions?: boolean;
}

export const FormRenderer = React.forwardRef<
  HTMLFormElement,
  FormRendererProps
>(function FormRenderer(
  {
    fields,
    initialData = {},
    onSubmit,
    onCancel,
    loading = false,
    error,
    submitLabel = "Save",
    title,
    showActions = true,
  },
  ref
) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const firstInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null
  );
  const isInitializedRef = useRef(false);
  const lastInitialDataRef = useRef<string>("");

  // Get visible form fields, sorted by order
  const formFields = useMemo(
    () =>
      fields
        .filter((field) => field.form?.visible !== false)
        .sort((a, b) => (a.form?.order || 0) - (b.form?.order || 0)),
    [fields]
  );

  // Initialize form data (only once or when initialData actually changes)
  useEffect(() => {
    const newData = initialData || {};
    const newDataString = JSON.stringify(newData);

    if (
      !isInitializedRef.current ||
      lastInitialDataRef.current !== newDataString
    ) {
      setFormData(newData);
      setValidationErrors({});
      lastInitialDataRef.current = newDataString;
      isInitializedRef.current = true;
    }
  }, [initialData]);

  // Focus first input when form mounts (only once)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once on mount

  // Validate field data type
  const validateFieldType = (
    field: FieldDefinition,
    value: any
  ): string | null => {
    if (value === undefined || value === null || value === "") {
      return null; // Let required validation handle empty values
    }

    switch (field.type) {
      case "number":
        if (typeof value !== "number" && isNaN(Number(value))) {
          return `${field.label} must be a valid number`;
        }
        break;

      case "boolean":
        if (typeof value !== "boolean") {
          return `${field.label} must be a boolean value`;
        }
        break;

      case "date":
      case "datetime":
        if (typeof value !== "string") {
          return `${field.label} must be a valid date string`;
        }
        // Try to parse as date
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return `${field.label} must be a valid date`;
        }
        break;

      case "json":
        if (typeof value !== "object" && typeof value !== "string") {
          return `${field.label} must be valid JSON`;
        }
        // If it's a string, try to parse it
        if (typeof value === "string") {
          try {
            JSON.parse(value);
          } catch {
            return `${field.label} must be valid JSON`;
          }
        }
        break;

      case "select":
        if (field.options && field.options.length > 0) {
          const validValues = field.options.map((opt) => opt.value);
          if (!validValues.includes(value)) {
            return `${field.label} must be one of the allowed values`;
          }
        }
        break;

      case "email":
        if (typeof value === "string") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return `${field.label} must be a valid email address`;
          }
        }
        break;

      case "url":
        if (typeof value === "string") {
          try {
            new URL(value);
          } catch {
            return `${field.label} must be a valid URL`;
          }
        }
        break;

      case "tel":
        if (typeof value === "string") {
          // Basic phone number validation - allow digits, spaces, dashes, parentheses, plus
          const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
          if (!phoneRegex.test(value)) {
            return `${field.label} must be a valid phone number`;
          }
        }
        break;

      default:
        // For text, textarea, and other string types
        if (typeof value !== "string") {
          return `${field.label} must be a text value`;
        }
        break;
    }

    return null;
  };
  const validateField = (field: FieldDefinition, value: any): string | null => {
    // First check data type
    const typeError = validateFieldType(field, value);
    if (typeError) {
      return typeError;
    }

    const validation = field.validation;

    if (!validation) return null;

    // Required validation
    if (
      validation.required &&
      (value === undefined || value === null || value === "")
    ) {
      return `${field.label} is required`;
    }

    // Skip other validations if field is empty and not required
    if (value === undefined || value === null || value === "") {
      return null;
    }

    // String validations
    if (typeof value === "string") {
      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`;
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} must be no more than ${validation.maxLength} characters`;
      }
      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        return `${field.label} format is invalid`;
      }
    }

    // Number validations
    if (typeof value === "number") {
      if (validation.min !== undefined && value < validation.min) {
        return `${field.label} must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && value > validation.max) {
        return `${field.label} must be no more than ${validation.max}`;
      }
    }

    // Custom validation
    if (validation.custom) {
      const result = validation.custom(value, formData);
      if (typeof result === "string") {
        return result;
      }
      if (result === false) {
        return `${field.label} is invalid`;
      }
    }

    // JSON validation - check if it's valid JSON when field is required or has value
    if (field.type === "json" && typeof value === "string" && value.trim()) {
      try {
        JSON.parse(value);
      } catch {
        return `${field.label} must be valid JSON`;
      }
    }

    return null;
  };

  // Handle field change
  const handleFieldChange = (field: FieldDefinition, value: any) => {
    setFormData((prev) => ({ ...prev, [field.key]: value }));

    // Clear validation error for this field
    if (validationErrors[field.key]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field.key];
        return newErrors;
      });
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    formFields.forEach((field) => {
      const error = validateField(field, formData[field.key]);
      if (error) {
        errors[field.key] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Parse JSON fields before submission
    const processedData = { ...formData };
    formFields.forEach((field) => {
      if (
        field.type === "json" &&
        typeof processedData[field.key] === "string"
      ) {
        try {
          processedData[field.key] = processedData[field.key]
            ? JSON.parse(processedData[field.key])
            : null;
        } catch {
          // This should not happen since we validate, but just in case
          processedData[field.key] = null;
        }
      }
    });

    try {
      await onSubmit(processedData);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

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

  // Render field based on type
  const renderField = (field: FieldDefinition, isFirstField: boolean) => {
    const value = formData[field.key];
    const fieldError = validationErrors[field.key];
    const isRequired = field.validation?.required;

    const fieldProps = {
      id: field.key,
      placeholder: field.placeholder || getDefaultPlaceholder(field),
      disabled: field.readonly || loading,
      className: fieldError ? "border-destructive" : "",
    };

    // Add ref only to the first field and only for input-like elements
    const inputRef = isFirstField ? firstInputRef : undefined;

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
            onChange={(e) => handleFieldChange(field, e.target.value)}
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
              handleFieldChange(field, e.target.valueAsNumber || e.target.value)
            }
            ref={inputRef as React.RefObject<HTMLInputElement>}
          />
        );

      case "textarea":
        return (
          <Textarea
            {...fieldProps}
            value={value || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
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
              onCheckedChange={(checked) => handleFieldChange(field, checked)}
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
            onValueChange={(newValue) => handleFieldChange(field, newValue)}
            disabled={field.readonly || loading}
          >
            <SelectTrigger className={fieldError ? "border-destructive" : ""}>
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
            onChange={(e) => handleFieldChange(field, e.target.value)}
            ref={inputRef as React.RefObject<HTMLInputElement>}
          />
        );

      case "datetime":
        return (
          <Input
            {...fieldProps}
            type="datetime-local"
            value={value ? new Date(value).toISOString().slice(0, 16) : ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
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
            onChange={(e) => handleFieldChange(field, e.target.value)}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          />
        );

      default:
        return (
          <Input
            {...fieldProps}
            value={value || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            ref={inputRef as React.RefObject<HTMLInputElement>}
          />
        );
    }
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {formFields.map((field, index) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.validation?.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>

            {renderField(field, index === 0)}

            {field.description && (
              <div className="text-sm text-muted-foreground">
                {field.description}
              </div>
            )}

            {validationErrors[field.key] && (
              <div className="text-sm text-destructive">
                {validationErrors[field.key]}
              </div>
            )}
          </div>
        ))}
      </div>

      {showActions && (
        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : submitLabel}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
});
