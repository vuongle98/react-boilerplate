import { SlideUp } from "@/shared/ui/animate";
import { Button } from "@/shared/ui/button";
import { Plus, RefreshCw } from "lucide-react";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {displayName}
          </h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            iconLeft={<RefreshCw className={isLoading ? "animate-spin" : ""} />}
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
