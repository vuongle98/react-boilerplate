import { useIsMobile } from "@/shared/hooks/use-mobile";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ChevronFirst, ChevronLast, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageSizeSelector?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  totalItems?: number;
  showInfo?: boolean;
  showJumpToPage?: boolean;
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className = "",
  showPageSizeSelector = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  onPageSizeChange,
  totalItems = 0,
  showInfo = false,
  showJumpToPage = false,
}: PaginationControlsProps) {
  const [jumpToPage, setJumpToPage] = useState("");
  const isMobile = useIsMobile();

  if (totalPages <= 1 && !showPageSizeSelector && !showInfo) return null;

  const handlePageChange = (newPage: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpToPage, 10) - 1; // Convert to 0-based index
    if (pageNum >= 0 && pageNum < totalPages) {
      onPageChange(pageNum);
      setJumpToPage("");
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // On mobile, only show Previous/Next and current page numbers
    if (!isMobile) {
      // First page
      if (startPage > 0) {
        pages.push(
          <PaginationItem key="first">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-primary/5 transition-colors"
              onClick={(e) => handlePageChange(0, e)}
              disabled={page === 0}
              aria-label="First page"
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
          </PaginationItem>
        );
      }
    }

    // Previous page
    pages.push(
      <PaginationItem key="prev">
        <Button
          variant="ghost"
          size="icon"
          className={`hover:bg-primary/5 transition-colors ${isMobile ? "h-10 w-10" : "h-9 w-9"
            }`}
          onClick={(e) => handlePageChange(page - 1)}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <PaginationPrevious />
        </Button>
      </PaginationItem>
    );

    // On mobile, skip ellipsis and show only essential page numbers
    if (!isMobile) {
      // Add ellipsis if needed
      if (startPage > 1) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <span className="flex h-9 w-9 items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          </PaginationItem>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={(e) => handlePageChange(i, e)}
            isActive={i === page}
            aria-label={`Page ${i + 1}`}
            aria-current={i === page ? "page" : undefined}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (!isMobile) {
      // Add ellipsis if needed
      if (endPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <span className="flex h-9 w-9 items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          </PaginationItem>
        );
      }
    }

    // Next page
    pages.push(
      <PaginationItem key="next">
        <Button
          variant="ghost"
          size="icon"
          className={`hover:bg-primary/5 transition-colors ${isMobile ? "h-10 w-10" : "h-9 w-9"
            }`}
          onClick={(e) => handlePageChange(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
        >
          <PaginationNext />
        </Button>
      </PaginationItem>
    );

    if (!isMobile) {
      // Last page
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="last">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-primary/5 transition-colors"
              onClick={(e) => handlePageChange(totalPages - 1)}
              disabled={page >= totalPages - 1}
              aria-label="Last page"
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  const getItemRange = () => {
    if (!totalItems) return "";
    const startItem = page * pageSize + 1;
    const endItem = Math.min((page + 1) * pageSize, totalItems);
    return `${startItem}-${endItem} of ${totalItems}`;
  };

  if (isMobile) {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        {/* Page Size Selector - Mobile */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2 w-full justify-center">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-24 h-10 border-muted-foreground/20 hover:border-primary focus:border-primary transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Pagination Controls - Mobile */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>{renderPageNumbers()}</PaginationContent>
          </Pagination>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* Left: Info and Page Size Selector */}
      <div className="flex items-center gap-4">
        {showInfo && totalItems > 0 && (
          <span className="text-sm text-muted-foreground">
            {getItemRange()} items
          </span>
        )}

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-20 h-8 border-muted-foreground/20 hover:border-primary focus:border-primary transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Center: Pagination Controls */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>{renderPageNumbers()}</PaginationContent>
        </Pagination>
      )}

      {/* Right: Jump to page */}
      {showJumpToPage && totalPages > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Go to:</span>
          <Input
            type="number"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJumpToPage()}
            placeholder={`${page + 1}`}
            className="w-16 h-8 text-center border-muted-foreground/20 focus:border-primary transition-colors"
            min={1}
            max={totalPages}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 border-muted-foreground/20 hover:border-primary hover:bg-primary/5 transition-colors"
            onClick={handleJumpToPage}
            disabled={
              !jumpToPage ||
              parseInt(jumpToPage, 10) < 1 ||
              parseInt(jumpToPage, 10) > totalPages
            }
          >
            Go
          </Button>
        </div>
      )}
    </div>
  );
}
