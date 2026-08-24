import * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** When false, renders only `<table>` — scroll must live in a parent `TableScrollShell`. */
  scrollContainer?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, scrollContainer = true, ...props }, ref) => {
    const table = (
      <table
        ref={ref}
        className={cn(
          "w-full min-w-max caption-bottom text-body-sm",
          className,
        )}
        {...props}
      />
    );

    if (!scrollContainer) {
      return table;
    }

    return (
      <div className="scrollbar-none relative w-full overflow-auto">
        {table}
      </div>
    );
  },
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b border-line", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "group border-b border-line transition-colors hover:bg-paper/50",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-11 px-4 text-left align-middle font-medium text-ink-muted has-[[role=checkbox]]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle has-[[role=checkbox]]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
