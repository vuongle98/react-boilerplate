import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface AdminErrorStateProps {
  error: Error | unknown;
  onRetry: () => void;
}

export function AdminErrorState({ error, onRetry }: AdminErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          {error instanceof Error
            ? error.message
            : "Failed to fetch service configurations"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="ml-4"
          iconLeft={<RefreshCw />}
        >
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}
