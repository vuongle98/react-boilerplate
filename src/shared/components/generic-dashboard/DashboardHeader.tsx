import { Button } from "@/shared/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { SlideUp } from "@/shared/ui/animate";

interface DashboardHeaderProps {
  displayName: string;
  description: string;
  isLoading: boolean;
  canCreate: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function DashboardHeader({
  displayName,
  description,
  isLoading,
  canCreate,
  onRefresh,
  onCreate,
}: DashboardHeaderProps) {
  return (
    <SlideUp delay={100}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {displayName}
          </h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            iconLeft={
              <RefreshCw className={isLoading ? "animate-spin" : ""} />
            }
          >
            Refresh
          </Button>

          {canCreate && (
            <Button onClick={onCreate} iconLeft={<Plus />}>
              Add {displayName.slice(0, -1)}
            </Button>
          )}
        </div>
      </div>
    </SlideUp>
  );
}
