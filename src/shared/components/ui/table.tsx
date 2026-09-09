import * as React from "react";
import { cn } from "@/shared/utils/cn";

import { tableStyles } from "./table.styles";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** When false, renders only `<table>` — scroll must live in a parent `TableScrollShell`. */
  scrollContainer?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, scrollContainer = true, ...props }, ref) => {
    const table = (
      <table
        ref={ref}
        className={cn(tableStyles.table, className)}
        {...props}
      />
    );

    if (!scrollContainer) {
      return table;
    }

    return <div className={tableStyles.container}>{table}</div>;
  },
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(tableStyles.header, className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(tableStyles.body, className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn(tableStyles.row, className)} {...props} />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn(tableStyles.head, className)} {...props} />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn(tableStyles.cell, className)} {...props} />
));
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
