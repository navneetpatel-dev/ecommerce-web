"use client";

import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table";
import { LABELS } from "@/shared/constants/labels";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";
import { cn } from "@/shared/utils/cn";
import { useVendorLowStock } from "../hooks/useVendorLowStock.hook";

const MAX_VISIBLE_ROWS = 6;

export function VendorLowStockWidget() {
  const { rows, isLoading } = useVendorLowStock();
  const visible = rows.slice(0, MAX_VISIBLE_ROWS);
  const remaining = rows.length - visible.length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-body-lg">
          <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
          {vendorDashboardWidgetsLabels.vendorLowStockTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : visible.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-ink-muted">
            {vendorDashboardWidgetsLabels.vendorLowStockEmpty}
          </p>
        ) : (
          <>
            <TableScrollShell>
              <Table scrollContainer={false}>
                <TableHeader>
                  <TableRow>
                    <TableHead className={TABLE_DATA_CELL_CLASS}>
                      {LABELS.productName}
                    </TableHead>
                    <TableHead className={TABLE_DATA_CELL_CLASS}>
                      {LABELS.sku}
                    </TableHead>
                    <TableHead className={TABLE_DATA_CELL_CLASS}>
                      {LABELS.stock}
                    </TableHead>
                    <TableHead className={TABLE_DATA_CELL_CLASS}>
                      {LABELS.lowStockAt}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        className={cn(TABLE_DATA_CELL_CLASS, "text-body")}
                      >
                        {row.productName}
                      </TableCell>
                      <TableCell
                        className={cn(
                          TABLE_DATA_CELL_CLASS,
                          "font-mono text-body-sm text-ink-muted",
                        )}
                      >
                        {row.sku}
                      </TableCell>
                      <TableCell
                        className={cn(
                          TABLE_DATA_CELL_CLASS,
                          "font-mono",
                          row.stock <= 0 ? "text-danger" : "text-warning",
                        )}
                      >
                        {row.stock}
                      </TableCell>
                      <TableCell
                        className={cn(
                          TABLE_DATA_CELL_CLASS,
                          "font-mono text-ink-muted",
                        )}
                      >
                        {row.lowStockAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableScrollShell>
            {remaining > 0 && (
              <p className="mt-3 text-body-sm text-ink-muted">
                +{remaining}{" "}
                {vendorDashboardWidgetsLabels.vendorLowStockMoreItemsSuffix}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
