import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn, getTableRowStyles } from "./utils"

const tableVariants = cva(
  [
    // Base styles
    "w-full caption-bottom text-sm",
    "border-collapse border-spacing-0",
  ],
  {
    variants: {
      variant: {
        default: "",
        bordered: "border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden",
        striped: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  striped?: boolean
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, striped = false, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
      <table
        ref={ref}
        className={cn(tableVariants({ variant }), className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700",
      className
    )}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 font-medium",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index?: number
  isHoverable?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, index = 0, isHoverable = false, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(getTableRowStyles(index, isHoverable), className)}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable = false, sortDirection, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-semibold text-neutral-900 dark:text-neutral-100",
        sortable && "cursor-pointer select-none hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && sortDirection === 'asc' && <ChevronUp className="h-4 w-4" />}
        {sortable && sortDirection === 'desc' && <ChevronDown className="h-4 w-4" />}
        {sortable && sortDirection === null && (
          <div className="flex flex-col">
            <ChevronUp className="h-3 w-3 -mb-1 opacity-50" />
            <ChevronDown className="h-3 w-3 opacity-50" />
          </div>
        )}
      </div>
    </th>
  )
)
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3 align-middle text-neutral-900 dark:text-neutral-100 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-4 text-sm text-neutral-600 dark:text-neutral-400 text-center",
      className
    )}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
