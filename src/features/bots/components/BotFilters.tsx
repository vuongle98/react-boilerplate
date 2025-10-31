import React from "react";
import { DataFilters } from "@/shared/components/filters/DataFilter";
import { FilterOption } from "@/shared/types/common";
import { BotFilters as BotFiltersType, BOT_STATUS_OPTIONS } from "../types";
import { ApiQueryFilters } from "@/shared/hooks/use-api-query";
import { Button } from "@/shared/ui/button";
import { RefreshCw } from "lucide-react";

interface BotFiltersProps {
  filters: BotFiltersType;
  onFiltersChange: (filters: BotFiltersType) => void;
  onReset: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

function BotFilters({
  filters,
  onFiltersChange,
  onReset,
  onRefresh,
  isLoading,
}: BotFiltersProps) {
  // Memoize API filters conversion to prevent unnecessary recalculations
  const apiFilters: ApiQueryFilters = React.useMemo(() => ({
    username: filters.username || "",
    name: filters.name || "",
    status: filters.status || "",
    active: filters.active !== undefined ? filters.active.toString() : "all",
  }), [filters.username, filters.name, filters.status, filters.active]);

  // Memoize filter options for DataFilters
  const filterOptions = React.useMemo(() => [
    {
      id: "username",
      label: "Username",
      type: "text",
      placeholder: "Search by username...",
    },
    {
      id: "name",
      label: "Bot Name",
      type: "text",
      placeholder: "Search by name...",
    },
    {
      id: "status",
      label: "Status",
      type: "searchable-select",
      options: BOT_STATUS_OPTIONS, // Local options for SearchableSelect
      placeholder: "Select status...",
      multiple: false, // Single selection for status
    },
    {
      id: "active",
      label: "Active Status",
      type: "select",
      options: [
        { value: "all", label: "All" },
        { value: "true", label: "Active Only" },
        { value: "false", label: "Inactive Only" },
      ],
    },
  ], []);

  // Memoize filter change handler
  const handleFiltersChange = React.useCallback((newFilters: ApiQueryFilters) => {
    const botFilters: BotFiltersType = {
      username: (newFilters.username as string) || undefined,
      name: (newFilters.name as string) || undefined,
      status: (newFilters.status as BotFiltersType["status"]) || undefined,
      active:
        newFilters.active === "true"
          ? true
          : newFilters.active === "false"
          ? false
          : newFilters.active === "all"
          ? undefined
          : undefined,
    };
    onFiltersChange(botFilters);
  }, [onFiltersChange]);

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-1.5 h-8 px-3"
        >
          <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="text-xs sm:text-sm">Refresh</span>
        </Button>
      </div>

      {/* Data Filters */}
      <DataFilters
        filters={apiFilters}
        onChange={handleFiltersChange}
        onReset={onReset}
        options={filterOptions}
        withSearch={false}
        showToggle={false}
        className="p-0"
      />
    </div>
  );
}

const MemoizedBotFilters = React.memo(BotFilters);
export { MemoizedBotFilters as BotFilters };
export default MemoizedBotFilters;
