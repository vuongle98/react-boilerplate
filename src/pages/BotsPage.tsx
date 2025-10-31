import React from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { LoadingSpinner } from "@/shared/components/loading";
import { FadeUp, SlideUp, Scale } from "@/shared/ui/animate";
import { Plus, RefreshCw, Trash2, Home } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BotFilters } from "@/features/bots/components/BotFilters";
import { BotForm } from "@/features/bots/components/BotForm";
import { BotTable } from "@/features/bots/components/BotTable";
import { useBots, useBotMutations } from "@/features/bots/hooks/useBots";
import { Bot, CreateBotDto } from "@/features/bots/types";
import { useCacheInvalidation } from "@/shared/hooks/use-api-mutations";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Breadcrumbs } from "@/shared/components/navigation/Breadcrumbs";

export function BotsPage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | undefined>();

  // Fetch bots with pagination and filters
  const {
    data: bots,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    totalItems,
    totalPages,
    filters,
    setFilters,
    resetFilters,
    refresh,
    forceRefresh,
  } = useBots();

  // Mutations
  const { create, update, delete: deleteMutation, isLoading: isMutating } = useBotMutations();

  // Cache control
  const { clearAllCache } = useCacheInvalidation();

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSubmit = useCallback(async (data: CreateBotDto) => {
    if (editingBot) {
      await update.mutateAsync({ ...data, id: editingBot.id });
    } else {
      await create.mutateAsync(data);
    }
    setEditingBot(undefined);
  }, [editingBot, update, create]);

  const handleEdit = useCallback((bot: Bot) => {
    setEditingBot(bot);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const handleFormClose = useCallback((open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingBot(undefined);
    }
  }, []);

  // Memoize page header actions to prevent recreation
  const pageHeaderActions = useMemo(() => (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={forceRefresh}
        disabled={isLoading}
        className="gap-1.5 sm:gap-2 min-w-0 sm:min-w-fit"
        title="Refresh data"
        iconLeft={<RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLoading ? "animate-spin" : ""}`} />}
      >
        <span className="hidden sm:inline">Refresh Data</span>
        <span className="sm:hidden">Refresh</span>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={clearAllCache}
        className="gap-1.5 sm:gap-2 min-w-0 sm:min-w-fit"
        title="Clear all cached data"
        iconLeft={<Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
      >
        <span className="hidden sm:inline">Clear Cache</span>
        <span className="sm:hidden">Clear Cache</span>
      </Button>
    </>
  ), [forceRefresh, isLoading, clearAllCache]);

  // Show loading skeleton for initial page load
  if (isLoading && !bots) {
    return (
      <div className="page-container">
        <div className="section-spacing space-y-3 sm:space-y-4">
          {/* Breadcrumbs Skeleton */}
          <FadeUp delay={50}>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </FadeUp>

          {/* Page Header Skeleton */}
          <SlideUp delay={100}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </SlideUp>

          {/* Main Content Skeleton */}
          <Scale delay={200}>
            <Card>
              <CardHeader className="pb-1 sm:pb-1.5">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent className="element-spacing space-y-2 sm:space-y-2.5">
                {/* Filters Skeleton */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>

                {/* Table Skeleton */}
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-4 pb-2 border-b">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  {/* Table Rows */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Scale>

          {/* Loading Spinner */}
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Loading bots data..." size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-spacing space-y-3 sm:space-y-4">
        {/* Breadcrumbs */}
        <FadeUp delay={50}>
          <div className="flex items-center justify-between">
            <Breadcrumbs />
          </div>
        </FadeUp>

        {/* Page Header with Actions */}
        <SlideUp delay={100}>
          <PageHeader
            title="Bots Management"
            description="Manage your Telegram bots and their configurations"
            showAddButton
            addButtonText="Create Bot"
            onAddClick={() => setIsFormOpen(true)}
          >
            {pageHeaderActions}
          </PageHeader>
        </SlideUp>

      {/* Main Content */}
      <Scale delay={200}>
        <Card>
          <FadeUp delay={250}>
            <CardHeader className="pb-1 sm:pb-1.5">
              <CardTitle className="text-lg sm:text-xl">All Bots</CardTitle>
              <CardDescription className="text-sm">
                A complete list of all bots with advanced filtering and pagination
              </CardDescription>
            </CardHeader>
          </FadeUp>
          <CardContent className="element-spacing space-y-2 sm:space-y-2.5">
            {/* Filters */}
            <FadeUp delay={300}>
              <BotFilters
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
                onRefresh={refresh}
                isLoading={isLoading}
              />
            </FadeUp>

            {/* Table with Integrated Pagination */}
            <FadeUp delay={350}>
              <BotTable
                bots={bots}
                isLoading={isLoading}
                loadingMode="overlay"
                loadingText="Refreshing data..."
                onEdit={handleEdit}
                onDelete={handleDelete}
                showPagination={true}
                page={page}
                pageSize={pageSize}
                totalItems={totalItems}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[5, 10, 20, 50]}
              />
            </FadeUp>
          </CardContent>
        </Card>
      </Scale>

      {/* Create/Edit Form Dialog */}
      <BotForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        bot={editingBot}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      {/* Loading overlay for mutations */}
      {isMutating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingSpinner text="Processing..." size="lg" />
        </div>
      )}
      </div>
    </div>
  );
}

