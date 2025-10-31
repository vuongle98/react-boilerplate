import React from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { FadeUp, SlideUp, Scale } from "@/shared/ui/animate";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { BotFilters } from "@/features/bots/components/BotFilters";
import { BotForm } from "@/features/bots/components/BotForm";
import { BotTable } from "@/features/bots/components/BotTable";
import { useBots, useBotMutations } from "@/features/bots/hooks/useBots";
import { Bot, CreateBotDto } from "@/features/bots/types";
import { useCacheInvalidation } from "@/shared/hooks/use-api-mutations";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Breadcrumbs } from "@/shared/components/navigation/Breadcrumbs";

export function BotsPage() {
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
        variant="outline"
        size="sm"
        onClick={forceRefresh}
        disabled={isLoading}
        className="gap-1.5 sm:gap-2 min-w-0 sm:min-w-fit"
        title="Refresh data"
      >
        <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLoading ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">Refresh Data</span>
        <span className="sm:hidden">Refresh</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={clearAllCache}
        className="gap-1.5 sm:gap-2 min-w-0 sm:min-w-fit"
        title="Clear all cached data"
      >
        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Clear Cache</span>
        <span className="sm:hidden">Clear Cache</span>
      </Button>
    </>
  ), [forceRefresh, isLoading, clearAllCache]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Breadcrumbs */}
      <FadeUp delay={50}>
        <Breadcrumbs />
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
          <CardContent className="space-y-2 sm:space-y-2.5">
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
    </div>
  );
}

