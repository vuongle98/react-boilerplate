import { GenericDataItem } from "@/shared/types/admin-dashboard";
import { Scale } from "@/shared/ui/animate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { TableRenderer } from "./TableRenderer";

interface DataTableSectionProps {
  displayName: string;
  items: GenericDataItem[];
  fields: any[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  searchTerm: string;
  filters: Record<string, any>;
  canEdit: boolean;
  canDelete: boolean;
  supportsBulkActions: boolean;
  customTableComponent?: any;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
  onFiltersChange: (filters: Record<string, any>) => void;
  onView: (item: GenericDataItem) => void;
  onEdit: (item: GenericDataItem) => void;
  onDelete: (item: GenericDataItem) => void;
  onBulkDelete: (items: GenericDataItem[]) => void;
  onBulkUpdate: (
    items: GenericDataItem[],
    updates: Record<string, any>
  ) => void;
}

export function DataTableSection({
  displayName,
  items,
  fields,
  loading,
  page,
  pageSize,
  totalItems,
  totalPages,
  searchTerm,
  filters,
  canEdit,
  canDelete,
  supportsBulkActions,
  customTableComponent,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onFiltersChange,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkUpdate,
}: DataTableSectionProps) {
  const TableComponent = customTableComponent || TableRenderer;

  return (
    <Scale delay={200}>
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            View, create, update, and delete {displayName.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableComponent
            data={items}
            fields={fields}
            loading={loading}
            error={null}
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            showPagination={true}
            pageSizeOptions={[5, 10, 20, 50]}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            filters={filters}
            onFiltersChange={onFiltersChange}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            canView={true}
            canEdit={canEdit}
            canDelete={canDelete}
            onBulkDelete={onBulkDelete}
            onBulkUpdate={onBulkUpdate}
            canBulkDelete={supportsBulkActions && canDelete}
            canBulkUpdate={supportsBulkActions && canEdit}
            supportsBulkActions={supportsBulkActions}
          />
        </CardContent>
      </Card>
    </Scale>
  );
}
