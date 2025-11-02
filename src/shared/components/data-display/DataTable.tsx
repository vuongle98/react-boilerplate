import React, { memo, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { LoadingSpinner } from "@/shared/components/loading";
import { ConfirmationDialog } from "@/shared/components/dialogs/ConfirmationDialog";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { PaginationControls } from "@/shared/components/pagination/PaginationControls";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface Action<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (item: T) => void;
  variant?: "default" | "destructive";
  disabled?: boolean | ((item: T) => boolean);
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  isLoading?: boolean;
  loadingMode?: "skeleton" | "overlay" | "spinner";
  emptyState?: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  };
  loadingRows?: number;
  loadingText?: string;
  onRowClick?: (item: T) => void;
  className?: string;

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

function DataTableComponent<T extends { id: string | number }>({
  data,
  columns,
  actions = [],
  isLoading = false,
  loadingMode = "skeleton",
  emptyState = {
    title: "No data found",
    description: "There are no items to display at the moment.",
  },
  loadingRows = 5,
  loadingText = "Loading data...",
  onRowClick,
  className = "",

  // Pagination props with defaults
  showPagination = false,
  page = 0,
  pageSize = 10,
  totalItems = 0,
  totalPages = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: DataTableProps<T>) {
  const [deleteItem, setDeleteItem] = useState<T | null>(null);
  const [deleteAction, setDeleteAction] = useState<Action<T> | null>(null);
  const isMobile = useIsMobile();

  // Memoized skeleton table rows to prevent recreation
  const skeletonTableRows = useMemo(() => {
    return [...Array(loadingRows)].map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        {columns.map((column) => (
          <TableCell key={String(column.key)}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
        {actions.length > 0 && (
          <TableCell>
            <Skeleton className="h-8 w-8" />
          </TableCell>
        )}
      </TableRow>
    ));
  }, [loadingRows, columns, actions.length]);

  // Memoized skeleton mobile cards to prevent recreation
  const skeletonMobileCards = useMemo(() => {
    return [...Array(loadingRows)].map((_, i) => (
      <Card key={`skeleton-mobile-${i}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {columns.slice(0, 3).map((column) => (
              <div key={String(column.key)} className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {column.label}
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
            {actions.length > 0 && (
              <div className="flex justify-end">
                <Skeleton className="h-8 w-8" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    ));
  }, [loadingRows, columns, actions.length]);

  const handleActionClick = useCallback((action: Action<T>, item: T) => {
    if (action.variant === "destructive") {
      setDeleteItem(item);
      setDeleteAction(action);
    } else {
      action.onClick(item);
    }
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteAction && deleteItem) {
      deleteAction.onClick(deleteItem);
      setDeleteItem(null);
      setDeleteAction(null);
    }
  }, [deleteAction, deleteItem]);

  // Render mobile card layout
  const renderMobileCards = () => {
    if (isLoading && loadingMode === "skeleton") {
      return <div className="space-y-2">{skeletonMobileCards}</div>;
    }

    if (data.length === 0) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 text-center">
          {emptyState.icon}
          <p className="text-lg font-medium">{emptyState.title}</p>
          <p className="text-sm text-muted-foreground">
            {emptyState.description}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2 relative">
        {data.map((item) => (
          <Card
            key={item.id}
            className={onRowClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
            onClick={() => onRowClick?.(item)}
          >
            <CardContent className="py-3">
              <div className="space-y-2">
                {/* Actions moved to top with smaller spacing */}
                {actions.length > 0 && (
                  <div className="flex justify-end pb-1 gap-1">
                    {actions.length <= 6 ? (
                      // Show individual buttons for 4 or fewer actions
                      actions.map((action, index) => {
                        const isDisabled =
                          typeof action.disabled === "function"
                            ? action.disabled(item)
                            : action.disabled;

                        return (
                          <Button
                            key={index}
                            variant={action.variant === "destructive" ? "danger" : "ghost"}
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(action, item);
                            }}
                            disabled={isDisabled}
                            className="h-7 w-7"
                            aria-label={action.label}
                          >
                            {action.icon && (
                              <action.icon className="h-3 w-3" />
                            )}
                          </Button>
                        );
                      })
                    ) : (
                      // Show dropdown menu for more than 4 actions
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {actions.map((action, index) => {
                            const isDisabled =
                              typeof action.disabled === "function"
                                ? action.disabled(item)
                                : action.disabled;

                            return (
                              <DropdownMenuItem
                                key={index}
                                onClick={() => handleActionClick(action, item)}
                                disabled={isDisabled}
                                className={
                                  action.variant === "destructive"
                                    ? "text-destructive focus:text-destructive"
                                    : ""
                                }
                              >
                                {action.icon && (
                                  <action.icon className="mr-2 h-4 w-4" />
                                )}
                                {action.label}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                )}

                {columns.map((column) => (
                  <div key={String(column.key)} className="flex justify-between items-start gap-3">
                    <div className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                      {column.label}:
                    </div>
                    <div className="text-sm flex-1 text-right">
                      {column.render
                        ? column.render(item[column.key as keyof T], item)
                        : String(item[column.key as keyof T] || "")
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Pagination Controls for Mobile */}
        {showPagination && totalItems > 0 && (
          <div className="flex flex-col gap-4 pt-4">
            {/* Results Info */}
            <div className="flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Showing {page * pageSize + 1} to{" "}
                {Math.min((page + 1) * pageSize, totalItems)} of {totalItems} results
              </p>
            </div>

            {/* Pagination */}
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange || (() => {})}
              showPageSizeSelector={true}
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              onPageSizeChange={onPageSizeChange}
              totalItems={totalItems}
              showInfo={false}
              showJumpToPage={totalPages > 5}
            />
          </div>
        )}

        {/* Loading overlay for overlay mode */}
        {shouldShowOverlay && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <LoadingSpinner size="lg" text={loadingText} />
          </div>
        )}
      </div>
    );
  };

  // Loading state - different modes
  if (isLoading && loadingMode === "spinner") {
    return (
      <div className={`rounded-md border ${className}`}>
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <LoadingSpinner size="lg" text={loadingText} />
        </div>
      </div>
    );
  }

  // For overlay mode, we'll render the normal content but with an overlay
  const shouldShowOverlay = isLoading && loadingMode === "overlay";

  // Empty state
  if (data.length === 0) {
    return (
      <div className={`rounded-md border ${className}`}>
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 text-center">
          {emptyState.icon}
          <p className="text-lg font-medium">{emptyState.title}</p>
          <p className="text-sm text-muted-foreground">
            {emptyState.description}
          </p>
        </div>
      </div>
    );
  }

  // Render based on screen size
  if (isMobile) {
    return (
      <>
        {renderMobileCards()}

        {/* Delete Confirmation Dialog */}
        {deleteAction && deleteItem && (
          <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {deleteAction.label} "{(deleteItem as any).name || (deleteItem as any).title || `item ${deleteItem.id}`}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteAction.label}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  }

  // Desktop table layout
  return (
    <>
      <div className={`rounded-md border relative ${className}`}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-[70px]"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && loadingMode === "skeleton" ? (
              skeletonTableRows
            ) : (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render
                        ? column.render(item[column.key as keyof T], item)
                        : String(item[column.key as keyof T] || "")
                      }
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {actions.map((action, index) => {
                            const isDisabled =
                              typeof action.disabled === "function"
                                ? action.disabled(item)
                                : action.disabled;

                            return (
                              <DropdownMenuItem
                                key={index}
                                onClick={() => handleActionClick(action, item)}
                                disabled={isDisabled}
                                className={
                                  action.variant === "destructive"
                                    ? "text-destructive focus:text-destructive"
                                    : ""
                                }
                              >
                                {action.icon && (
                                  <action.icon className="mr-2 h-4 w-4" />
                                )}
                                {action.label}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Loading overlay for overlay mode */}
        {shouldShowOverlay && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-md">
            <LoadingSpinner size="lg" text={loadingText} />
          </div>
        )}
      </div>

      {/* Pagination Controls for Desktop */}
      {showPagination && totalItems > 0 && (
        <div className="flex flex-col gap-4 pt-4">
          {/* Results Info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {page * pageSize + 1} to{" "}
              {Math.min((page + 1) * pageSize, totalItems)} of {totalItems} results
            </p>

            {/* Pagination */}
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange || (() => {})}
              showPageSizeSelector={true}
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              onPageSizeChange={onPageSizeChange}
              totalItems={totalItems}
              showInfo={false}
              showJumpToPage={totalPages > 5}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteAction && deleteItem && (
        <ConfirmationDialog
          open={!!deleteItem}
          onOpenChange={() => setDeleteItem(null)}
          title="Are you sure?"
          description={`${deleteAction.label} "${(deleteItem as any).name || (deleteItem as any).title || `item ${deleteItem.id}`}". This action cannot be undone.`}
          confirmText={deleteAction.label}
          onConfirm={handleDeleteConfirm}
          variant="danger"
        />
      )}
    </>
  );
}

export const DataTable = memo(DataTableComponent) as <T extends { id: string | number }>(
  props: DataTableProps<T>
) => JSX.Element;

