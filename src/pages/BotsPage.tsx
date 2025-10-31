import React from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Plus, RefreshCw } from "lucide-react";
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
        className="gap-2"
      >
        <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">Refresh Data</span>
        <span className="sm:hidden">Refresh</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={clearAllCache}
      >
        <span className="hidden sm:inline">Clear Cache</span>
        <span className="sm:hidden">Cache</span>
      </Button>
    </>
  ), [forceRefresh, isLoading, clearAllCache]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Page Header with Actions */}
      <PageHeader
        title="Bots Management"
        description="Manage your Telegram bots and their configurations"
        showAddButton
        addButtonText="Create Bot"
        onAddClick={() => setIsFormOpen(true)}
      >
        {pageHeaderActions}
      </PageHeader>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">All Bots</CardTitle>
          <CardDescription className="text-sm">
            A complete list of all bots with advanced filtering and pagination
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {/* Filters */}
          <BotFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
            onRefresh={refresh}
            isLoading={isLoading}
          />

          {/* Table with Integrated Pagination */}
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
        </CardContent>
      </Card>

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

