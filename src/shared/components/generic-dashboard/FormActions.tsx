import { Button } from "@/shared/ui/button";
import { Save, X } from "lucide-react";

interface FormActionsProps {
  loading?: boolean;
  submitLabel?: string;
  onCancel: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  loading = false,
  submitLabel = "Save",
  onCancel,
}) => {
  return (
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
  );
};
