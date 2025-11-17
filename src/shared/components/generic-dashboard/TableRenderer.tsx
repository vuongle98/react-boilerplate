import { Action, Column, DataTable } from "@/shared/components/data-display";
import { DataFilters } from "@/shared/components/filters/DataFilter";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
  FieldDefinition,
  FieldsDefinition,
  GenericDataItem,
} from "@/shared/types/admin-dashboard";
import { FilterOption } from "@/shared/types/common";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Edit, Eye, Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

interface TableRendererProps {
  data: GenericDataItem[];
  fields: FieldsDefinition;
  loading?: boolean;
  error?: string | null;

  // Pagination - aligned with DataTable props
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPagination?: boolean;
  pageSizeOptions?: number[];

  // Search & Filters
  searchTerm: string;
  onSearchChange: (search: string) => void;
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;

  // Actions
  onView?: (item: GenericDataItem) => void;
  onEdit?: (item: GenericDataItem) => void;
  onDelete?: (item: GenericDataItem) => void;
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;

  // Bulk Actions
  onBulkDelete?: (items: GenericDataItem[]) => void;
  onBulkUpdate?: (
    items: GenericDataItem[],
    updates: Record<string, any>
  ) => void;
  canBulkDelete?: boolean;
  canBulkUpdate?: boolean;
  supportsBulkActions?: boolean;

  // Custom rendering
  customRenderers?: Record<
    string,
    (value: any, item: GenericDataItem) => React.ReactNode
  >;
}

