import { DataTable } from "@/shared/components/data-display/DataTable";
import { ConfirmationDialog } from "@/shared/components/dialogs/ConfirmationDialog";
import { Section } from "@/features/landing";
import { Option } from "@/shared/types/common";
import { FadeUp, SlideUp } from "@/shared/ui/animate";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  SearchableSelect,
  createSearchableSelectConfig,
} from "@/shared/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Calendar,
  Database,
  Edit,
  Eye,
  Filter,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "@/shared/hooks/use-debounce";

// Static data moved outside component to prevent recreation
const TABLE_DATA = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 5,
    name: "Eve Wilson",
    email: "eve@example.com",
    role: "Admin",
    status: "Pending",
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 8,
    name: "Henry Davis",
    email: "henry@example.com",
    role: "Admin",
    status: "Active",
  },
];

const SELECT_OPTIONS = [
  { value: "admin", label: "Administrator" },
  { value: "editor", label: "Editor" },
  { value: "user", label: "User" },
  { value: "manager", label: "Manager" },
  { value: "viewer", label: "Viewer" },
  { value: "developer", label: "Developer" },
  { value: "analyst", label: "Analyst" },
  { value: "designer", label: "Designer" },
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const MULTIPLE_SELECT_OPTIONS = SELECT_OPTIONS.slice(0, 5); // Pre-computed to avoid recreation

// Transform function for API data - defined outside to prevent recreation
const transformApiData = (data: any[]): Option<unknown>[] => {
  return data.map((item: any) => ({
    value: item.id?.toString() || item.value,
    label: item.name || item.label || item.title || item.botUsername,
  }));
};

// Isolated Multiple Select Demo Component
const MultipleSelectDemo = React.memo(() => {
  // Temporarily disabled to focus on infinite loop
  // console.log('🔄 MultipleSelectDemo rendering');

  const [multipleSelectValue, setMultipleSelectValue] = useState<
    Option<unknown>[] | null
  >(null);

  const multipleConfig = useMemo(
    () =>
      createSearchableSelectConfig({
        dataSource: {
          type: "local",
          options: MULTIPLE_SELECT_OPTIONS,
        },
        ui: {
          placeholder: "Select multiple roles...",
          showSelectedTags: true,
          showCheckboxes: true,
        },
        behavior: {
          multiple: true,
          clearable: true,
        },
      }),
    []
  );

  const handleRemoveMultipleItem = useCallback((valueToRemove: string) => {
    setMultipleSelectValue((prev) => {
      if (!prev) return prev;
      return prev.filter((item) => item.value !== valueToRemove);
    });
  }, []);

  const multipleSelectBadges = useMemo(() => {
    if (!multipleSelectValue || multipleSelectValue.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {multipleSelectValue.map((item) => (
          <Badge key={item.value} variant="secondary" className="gap-1 pr-1">
            {item.label}
            <button
              type="button"
              onClick={() => handleRemoveMultipleItem(item.value)}
              className="ml-1 hover:text-destructive transition-colors"
              aria-label={`Remove ${item.label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    );
  }, [multipleSelectValue, handleRemoveMultipleItem]);


  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
        Multiple Select
      </h3>
      <p className="text-sm text-muted-foreground">
        Select multiple options from a dropdown list
      </p>
      <SearchableSelect.Root
        config={multipleConfig}
        value={multipleSelectValue}
        onChange={setMultipleSelectValue}
      >
        <SearchableSelect.Trigger
          value={multipleSelectValue}
          multiple
        />
        <SearchableSelect.Content />
        <SearchableSelect.SelectedTags />
      </SearchableSelect.Root>
      {multipleSelectBadges}
    </div>
  );
});

// Isolated Searchable Select Demo Component
const SearchableSelectDemo = React.memo(() => {
  // Temporarily disabled to focus on infinite loop
  // console.log('🔄 SearchableSelectDemo rendering');

  const [searchableSelectValue, setSearchableSelectValue] = useState<
    Option<unknown>[] | null
  >(null);

  const searchableConfig = useMemo(
    () =>
      createSearchableSelectConfig({
        dataSource: {
          type: "local",
          options: SELECT_OPTIONS,
        },
        ui: {
          placeholder: "Search and select roles...",
          searchPlaceholder: "Type to search...",
          showSelectedTags: true,
          showCheckboxes: true,
        },
        behavior: {
          multiple: true,
          clearable: true,
        },
      }),
    []
  );

  const handleRemoveSearchableItem = useCallback((valueToRemove: string) => {
    setSearchableSelectValue((prev) => {
      if (!prev) return prev;
      return prev.filter((item) => item.value !== valueToRemove);
    });
  }, []);

  const searchableSelectBadges = useMemo(() => {
    if (!searchableSelectValue || searchableSelectValue.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {searchableSelectValue.map((item) => (
          <Badge key={item.value} variant="outline" className="gap-1 pr-1">
            {item.label}
            <button
              type="button"
              onClick={() => handleRemoveSearchableItem(item.value)}
              className="ml-1 hover:text-destructive transition-colors"
              aria-label={`Remove ${item.label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    );
  }, [searchableSelectValue, handleRemoveSearchableItem]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
        Searchable Select
      </h3>
      <p className="text-sm text-muted-foreground">
        Search through options and select multiple items with
        checkboxes
      </p>
      <SearchableSelect.Root
        config={searchableConfig}
        value={searchableSelectValue}
        onChange={setSearchableSelectValue}
      >
        <SearchableSelect.Trigger
          value={searchableSelectValue}
          multiple
        />
        <SearchableSelect.Content />
        <SearchableSelect.SelectedTags />
      </SearchableSelect.Root>
      {searchableSelectBadges}
    </div>
  );
});

export const TablesSection: React.FC = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [apiSelectValue, setApiSelectValue] = useState<
    Option<unknown>[] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(3);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<typeof TABLE_DATA[0] | null>(null);

  // Debounce search term to reduce filtering frequency and CPU usage
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized options arrays to prevent recreation

  const apiConfig = useMemo(
    () =>
      createSearchableSelectConfig({
        dataSource: {
          type: "api",
          endpoint: "/api/v1/bots",
          queryKey: ["bots", "list"],
          pageSize: 5,
          transformData: transformApiData, // Stable function reference
        },
        ui: {
          placeholder: "Search and select from API...",
          searchPlaceholder: "Search users...",
          showSelectedTags: true,
          showCheckboxes: true,
        },
        behavior: {
          multiple: true,
          clearable: true,
        },
      }),
    []
  );

  // Filtered and searched data - optimized with stable dependencies
  const filteredData = useMemo(() => {
    return TABLE_DATA.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || item.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [debouncedSearchTerm, roleFilter, statusFilter]);

  // Paginated data - slice filtered data based on current page and page size
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * currentPageSize;
    const endIndex = startIndex + currentPageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, currentPageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm, roleFilter, statusFilter]);

  // Memoized render functions to prevent recreation on every render
  const renderRole = useCallback(
    (value: string) => (
      <Badge variant={value === "Admin" ? "default" : "secondary"}>
        {value}
      </Badge>
    ),
    []
  );

  const renderStatus = useCallback(
    (value: string) => (
      <Badge
        variant={
          value === "Active"
            ? "success"
            : value === "Inactive"
              ? "secondary"
              : "warning"
        }
      >
        {value}
      </Badge>
    ),
    []
  );

  // Memoized action handlers to prevent recreation on every render
  const handleView = useCallback((item: (typeof TABLE_DATA)[0]) => {
    console.log("View", item);
  }, []);

  const handleEdit = useCallback((item: (typeof TABLE_DATA)[0]) => {
    console.log("Edit", item);
  }, []);

  const handleDelete = useCallback((item: (typeof TABLE_DATA)[0]) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (itemToDelete) {
      console.log("Delete confirmed", itemToDelete);
      // In a real app, you would make an API call here to delete the item
      // For demo purposes, we'll just log it
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  }, [itemToDelete]);

  // Memoized columns configuration
  const tableColumns = useMemo(
    () => [
      { key: "name", label: "Name", className: "font-medium" },
      { key: "email", label: "Email" },
      {
        key: "role",
        label: "Role",
        render: renderRole,
      },
      {
        key: "status",
        label: "Status",
        render: renderStatus,
      },
    ],
    [renderRole, renderStatus]
  );

  // Memoized actions configuration
  const tableActions = useMemo(
    () => [
      {
        label: "View",
        icon: Eye,
        onClick: handleView,
      },
      {
        label: "Edit",
        icon: Edit,
        onClick: handleEdit,
      },
      {
        label: "Delete",
        icon: Trash2,
        variant: "destructive" as const,
        onClick: handleDelete,
      },
    ],
    [handleView, handleEdit, handleDelete]
  );

  return (
    <>
      {/* DataTable Basic Usage */}
      <Section>
        <FadeUp delay={400}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                DataTable Basic Usage
              </CardTitle>
              <CardDescription>
                Basic DataTable implementation with columns, actions, and
                responsive design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={TABLE_DATA}
                columns={tableColumns}
                actions={[
                  {
                    label: "View",
                    icon: Eye,
                    onClick: handleView,
                  },
                  {
                    label: "Edit",
                    icon: Edit,
                    onClick: handleEdit,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </FadeUp>
      </Section>

      {/* DataTable Advanced Features */}
      <Section background="neutral">
        <SlideUp delay={850}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                DataTable Advanced Features
              </CardTitle>
              <CardDescription>
                DataTable with filtering, pagination, and advanced state
                management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startAdornment={<Search className="h-4 w-4" />}
                />

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredData.length} of {TABLE_DATA.length} results
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("all");
                    setStatusFilter("all");
                  }}
                  className="gap-2"
                  iconLeft={<Filter className="h-4 w-4" />}
                >
                  Clear Filters
                </Button>
              </div>

              {/* DataTable with filters and pagination */}
              <DataTable
                data={paginatedData}
                columns={tableColumns}
                actions={[
                  {
                    label: "View",
                    icon: Eye,
                    onClick: handleView,
                  },
                  {
                    label: "Edit",
                    icon: Edit,
                    onClick: handleEdit,
                  },
                  {
                    label: "Delete",
                    icon: Trash2,
                    variant: "destructive" as const,
                    onClick: handleDelete,
                  },
                ]}
                showPagination={true}
                page={currentPage}
                pageSize={currentPageSize}
                totalItems={filteredData.length}
                totalPages={Math.ceil(filteredData.length / currentPageSize)}
                onPageChange={setCurrentPage}
                onPageSizeChange={setCurrentPageSize}
                pageSizeOptions={[3, 6, 9]}
              />
            </CardContent>
          </Card>
        </SlideUp>
      </Section>

      {/* Select Components Demo */}
      <Section>
        <FadeUp delay={900}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Advanced Select Components
              </CardTitle>
              <CardDescription>
                Multiple select and searchable select components with advanced
                features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Multiple Select Demo */}
              <MultipleSelectDemo />

              {/* API Searchable Select Demo */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  API Searchable Select
                </h3>
                <p className="text-sm text-muted-foreground">
                  Searchable select with API data source using mock API endpoint
                </p>
                <SearchableSelect.Root
                  config={apiConfig}
                  value={apiSelectValue}
                  onChange={setApiSelectValue}
                >
                  <SearchableSelect.Trigger
                    value={apiSelectValue}
                  />
                  <SearchableSelect.Content />
                  <SearchableSelect.SelectedTags />
                </SearchableSelect.Root>
                {apiSelectValue && apiSelectValue.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {apiSelectValue.map((item) => (
                      <Badge key={item.value} variant="outline" className="gap-1 pr-1">
                        {item.label}
                        <button
                          type="button"
                          onClick={() => {
                            setApiSelectValue((prev) => {
                              if (!prev) return prev;
                              return prev.filter((i) => i.value !== item.value);
                            });
                          }}
                          className="ml-1 hover:text-destructive transition-colors"
                          aria-label={`Remove ${item.label}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Searchable Select Demo */}
              <SearchableSelectDemo />
            </CardContent>
          </Card>
        </FadeUp>
      </Section>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User"
        description={
          itemToDelete
            ? `Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this user? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </>
  );
});
