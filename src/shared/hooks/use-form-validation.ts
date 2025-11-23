import { FieldDefinition } from "@/shared/types/admin-dashboard";
import { useState } from "react";

export const useFormValidation = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  const validateField = (
    field: FieldDefinition,
    value: any,
    formData: Record<string, any>
  ): string | null => {
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

  const clearFieldError = (fieldKey: string) => {
    if (validationErrors[fieldKey]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  const validateForm = (
    fields: FieldDefinition[],
    formData: Record<string, any>
  ): boolean => {
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      const error = validateField(field, formData[field.key], formData);
      if (error) {
        errors[field.key] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    validationErrors,
    validateField,
    validateForm,
    clearFieldError,
  };
};
