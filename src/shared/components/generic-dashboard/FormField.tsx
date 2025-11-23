import { FieldDefinition } from "@/shared/types/admin-dashboard";
import { Label } from "@/shared/ui/label";
import React from "react";

interface FormFieldProps {
  field: FieldDefinition;
  value: any;
  error?: string;
  loading?: boolean;
  onChange: (field: FieldDefinition, value: any) => void;
  renderField: (field: FieldDefinition, isFirstField?: boolean) => React.ReactNode;
  isFirstField?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  loading,
  onChange,
  renderField,
  isFirstField = false,
}) => {
  const isRequired = field.validation?.required;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {isRequired && <span className="text-destructive ml-1">*</span>}
      </Label>

      {renderField(field, isFirstField)}

      {field.description && (
        <div className="text-sm text-muted-foreground">{field.description}</div>
      )}

      {error && <div className="text-sm text-destructive">{error}</div>}
    </div>
  );
};
