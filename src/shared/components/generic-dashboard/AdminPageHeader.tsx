import { Button } from "@/shared/ui/button";
import { SlideUp } from "@/shared/ui/animate";
import { RefreshCw, Plus } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
            iconLeft={<RefreshCw />}
          >
            Refresh Services
          </Button>

          {servicesCount > 0 && (
            <span className="text-sm text-muted-foreground">
              Loaded {servicesCount} service
              {servicesCount !== 1 ? "s" : ""} from API
            </span>
          )}
        </div>

        <Button onClick={onCreate} className="gap-2" iconLeft={<Plus />}>
          Create Service
        </Button>
      </div>
    </SlideUp>
  );
}
