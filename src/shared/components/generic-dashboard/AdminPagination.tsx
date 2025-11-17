import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";

interface AdminPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

export function AdminPagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: AdminPaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {page * pageSize + 1}-
        {Math.min((page + 1) * pageSize, totalItems)} of {totalItems}{" "}
        services
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => hasPreviousPage && onPageChange(page - 1)}
              className={
                !hasPreviousPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber =
              Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
            if (pageNumber >= totalPages) return null;

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  onClick={() => onPageChange(pageNumber)}
                  isActive={page === pageNumber}
                  className="cursor-pointer"
                >
                  {pageNumber + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {totalPages > 5 && page < totalPages - 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && onPageChange(page + 1)}
              className={
                !hasNextPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
