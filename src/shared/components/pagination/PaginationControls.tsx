import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";
import { ChevronFirst, ChevronLast, MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className = "",
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 0) {
      pages.push(
        <PaginationItem key="first">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handlePageChange(0, e)}
            disabled={page === 0}
            aria-label="First page"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>
        </PaginationItem>
      );
    }

    // Previous page
    pages.push(
      <PaginationItem key="prev">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => handlePageChange(page - 1, e)}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <PaginationPrevious />
        </Button>
      </PaginationItem>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <Button
            variant={i === page ? "default" : "ghost"}
            size="icon"
            onClick={(e) => handlePageChange(i, e)}
            aria-label={`Page ${i + 1}`}
            aria-current={i === page ? "page" : undefined}
          >
            {i + 1}
          </Button>
        </PaginationItem>
      );
    }

    // Next page
    pages.push(
      <PaginationItem key="next">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => handlePageChange(page + 1, e)}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
        >
          <PaginationNext />
        </Button>
      </PaginationItem>
    );

    // Last page
    if (endPage < totalPages - 1) {
      pages.push(
        <PaginationItem key="last">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handlePageChange(totalPages - 1, e)}
            disabled={page >= totalPages - 1}
            aria-label="Last page"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination className={className}>
      <PaginationContent>{renderPageNumbers()}</PaginationContent>
    </Pagination>
  );
}
