import { SlideUp } from "@/shared/ui/animate";
import { Button } from "@/shared/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface AdminPageHeaderProps {
  isLoading: boolean;
  servicesCount: number;
  onRefresh: () => void;
  onCreate: () => void;
}

export function AdminPageHeader({
  isLoading,
  servicesCount,
  onRefresh,
  onCreate,
}: AdminPageHeaderProps) {
  return (
    <SlideUp delay={50}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2 flex-1 sm:flex-none"
            iconLeft={<RefreshCw />}
          >
            <span className="hidden sm:inline">Refresh Services</span>
            <span className="sm:hidden">Refresh</span>
          </Button>

          <Button
            onClick={onCreate}
            className="gap-2 flex-1 sm:flex-none"
            iconLeft={<Plus />}
          >
            Create Service
          </Button>
        </div>

        {servicesCount > 0 && (
          <span className="text-sm text-muted-foreground text-center text-right">
            Loaded {servicesCount} service
            {servicesCount !== 1 ? "s" : ""} from API
          </span>
        )}
      </div>
    </SlideUp>
  );
}
