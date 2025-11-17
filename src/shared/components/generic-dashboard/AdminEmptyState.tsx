import { Button } from "@/shared/ui/button";
import { Database, Plus } from "lucide-react";

interface AdminEmptyStateProps {
  onRefresh: () => void;
  onCreate: () => void;
}

export function AdminEmptyState({ onRefresh, onCreate }: AdminEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Services Available</h3>
      <p className="text-muted-foreground mb-4">
        No service configurations found at /api/service-config
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={onRefresh}>
          Try Again
        </Button>
        <Button onClick={onCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create First Service
        </Button>
      </div>
    </div>
  );
}
