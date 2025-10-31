import React from "react";
import { Badge } from "@/shared/ui/badge";
import { DataTable, Column, Action } from "@/shared/components/data-display";
import { Edit, Trash2 } from "lucide-react";
import { Bot, BotStatus } from "../types";
import { formatDistanceToNow } from "date-fns";

interface BotTableProps {
  bots: Bot[];
  isLoading?: boolean;
  onEdit: (bot: Bot) => void;
  onDelete: (id: number) => void;

  // Pagination props
  showPagination?: boolean;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

const statusColors: Record<BotStatus, string> = {
  [BotStatus.ACTIVE]: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  [BotStatus.INACTIVE]: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
  [BotStatus.ERROR]: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  [BotStatus.MAINTENANCE]: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  [BotStatus.SUSPENDED]: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
};

export const BotTable = React.memo(function BotTable({
  bots,
  isLoading,
  onEdit,
  onDelete,
  showPagination = false,
  page = 0,
  pageSize = 10,
  totalItems = 0,
  totalPages = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: BotTableProps) {
  // Memoize table columns to prevent recreation on every render
  const columns: Column<Bot>[] = React.useMemo(() => [
    {
      key: "name",
      label: "Name",
      render: (_, bot) => (
        <div>
          <div className="font-medium">{bot.botName}</div>
          <div className="text-sm text-muted-foreground">@{bot.botUsername}</div>
          {bot.description && (
            <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
              {bot.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "webhookUrl",
      label: "Webhook URL",
      render: (value) => value ? (
        <div className="text-sm truncate max-w-[200px]" title={value}>
          {value}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge variant="outline" className={statusColors[value as BotStatus]}>
          {value}
        </Badge>
      ),
    },
    {
      key: "isActive",
      label: "Active",
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(value), { addSuffix: true })}
        </span>
      ),
    },
  ], []);

  // Memoize table actions to prevent recreation on every render
  const actions: Action<Bot>[] = React.useMemo(() => [
    {
      label: "Edit",
      icon: Edit,
      onClick: onEdit,
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: (bot) => onDelete(bot.id),
      variant: "destructive",
    },
  ], [onEdit, onDelete]);

  return (
    <DataTable
      data={bots}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      emptyState={{
        title: "No bots found",
        description: "Create your first bot or adjust your filters to see results.",
      }}
      showPagination={showPagination}
      page={page}
      pageSize={pageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={pageSizeOptions}
    />
  );
});

