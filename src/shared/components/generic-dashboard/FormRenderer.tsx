import {
  FieldDefinition,
  FieldsDefinition,
  GenericDataItem,
} from "@/shared/types/admin-dashboard";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormValidation } from "../../hooks/use-form-validation";
import { FieldRenderer } from "./FieldRenderer";
import { FormActions } from "./FormActions";
import { FormField } from "./FormField";

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
  const firstInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null
  );
  const isInitializedRef = useRef(false);
  const lastInitialDataRef = useRef<string>("");

  const { validationErrors, validateField, validateForm, clearFieldError } =
    useFormValidation();

  // Get visible form fields, sorted by order
  const formFields = useMemo(
    () =>
      [...fields].sort((a, b) => (a.form?.order || 0) - (b.form?.order || 0)),
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

  // Handle field change
  const handleFieldChange = (field: FieldDefinition, value: any) => {
    setFormData((prev) => ({ ...prev, [field.key]: value }));
    clearFieldError(field.key);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formFields, formData)) {
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

  // Render field using the FieldRenderer component
  const renderField = (field: FieldDefinition, isFirstField: boolean) => {
    return (
      <FieldRenderer
        field={field}
        value={formData[field.key]}
        error={validationErrors[field.key]}
        loading={loading}
        onChange={handleFieldChange}
        isFirstField={isFirstField}
        inputRef={isFirstField ? firstInputRef : undefined}
      />
    );
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
          <FormField
            key={field.key}
            field={field}
            value={formData[field.key]}
            error={validationErrors[field.key]}
            loading={loading}
            onChange={handleFieldChange}
            renderField={renderField}
            isFirstField={index === 0}
          />
        ))}
      </div>

      {showActions && (
        <FormActions
          loading={loading}
          submitLabel={submitLabel}
          onCancel={onCancel}
        />
      )}
    </form>
  );
});
