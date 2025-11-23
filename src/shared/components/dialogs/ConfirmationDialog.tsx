import { useTheme } from "@/app/providers/ThemeProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import React from "react";

/**
 * ConfirmationDialog - A reusable confirmation dialog component with consistent styling
 *
 * @example
 * ```tsx
 * // Basic danger confirmation (delete, etc.)
 * <ConfirmationDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item? This action cannot be undone."
 *   confirmText="Delete"
 *   onConfirm={handleDelete}
 *   variant="danger"
 * />
 *
 * // Success confirmation
 * <ConfirmationDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   title="Success!"
 *   description="Your changes have been saved successfully."
 *   confirmText="OK"
 *   onConfirm={handleClose}
 *   variant="success"
 * />
 *
 * // With custom content
 * <ConfirmationDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   title="Custom Dialog"
 *   description="This dialog has custom content below the description."
 *   confirmText="Continue"
 *   onConfirm={handleContinue}
 * >
 *   <div className="mt-4 p-4 bg-blue-50 rounded-md">
 *     <p>Additional information or form fields can go here.</p>
 *   </div>
 * </ConfirmationDialog>
 * ```
 */
export interface ConfirmationDialogProps {
  /** Controls whether the dialog is open */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Dialog description (supports React nodes) */
  description: string | React.ReactNode;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Callback when confirm button is clicked */
  onConfirm: () => void;
  /** Optional callback when cancel button is clicked */
  onCancel?: () => void;
  /** Visual variant that affects button styling */
  variant?: "default" | "danger" | "success" | "warning";
  /** Additional CSS classes for confirm button */
  confirmButtonClassName?: string;
  /** Additional CSS classes for cancel button */
  cancelButtonClassName?: string;
  /** Additional content to render in the dialog header */
  children?: React.ReactNode;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  confirmButtonClassName,
  cancelButtonClassName,
  children,
}) => {
  const { glassEffect } = useTheme();
  const getConfirmButtonClassName = () => {
    switch (variant) {
      case "danger":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
      case "success":
        return "bg-green-600 text-white hover:bg-green-700";
      case "warning":
        return "bg-yellow-600 text-white hover:bg-yellow-700";
      default:
        return confirmButtonClassName || "";
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={glassEffect ? "modal-content" : ""}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {children}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            className={cancelButtonClassName}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={getConfirmButtonClassName()}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