export function TableRenderer({
  data,
  fields,
  loading = false,
  error,
  page = 0,
  pageSize = 10,
  totalItems = 0,
  totalPages = 0,
  onPageChange,
  onPageSizeChange,
  showPagination = false,
  pageSizeOptions = [5, 10, 20, 50],
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onView,
  onEdit,
  onDelete,
  canView = true,
  canEdit = true,
  canDelete = true,
  onBulkDelete,
  onBulkUpdate,
  canBulkDelete = false,
  canBulkUpdate = false,
  supportsBulkActions = false,
  customRenderers = {},
}: TableRendererProps) {
  // Selection state for bulk actions
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(
    new Set()
  );
  const isMobile = useIsMobile();

  // Get visible table fields
  const tableFields = useMemo(
    () => fields.filter((field) => field.table?.visible !== false),
    [fields]
  );

  // Selection handlers
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allIds = new Set(data.map((item) => item.id));
        setSelectedItems(allIds);
      } else {
        setSelectedItems(new Set());
      }
    },
    [data]
  );

  const handleSelectItem = useCallback(
    (item: GenericDataItem, checked: boolean) => {
      setSelectedItems((prev) => {
        const newSelection = new Set(prev);
        if (checked) {
          newSelection.add(item.id);
        } else {
          newSelection.delete(item.id);
        }
        return newSelection;
      });
    },
    []
  );

  const handleBulkDelete = useCallback(() => {
    if (onBulkDelete && selectedItems.size > 0) {
      const itemsToDelete = data.filter((item) => selectedItems.has(item.id));
      onBulkDelete(itemsToDelete);
      setSelectedItems(new Set()); // Clear selection after action
    }
  }, [onBulkDelete, selectedItems, data]);

  const handleBulkUpdate = useCallback(
    (updates: Record<string, any>) => {
      if (onBulkUpdate && selectedItems.size > 0) {
        const itemsToUpdate = data.filter((item) => selectedItems.has(item.id));
        onBulkUpdate(itemsToUpdate, updates);
        setSelectedItems(new Set()); // Clear selection after action
      }
    },
    [onBulkUpdate, selectedItems, data]
  );

  // Check if all visible items are selected
  const isAllSelected = useMemo(() => {
    return data.length > 0 && data.every((item) => selectedItems.has(item.id));
  }, [data, selectedItems]);

  // Check if some (but not all) items are selected
  const isIndeterminate = useMemo(() => {
    return selectedItems.size > 0 && !isAllSelected;
  }, [selectedItems.size, isAllSelected]);

  // Convert fields to DataTable columns
  const columns: Column<GenericDataItem>[] = useMemo(() => {
    const fieldColumns = tableFields.map((field) => ({
      key: field.key,
      label: field.label,
      style: field.table?.width
        ? {
            width: `${field.table.width}px`,
            minWidth: `${field.table.width}px`,
          }
        : undefined,
      render: (value, item) => renderFieldValue(field, item),
    }));

    // Add selection column if bulk actions are supported
    if (supportsBulkActions) {
      fieldColumns.unshift({
        key: "selection",
        label: "",
        style: { width: "40px", minWidth: "40px" },
        render: (_, item) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={selectedItems.has(item.id)}
              onCheckedChange={(checked) =>
                handleSelectItem(item, checked as boolean)
              }
              aria-label={`Select item ${item.id}`}
            />
          </div>
        ),
      });
    }

    return fieldColumns;
  }, [tableFields, supportsBulkActions, selectedItems, handleSelectItem]);

  // Convert actions to DataTable actions
  const actions: Action<GenericDataItem>[] = useMemo(() => {
    const actionList: Action<GenericDataItem>[] = [];

    if (canView && onView) {
      actionList.push({
        label: "View",
        icon: Eye,
        onClick: onView,
      });
    }

    if (canEdit && onEdit) {
      actionList.push({
        label: "Edit",
        icon: Edit,
        onClick: onEdit,
      });
    }

    if (canDelete && onDelete) {
      actionList.push({
        label: "Delete",
        icon: Trash2,
        onClick: onDelete,
        variant: "destructive",
      });
    }

    return actionList;
  }, [canView, canEdit, canDelete, onView, onEdit, onDelete]);

  // Create filter options from fields that should be filterable
  const filterOptions: FilterOption<GenericDataItem>[] = useMemo(() => {
    return tableFields
      .filter((field) => {
        // Exclude fields that are explicitly not filterable
        if (field.table?.filterable === false) return false;

        // Include fields that are explicitly filterable
        if (field.table?.filterable === true) return true;

        // Include all other table fields by default (they should be filterable)
        return true;
      })
      .map((field) => ({
        id: field.key,
        label: field.label,
        type:
          field.type === "select"
            ? ("select" as const)
            : field.type === "boolean"
            ? ("select" as const)
            : field.type === "number"
            ? ("text" as const)
            : ("text" as const),
        placeholder:
          field.placeholder || `Filter by ${field.label.toLowerCase()}`,
        options:
          field.type === "select" && field.options
            ? field.options.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))
            : field.type === "boolean"
            ? [
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]
            : undefined,
      }));
  }, [tableFields]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters: Record<string, any>) => {
      const { search: newSearch, ...otherFilters } = newFilters;

      // Update search term if it changed
      if (newSearch !== searchTerm) {
        onSearchChange(newSearch || "");
      }

      // Update other filters
      onFiltersChange(otherFilters);
    },
    [onFiltersChange, onSearchChange, searchTerm]
  );

  // Handle filter reset
  const handleFilterReset = useCallback(() => {
    onSearchChange("");
    onFiltersChange({});
  }, [onFiltersChange, onSearchChange]);

  // Handle field value rendering
  const renderFieldValue = (field: FieldDefinition, item: GenericDataItem) => {
    const value = item[field.key];

    // Custom renderer takes precedence
    if (customRenderers[field.key]) {
      return customRenderers[field.key](value, item);
    }

    // Type-specific rendering
    switch (field.type) {
      case "boolean":
        return value ? (
          <Badge variant="default">Yes</Badge>
        ) : (
          <Badge variant="secondary">No</Badge>
        );

      case "date":
      case "datetime":
        if (!value) return "-";
        const date = new Date(value);
        return field.type === "datetime"
          ? date.toLocaleString()
          : date.toLocaleDateString();

      case "select":
        if (!value) return "-";
        const option = field.options?.find((opt) => opt.value === value);
        return option ? option.label : String(value);

      case "json":
        return value ? (
          <code className="text-xs bg-muted p-1 rounded">
            {JSON.stringify(value).slice(0, 50)}...
          </code>
        ) : (
          "-"
        );

      default:
        return value || "-";
    }
  };

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-destructive mb-2">Error loading data</div>
        <div className="text-sm text-muted-foreground">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Select All - shows when bulk actions supported in desktop only */}
      {supportsBulkActions &&
        selectedItems.size === 0 &&
        data.length > 0 &&
        !isMobile && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelectAll(true)}
            >
              Select All
            </Button>
          </div>
        )}

      {/* Bulk Actions Bar - shows when items are selected */}
      {supportsBulkActions && selectedItems.size > 0 && (
        <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border">
          <div className="text-sm font-medium">
            {selectedItems.size} item{selectedItems.size === 1 ? "" : "s"}{" "}
            selected
          </div>
          <div className="flex items-center gap-2">
            {canBulkDelete && onBulkDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleBulkDelete}
                iconLeft={<Trash2 />}
              >
                Delete Selected
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedItems(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Filters */}
      <DataFilters
        filters={{ search: searchTerm, ...filters }}
        options={filterOptions}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        withSearch={true}
        searchPlaceholder="Search..."
        filtersTitle="Advanced Filters"
        showToggle={false}
      />

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        actions={actions}
        isLoading={loading}
        loadingMode="skeleton"
        emptyState={{
          title: "No data found",
          description: "There are no items to display at the moment.",
        }}
        showPagination={showPagination}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={pageSizeOptions}
        supportsBulkActions={supportsBulkActions}
        canBulkDelete={canBulkDelete}
        canBulkUpdate={canBulkUpdate}
        onBulkDelete={onBulkDelete}
        onBulkUpdate={onBulkUpdate}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onClearSelection={() => setSelectedItems(new Set())}
      />
    </div>
  );
}
